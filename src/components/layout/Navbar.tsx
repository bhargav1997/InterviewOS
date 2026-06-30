import React from 'react';
import { RefreshCw, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { ParsedResume, JobDescription } from '../../types';

interface NavbarProps {
  activeResume: ParsedResume | null;
  activeJd: JobDescription | null;
  onRefreshJd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeResume, activeJd, onRefreshJd }) => {
  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <FileText className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-slate-400">Active Resume:</span>
          <span className="font-semibold text-slate-200">{activeResume?.title || 'No Resume Uploaded'}</span>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 max-w-md truncate">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">Target Job:</span>
          <span className="font-semibold text-slate-200 truncate">
            {activeJd ? `${activeJd.title} at ${activeJd.company}` : 'No Job Scraped'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefreshJd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          Scan Active Page
        </button>
        <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Engine Ready
        </div>
      </div>
    </header>
  );
};
