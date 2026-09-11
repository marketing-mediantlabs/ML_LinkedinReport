export type SectionId = 'followers' | 'visitors' | 'content' | 'ads' | 'competitors';
export type TabId = SectionId | 'mom';
export type ViewMode = 'all' | 'month';

export interface LocRow { l: string; v: number; p: number }
export interface TopPost {
  date: string; type: string; media: string;
  impr: number; eng: number; react: number;
}
export interface CompRow {
  n: string; f: number; p: number; c: number; r: number; highlight?: boolean;
}
export interface AdSetRow {
  rank: number; camp: string; set: string; obj: string; period: string;
  spend: string; impr: string; clicks: string; ctr: string; cpm: string; cpc: string;
  top?: boolean; bigImpr?: boolean; bestCpm?: boolean;
}

/** A parsed month of uploaded data. Keyed by month label, e.g. 'May 26'. */
export interface UploadValue {
  primary: number;
  secondary?: number;
  clicks?: number;
  posts?: number;
  rows?: CompRow[];
  meta?: { file: string; parsedAt: string; rowCount: number };
}

export type SectionUploads = Record<string, UploadValue>;
export type UploadStore = Record<SectionId, SectionUploads>;

export interface UploadStatus {
  text: string;
  state: 'idle' | 'ok' | 'warn' | 'error';
}

export interface Series {
  labels: string[];
  values: number[];
  values2: number[] | null;
}
