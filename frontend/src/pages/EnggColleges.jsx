import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import collegesData from "../data/engineeringColleges2025.json";
import "./EnggColleges.css";

const CASTES = ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"];

// Build unique sorted lists once
const ALL_DISTRICTS = [...new Set(collegesData.map(c => c.district).filter(Boolean))].sort();
const ALL_BRANCHES = [...new Set(
  collegesData.flatMap(c => c.courses.map(cr => cr.name))
)].sort();

export default function EnggColleges() {
  const navigate = useNavigate();

  // Filters
  const [search, setSearch]         = useState("");
  const [district, setDistrict]     = useState("");
  const [branch, setBranch]         = useState("");
  const [caste, setCaste]           = useState("OC");
  const [minCutoff, setMinCutoff]   = useState("");
  const [maxCutoff, setMaxCutoff]   = useState("");
  const [pincode, setPincode]       = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Expanded college rows
  const [expanded, setExpanded]     = useState(new Set());

  // Flatten: one row per college with matching courses
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minCutoff !== "" ? parseFloat(minCutoff) : null;
    const max = maxCutoff !== "" ? parseFloat(maxCutoff) : null;

    return collegesData
      .map(college => {
        // College-level filters
        if (district && college.district !== district) return null;
        if (pincode && !college.pincode?.startsWith(pincode)) return null;
        if (q && !college.name.toLowerCase().includes(q) &&
                 !college.shortName?.toLowerCase().includes(q) &&
                 !college.code?.includes(q)) return null;

        // Course-level filter
        const matchCourses = college.courses.filter(cr => {
          if (branch && cr.name !== branch) return false;
          const val = cr.cutoffs?.[caste];
          if (val === null || val === undefined) return false;
          if (min !== null && val < min) return false;
          if (max !== null && val > max) return false;
          return true;
        });

        if (matchCourses.length === 0) return null;

        return { ...college, matchCourses };
      })
      .filter(Boolean);
  }, [search, district, branch, caste, minCutoff, maxCutoff, pincode]);

  const toggleExpand = useCallback((code) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }, []);

  const addToChoice = useCallback((college) => {
    const stored = JSON.parse(localStorage.getItem("choiceList") || "[]");
    if (!stored.find(c => c.code === college.code)) {
      stored.push({
        code: college.code,
        name: college.name,
        shortName: college.shortName,
        district: college.district,
        pincode: college.pincode,
        courses: college.courses,
        maxOC: college.maxOC,
      });
      localStorage.setItem("choiceList", JSON.stringify(stored));
    }
    navigate("/choice-filling");
  }, [navigate]);

  const clearFilters = () => {
    setSearch(""); setDistrict(""); setBranch("");
    setCaste("OC"); setMinCutoff(""); setMaxCutoff(""); setPincode("");
  };

  return (
    <div className="ec-page">
      {/* Header */}
      <div className="ec-header">
        <div className="ec-header-inner">
          <div>
            <h1 className="ec-title">TNEA 2025 Engineering Colleges</h1>
            <p className="ec-subtitle">420 colleges · Tamil Nadu Engineering Admissions</p>
          </div>
          <button className="ec-choice-btn" onClick={() => navigate("/choice-filling")}>
            📋 Choice Filling
          </button>
        </div>
      </div>

      <div className="ec-container">
        {/* Filter Panel */}
        <div className={`ec-filters ${showFilters ? "open" : "closed"}`}>
          <div className="ec-filters-header" onClick={() => setShowFilters(v => !v)}>
            <span>🔍 Search &amp; Filters</span>
            <span className="ec-chevron">{showFilters ? "▲" : "▼"}</span>
          </div>
          {showFilters && (
            <div className="ec-filters-body">
              {/* Search */}
              <div className="ec-field ec-field-full">
                <label>College Name / Code</label>
                <input
                  type="text"
                  placeholder="Search college name or code..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="ec-input"
                />
              </div>

              {/* District */}
              <div className="ec-field">
                <label>District</label>
                <select value={district} onChange={e => setDistrict(e.target.value)} className="ec-select">
                  <option value="">All Districts</option>
                  {ALL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Pincode */}
              <div className="ec-field">
                <label>Pincode (starts with)</label>
                <input
                  type="text"
                  placeholder="e.g. 600"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className="ec-input"
                  maxLength={6}
                />
              </div>

              {/* Branch */}
              <div className="ec-field ec-field-wide">
                <label>Course / Branch</label>
                <select value={branch} onChange={e => setBranch(e.target.value)} className="ec-select">
                  <option value="">All Branches</option>
                  {ALL_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Caste */}
              <div className="ec-field">
                <label>Category</label>
                <div className="ec-caste-pills">
                  {CASTES.map(c => (
                    <button
                      key={c}
                      className={`ec-pill ${caste === c ? "active" : ""}`}
                      onClick={() => setCaste(c)}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Cutoff Range */}
              <div className="ec-field">
                <label>Cutoff Range ({caste})</label>
                <div className="ec-range-row">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minCutoff}
                    onChange={e => setMinCutoff(e.target.value)}
                    className="ec-input ec-input-sm"
                    min={0} max={200} step={0.5}
                  />
                  <span>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxCutoff}
                    onChange={e => setMaxCutoff(e.target.value)}
                    className="ec-input ec-input-sm"
                    min={0} max={200} step={0.5}
                  />
                </div>
              </div>

              {/* Clear */}
              <div className="ec-field ec-field-end">
                <button className="ec-clear-btn" onClick={clearFilters}>✕ Clear All</button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="ec-results-bar">
          <span><strong>{results.length}</strong> college{results.length !== 1 ? "s" : ""} found</span>
        </div>

        <div className="ec-list">
          {results.length === 0 && (
            <div className="ec-empty">
              <p>No colleges match your filters.</p>
              <button onClick={clearFilters}>Clear filters</button>
            </div>
          )}

          {results.map(college => {
            const isOpen = expanded.has(college.code);
            return (
              <div key={college.code} className="ec-card">
                <div className="ec-card-header" onClick={() => toggleExpand(college.code)}>
                  <div className="ec-card-left">
                    <span className="ec-code">{college.code}</span>
                    <div>
                      <div className="ec-clg-name">{college.shortName}</div>
                      <div className="ec-meta">
                        <span className="ec-district">📍 {college.district}</span>
                        {college.pincode && <span className="ec-pin">· {college.pincode}</span>}
                        <span className="ec-course-count">· {college.matchCourses.length} course{college.matchCourses.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ec-card-right">
                    <button
                      className="ec-add-btn"
                      onClick={e => { e.stopPropagation(); addToChoice(college); }}
                      title="Add to Choice List"
                    >
                      + Add to Choice
                    </button>
                    <span className={`ec-chevron ${isOpen ? "up" : ""}`}>▼</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="ec-courses">
                    <div className="ec-courses-table-wrap">
                      <table className="ec-courses-table">
                        <thead>
                          <tr>
                            <th>Course</th>
                            {CASTES.map(c => <th key={c}>{c}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {college.matchCourses.map(cr => (
                            <tr key={cr.code}>
                              <td className="ec-course-name">{cr.name}</td>
                              {CASTES.map(c => {
                                const val = cr.cutoffs?.[c];
                                return (
                                  <td key={c} className={`ec-cut ${c === caste && val ? "highlight" : ""} ${!val ? "na" : ""}`}>
                                    {val ?? "—"}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
