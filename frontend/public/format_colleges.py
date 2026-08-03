#!/usr/bin/env python3
"""
Parse colleges.html (TNEA cutoff data scraped from Ant Design table)
and produce a clean, formatted colleges_formatted.html.

Data pattern in source:
  <tr class="ant-table-row ..." data-row-key="CODE-BRANCH-N">
    <td>CODE</td>
    <td><div>College Name</div></td>
    <td><span>Branch</span></td>
    <td>OC value</td>
    <td>BC value</td>
    <td>BCM value</td>
    <td>MBC value</td>
    <td>SC value</td>
    <td>SCA value</td>
    <td>ST value</td>
  </tr>
"""

from bs4 import BeautifulSoup
import re

INPUT  = "colleges.html"
OUTPUT = "colleges_formatted.html"

print(f"Reading {INPUT} ...")
with open(INPUT, "r", encoding="utf-8") as f:
    content = f.read()

print("Parsing HTML ...")
soup = BeautifulSoup(content, "html.parser")

# Only real data rows have data-row-key attribute
rows = soup.find_all("tr", attrs={"data-row-key": True})
print(f"Found {len(rows)} data rows.")

records = []
for row in rows:
    cells = row.find_all("td", class_="ant-table-cell")
    if len(cells) < 10:
        continue

    def cell_text(cell):
        """Extract visible text from a cell, stripping sup elements (the * markers)."""
        # Remove sup tags so we get clean numbers
        for sup in cell.find_all("sup"):
            sup.decompose()
        txt = cell.get_text(strip=True)
        return txt if txt else "—"

    def cell_text_with_vacant(cell):
        """Extract number and append * if there was a sup (vacant seats indicator)."""
        has_vacant = bool(cell.find("sup"))
        for sup in cell.find_all("sup"):
            sup.decompose()
        txt = cell.get_text(strip=True)
        if not txt or txt == "—":
            return "—"
        return f"{txt}*" if has_vacant else txt

    code        = cell_text(cells[0])
    college     = cells[1].get_text(strip=True)
    branch      = cells[2].get_text(strip=True)
    oc          = cell_text_with_vacant(cells[3])
    bc          = cell_text_with_vacant(cells[4])
    bcm         = cell_text_with_vacant(cells[5])
    mbc         = cell_text_with_vacant(cells[6])
    sc          = cell_text_with_vacant(cells[7])
    sca         = cell_text_with_vacant(cells[8])
    st          = cell_text_with_vacant(cells[9])

    records.append({
        "code": code,
        "college": college,
        "branch": branch,
        "OC": oc, "BC": bc, "BCM": bcm,
        "MBC": mbc, "SC": sc, "SCA": sca, "ST": st,
    })

print(f"Extracted {len(records)} records. Building output HTML ...")

# Build clean HTML
html_rows = []
for r in records:
    def td(val, cls=""):
        vacant = val.endswith("*") and val != "—"
        display = val.rstrip("*") if vacant else val
        no_data = val == "—"
        style_td = ' class="no-data"' if no_data else (' class="vacant"' if vacant else "")
        sup_html = '<sup title="Vacant seats">*</sup>' if vacant else ""
        return f"<td{style_td}>{display}{sup_html}</td>"

    html_rows.append(
        f"  <tr>"
        f"<td class='code'>{r['code']}</td>"
        f"<td class='college'>{r['college']}</td>"
        f"<td class='branch'>{r['branch']}</td>"
        f"{td(r['OC'])}{td(r['BC'])}{td(r['BCM'])}"
        f"{td(r['MBC'])}{td(r['SC'])}{td(r['SCA'])}{td(r['ST'])}"
        f"</tr>\n"
    )

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TNEA 2025 Cutoff Data — {len(records)} Records</title>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f4f6f9;
      color: #1e2a3a;
      padding: 24px 16px;
    }}

    h1 {{
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
      color: #16213e;
    }}
    .subtitle {{
      font-size: 13px;
      color: #6b7f9e;
      margin-bottom: 16px;
    }}

    .legend {{
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 12px;
      font-size: 12px;
      color: #4a5a73;
    }}
    .legend span {{ display: flex; align-items: center; gap: 4px; }}
    .dot-vacant {{ color: #c0392b; font-weight: 700; }}

    .table-wrap {{
      overflow-x: auto;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,.1);
    }}

    table {{
      border-collapse: collapse;
      width: 100%;
      min-width: 900px;
      background: #fff;
      font-size: 13px;
    }}

    thead tr {{
      background: #16213e;
      color: #fff;
    }}
    thead th {{
      padding: 10px 10px;
      font-weight: 600;
      font-size: 12px;
      letter-spacing: .04em;
      white-space: nowrap;
      text-align: center;
    }}
    thead th.left {{ text-align: left; }}

    tbody tr {{ border-bottom: 1px solid #eef0f4; }}
    tbody tr:hover {{ background: #f0f4ff; }}
    tbody tr:last-child {{ border-bottom: none; }}

    td {{
      padding: 8px 10px;
      vertical-align: top;
      text-align: center;
    }}
    td.code   {{ font-weight: 700; color: #16213e; white-space: nowrap; }}
    td.college {{
      text-align: left;
      font-weight: 500;
      color: #16213e;
      max-width: 280px;
      white-space: normal;
      word-break: break-word;
      line-height: 1.45;
    }}
    td.branch {{
      text-align: left;
      color: #4a5a73;
      white-space: normal;
      word-break: break-word;
    }}
    td.no-data {{ color: #bcc4d0; }}
    td.vacant {{ color: #1e2a3a; }}
    td.vacant sup {{
      color: #c0392b;
      font-weight: 700;
      font-size: 9px;
      margin-left: 1px;
    }}

    .total {{
      font-size: 12px;
      color: #6b7f9e;
      margin-top: 10px;
      text-align: right;
    }}
  </style>
</head>
<body>
  <h1>TNEA 2025 — College Cutoff Marks</h1>
  <p class="subtitle">Government of Tamil Nadu · Department of Technical Education · {len(records)} records</p>

  <div class="legend">
    <span><span class="dot-vacant">*</span> Vacant seats available</span>
    <span><strong>—</strong> No seats allotted</span>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th style="text-align:left">Code</th>
          <th class="left" style="min-width:220px">College Name</th>
          <th class="left" style="min-width:160px">Branch</th>
          <th>OC</th>
          <th>BC</th>
          <th>BCM</th>
          <th>MBC</th>
          <th>SC</th>
          <th>SCA</th>
          <th>ST</th>
        </tr>
      </thead>
      <tbody>
{''.join(html_rows)}      </tbody>
    </table>
  </div>
  <p class="total">{len(records)} records · Data sourced from official TNEA counseling records (2025). For informational purposes only.</p>
</body>
</html>
"""

with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Done! Written to {OUTPUT} ({len(records)} records)")
