'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, FileText, Trash2, Download, Search, Filter, Loader2, CheckCircle, AlertTriangle, X, FileImage, File } from 'lucide-react';
import { authFetch } from '@/lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type DocCategory = 'hr' | 'loan' | 'kyc' | 'compliance' | 'operational' | 'branch' | 'general';

const CATEGORY_LABELS: Record<DocCategory, string> = {
  hr: 'HR / Staff',
  loan: 'Loan Documents',
  kyc: 'KYC / Customer',
  compliance: 'Compliance',
  operational: 'Operational',
  branch: 'Branch',
  general: 'General',
};

const CATEGORY_COLORS: Record<DocCategory, string> = {
  hr: 'bg-purple-50 text-purple-700',
  loan: 'bg-blue-50 text-blue-700',
  kyc: 'bg-teal-50 text-teal-700',
  compliance: 'bg-amber-50 text-amber-700',
  operational: 'bg-gray-50 text-gray-600',
  branch: 'bg-green-50 text-green-700',
  general: 'bg-slate-50 text-slate-600',
};

interface Document {
  id: number;
  title: string;
  description?: string;
  category: DocCategory;
  originalName: string;
  filePath: string;
  fileSize?: number;
  mimeType?: string;
  uploadedByName?: string;
  entityType?: string;
  entityId?: number;
  createdAt: string;
}

interface DocumentManagerProps {
  /** Restrict to a specific category filter */
  defaultCategory?: DocCategory;
  /** If set, only shows/uploads docs linked to this entity */
  entityType?: string;
  entityId?: number;
  /** Which categories users can choose when uploading */
  allowedCategories?: DocCategory[];
  title?: string;
  description?: string;
  accentColor?: string; // tailwind class e.g. 'indigo'
  canDelete?: boolean;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(mimeType?: string) {
  if (!mimeType) return <File className="w-4 h-4 text-gray-400" />;
  if (mimeType.startsWith('image/')) return <FileImage className="w-4 h-4 text-blue-400" />;
  if (mimeType === 'application/pdf') return <FileText className="w-4 h-4 text-red-400" />;
  return <FileText className="w-4 h-4 text-gray-400" />;
}

export default function DocumentManager({
  defaultCategory,
  entityType,
  entityId,
  allowedCategories = ['hr', 'loan', 'kyc', 'compliance', 'operational', 'branch', 'general'],
  title = 'Documents',
  description = 'Upload and manage documents',
  accentColor = 'indigo',
  canDelete = true,
}: DocumentManagerProps) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<DocCategory | ''>('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Upload form state
  const [upTitle, setUpTitle] = useState('');
  const [upDesc, setUpDesc] = useState('');
  const [upCat, setUpCat] = useState<DocCategory>(defaultCategory ?? allowedCategories[0] ?? 'general');
  const [upFile, setUpFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (defaultCategory) params.set('category', defaultCategory);
      if (entityType) params.set('entityType', entityType);
      if (entityId) params.set('entityId', String(entityId));
      if (search) params.set('search', search);
      if (filterCat) params.set('category', filterCat);
      const res = await authFetch(`/documents?${params.toString()}`);
      if (res.ok) setDocs(await res.json());
    } finally { setLoading(false); }
  }, [defaultCategory, entityType, entityId, search, filterCat]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const handleFileSelect = (file: File) => {
    setUpFile(file);
    if (!upTitle) setUpTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upFile) return;
    setUploading(true); setUploadResult(null);
    try {
      const fd = new FormData();
      fd.append('file', upFile);
      fd.append('title', upTitle);
      if (upDesc) fd.append('description', upDesc);
      fd.append('category', upCat);
      if (entityType) fd.append('entityType', entityType);
      if (entityId) fd.append('entityId', String(entityId));

      const res = await authFetch('/documents', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed.');
      setUploadResult({ success: true, message: `"${upTitle}" uploaded successfully.` });
      setUpTitle(''); setUpDesc(''); setUpFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadDocs();
    } catch (err: any) { setUploadResult({ success: false, message: err.message }); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await authFetch(`/documents/${id}`, { method: 'DELETE' });
      setDocs(prev => prev.filter(d => d.id !== id));
    } finally { setDeletingId(null); }
  };

  const getFileUrl = (filePath: string) => `${API_URL}/${filePath.replace(/\\/g, '/')}`;

  const accent = `text-${accentColor}-700`;
  const accentBorder = `border-${accentColor}-300`;
  const accentBg = `bg-${accentColor}-50`;
  const accentBtn = `bg-${accentColor}-700 hover:bg-${accentColor}-600`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-[#0A1F44] text-sm">{title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{docs.length} files</span>
          <button
            onClick={() => { setShowUpload(v => !v); setUploadResult(null); }}
            className="flex items-center gap-1.5 bg-[#0A1F44] hover:bg-[#1E3A5F] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <div className="border-b border-gray-100 bg-gray-50/50 p-5">
          <form onSubmit={handleUpload} className="space-y-4">
            {uploadResult && (
              <div className={`flex items-center gap-2.5 p-3 rounded-xl text-sm ${uploadResult.success ? 'bg-teal-50 border border-teal-200 text-teal-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {uploadResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                <span>{uploadResult.message}</span>
              </div>
            )}

            {/* Drag & Drop zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
            >
              {upFile ? (
                <div className="flex items-center justify-center gap-2">
                  {fileIcon(upFile.type)}
                  <span className="text-sm font-medium text-gray-700">{upFile.name}</span>
                  <span className="text-xs text-gray-400">({formatBytes(upFile.size)})</span>
                  <button type="button" onClick={e => { e.stopPropagation(); setUpFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="ml-1 text-gray-400 hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Drop file here or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, Images — max 10MB</p>
                </>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Document Title *</label>
                <input value={upTitle} onChange={e => setUpTitle(e.target.value)} required placeholder="e.g. John Doe Employment Contract" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select value={upCat} onChange={e => setUpCat(e.target.value as DocCategory)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                  {allowedCategories.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description (optional)</label>
                <input value={upDesc} onChange={e => setUpDesc(e.target.value)} placeholder="Brief description of this document..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400" />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
              <button type="submit" disabled={uploading || !upFile || !upTitle} className="flex items-center gap-1.5 bg-[#0A1F44] hover:bg-[#1E3A5F] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                {uploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Uploading...</> : <><Upload className="w-3.5 h-3.5" />Upload Document</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300" />
        </div>
        {!defaultCategory && (
          <select value={filterCat} onChange={e => setFilterCat(e.target.value as DocCategory | '')} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-600">
            <option value="">All Categories</option>
            {allowedCategories.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
        )}
        <button onClick={loadDocs} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Document List */}
      <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
        ) : docs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-medium">No documents yet</p>
            <p className="text-xs text-gray-300 mt-1">Upload your first document using the button above</p>
          </div>
        ) : (
          docs.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 group transition-colors">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                {fileIcon(doc.mimeType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-[#0A1F44] truncate">{doc.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${CATEGORY_COLORS[doc.category]}`}>{CATEGORY_LABELS[doc.category]}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                  <span>{doc.originalName}</span>
                  {doc.fileSize && <><span>·</span><span>{formatBytes(doc.fileSize)}</span></>}
                  <span>·</span>
                  <span>{doc.uploadedByName ?? 'Staff'}</span>
                  <span>·</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                {doc.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.description}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <a
                  href={getFileUrl(doc.filePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
                  title="View / Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    disabled={deletingId === doc.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    {deletingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
