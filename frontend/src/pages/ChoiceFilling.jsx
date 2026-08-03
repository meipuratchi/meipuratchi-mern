import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import colleges from '../data/engineeringColleges2025.json';
import './ChoiceFilling.css';

const categories = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];
const allChoices = colleges.flatMap(college =>
  college.courses.map(course => ({
    ...course,
    collegeCode: college.code,
    collegeName: college.name,
    shortName: college.shortName || college.name,
    district: college.district,
    pincode: college.pincode,
    id: `${college.code}-${course.code || course.name}`,
  }))
);

const districts = [...new Set(colleges.map(c => c.district))].sort();
const courseNames = [...new Set(allChoices.map(c => c.name))].sort();

// ── PDF Generation ───────────────────────────────────────────
async function generatePDF(order, category) {
  if (!order.length) return;

  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, margin = 14;

  // ── Header ──
  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 120; canvas.height = 120;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(60, 60, 60, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, 120, 120);
        const dataUrl = canvas.toDataURL('image/png');
        pdf.addImage(dataUrl, 'PNG', margin, 8, 18, 18);
        resolve();
      };
      img.onerror = reject;
      img.src = '/mei_logo.png';
    });
  } catch {
    pdf.setFillColor(26, 58, 110);
    pdf.circle(margin + 9, 17, 9, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('M', margin + 6.5, 20);
  }

  // Title block
  pdf.setTextColor(26, 58, 110);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Meipuratchi', margin + 22, 14);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(80, 100, 130);
  pdf.text(`Tamil Nadu Engineering Counselling 2025 — Choice Filling Order (${category} Category)`, margin + 22, 20);

  // Gold line
  pdf.setDrawColor(229, 161, 0);
  pdf.setLineWidth(0.8);
  pdf.line(margin, 27, W - margin, 27);

  // Date & count
  pdf.setFontSize(8);
  pdf.setTextColor(100, 120, 150);
  pdf.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin, 32);
  pdf.text(`Total Choices: ${order.length}`, W - margin - 30, 32);

  // ── Table ──
  // Columns: #(10), Code(18), College Name(80), Course(52), Cutoff(22)
  const tableTop = 37;
  const colWidths = [10, 18, 80, 52, 22];
  const colX = [margin];
  colWidths.slice(0, -1).forEach((w, i) => colX.push(colX[i] + w));
  const rowH = 12;
  const headers = ['#', 'Code', 'College Name', 'Course', `${category} 2025`];

  // Header row
  pdf.setFillColor(26, 58, 110);
  pdf.rect(margin, tableTop, W - 2 * margin, rowH, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  headers.forEach((h, i) => {
    pdf.text(h, colX[i] + 2, tableTop + 7.5);
  });

  let y = tableTop + rowH;
  let pageNum = 1;

  const addPageFooter = () => {
    pdf.setFontSize(7);
    pdf.setTextColor(140, 150, 165);
    pdf.text(
      'This is a sample planning sheet only. Submit your final choices on the official TNEA portal at tneaonline.org',
      margin, 290
    );
    pdf.text(`Page ${pageNum}`, W - margin - 10, 290);
  };

  order.forEach((item, idx) => {
    if (y > 272) {
      addPageFooter();
      pdf.addPage();
      pageNum++;
      y = 18;
      pdf.setFillColor(26, 58, 110);
      pdf.rect(margin, y - rowH, W - 2 * margin, rowH, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      headers.forEach((h, i) => pdf.text(h, colX[i] + 2, y - 4.5));
    }

    if (idx % 2 === 0) {
      pdf.setFillColor(245, 248, 252);
      pdf.rect(margin, y, W - 2 * margin, rowH, 'F');
    }

    pdf.setDrawColor(220, 227, 235);
    pdf.setLineWidth(0.2);
    pdf.rect(margin, y, W - 2 * margin, rowH);

    // #
    pdf.setTextColor(30, 42, 58);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(String(idx + 1), colX[0] + 2, y + 5);

    // Code
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 58, 110);
    pdf.text(item.collegeCode, colX[1] + 2, y + 5);

    // College name (line 1) + district · pincode (line 2)
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 42, 58);
    pdf.setFontSize(7.5);
    const nameTrunc = pdf.splitTextToSize(item.shortName || item.collegeName, colWidths[2] - 4)[0];
    pdf.text(nameTrunc, colX[2] + 2, y + 4.5);

    const locationStr = [item.district, item.pincode].filter(Boolean).join(' · ');
    pdf.setFontSize(6.5);
    pdf.setTextColor(100, 120, 150);
    pdf.text(locationStr, colX[2] + 2, y + 9.5);

    // Course
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(40, 100, 160);
    const courseTrunc = pdf.splitTextToSize(item.name, colWidths[3] - 4)[0];
    pdf.text(courseTrunc, colX[3] + 2, y + 5);

    // Cutoff
    const cutoffVal = item.cutoffs?.[category];
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    if (cutoffVal != null) {
      pdf.setTextColor(26, 58, 110);
    } else {
      pdf.setTextColor(180, 180, 180);
    }
    pdf.text(cutoffVal != null ? String(cutoffVal) : '—', colX[4] + 2, y + 5);

    y += rowH;
  });

  addPageFooter();
  pdf.save(`meipuratchi-tnea-2025-${category.toLowerCase()}-choices.pdf`);
}

