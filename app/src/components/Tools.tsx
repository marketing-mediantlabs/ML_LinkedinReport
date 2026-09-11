import { useRef, useState } from 'react';
import type { SectionId, UploadStatus } from '../types';

interface UploadProps {
  section: SectionId;
  label: string;
  status: UploadStatus;
  onUpload: (section: SectionId, file: File | null) => void;
}

export function UploadZone({ section, label, status, onUpload }: UploadProps) {
  const [over, setOver] = useState(false);
  const inputId = 'upload-' + section;
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={'dropzone' + (over ? ' dropzone--over' : '')}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onUpload(section, e.dataTransfer.files?.[0] ?? null);
      }}
    >
      <label className="tool-title" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        ref={ref}
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={(e) => {
          onUpload(section, e.target.files?.[0] ?? null);
          if (ref.current) ref.current.value = '';
        }}
      />
      <div className={'status status--' + status.state} role="status">{status.text}</div>
    </div>
  );
}

interface FilterProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

export function FilterBox({ id, label, placeholder, value, onChange }: FilterProps) {
  return (
    <div className="filterbox">
      <label className="tool-title" htmlFor={id}>{label}</label>
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
