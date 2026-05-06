import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaPlus, FaTrash, FaEdit, FaSave, FaEye, FaEyeSlash,
  FaPalette, FaFileAlt, FaGlobe, FaTimes, FaArrowUp,
  FaArrowDown, FaCheck, FaImage, FaLink, FaListUl, FaFont
} from 'react-icons/fa';
import './AdminCMS.css';

import API_URL from '../config';
const BASE = `${API_URL}/api/content`;
const h = key => ({ 'x-admin-key': key });

// ── Block type icon ────────────────────────────────────────
const typeIcon = { text: <FaFont />, textarea: <FaFileAlt />, image: <FaImage />, link: <FaLink />, list: <FaListUl />, color: <FaPalette /> };

// ── Single block editor ────────────────────────────────────
function BlockEditor({ block, onChange, onDelete }) {
  const update = (field, val) => onChange({ ...block, [field]: val });

  const updateListItem = (i, val) => {
    const items = [...(block.listItems || [])];
    items[i] = val;
    onChange({ ...block, listItems: items });
  };

  const addListItem  = () => onChange({ ...block, listItems: [...(block.listItems || []), ''] });
  const delListItem  = i  => onChange({ ...block, listItems: block.listItems.filter((_, idx) => idx !== i) });

  return (
    <div className="block-editor">
      <div className="block-header">
        <span className="block-type-icon">{typeIcon[block.type] || <FaFont />}</span>
        <input
          className="block-label-input"
          value={block.label || ''}
          onChange={e => update('label', e.target.value)}
          placeholder="Field label"
        />
        <select className="block-type-select" value={block.type} onChange={e => update('type', e.target.value)}>
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
          <option value="image">Image URL</option>
          <option value="link">Link URL</option>
          <option value="color">Color</option>
          <option value="list">List</option>
        </select>
        <input
          className="block-key-input"
          value={block.key}
          onChange={e => update('key', e.target.value)}
          placeholder="key_name"
        />
        <button className="block-del-btn" onClick={onDelete} title="Remove field"><FaTimes /></button>
      </div>

      <div className="block-value">
        {block.type === 'textarea' && (
          <textarea
            value={block.value || ''}
            onChange={e => update('value', e.target.value)}
            placeholder="Enter content..."
            rows={4}
          />
        )}
        {block.type === 'color' && (
          <div className="color-input-row">
            <input type="color" value={block.value || '#192441'} onChange={e => update('value', e.target.value)} />
            <input type="text"  value={block.value || ''} onChange={e => update('value', e.target.value)} placeholder="#192441" />
          </div>
        )}
        {block.type === 'list' && (
          <div className="list-editor">
            {(block.listItems || []).map((item, i) => (
              <div key={i} className="list-item-row">
                <input value={item} onChange={e => updateListItem(i, e.target.value)} placeholder={`Item ${i + 1}`} />
                <button onClick={() => delListItem(i)}><FaTimes /></button>
              </div>
            ))}
            <button className="add-list-item" onClick={addListItem}><FaPlus /> Add Item</button>
          </div>
        )}
        {['text', 'image', 'link'].includes(block.type) && (
          <input
            type="text"
            value={block.value || ''}
            onChange={e => update('value', e.target.value)}
            placeholder={block.type === 'image' ? 'https://...' : block.type === 'link' ? 'https://...' : 'Enter text...'}
          />
        )}
        {block.type === 'image' && block.value && (
          <img src={block.value} alt="preview" className="img-preview" onError={e => e.target.style.display='none'} />
        )}
      </div>
    </div>
  );
}

