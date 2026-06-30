import React, { useRef, useState } from 'react';
import { Settings, ShieldCheck, Database, Download, Upload, Moon, AlertCircle, CheckCircle } from 'lucide-react';

async function getAllStorageData(): Promise<Record<string, unknown>> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => chrome.storage.local.get(null, resolve));
  }
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    try { data[key] = JSON.parse(localStorage.getItem(key) || ''); } catch { data[key] = localStorage.getItem(key); }
  }
  return data;
}

async function setAllStorageData(data: Record<string, unknown>): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => chrome.storage.local.set(data, resolve));
  }
  Object.entries(data).forEach(([k, v]) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* skip */ }
  });
}

export const SettingsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportStatus, setExportStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'done' | 'error'>('idle');

  const handleExport = async () => {
    try {
      const data = await getAllStorageData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interviewos-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus('done');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch {
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Invalid backup file format');
      }
      await setAllStorageData(data as Record<string, unknown>);
      setRestoreStatus('done');
      setTimeout(() => { setRestoreStatus('idle'); window.location.reload(); }, 2000);
    } catch {
      setRestoreStatus('error');
      setTimeout(() => setRestoreStatus('idle'), 3000);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClearStorage = async () => {
    if (!confirm('Are you sure? This will delete ALL resumes, tracked jobs, and job descriptions stored locally.')) return;
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.clear();
    } else {
      const keysToRemove = Object.keys(localStorage).filter(k => k.startsWith('interviewos'));
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings & Storage Management</h1>
        <p className="text-xs text-slate-400">Manage extension configuration, data backups, and storage.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Moon className="w-4 h-4 text-brand-400" />
            Appearance & Theme
          </h3>
          <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">Interface Theme</p>
              <p className="text-[11px] text-slate-400">Dark mode is optimized for extended job search sessions.</p>
            </div>
            <span className="px-3 py-1 bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs font-bold rounded-lg">
              Dark Mode Active
            </span>
          </div>
        </div>

        {/* Privacy Guarantee */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Architecture & Local Storage Guarantee
          </h3>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs text-emerald-300">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Zero AI API & External Server Architecture
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              InterviewOS does not transmit any resume data, text content, or personal analytics to external servers. All skill extraction, ATS scoring, match analysis, and prompt generation are computed entirely in your browser using Chrome Storage API.
            </p>
          </div>
        </div>

        {/* Export & Backup */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            Data Backup & Migration
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Export */}
            <button
              onClick={handleExport}
              className={`p-4 rounded-xl border flex items-center gap-3 text-left transition ${
                exportStatus === 'done'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : exportStatus === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
              }`}
            >
              {exportStatus === 'done'
                ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                : exportStatus === 'error'
                ? <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                : <Download className="w-5 h-5 text-brand-400 shrink-0" />
              }
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {exportStatus === 'done' ? 'Exported!' : exportStatus === 'error' ? 'Export Failed' : 'Export Local Data JSON'}
                </p>
                <p className="text-[10px] text-slate-400">Backup resumes, tracked jobs & job descriptions</p>
              </div>
            </button>

            {/* Restore */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-xl border flex items-center gap-3 text-left transition ${
                restoreStatus === 'done'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : restoreStatus === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
              }`}
            >
              {restoreStatus === 'done'
                ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                : restoreStatus === 'error'
                ? <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                : <Upload className="w-5 h-5 text-indigo-400 shrink-0" />
              }
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {restoreStatus === 'done' ? 'Restored! Reloading...' : restoreStatus === 'error' ? 'Invalid Backup File' : 'Restore Backup File'}
                </p>
                <p className="text-[10px] text-slate-400">Import previously saved JSON state</p>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleRestoreFile}
            />
          </div>
        </div>

        {/* Keyboard Shortcuts Section */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">⌨️</span>
            Keyboard Shortcuts & Quick Actions
          </h3>
          <p className="text-xs text-slate-400">Use these shortcuts while browsing job pages to capture and match data instantly.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-200">Rescan Active Job Page</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-brand-400 border border-slate-700">Web Context</span>
              </div>
              <p className="text-[11px] text-slate-400">Extracts job details on the active tab and animates the floating badge.</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Shortcut:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">Alt</kbd>
                <span className="text-slate-600 text-xs">+</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">Shift</kbd>
                <span className="text-slate-600 text-xs">+</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">R</kbd>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-200">Global Rescan Command</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-indigo-400 border border-slate-700">Browser Context</span>
              </div>
              <p className="text-[11px] text-slate-400">Triggers scan globally from anywhere inside Google Chrome.</p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Shortcut:</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-slate-500">Windows:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-300">Ctrl</kbd>
                  <span className="text-slate-600 text-xs">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-300">Shift</kbd>
                  <span className="text-slate-600 text-xs">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-300">U</kbd>
                </div>
                <div className="w-px h-3 bg-slate-800" />
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-slate-500">Mac:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-300">⌘</kbd>
                  <span className="text-slate-600 text-xs">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-300">Shift</kbd>
                  <span className="text-slate-600 text-xs">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-300">U</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-rose-500/20">
          <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Danger Zone
          </h3>
          <div className="flex items-center justify-between p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/20">
            <div>
              <p className="text-xs font-semibold text-slate-200">Clear All Local Data</p>
              <p className="text-[11px] text-slate-400">Permanently deletes all resumes, tracked jobs, and scanned job descriptions.</p>
            </div>
            <button
              onClick={handleClearStorage}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
            >
              Clear Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
