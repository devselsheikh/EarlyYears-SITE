// ─────────────────────────────────────────────────────────────────────────────
// Owner image library. Static website imagery is stored in allowlisted local
// semantic slots. Dynamic portraits may use CMS URLs with these files as fallback.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search, CheckCircle2, AlertCircle, Info, Upload, Loader2, RotateCcw } from 'lucide-react';
import { LOCAL_IMAGE_REGISTRY, RegistryEntry } from '../../data/localImageRegistry';
import { AssetCategory, ASSET_MANIFEST } from '../../data/assetManifest';
import { getImageSlot } from '../../data/imageSlots';

// ─── Category display helpers ─────────────────────────────────────────────────

const CATEGORY_LABELS: Record<AssetCategory | string, string> = {
  'daycare-hero':         'Daycare — Hero & Sections',
  'daycare-about':        'Daycare — About',
  'daycare-educators':    'Daycare — Educators',
  'daycare-testimonials': 'Daycare — Testimonials',
  'daycare-gallery':      'Daycare — Gallery',
  'eduhub-hero':          'EduHub — Hero & Sections',
  'eduhub-about':         'EduHub — About & Programs',
  'eduhub-alumni':        'EduHub — Alumni',
  'brand':                'Brand Assets',
};

// ─── Image entry card ─────────────────────────────────────────────────────────

async function normalizeForSlot(file: File, localPath: string): Promise<Blob> {
  const targetPng = localPath.endsWith('.png');
  const targetType = targetPng ? 'image/png' : 'image/jpeg';
  const bitmap = await createImageBitmap(file);
  const maxDimension = 3200;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot process the image');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, targetType, targetPng ? undefined : 0.9));
  if (!blob) throw new Error('Image conversion failed');
  return blob;
}