// ── Page Editor ────────────────────────────────────────────
function PageEditor({ page, adminKey, onSaved }) {
  const [blocks, setBlocks]   = useState(page.blocks || []);
  const [title, setTitle]     = useState(page.title);
  const [visible, setVisible] = useState(page.visible !== false);
  const [saving, setSaving]   = useState(false);
  const [preview, setPreview] = useState(false);

  const updateBlock = (i, updated) => {
    const b = [...blocks];
    b[i] = updated;
    setBlocks(b);
  };

  const deleteBlock = i => setBlocks(blocks.filter((_, idx) => idx !== i));

  const addBlock = () => setBlocks([...blocks, {
    key: `field_${Date.now()}`, type: 'text', label: 'New Field', value: ''
  }]);

  const moveBlock = (i, dir) => {
    const b = [...blocks];
    const j = i + dir;
    if (j < 0 || j >= b.length) return;
    [b[i], b[j]] = [b[j], b[i]];
    setBlocks(b);
  };

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`${BASE}/admin/pages/${page.pageId}`, { blocks, title, visible }, { headers: h(adminKey) });
      toast.success(`"${title}" saved!`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="page-editor">
      <div className="page-editor-toolbar">
        <div className="pe-left">
          <input className="page-title-input" value={title} onChange={e => setTitle(e.target.value)} />
          <span className="page-slug">{page.slug}</span>
          <button className={`visibility-btn ${visible ? 'on' : 'off'}`} onClick={() => setVisible(!visible)}>
            {visible ? <><FaEye /> Visible</> : <><FaEyeSlash /> Hidden</>}
          </button>
        </div>
        <div className="pe-right">
          <button className="btn-preview" onClick={() => setPreview(!preview)}>
            <FaEye /> {preview ? 'Edit' : 'Preview'}
          </button>
          <button className="btn-save" onClick={save} disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="preview-panel">
          <h3>Content Preview</h3>
          {blocks.map(b => (
            <div key={b.key} className="preview-block">
              <span className="preview-label">{b.label || b.key}</span>
              {b.type === 'list'
                ? <ul>{(b.listItems || []).map((item, i) => <li key={i}>{item}</li>)}</ul>
                : b.type === 'color'
                ? <div className="preview-color"><div style={{ background: b.value, width: 32, height: 32, borderRadius: 6 }} /><span>{b.value}</span></div>
                : b.type === 'image' && b.value
                ? <img src={b.value} alt={b.label} style={{ maxWidth: 200, borderRadius: 8 }} />
                : <p>{b.value}</p>
              }
            </div>
          ))}
        </div>
      ) : (
        <div className="blocks-list">
          {blocks.length === 0 && (
            <div className="empty-blocks">No content blocks yet. Add one below.</div>
          )}
          {blocks.map((block, i) => (
            <div key={i} className="block-wrap">
              <div className="block-order-btns">
                <button onClick={() => moveBlock(i, -1)} disabled={i === 0}><FaArrowUp /></button>
                <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}><FaArrowDown /></button>
              </div>
              <BlockEditor
                block={block}
                onChange={updated => updateBlock(i, updated)}
                onDelete={() => deleteBlock(i)}
              />
            </div>
          ))}
          <button className="add-block-btn" onClick={addBlock}>
            <FaPlus /> Add Content Block
          </button>
        </div>
      )}
    </div>
  );
}