// ── Search Result Item ───────────────────────────────────────
function SearchItem({ item, isAdded, onAdd, filterCategory }) {
  return (
    <div className={`cf-result-item ${isAdded ? 'cf-result-item--added' : ''}`}>
      <div className="cf-result-info">
        <div className="cf-result-top">
          <span className="cf-result-code">{item.collegeCode}</span>
          <span className="cf-result-district">📍 {item.district}</span>
        </div>
        <p className="cf-result-college">{item.shortName || item.collegeName}</p>
        <p className="cf-result-course">{item.name}</p>
        <div className="cf-result-cutoffs">
          {categories.map(cat => {
            const val = item.cutoffs?.[cat];
            return (
              <span key={cat} className={`cf-cut-pill ${cat === filterCategory ? 'cf-cut-pill--hl' : ''} ${!val ? 'cf-cut-pill--na' : ''}`}>
                <span className="cf-cut-label">{cat}</span>
                <span className="cf-cut-num">{val ?? '—'}</span>
              </span>
            );
          })}
        </div>
      </div>
      <button
        className={`cf-add-btn ${isAdded ? 'cf-add-btn--added' : ''}`}
        onClick={() => !isAdded && onAdd(item)}
        disabled={isAdded}
        title={isAdded ? 'Already added' : 'Add to choice list'}
      >
        {isAdded ? '✓' : '+'}
      </button>
    </div>
  );
}

