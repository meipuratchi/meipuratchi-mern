#!/usr/bin/env python3
"""
Enhance engineeringColleges2025.json:
  1. Fix branch/course names → Title Case, remove double spaces
  2. Normalize district names (Kancheepuram → Kancheepuram, Trichy → Tiruchirappalli, etc.)
  3. Extract short college name (strip address noise after comma/dash)
  4. Ensure pincode field is populated (extract from address if missing)
  5. Add maxOC field for easy sorting
  6. Remove colleges that have ZERO cutoff data across all courses/categories
"""

import json, re

INPUT  = "engineeringColleges2025.json"
OUTPUT = "engineeringColleges2025.json"  # overwrite in-place

# District normalization map
DIST_NORM = {
    "Kancheepuram": "Kancheepuram",
    "Kanchipuram":  "Kancheepuram",
    "Kancheepuram": "Kancheepuram",
    "Trichy":       "Tiruchirappalli",
    "Tiruchirappalli": "Tiruchirappalli",
    "Tuticorin":    "Thoothukudi",
    "Thoothukudi":  "Thoothukudi",
    "Sivaganga":    "Sivaganga",
    "Sivaganagi":   "Sivaganga",
    "Tirupur":      "Tiruppur",
    "Tiruppur":     "Tiruppur",
    "Madurai":      "Madurai",
    "Chennai":      "Chennai",
    "Coimbatore":   "Coimbatore",
    "Salem":        "Salem",
    "Namakkal":     "Namakkal",
    "Erode":        "Erode",
    "Vellore":      "Vellore",
    "Thiruvallur":  "Thiruvallur",
    "Villupuram":   "Villupuram",
    "Cuddalore":    "Cuddalore",
    "Thanjavur":    "Thanjavur",
    "Tiruvarur":    "Tiruvarur",
    "Nagapattinam": "Nagapattinam",
    "Pudukkottai":  "Pudukkottai",
    "Dindigul":     "Dindigul",
    "Theni":        "Theni",
    "Virudhunagar": "Virudhunagar",
    "Ramanathapuram": "Ramanathapuram",
    "Tirunelveli":  "Tirunelveli",
    "Tenkasi":      "Tenkasi",
    "Kanyakumari":  "Kanyakumari",
    "Krishnagiri":  "Krishnagiri",
    "Dharmapuri":   "Dharmapuri",
    "Karur":        "Karur",
    "Perambalur":   "Perambalur",
    "Ariyalur":     "Ariyalur",
    "Nilgiris":     "Nilgiris",
    "Ranipet":      "Ranipet",
    "Tirupattur":   "Tirupattur",
    "Kallakurichi": "Kallakurichi",
    "Chengalpattu": "Chengalpattu",
    "Mayiladuthurai": "Mayiladuthurai",
    "Tiruvannamalai": "Tiruvannamalai",
}

# Branch name normalization → clean Title Case
BRANCH_NORM = {
    "COMPUTER SCIENCE AND ENGINEERING": "Computer Science and Engineering",
    "ELECTRONICS AND COMMUNICATION ENGINEERING": "Electronics and Communication Engineering",
    "MECHANICAL ENGINEERING": "Mechanical Engineering",
    "ELECTRICAL AND ELECTRONICS ENGINEERING": "Electrical and Electronics Engineering",
    "CIVIL  ENGINEERING": "Civil Engineering",
    "CIVIL ENGINEERING": "Civil Engineering",
    "INFORMATION TECHNOLOGY": "Information Technology",
    "AERONAUTICAL ENGINEERING": "Aeronautical Engineering",
    "BIO MEDICAL ENGINEERING": "Bio Medical Engineering",
    "BIO TECHNOLOGY": "Bio Technology",
    "ROBOTICS AND AUTOMATION": "Robotics and Automation",
    "COMPUTER SCIENCE AND BUSSINESS SYSTEM": "Computer Science and Business Systems",
    "COMPUTER SCIENCE AND BUSINESS SYSTEM": "Computer Science and Business Systems",
    "AGRICULTURAL ENGINEERING": "Agricultural Engineering",
    "AUTOMOBILE ENGINEERING": "Automobile Engineering",
    "CHEMICAL ENGINEERING": "Chemical Engineering",
    "FASHION TECHNOLOGY": "Fashion Technology",
    "TEXTILE TECHNOLOGY": "Textile Technology",
    "MARINE ENGINEERING": "Marine Engineering",
    "MEDICAL ELECTRONICS ENGINEERING": "Medical Electronics Engineering",
    "PETRO CHEMICAL TECHNOLOGY": "Petro Chemical Technology",
    "INSTRUMENTATION AND CONTROL ENGINEERING": "Instrumentation and Control Engineering",
    "INDUSTRIAL ENGINEERING AND MANAGEMENT": "Industrial Engineering and Management",
    "FOOD TECHNOLOGY": "Food Technology",
    "MECHANICAL AND AUTOMATION ENGINEERING": "Mechanical and Automation Engineering",
}

