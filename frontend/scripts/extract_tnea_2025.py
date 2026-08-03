#!/usr/bin/env python3
"""Extract a compact, searchable 2025 TNEA catalogue from a saved portal page.

Usage:
  python3 scripts/extract_tnea_2025.py /path/to/body.html \
    vkdb-kms-frontend/src/data/engineeringColleges2025.json
"""
import json
import re
import sys
from collections import OrderedDict
from html.parser import HTMLParser
from pathlib import Path

CATEGORIES = ("OC", "BC", "BCM", "MBC", "SC", "SCA", "ST")
DISTRICTS = (
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
    "Vellore", "Viluppuram", "Virudhunagar",
)
DISTRICT_ALIASES = {
    "Kancheepuram": ("Kancheepuram", "Kanchipuram"), "Nagapattinam": ("Nagapattinam", "Nagappattinam"),
    "Sivaganga": ("Sivaganga", "Sivagangai", "Sivaganagi"),
    "Kanyakumari": ("Kanyakumari", "Kanyakumarai", "Nagercoil"),
    "Thoothukudi": ("Tuticorin", "Thoothukudi"),
    "Tiruchirappalli": ("Trichy", "Tiruchirappalli"),
    "Tirunelveli": ("Tirunelveli", "Tirunelvei"), "Tiruvallur": ("Thiruvallur", "Tiruvallur"),
    "Tiruvannamalai": ("Thiruvannamalai", "Tiruvannamalai"),
    "Tiruvarur": ("Thiruvarur", "Tiruvarur"),
    "Viluppuram": ("Villupuram", "Viluppuram"),
    "Virudhunagar": ("Virudhunagar",), "Tiruppur": ("Tirupur", "Tiruppur"),
}


class PortalTableParser(HTMLParser):
    """Read table cells without external packages; the export contains many pages."""
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell = [], None, None
        self.row_key = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "tr":
            self.row, self.row_key = [], attrs.get("data-row-key", "")
        elif tag in ("td", "th") and self.row is not None:
            self.cell = []

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.cell is not None:
            self.row.append(" ".join("".join(self.cell).split()))
            self.cell = None
        elif tag == "tr" and self.row is not None:
            if len(self.row) == 10 and self.row[0] != "Code":
                self.rows.append((self.row_key, self.row))
            self.row = None


def clean_text(value):
    return " ".join(value.replace("\u00a0", " ").split())


def extract_district(address):
    for district in DISTRICTS:
        names = DISTRICT_ALIASES.get(district, (district,))
        if any(re.search(r"\b" + re.escape(name) + r"\b", address, re.I) for name in names):
            return district
    return "Other Tamil Nadu"


def cutoff(value):
    value = value.replace("*", "").strip()
    try:
        return float(value)
    except ValueError:
        return None


def main(source, output):
    parser = PortalTableParser()
    parser.feed(Path(source).read_text(encoding="utf-8"))

    colleges = OrderedDict()
    seen = set()
    for row_key, row in parser.rows:
        code, address, course, *marks = row
        course_code = row_key.split("-")[1] if "-" in row_key else ""
        key = (code, course_code or course)
        if key in seen:  # the captured DOM repeats one result page
            continue
        seen.add(key)
        address = clean_text(address)
        pin_match = re.search(r"\b(\d{6})\b", address)
        pincode = pin_match.group(1) if pin_match else ""
        college = colleges.setdefault(code, {
            "code": code,
            "name": re.sub(r"\s+", " ", re.sub(r"\b\d{6}\b", "", address)).strip(" ,"),
            "address": address,
            "district": extract_district(address),
            "pincode": pincode,
            "courses": [],
        })
        college["courses"].append({
            "code": course_code,
            "name": clean_text(course).title(),
            "cutoffs": dict(zip(CATEGORIES, map(cutoff, marks))),
        })

    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(list(colleges.values()), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    unknown = sum(c["district"] == "Other Tamil Nadu" for c in colleges.values())
    print(f"Wrote {len(colleges)} colleges and {len(seen)} course rows to {output} ({unknown} districts need manual review).")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Expected source HTML and output JSON paths.")
    main(*sys.argv[1:])
