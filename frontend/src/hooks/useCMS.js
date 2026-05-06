import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const cache = {};

export function useCMS(pageId) {
  const [content, setContent] = useState(cache[pageId] || {});
  const [loading, setLoading] = useState(!cache[pageId]);

  useEffect(() => {
    if (cache[pageId]) { setContent(cache[pageId]); setLoading(false); return; }
    axios.get(`${API_URL}/api/content/pages/${pageId}`)
      .then(r => {
        cache[pageId] = r.data.data.content;
        setContent(r.data.data.content);
      })
      .catch(() => {}) // silently fall back to defaults
      .finally(() => setLoading(false));
  }, [pageId]);

  // c(key, fallback) — returns CMS value or fallback if not loaded yet
  const c = (key, fallback = '') => content[key] ?? fallback;

  return { c, loading, content };
}