// ── Choice Order Item ────────────────────────────────────────
function OrderItem({ item, index, total, category, onMove, onRemove, onDragStart, onDragOver, onDrop }) {
  const cutoffVal = item.cutoffs?.[category];
  return (
    <div
      className="cf-order-item"
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => { e.preventDefault(); onDragOver(index); }}
      onDrop={() => onDrop(index)}
    >
      <span className="cf-order-num">{index + 1}</span>
      <div className="cf-order-main">
        <div className="cf-order-info">
          <p className="cf-order-college">{item.shortName || item.collegeName}</p>
          <p className="cf-order-location">{item.district}{item.pincode ? ` · ${item.pincode}` : ''}</p>
          <p className="cf-order-course">{item.name}</p>
          <p className="cf-order-meta">{item.collegeCode}</p>
        </div>
        <div className="cf-order-item-bottom">
          <div className="cf-order-cutoff">
            <span className="cf-order-cutoff-label">{category}</span>
            <span className="cf-order-cutoff-val">{cutoffVal != null ? cutoffVal : '—'}</span>
          </div>
          <div className="cf-order-controls">
            <button className="cf-ctrl-btn" onClick={() => onMove(index, index - 1)} disabled={index === 0} title="Move up">▲</button>
            <button className="cf-ctrl-btn" onClick={() => onMove(index, index + 1)} disabled={index === total - 1} title="Move down">▼</button>
            <button className="cf-ctrl-btn cf-ctrl-btn--remove" onClick={() => onRemove(item.id)} title="Remove">✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function ChoiceFilling() {
  const [params] = useSearchParams();
  const [order, setOrder]       = useState([]);
  const [search, setSearch]     = useState('');
  const [district, setDistrict] = useState('');
  const [course, setCourse]     = useState('');
  const [category, setCategory] = useState('OC');
  const [cutoff, setCutoff]     = useState('');
  const [dragFrom, setDragFrom] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Auto-add from URL param
  useEffect(() => {
    const id = params.get('add');
    if (!id) return;
    const item = allChoices.find(c => c.id === id);
    if (item) setOrder(prev => prev.some(c => c.id === item.id) ? prev : [...prev, item]);
  }, [params]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const max = cutoff !== '' ? Number(cutoff) : null;
    return allChoices.filter(item => {
      if (district && item.district !== district) return false;
      if (course   && item.name    !== course)    return false;
      const val = item.cutoffs?.[category];
      if (max !== null && (val == null || val > max)) return false;
      if (q && ![item.collegeName, item.shortName, item.collegeCode, item.pincode, item.district, item.name]
               .join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, district, course, category, cutoff]);

  const add = useCallback((item) => {
    setOrder(prev => prev.some(c => c.id === item.id) ? prev : [...prev, item]);
  }, []);

  const remove = useCallback((id) => {
    setOrder(prev => prev.filter(c => c.id !== id));
  }, []);

  const move = useCallback((from, to) => {
    if (to < 0 || to >= order.length) return;
    setOrder(prev => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, [order.length]);

  const handleDragOver = useCallback((toIdx) => {
    if (dragFrom === null || dragFrom === toIdx) return;
    setOrder(prev => {
      const next = [...prev];
      const [item] = next.splice(dragFrom, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
    setDragFrom(toIdx);
  }, [dragFrom]);

  const handlePDF = async () => {
    setGenerating(true);
    try { await generatePDF(order, category); }
    finally { setGenerating(false); }
  };

  const addedIds = useMemo(() => new Set(order.map(c => c.id)), [order]);

  return (
    <div className="cf-page">
      {/* Page header */}
      <div className="cf-header">
        <div className="cf-header-inner">
          <div>
            <h1 className="cf-title">TNEA 2025 — Choice Filling</h1>
            <p className="cf-subtitle">Search, add and order your college preferences · Download as PDF</p>
          </div>
          <div className="cf-header-actions">
            <Link to="/engineering" className="cf-back-link">← Colleges</Link>
            <button
              className={`cf-pdf-btn ${!order.length ? 'cf-pdf-btn--disabled' : ''}`}
              onClick={handlePDF}
              disabled={!order.length || generating}
            >
              {generating ? '⏳ Generating…' : '⬇ Download PDF'}
            </button>
          </div>
        </div>
      </div>

      <div className="cf-body">
        {/* ── Left: Search Panel ── */}
        <div className="cf-search-panel">
          <div className="cf-panel-head">
            <h2>Search Colleges</h2>
            <span className="cf-result-count">{filtered.length.toLocaleString()} results</span>
          </div>

          {/* Filters */}
          <div className="cf-filters">
            <input
              className="cf-input cf-input--full"
              type="text"
              placeholder="Search college name, code, pincode…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="cf-filter-row">
              <select className="cf-select" value={district} onChange={e => setDistrict(e.target.value)}>
                <option value="">All Districts</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className="cf-select" value={course} onChange={e => setCourse(e.target.value)}>
                <option value="">All Courses</option>
                {courseNames.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="cf-filter-row">
              <div className="cf-category-row">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`cf-cat-btn ${category === cat ? 'cf-cat-btn--active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >{cat}</button>
                ))}
              </div>
              <input
                className="cf-input cf-input--cutoff"
                type="number"
                placeholder="Max cutoff"
                value={cutoff}
                onChange={e => setCutoff(e.target.value)}
                min={0} max={200} step={0.5}
              />
            </div>
          </div>

          {/* Results */}
          <div className="cf-results">
            {filtered.length === 0 && (
              <div className="cf-empty">No results. Try changing the filters.</div>
            )}
            {filtered.slice(0, 100).map(item => (
              <SearchItem
                key={item.id}
                item={item}
                isAdded={addedIds.has(item.id)}
                onAdd={add}
                filterCategory={category}
              />
            ))}
            {filtered.length > 100 && (
              <p className="cf-limit-note">Showing first 100 of {filtered.length.toLocaleString()} — refine your search to see more.</p>
            )}
          </div>
        </div>

        {/* ── Right: Choice Order Panel ── */}
        <div className="cf-order-panel">
          <div className="cf-panel-head">
            <div>
              <h2>Your Choice Order</h2>
              <span className="cf-order-sub">{order.length} college{order.length !== 1 ? 's' : ''} selected</span>
            </div>
            <div className="cf-order-head-actions">
              {order.length > 0 && (
                <button className="cf-clear-btn" onClick={() => setOrder([])}>Clear all</button>
              )}
            </div>
          </div>

          {order.length === 0 ? (
            <div className="cf-order-empty">
              <div className="cf-order-empty-icon">📋</div>
              <p>Search and add colleges on the left to build your choice order.</p>
              <p className="cf-order-empty-hint">Drag rows or use ▲▼ to reorder.</p>
            </div>
          ) : (
            <>
              <p className="cf-drag-hint">↕ Drag to reorder &nbsp;·&nbsp; Use ▲▼ on mobile</p>
              <div className="cf-order-list">
                {order.map((item, idx) => (
                  <OrderItem
                    key={item.id}
                    item={item}
                    index={idx}
                    total={order.length}
                    category={category}
                    onMove={move}
                    onRemove={remove}
                    onDragStart={(i) => setDragFrom(i)}
                    onDragOver={handleDragOver}
                    onDrop={() => setDragFrom(null)}
                  />
                ))}
              </div>

              <button
                className={`cf-pdf-btn-bottom ${generating ? 'cf-pdf-btn--disabled' : ''}`}
                onClick={handlePDF}
                disabled={generating}
              >
                {generating ? '⏳ Generating…' : '⬇ Download PDF'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
