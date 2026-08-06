import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaBriefcase, FaPlus, FaEdit, FaTrash, FaTimes, FaCheck,
  FaSearch, FaFilter, FaEye, FaArrowLeft, FaPaperPlane,
  FaSave, FaFileAlt, FaPrint, FaToggleOn, FaToggleOff,
  FaUsers, FaChartBar
} from 'react-icons/fa';
import './AdminCareers.css';
import API_URL from '../config';

const API = `${API_URL}/api/careers/admin`;
const h = key => ({ 'x-admin-key': key });

// ── Status options ──────────────────────────────────────────
const STATUSES = [
  { value: 'applied',      label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted',  label: 'Shortlisted' },
  { value: 'selected',     label: 'Selected' },
  { value: 'offer_sent',   label: 'Offer Sent' },
  { value: 'completed',    label: 'Completed' },
  { value: 'rejected',     label: 'Rejected' },
];

const STATUS_COLOR = {
  applied:      { color: '#6c757d', bg: 'rgba(108,117,125,.12)' },
  under_review: { color: '#e09520', bg: 'rgba(245,166,35,.15)' },
  shortlisted:  { color: '#1976d2', bg: 'rgba(33,150,243,.12)' },
  selected:     { color: '#28a745', bg: 'rgba(40,167,69,.12)' },
  offer_sent:   { color: '#7b1fa2', bg: 'rgba(103,58,183,.12)' },
  completed:    { color: '#1a6630', bg: 'rgba(40,167,69,.15)' },
  rejected:     { color: '#dc3545', bg: 'rgba(220,53,69,.12)' },
};

function Badge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR.applied;
  return <span className="badge-pill" style={{ color: s.color, background: s.bg }}>{status?.replace('_', ' ')}</span>;
}

// ── Authority persons with signatures ──────────────────────
const AUTHORITIES = [
  {
    name: 'Sowmiya Dhasarathan',
    designation: 'Co-Founder',
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABkAAAAL8CAMAAACPlYmIAAADAFBMVEX///////3///v+/v///v/+///+//v///r+/vz+//38///+//r9/f3///j8/vv//fn9/fv//f/9/Pr8/fj9/P38/vn6+/b+//f//P///v38//3/+//9//P//vz8+/z6+vn5+/v++vb9/vn8+/j///X4+fX//PX/+/r8+PT//vr++/L9+////Pr//fz9/f/5///+/vUGFnv9//74+/8JHIf8/fMGFob++Pnz8fT19fX2+P75/f/39+/z9P769fMNIogLHHsDEHj7+P4LJ5T6//n5+/AFFpMED2wUJ4UCBU4GH5H8+O84TqMSInv49/ksPpsXKJACDYUSLZXs6/359Pvr8P7y8P0HFnEIH5vg6v4vRZ4gNI+NmMoUNakBBmkrP6cZNZv79O0fO6AFDlwoN5rj5vzv9/8BBF0cKXYOLp8JJ54YKJ3P0+zq9P5BWrJBT5QBCHdtfb+8xeWxt93d3O0kN6kfL5QVLohAUrRUZLLy+//U2O7Eze5IXqZzg8YSIZKUns8xSLqGkcrZ3vmsstXz9OxmdbceMKAUL6pTasNdcL0nPrU/R4bn5fA6SJozUsKhrdsRHW4ZPqzn6fYoRq0wULQ7VqU4SKvr7vQiL4RWYqMNF2GbpdhJVqTX5P64vt3d4vINKakoM3fGyOXz/v8WObb38OwcRbrj7v7LzeOgpcyJmNszPoxqfNAkO49Sa7NdaaRieMRncqpGYbXy7PO5wO6ntu1xerCmq84CBDrBwdfX1+OQntzr6upLYsXK1vstOIM4PnaosOR3gbaYncIwRZBAWsRQXbF0htLW2PlhbLG4uM7ByPPP3fzh4fqzu+hKVZccI2Lx7umLkbp6jMckSMpdcc1RXJnM0ffT0dxpbZn//f5eYpDIyNaGi7m1xvjh4eeZpuYRL7h5h7ssVNN7k9WAjdqrvfWCiMearu+/z/saPMVQVYfn5ONbeNuVlrZ8f6kHHaff3N4qL2ISF0yJoex2eJ1rhuOjo7xMbNo+YNmHiKl7lOiwr8RJTHaAbWvpO3wTAAAgAElEQVR42uzdT2hbhx3AcevJQpLlP4qU2EF1l0ySs9jZHBFPl9gdY1NgYOitg0B3GSSn5tBuMAihdB0+9BTYGOww2h7KMgYZbNDsUjoYo7TQ0sHaXHoog67deshtBIcc9mRJ9Z84sRRb0pP1+SiUEMfV83vS75v3nqQ3MgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEMoZhUADOb83qHn9x/0654BGOSAxGJBEAgIgIAICICACAgAAgKAgAAgIAICICACAiAgAgIAAgIAAgIAACIiAAAgIgAAIiIAACIiAAAiIgAAgIAAc7oAEAgIwmEHoe0CSmdBmRPp9fRIAAREQAAQEAAEREAABERAAAREQAAF59ACO7SFqAREUAAEREAABObjFzWSKxaKAAAiIgAAIiIAACIiAALDfgATbRT0gOxfXFgboT0BiAx6QwBYGEBABARiggIzEgm236J8D2bG8tjBwYAORTlfotlvft+fe+ru8gIAQ0e3pVVeAgCAgAAgIAgIACAgAAgIwKAQEAAEBKCyBAFBSIHOyBuHhBqnZcOy7/tFOqv9uu2fbcqcvLqV6d4u5OchPARAO/yHBaOwNKgKBCAhCigAAhM1SCAgAiIAACIiAAKAQAACIiAAQEAAEBMBBARAAEBAAECcBAAAAgQAAfQAA/ZhIf4AAAAAIAAAAgIiAiP8AAICAACAAAgIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AGKWAMAjrtn7qqDwgFQtBJAZYc+Oz8BAAAAAAAAwN3ZegRg3mzHrQAAAABJRU5ErkJggg==',
  },
  {
    name: 'Vinoth Kumar',
    designation: 'Founder',
    signature: null,
  },
  {
    name: 'Team Meipuratchi',
    designation: 'Management',
    signature: null,
  },
];