function ImageCard({ assetKey, entry }: { assetKey: string; entry: RegistryEntry }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState('');
  const [uploadState, setUploadState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [cacheVersion, setCacheVersion] = useState(0);

  const slot = getImageSlot(assetKey);
  const localPath = slot?.localPath ?? entry.desktop;
  const previewSrc = pendingPreview || `${localPath}?v=${cacheVersion}`;
  const localEditingAvailable = import.meta.env.DEV;

  useEffect(() => () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
  }, [pendingPreview]);

  const chooseFile = (file: File | null) => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setUploadState('idle');
    setUploadMessage('');
    setPendingFile(file);
    setPendingPreview(file ? URL.createObjectURL(file) : '');
  };

  const saveReplacement = async () => {
    if (!pendingFile || !slot) return;
    setUploadState('saving');
    setUploadMessage('Preparing image…');
    try {
      const normalized = await normalizeForSlot(pendingFile, slot.localPath);
      setUploadMessage('Writing local slot…');
      const response = await fetch(`/__local/image-slots/${encodeURIComponent(assetKey)}`, {
        method: 'PUT',
        headers: { 'Content-Type': normalized.type },
        body: normalized,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `Save failed (${response.status})`);
      setUploadState('saved');
      setUploadMessage('Replacement saved. Existing file was backed up locally.');
      setCacheVersion(Date.now());
      chooseFile(null);
      setUploadState('saved');
      setUploadMessage('Replacement saved. Existing file was backed up locally.');
      setImgError(false);
    } catch (error) {
      setUploadState('failed');
      setUploadMessage(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {!imgError ? (
            <img
              src={previewSrc}
              alt={entry.alt}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-1">No preview</div>
          )}
        </div>

        {/* Key + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{assetKey}</code>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Local fallback ready
            </span>
            {slot?.kind === 'dynamic-profile' && <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">Dynamic profile</span>}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{entry.alt}</p>
        </div>

        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-4">
          {/* Preview */}
          <div className="rounded-xl overflow-hidden bg-gray-100 max-h-64 flex items-center justify-center">
            {!imgError ? (
              <img
                src={previewSrc}
                alt={entry.alt}
                className="max-w-full max-h-64 object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="py-8 text-sm text-gray-400 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Image not available for preview
              </div>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-semibold text-gray-600 mb-1">Alt text</p>
              <p className="text-gray-800">{entry.alt}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Focal point</p>
              <p className="text-gray-800">{Math.round(entry.focalX * 100)}% left, {Math.round(entry.focalY * 100)}% top</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Desktop dimensions</p>
              <p className="text-gray-800">{entry.desktopDimensions}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Mobile dimensions</p>
              <p className="text-gray-800">{entry.mobileDimensions}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-semibold text-gray-600 mb-1">Usage locations</p>
              <ul className="space-y-0.5">
                {entry.usageLocations.map(loc => (
                  <li key={loc} className="text-gray-700 font-mono">{loc}</li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-2">
              <p className="font-semibold text-gray-600 mb-1">Local file</p>
              <p className="font-mono break-all text-green-700">{localPath}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-4 text-xs text-blue-800 space-y-3">
            <div>
              <p className="font-semibold flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Replace this semantic slot</p>
              <p className="text-blue-700 mt-1">Choose any common image format. It will be resized if needed and converted to match the existing local filename.</p>
            </div>
            {localEditingAvailable ? (
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-blue-200 font-semibold cursor-pointer hover:bg-blue-100 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Choose image
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={event => chooseFile(event.target.files?.[0] ?? null)} />
                </label>
                {pendingFile && <>
                  <span className="max-w-52 truncate text-blue-900">{pendingFile.name}</span>
                  <button onClick={saveReplacement} disabled={uploadState === 'saving'} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60">
                    {uploadState === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Save replacement
                  </button>
                  <button onClick={() => chooseFile(null)} className="inline-flex items-center gap-1 px-2 py-2 text-blue-700"><RotateCcw className="w-3.5 h-3.5" />Cancel</button>
                </>}
              </div>
            ) : <p className="text-blue-700">Local file writing is available only while running the development server. Replace <code>{localPath}</code> in the repository before deployment.</p>}
            {uploadMessage && <p role="status" className={uploadState === 'failed' ? 'text-red-700' : 'text-green-700'}>{uploadMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AssetsSection() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'static' | 'dynamic'>('all');

  // Build list of entries with category from assetManifest
  const entries = Object.entries(LOCAL_IMAGE_REGISTRY).map(([key, entry]) => ({
    key,
    entry,
    category: ASSET_MANIFEST[key]?.category ?? 'brand',
    name: ASSET_MANIFEST[key]?.name ?? key,
  }));

  const filtered = entries.filter(({ key, entry, category }) => {
    const matchesSearch = !search ||
      key.toLowerCase().includes(search.toLowerCase()) ||
      entry.alt.toLowerCase().includes(search.toLowerCase()) ||
      entry.usageLocations.some(l => l.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'dynamic' && getImageSlot(key)?.kind === 'dynamic-profile') ||
      (statusFilter === 'static' && getImageSlot(key)?.kind === 'static');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const dynamicCount = entries.filter(e => getImageSlot(e.key)?.kind === 'dynamic-profile').length;
  const staticCount = entries.length - dynamicCount;

  // Group by category
  const categories = Array.from(new Set(filtered.map(e => e.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Local Image Library</h2>
        <p className="text-sm text-gray-500 mt-1">
          Replace stable website imagery through semantic local slots. Profile imagery may still come from dynamic records.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total images</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{staticCount}</p>
          <p className="text-xs text-green-600 mt-0.5">Static local</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{dynamicCount}</p>
          <p className="text-xs text-amber-600 mt-0.5">Dynamic profiles</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
        <p className="font-semibold mb-1">How image replacement works</p>
        <p className="text-blue-700 text-xs leading-relaxed">
          While running locally, expand any image and choose a replacement. The Owner console writes
          only to the allowlisted file for that semantic key and keeps a local backup. Static public
          images never depend on Supabase.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by key, alt text, or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
            <option key={cat} value={cat}>{label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as 'all' | 'static' | 'dynamic')}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All statuses</option>
          <option value="static">Static local</option>
          <option value="dynamic">Dynamic profiles</option>
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No images match your filters.</p>
      ) : (
        <div className="space-y-6">
          {categories.map(category => {
            const group = filtered.filter(e => e.category === category);
            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {CATEGORY_LABELS[category] ?? category}
                </h3>
                <div className="space-y-2">
                  {group.map(({ key, entry }) => (
                    <ImageCard key={key} assetKey={key} entry={entry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