// ── New Page Modal ─────────────────────────────────────────
function NewPageModal({ adminKey, onClose, onCreated }) {
  const [form, setForm] = useState({ pageId: '', title: '', slug: '/' });
  const [saving, setSaving] = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${BASE}/admin/pages`, form, { headers: h(adminKey) });
      toast.success(`Page "${form.title}" created!`);
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create page');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><FaPlus /> Create New Page</h3>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Page ID (unique, no spaces)</label>
            <input name="pageId" value={form.pageId} onChange={set} placeholder="e.g. about-us" required />
          </div>
          <div className="form-group">
            <label>Page Title</label>
            <input name="title" value={form.title} onChange={set} placeholder="e.g. About Us" required />
          </div>
          <div className="form-group">
            <label>URL Slug</label>
            <input name="slug" value={form.slug} onChange={set} placeholder="e.g. /about-us" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating...' : <><FaPlus /> Create Page</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Theme Manager ──────────────────────────────────────────
function ThemeManager({ adminKey }) {
  const [themes, setThemes]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [newTheme, setNewTheme] = useState(false);
  const [newName, setNewName]   = useState('');
  const [saving, setSaving]     = useState(false);

  const fetchThemes = useCallback(async () => {
    const r = await axios.get(`${BASE}/admin/themes`, { headers: h(adminKey) });
    setThemes(r.data.data);
  }, [adminKey]);

  useEffect(() => { fetchThemes(); }, [fetchThemes]);

  const activate = async id => {
    try {
      await axios.patch(`${BASE}/admin/themes/${id}/activate`, {}, { headers: h(adminKey) });
      toast.success('Theme activated! Refresh the site to see changes.');
      fetchThemes();
    } catch { toast.error('Failed'); }
  };

  const saveTheme = async (theme) => {
    setSaving(true);
    try {
      await axios.put(`${BASE}/admin/themes/${theme._id}`, theme, { headers: h(adminKey) });
      toast.success('Theme saved!');
      setEditing(null);
      fetchThemes();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const createTheme = async () => {
    if (!newName.trim()) return;
    try {
      await axios.post(`${BASE}/admin/themes`, {
        name: newName,
        colors: { primary: '#192441', primaryLight: '#2a3a6b', accent: '#f5a623', accentRed: '#e74c3c', dark: '#212529', light: '#f8f9fa' },
      }, { headers: h(adminKey) });
      toast.success('Theme created!');
      setNewTheme(false);
      setNewName('');
      fetchThemes();
    } catch { toast.error('Failed'); }
  };

  const colorFields = [
    { key: 'primary',      label: 'Primary Color' },
    { key: 'primaryLight', label: 'Primary Light' },
    { key: 'accent',       label: 'Accent Color' },
    { key: 'accentRed',    label: 'Accent Red' },
    { key: 'dark',         label: 'Dark Text' },
    { key: 'light',        label: 'Light Background' },
  ];

  return (
    <div className="theme-manager">
      <div className="theme-header">
        <h3>Site Themes</h3>
        <button className="btn btn-primary sm-btn" onClick={() => setNewTheme(true)}>
          <FaPlus /> New Theme
        </button>
      </div>

      {newTheme && (
        <div className="new-theme-row">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Theme name..." />
          <button className="btn btn-primary sm-btn" onClick={createTheme}><FaCheck /> Create</button>
          <button className="btn-cancel" onClick={() => setNewTheme(false)}>Cancel</button>
        </div>
      )}

      <div className="themes-grid">
        {themes.map(theme => (
          <div key={theme._id} className={`theme-card ${theme.isActive ? 'active' : ''}`}>
            <div className="theme-card-header">
              <div className="theme-swatches">
                {Object.values(theme.colors).slice(0, 4).map((c, i) => (
                  <div key={i} className="swatch" style={{ background: c }} title={c} />
                ))}
              </div>
              <div>
                <h4>{theme.name}</h4>
                {theme.isActive && <span className="active-badge"><FaCheck /> Active</span>}
              </div>
            </div>

            <div className="theme-actions">
              {!theme.isActive && (
                <button className="btn btn-primary sm-btn" onClick={() => activate(theme._id)}>
                  Activate
                </button>
              )}
              <button className="btn-outline-sm" onClick={() => setEditing(editing?._id === theme._id ? null : { ...theme })}>
                <FaEdit /> Edit Colors
              </button>
            </div>

            {editing?._id === theme._id && (
              <div className="color-editor">
                {colorFields.map(f => (
                  <div key={f.key} className="color-row">
                    <label>{f.label}</label>
                    <div className="color-input-row">
                      <input type="color" value={editing.colors[f.key] || '#000000'}
                        onChange={e => setEditing({ ...editing, colors: { ...editing.colors, [f.key]: e.target.value } })} />
                      <input type="text" value={editing.colors[f.key] || ''}
                        onChange={e => setEditing({ ...editing, colors: { ...editing.colors, [f.key]: e.target.value } })} />
                    </div>
                  </div>
                ))}
                <div className="color-editor-actions">
                  <button className="btn btn-primary sm-btn" onClick={() => saveTheme(editing)} disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Theme'}
                  </button>
                  <button className="btn-cancel" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main CMS Component ─────────────────────────────────────
export default function AdminCMS({ adminKey }) {
  const [pages, setPages]         = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [cmsTab, setCmsTab]       = useState('pages'); // 'pages' | 'themes'
  const [showNewPage, setShowNewPage] = useState(false);

  const fetchPages = useCallback(async () => {
    try {
      const r = await axios.get(`${BASE}/admin/pages`, { headers: h(adminKey) });
      setPages(r.data.data);
      if (!activePage && r.data.data.length > 0) setActivePage(r.data.data[0]);
    } catch { toast.error('Failed to load pages'); }
  }, [adminKey]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const deletePage = async (pageId) => {
    if (!window.confirm('Delete this custom page?')) return;
    try {
      await axios.delete(`${BASE}/admin/pages/${pageId}`, { headers: h(adminKey) });
      toast.success('Page deleted');
      setActivePage(null);
      fetchPages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete built-in pages');
    }
  };

  return (
    <div className="cms-container">
      {/* CMS Sub-tabs */}
      <div className="cms-subtabs">
        <button className={cmsTab === 'pages'  ? 'active' : ''} onClick={() => setCmsTab('pages')}>
          <FaFileAlt /> Pages & Content
        </button>
        <button className={cmsTab === 'themes' ? 'active' : ''} onClick={() => setCmsTab('themes')}>
          <FaPalette /> Themes & Colors
        </button>
      </div>

      {cmsTab === 'themes' && <ThemeManager adminKey={adminKey} />}

      {cmsTab === 'pages' && (
        <div className="cms-layout">
          {/* Page list sidebar */}
          <div className="cms-sidebar">
            <div className="cms-sidebar-header">
              <span>Pages ({pages.length})</span>
              <button className="add-page-btn" onClick={() => setShowNewPage(true)} title="Add new page">
                <FaPlus />
              </button>
            </div>
            <div className="page-list">
              {pages.map(p => (
                <div
                  key={p.pageId}
                  className={`page-list-item ${activePage?.pageId === p.pageId ? 'active' : ''} ${!p.visible ? 'hidden' : ''}`}
                  onClick={() => setActivePage(p)}
                >
                  <div className="pli-info">
                    <span className="pli-title">{p.title}</span>
                    <span className="pli-slug">{p.slug}</span>
                  </div>
                  <div className="pli-actions">
                    {!p.visible && <FaEyeSlash className="hidden-icon" />}
                    {p.isCustom && (
                      <button className="pli-del" onClick={e => { e.stopPropagation(); deletePage(p.pageId); }}>
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page editor */}
          <div className="cms-editor-area">
            {activePage ? (
              <PageEditor
                key={activePage.pageId}
                page={activePage}
                adminKey={adminKey}
                onSaved={() => {
                  fetchPages();
                  toast.success('Changes saved to database');
                }}
              />
            ) : (
              <div className="cms-empty">
                <FaFileAlt />
                <p>Select a page to edit</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showNewPage && (
        <NewPageModal
          adminKey={adminKey}
          onClose={() => setShowNewPage(false)}
          onCreated={fetchPages}
        />
      )}
    </div>
  );
}
