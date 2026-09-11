import { useCallback, useState } from 'react';
import type { SectionId, UploadStore, UploadStatus } from '../types';
import { parseUpload } from '../lib/parseUpload';

const KEY = 'ml-linkedin-dashboard-uploads-v1';

const EMPTY: UploadStore = {
  followers: {}, visitors: {}, content: {}, ads: {}, competitors: {},
};

function load(): UploadStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    // Shallow-merge so a partial or older payload cannot break the app.
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

const IDLE: UploadStatus = { text: 'No file uploaded yet.', state: 'idle' };

export function useUploads() {
  const [uploads, setUploads] = useState<UploadStore>(load);
  const [status, setStatus] = useState<Record<SectionId, UploadStatus>>({
    followers: IDLE, visitors: IDLE, content: IDLE, ads: IDLE, competitors: IDLE,
  });

  const upload = useCallback(async (section: SectionId, file: File | null) => {
    if (!file) return;
    setStatus((s) => ({ ...s, [section]: { text: 'Reading ' + file.name + '…', state: 'idle' } }));
    try {
      const { label, value, warnings } = await parseUpload(section, file);
      setUploads((prev) => {
        const next: UploadStore = {
          ...prev,
          [section]: { ...prev[section], [label]: value },
        };
        try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* quota */ }
        return next;
      });
      setStatus((s) => ({
        ...s,
        [section]: warnings.length
          ? { text: 'Saved ' + label + ' — but: ' + warnings.join('; '), state: 'warn' }
          : { text: 'Saved ' + label + ' ✓', state: 'ok' },
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus((s) => ({ ...s, [section]: { text: 'Could not read this file: ' + msg, state: 'error' } }));
    }
  }, []);

  return { uploads, status, upload };
}
