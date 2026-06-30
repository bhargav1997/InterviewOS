import React from 'react';
import { AtsAnalysis } from '../types';
import { CircularScore } from '../components/ui/CircularScore';
import { ShieldCheck, AlertOctagon, CheckCircle, ArrowUpRight, FileText, Globe } from 'lucide-react';

interface AtsPageProps {
  ats: AtsAnalysis | null;
}

export const AtsPage: React.FC<AtsPageProps> = ({ ats }) => {
  if (!ats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 glass-panel rounded-2xl p-10 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <FileText className="w-6 h-6 text-slate-500" />
          </div>
          <span className="text-slate-500 text-xl">+</span>
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <Globe className="w-6 h-6 text-slate-500" />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-300">ATS Auditor Needs Both Inputs</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Upload your resume in Resume Lab and scan a job posting to run the 13-category ATS formatting audit.
          </p>
        </div>
      </div>
    );
  }

  const categoryList = Object.values(ats.categories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Rule-Based ATS Auditor</h1>
          <p className="text-xs text-slate-400">100% Client-Side parsing audit across 13 core ATS metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          ATS Score: {ats.totalScore}/100
        </div>
      </div>

      {/* Top Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <CircularScore score={ats.totalScore} size={150} />
          <span className="text-xs font-semibold text-slate-300 mt-2">Overall ATS Readiness</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3 md:col-span-2">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            Critical Issues & ATS Flags ({ats.criticalIssues.length})
          </h3>
          <div className="space-y-2">
            {ats.criticalIssues.length > 0 ? (
              ats.criticalIssues.map((issue, i) => (
                <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0"></span>
                  {issue}
                </div>
              ))
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Zero critical ATS parsing flags detected! Your document structure is solid.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 13 Categories Breakdown Table/Grid */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-100 text-base">ATS Category Score Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryList.map((cat, idx) => {
            const percent = Math.round((cat.score / cat.maxScore) * 100);
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-200">{cat.category}</span>
                  <span className={`text-xs font-bold ${percent >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {cat.score} / {cat.maxScore}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${percent >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{cat.feedback[0] || 'Standard check passed'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