def normalize_branch(name):
    key = name.strip().upper().replace("  ", " ")
    if key in BRANCH_NORM:
        return BRANCH_NORM[key]
    # Title-case fallback, fixing common noise
    cleaned = re.sub(r'\s+', ' ', name.strip())
    # Fix known typos
    cleaned = cleaned.replace("BUSSINESS", "Business")
    # Convert ALL CAPS to title case
    if cleaned == cleaned.upper():
        cleaned = cleaned.title()
        # fix known exceptions
        cleaned = cleaned.replace(" And ", " and ").replace(" Of ", " of ").replace(" In ", " in ")
    return cleaned

def normalize_district(d):
    return DIST_NORM.get(d, d)

def extract_short_name(full_name):
    """Extract college name before the address part (first comma-separated chunk that looks like a name)."""
    # Split at comma and take first part, but only if it's the actual college name
    parts = full_name.split(',')
    name = parts[0].strip()
    # Remove trailing punctuation
    name = name.rstrip('.,- ')
    return name

def extract_pincode_from_address(address):
    pins = re.findall(r'\b(\d{6})\b', address)
    return pins[0] if pins else ""

def college_has_any_cutoff(college):
    for course in college.get("courses", []):
        cutoffs = course.get("cutoffs", {})
        if any(v is not None for v in cutoffs.values()):
            return True
    return False

def max_oc_cutoff(college):
    best = 0.0
    for course in college.get("courses", []):
        v = course.get("cutoffs", {}).get("OC")
        if v is not None and v > best:
            best = v
    return best

print(f"Reading {INPUT}...")
with open(INPUT, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total colleges before cleanup: {len(data)}")

enhanced = []
removed = 0

for college in data:
    # Skip colleges with zero cutoff data
    if not college_has_any_cutoff(college):
        removed += 1
        continue

    # Normalize district
    college["district"] = normalize_district(college.get("district", ""))

    # Fix pincode if missing
    if not college.get("pincode"):
        college["pincode"] = extract_pincode_from_address(college.get("address", ""))

    # Short name
    college["shortName"] = extract_short_name(college.get("name", ""))

    # Normalize branch names + add maxOC
    for course in college.get("courses", []):
        course["name"] = normalize_branch(course.get("name", ""))

    # Add maxOC for sorting
    college["maxOC"] = max_oc_cutoff(college)

    enhanced.append(college)

# Sort by maxOC descending
enhanced.sort(key=lambda c: c["maxOC"], reverse=True)

print(f"Removed (zero data): {removed}")
print(f"Remaining colleges:  {len(enhanced)}")

# Verify districts
from collections import Counter
dist_counts = Counter(c["district"] for c in enhanced)
print("\nDistrict distribution:")
for d, cnt in sorted(dist_counts.items(), key=lambda x: -x[1]):
    print(f"  {d}: {cnt}")

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(enhanced, f, ensure_ascii=False, indent=2)

print(f"\nDone! Saved {len(enhanced)} colleges to {OUTPUT}")