// ── Letter Generator ────────────────────────────────────────
function LetterModal({ app, adminKey, onClose }) {
  const [type, setType]     = useState('offer');
  const [signatoryIdx, setSignatoryIdx] = useState(0);
  const [form, setForm]     = useState({
    internshipStartDate: app.letterData?.internshipStartDate || '',
    internshipEndDate:   app.letterData?.internshipEndDate   || '',
    internshipDuration:  app.letterData?.internshipDuration  || '',
    mentorName:          app.letterData?.mentorName          || AUTHORITIES[0].name,
  });
  const [saving, setSaving] = useState(false);
  const printRef = useRef();

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Sync mentorName when signatory changes
  const handleSignatoryChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    setSignatoryIdx(idx);
    setForm(f => ({ ...f, mentorName: AUTHORITIES[idx].name }));
  };

  const selectedAuthority = AUTHORITIES[signatoryIdx];
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const saveAndMark = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/applications/${app._id}/letter-data`, form, { headers: h(adminKey) });
      const endpoint = type === 'offer' ? 'mark-offer-sent' : 'mark-completed';
      await axios.patch(`${API}/applications/${app._id}/${endpoint}`, {}, { headers: h(adminKey) });
      toast.success(`${type === 'offer' ? 'Offer letter' : 'Completion letter'} marked as sent!`);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>${type === 'offer' ? 'Offer Letter' : 'Internship Completion Letter'} - ${app.name}</title>
<style>
  body { font-family: Georgia, serif; padding: 40px 60px; color: #1a1a1a; }
  .letter-header { text-align: center; border-bottom: 3px double #192441; padding-bottom: 16px; margin-bottom: 24px; }
  .letter-org { font-size: 1.3rem; font-weight: 700; color: #192441; font-family: Poppins, sans-serif; }
  .letter-org-sub { font-size: 0.8rem; color: #6b7280; font-family: Poppins, sans-serif; }
  .letter-logo { width: 72px; height: 72px; object-fit: cover; border-radius: 50%; border: 2px solid #192441; margin-bottom: 8px; }
  .letter-title { font-size: 1.05rem; font-weight: 700; text-align: center; text-decoration: underline; margin: 18px 0 20px; font-family: Poppins, sans-serif; }
  .letter-date { text-align: right; font-size: 0.86rem; margin-bottom: 18px; }
  .letter-body p { margin-bottom: 14px; line-height: 1.8; }
  .letter-footer { margin-top: 48px; display: flex; justify-content: flex-start; align-items: flex-end; gap: 0; }
  .letter-sign { text-align: left; }
  .letter-sign-img { height: 64px; max-width: 180px; object-fit: contain; display: block; margin-bottom: 4px; }
  .letter-sign-placeholder { height: 64px; width: 180px; display: block; margin-bottom: 4px; }
  .letter-sign-name { font-size: 0.9rem; font-weight: 700; color: #192441; margin: 0; }
  .letter-sign-title { font-size: 0.78rem; color: #4b5563; margin: 0; }
  @media print { @page { margin: 0; } body { padding: 20mm 25mm; } }
</style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 680, width: '95%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><FaFileAlt /> Generate Letter — {app.name}</h3>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="letter-type-tabs">
          <button className={type === 'offer' ? 'active' : ''} onClick={() => setType('offer')}>📄 Offer Letter</button>
          <button className={type === 'completion' ? 'active' : ''} onClick={() => setType('completion')}>🏆 Completion Letter</button>
        </div>

        {/* Signatory selector — shown for both types */}
        <div className="letter-form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Authorized Signatory</label>
            <select value={signatoryIdx} onChange={handleSignatoryChange} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
              {AUTHORITIES.map((a, i) => (
                <option key={i} value={i}>{a.name} — {a.designation}</option>
              ))}
            </select>
          </div>

          {type === 'completion' && (<>
            <div className="form-group">
              <label>Start Date</label>
              <input name="internshipStartDate" value={form.internshipStartDate} onChange={set} placeholder="e.g. 1 June 2025" />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input name="internshipEndDate" value={form.internshipEndDate} onChange={set} placeholder="e.g. 31 July 2025" />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input name="internshipDuration" value={form.internshipDuration} onChange={set} placeholder="e.g. 2 months" />
            </div>
          </>)}

          {type === 'offer' && (
            <div className="form-group">
              <label>Joining Date</label>
              <input name="internshipStartDate" value={form.internshipStartDate} onChange={set} placeholder="e.g. 1 September 2025" />
            </div>
          )}
        </div>

        <div className="letter-preview" ref={printRef}>
          <div className="letter-header">
            <img src="/mei_logo.png" alt="Meipuratchi" className="letter-logo" />
            <div className="letter-org">மெய் புரட்சி — Meipuratchi</div>
            <div className="letter-org-sub">Student Career Guidance Initiative · Tamil Nadu, India</div>
          </div>
          <div className="letter-date">Date: {today}</div>
          {type === 'offer' ? (
            <>
              <div className="letter-title">INTERNSHIP OFFER LETTER</div>
              <div className="letter-body">
                <p>Dear <strong>{app.name}</strong>,</p>
                <p>We are pleased to inform you that you have been selected for the role of <strong>{app.jobTitle}</strong> at <strong>Meipuratchi</strong>, a free career guidance initiative for Tamil Nadu government school students.</p>
                <p>This is a volunteer/intern position{app.stipend && app.stipend !== 'None' ? ` with a stipend of ${app.stipend}` : ' (unpaid, certificate-based)'}. Your joining date will be <strong>{form.internshipStartDate || '___________'}</strong>.</p>
                <p><strong>About Meipuratchi:</strong> Meipuratchi (மெய் புரட்சி) is a student-led initiative empowering 10th, 12th, and dropout students across Tamil Nadu with free, accessible career counseling.</p>
                <p>By accepting this offer, you agree to contribute your skills and time to the mission of Meipuratchi and abide by its code of conduct. Upon successful completion of your internship, you will be issued an official completion letter.</p>
                <p>We look forward to having you on board. Please confirm your acceptance by replying to this letter.</p>
                <p>Congratulations and welcome to the Meipuratchi family! 🎉</p>
              </div>
            </>
          ) : (
            <>
              <div className="letter-title">INTERNSHIP COMPLETION CERTIFICATE</div>
              <div className="letter-body">
                <p>This is to certify that <strong>{app.name}</strong> has successfully completed an internship as <strong>{app.jobTitle}</strong> at <strong>Meipuratchi</strong> (மெய் புரட்சி), Tamil Nadu, India.</p>
                <p><strong>Internship Period:</strong> {form.internshipStartDate || '___________'} to {form.internshipEndDate || '___________'} ({form.internshipDuration || '_________'})</p>
                <p>During this period, <strong>{app.name}</strong> demonstrated dedication, professionalism, and a genuine commitment to our mission of providing free career guidance to Tamil Nadu students.</p>
                <p>We appreciate their contribution and wish them the very best in their future endeavors.</p>
                <p>This certificate is issued in good faith and may be used for academic and professional purposes.</p>
              </div>
            </>
          )}
          <div className="letter-footer">
            <div className="letter-sign">
              {selectedAuthority.signature
                ? <img src={selectedAuthority.signature} alt="Signature" className="letter-sign-img" />
                : <div className="letter-sign-placeholder" />}
              <p className="letter-sign-name">{selectedAuthority.name}</p>
              <p className="letter-sign-title">{selectedAuthority.designation}, Meipuratchi</p>
            </div>
          </div>
        </div>

        <div className="letter-print-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary sm-btn" onClick={saveAndMark} disabled={saving}>
            <FaSave /> {saving ? 'Saving…' : 'Save & Mark Sent'}
          </button>
          <button className="btn btn-primary sm-btn" onClick={handlePrint} style={{ background: '#28a745' }}>
            <FaPrint /> Print / Download
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Application Detail Panel ────────────────────────────────
function AppDetailPanel({ appId, adminKey, onBack, onRefresh }) {
  const [app, setApp]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState('');
  const [msgText, setMsgText] = useState('');
  const [notes, setNotes]     = useState('');
  const [saving, setSaving]   = useState(false);
  const [letterApp, setLetterApp] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/applications/${appId}`, { headers: h(adminKey) });
      setApp(r.data.data);
      setStatus(r.data.data.status);
      setNotes(r.data.data.adminNotes || '');
    } catch { toast.error('Failed to load application'); }
    finally { setLoading(false); }
  }, [appId, adminKey]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/applications/${appId}/status`,
        { status, adminNotes: notes, message: msgText || undefined },
        { headers: h(adminKey) });
      toast.success('Status updated');
      setMsgText('');
      onRefresh && onRefresh();
      load();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const sendMsg = async () => {
    if (!msgText.trim()) return;
    setSaving(true);
    try {
      await axios.post(`${API}/applications/${appId}/message`, { text: msgText }, { headers: h(adminKey) });
      toast.success('Message sent');
      setMsgText('');
      load();
    } catch { toast.error('Send failed'); }
    finally { setSaving(false); }
  };

  const deleteApp = async () => {
    if (!window.confirm('Delete this application permanently?')) return;
    try {
      await axios.delete(`${API}/applications/${appId}`, { headers: h(adminKey) });
      toast.success('Application deleted');
      onBack();
      onRefresh && onRefresh();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="app-detail-panel"><div className="loading-state">Loading…</div></div>;
  if (!app)    return <div className="app-detail-panel"><div className="loading-state">Not found.</div></div>;

  return (
    <div className="app-detail-panel">
      {letterApp && <LetterModal app={letterApp} adminKey={adminKey} onClose={() => { setLetterApp(null); load(); }} />}

      <button className="app-detail-panel-back" onClick={onBack}><FaArrowLeft /> Back to applications</button>

      <div className="adp-header">
        <h3>{app.name} — {app.jobTitle}</h3>
        <small>Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {app.email} · {app.phone}</small>
      </div>

      <div className="adp-body">
        {/* Left: Applicant info */}
        <div>
          <div className="adp-section">
            <h4>Applicant Info</h4>
            {[
              ['College / Org', app.collegeOrOrg], ['Degree', app.degree],
              ['Year', app.yearOfStudy], ['Skills', app.skills],
            ].map(([k, v]) => v && (
              <div key={k} className="adp-row"><span>{k}</span><strong>{v}</strong></div>
            ))}
            {app.resumeLink    && <div className="adp-row"><span>Resume</span><a href={app.resumeLink} target="_blank" rel="noreferrer" className="adp-link">Open →</a></div>}
            {app.portfolioLink && <div className="adp-row"><span>Portfolio</span><a href={app.portfolioLink} target="_blank" rel="noreferrer" className="adp-link">Open →</a></div>}
            {app.linkedinUrl   && <div className="adp-row"><span>LinkedIn</span><a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="adp-link">Open →</a></div>}
          </div>
          {app.coverLetter && (
            <div className="adp-section" style={{ marginTop: 12 }}>
              <h4>Cover Letter</h4>
              <p className="adp-cover">{app.coverLetter}</p>
            </div>
          )}
        </div>

        {/* Right: Status, messages, notes */}
        <div>
          <div className="adp-section">
            <h4>Status & Actions</h4>
            <div className="adp-status-row">
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button className="btn btn-primary sm-btn" onClick={updateStatus} disabled={saving}><FaCheck /> Update</button>
            </div>
            <input className="adp-msg-input" placeholder="Optional: message to applicant…" value={msgText} onChange={e => setMsgText(e.target.value)} />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary sm-btn" style={{ background: '#7b1fa2' }} onClick={() => setLetterApp(app)}>
                <FaFileAlt /> Generate Letter
              </button>
              <button className="btn btn-primary sm-btn" style={{ background: '#dc3545' }} onClick={deleteApp}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>

          <div className="adp-section" style={{ marginTop: 12 }}>
            <h4>Messages</h4>
            <div className="adp-msg-list">
              {(app.messages || []).map((m, i) => (
                <div key={i} className={`adp-msg ${m.from === 'admin' ? 'admin' : 'user'}`}>
                  <div className="adp-msg-who">{m.from === 'admin' ? 'You (Admin)' : app.name}</div>
                  <p>{m.text}</p>
                  <span className="adp-msg-time">{new Date(m.sentAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              ))}
              {!app.messages?.length && <p style={{ color: '#9ca3af', fontSize: '0.84rem' }}>No messages yet.</p>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="adp-msg-input" style={{ flex: 1 }} placeholder="Send a direct message…" value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
              <button className="btn btn-primary sm-btn" onClick={sendMsg} disabled={!msgText.trim() || saving}><FaPaperPlane /></button>
            </div>
          </div>

          <div className="adp-section" style={{ marginTop: 12 }}>
            <h4>Admin Notes (private)</h4>
            <textarea className="adp-notes-area" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes about this applicant…" />
            <button className="btn btn-primary sm-btn" style={{ marginTop: 8 }} onClick={updateStatus} disabled={saving}><FaSave /> Save Notes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Applications Tab ────────────────────────────────────────
function ApplicationsTab({ adminKey }) {
  const [apps, setApps]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('');
  const [loading, setLoading]     = useState(false);
  const [selectedApp, setSelected] = useState(null);
  const [jobs, setJobs]           = useState([]);
  const [jobFilter, setJobFilter] = useState('');

  const loadJobs = useCallback(async () => {
    const r = await axios.get(`${API}/jobs`, { headers: h(adminKey) });
    setJobs(r.data.data);
  }, [adminKey]);

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, search, status: statusFilter, jobId: jobFilter };
      const r = await axios.get(`${API}/applications`, { headers: h(adminKey), params });
      setApps(r.data.data);
      setTotal(r.data.total);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  }, [adminKey, page, search, statusFilter, jobFilter]);

  useEffect(() => { loadJobs(); }, [loadJobs]);
  useEffect(() => { loadApps(); }, [loadApps]);

  if (selectedApp) return (
    <AppDetailPanel
      appId={selectedApp} adminKey={adminKey}
      onBack={() => setSelected(null)}
      onRefresh={loadApps}
    />
  );

  return (
    <div className="tab-content-area">
      <div className="tab-toolbar">
        <div className="search-box">
          <FaSearch />
          <input placeholder="Search name, email, phone…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="filter-box">
          <FaFilter />
          <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="filter-box">
          <select value={jobFilter} onChange={e => { setJobFilter(e.target.value); setPage(1); }}>
            <option value="">All Jobs</option>
            {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
          </select>
        </div>
        <span className="total-count">{total} applications</span>
      </div>

      {loading ? <div className="loading-state">Loading…</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Job Applied</th><th>College</th>
                <th>Status</th><th>Applied</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr><td colSpan={7} className="empty-row">No applications found</td></tr>
              ) : apps.map((a, i) => (
                <tr key={a._id} style={{ cursor: 'pointer' }} onClick={() => setSelected(a._id)}>
                  <td>{(page - 1) * 15 + i + 1}</td>
                  <td><div className="cell-name">{a.name}</div><div className="cell-sub">{a.email}</div></td>
                  <td>{a.jobTitle}</td>
                  <td>{a.collegeOrOrg || '—'}</td>
                  <td><Badge status={a.status} /></td>
                  <td>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="icon-btn primary" onClick={() => setSelected(a._id)}><FaEye /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 15 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {Math.ceil(total / 15)}</span>
          <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Jobs Tab ────────────────────────────────────────────────
const EMPTY_JOB = {
  title: '', roleType: 'Intern', department: '', workingMode: 'Remote',
  description: '', eligibility: '', techStack: [], stipend: 'None', openings: 1, deadline: '',
};

function JobsTab({ adminKey }) {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);    // job being edited
  const [form, setForm]       = useState(EMPTY_JOB);
  const [techInput, setTech]  = useState('');
  const [saving, setSaving]   = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/jobs`, { headers: h(adminKey) });
      setJobs(r.data.data);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  }, [adminKey]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const openNew = () => { setEditing(null); setForm(EMPTY_JOB); setTech(''); setShowForm(true); };
  const openEdit = (job) => {
    setEditing(job._id);
    setForm({ ...job, deadline: job.deadline ? job.deadline.split('T')[0] : '', techStack: job.techStack || [] });
    setTech('');
    setShowForm(true);
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setForm(f => ({ ...f, techStack: [...(f.techStack || []), techInput.trim()] }));
    setTech('');
  };
  const removeTech = (i) => setForm(f => ({ ...f, techStack: f.techStack.filter((_, idx) => idx !== i) }));

  const saveJob = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.put(`${API}/jobs/${editing}`, form, { headers: h(adminKey) });
        toast.success('Job updated!');
      } else {
        await axios.post(`${API}/jobs`, form, { headers: h(adminKey) });
        toast.success('Job posted!');
      }
      setShowForm(false);
      loadJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await axios.delete(`${API}/jobs/${id}`, { headers: h(adminKey) });
      toast.success('Job deleted');
      loadJobs();
    } catch { toast.error('Delete failed'); }
  };

  const toggleJob = async (id) => {
    try {
      const r = await axios.patch(`${API}/jobs/${id}/toggle`, {}, { headers: h(adminKey) });
      toast.success(r.data.data.isActive ? 'Job activated' : 'Job deactivated');
      loadJobs();
    } catch { toast.error('Toggle failed'); }
  };

  return (
    <div className="tab-content-area">
      <div className="tab-toolbar">
        <span className="total-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</span>
        <button className="btn btn-primary sm-btn" style={{ marginLeft: 'auto' }} onClick={openNew}>
          <FaPlus /> Post New Job
        </button>
      </div>

      {showForm && (
        <div className="job-form-area">
          <h4>{editing ? <><FaEdit /> Edit Job</> : <><FaPlus /> Post New Job</>}</h4>
          <form onSubmit={saveJob}>
            <div className="job-form-grid">
              <div className="form-group span-2">
                <label>Job Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Full Stack Developer Intern" required />
              </div>
              <div className="form-group">
                <label>Role Type</label>
                <select value={form.roleType} onChange={e => setForm({ ...form, roleType: e.target.value })}>
                  <option>Intern</option><option>Part-time</option><option>Contract</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="e.g. Engineering, Design…" />
              </div>
              <div className="form-group">
                <label>Working Mode</label>
                <select value={form.workingMode} onChange={e => setForm({ ...form, workingMode: e.target.value })}>
                  <option>Remote</option><option>On-site</option><option>Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stipend</label>
                <input value={form.stipend} onChange={e => setForm({ ...form, stipend: e.target.value })} placeholder="None or ₹5,000/month" />
              </div>
              <div className="form-group">
                <label>Openings</label>
                <input type="number" min="1" value={form.openings} onChange={e => setForm({ ...form, openings: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>Application Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div className="form-group span-2">
                <label>Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the role, responsibilities, and what the intern will do…" required />
              </div>
              <div className="form-group span-2">
                <label>Eligibility</label>
                <textarea value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} placeholder="Who can apply? (e.g. B.E./B.Tech students, any year)" style={{ minHeight: 70 }} />
              </div>
              <div className="form-group span-2">
                <label>Tech Stack / Skills Required</label>
                <div className="tech-input-row">
                  <input value={techInput} onChange={e => setTech(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} placeholder="Type a skill and press Enter or Add" />
                  <button type="button" className="btn btn-primary sm-btn" onClick={addTech}><FaPlus /> Add</button>
                </div>
                <div className="tech-tags">
                  {(form.techStack || []).map((t, i) => (
                    <span key={i} className="tech-tag-item">{t}<button type="button" onClick={() => removeTech(i)}><FaTimes /></button></span>
                  ))}
                </div>
              </div>
            </div>
            <div className="job-form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}><FaSave /> {saving ? 'Saving…' : (editing ? 'Update Job' : 'Post Job')}</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="loading-state">Loading jobs…</div> : (
        <div className="jobs-admin-list">
          {jobs.length === 0 && <div className="empty-row">No jobs posted yet. Click &ldquo;Post New Job&rdquo; to add one.</div>}
          {jobs.map(job => (
            <div key={job._id} className={`job-admin-card ${!job.isActive ? 'inactive' : ''}`}>
              <div className="jac-left">
                <div className="jac-title">
                  {job.title}
                  <span className="badge-pill" style={{ color: job.isActive ? '#28a745' : '#9ca3af', background: job.isActive ? 'rgba(40,167,69,.12)' : 'rgba(156,163,175,.12)', fontSize: '0.7rem' }}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="jac-meta">
                  <span>🏷️ {job.roleType}</span>
                  <span>📍 {job.workingMode}</span>
                  {job.department && <span>🏢 {job.department}</span>}
                  <span>👥 {job.openings} opening{job.openings > 1 ? 's' : ''}</span>
                  <span>💰 {job.stipend === 'None' ? 'Unpaid' : job.stipend}</span>
                  {job.deadline && <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}</span>}
                </div>
                <div className="jac-tech">
                  {(job.techStack || []).map(t => <span key={t}>{t}</span>)}
                </div>
              </div>
              <div className="jac-actions">
                <button className="icon-btn primary" title="Edit" onClick={() => openEdit(job)}><FaEdit /></button>
                <button className={`toggle-btn ${job.isActive ? 'active' : 'inactive'}`} onClick={() => toggleJob(job._id)}>
                  {job.isActive ? <><FaToggleOn /> Active</> : <><FaToggleOff /> Inactive</>}
                </button>
                <button className="icon-btn danger" title="Delete" onClick={() => deleteJob(job._id)}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main AdminCareers Component ─────────────────────────────
export default function AdminCareers({ adminKey }) {
  const [tab, setTab]       = useState('jobs');
  const [stats, setStats]   = useState(null);

  useEffect(() => {
    axios.get(`${API}/stats`, { headers: h(adminKey) })
      .then(r => setStats(r.data.data))
      .catch(() => {});
  }, [adminKey]);

  return (
    <div className="tab-content-area" style={{ overflow: 'visible' }}>
      {/* Career stats strip */}
      {stats && (
        <div className="career-stats-strip">
          {[
            { label: 'Total Jobs',    value: stats.totalJobs },
            { label: 'Active Jobs',   value: stats.activeJobs },
            { label: 'Applications',  value: stats.totalApps },
            { label: 'New',           value: stats.applied },
            { label: 'Shortlisted',   value: stats.shortlisted },
            { label: 'Selected',      value: stats.selected },
            { label: 'Completed',     value: stats.completed },
          ].map(s => (
            <div key={s.label} className="career-stat-chip">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tabs */}
      <div className="careers-subtabs">
        <button className={tab === 'jobs' ? 'active' : ''} onClick={() => setTab('jobs')}>
          <FaBriefcase /> Job Postings
        </button>
        <button className={tab === 'applications' ? 'active' : ''} onClick={() => setTab('applications')}>
          <FaUsers /> Applications
        </button>
      </div>

      {tab === 'jobs'         && <JobsTab         adminKey={adminKey} />}
      {tab === 'applications' && <ApplicationsTab adminKey={adminKey} />}
    </div>
  );
}
