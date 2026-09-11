import type { SectionId, UploadStatus, UploadStore, ViewMode } from '../types';

export interface ViewCtx {
  isDark: boolean;
  viewMode: ViewMode;
  selectedMonth: string;
  uploads: UploadStore;
  status: Record<SectionId, UploadStatus>;
  onUpload: (section: SectionId, file: File | null) => void;
  filters: Record<SectionId, string>;
  setFilter: (section: SectionId, value: string) => void;
}

export function match(term: string, fields: (string | number)[]): boolean {
  if (!term) return true;
  const q = term.toLowerCase();
  return fields.some((f) => String(f ?? '').toLowerCase().includes(q));
}
