import React, { useState, useMemo } from 'react';
import { ParsedResume, BulletAnalysis } from '../types';
import { analyzeBullets } from '../engine/bulletRewriter';
import { PenLine, ChevronDown, ChevronUp, Copy, CheckCircle, AlertTriangle, Zap, TrendingUp, Filter } from 'lucide-react';

interface BulletRewriterPageProps {
  resume: ParsedResume | null;
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 75) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Strong {score}</span>;
  if (score >= 45) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Fair {score}</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Weak {score}</span>;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? 'bg-emerald-500' : score >= 45 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
    </div>
  );
}

function BulletCard({ bullet, defaultOpen }: { bullet: BulletAnalysis; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={`glass-panel rounded-2xl border transition-all ${bullet.score < 45 ? 'border-rose-500/20' : bullet.score < 75 ? 'border-amber-500/20' : 'border-slate-700/50'}`}>
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{bullet.role} @ {bullet.company}</span>
            <ScoreBadge score={bullet.score} />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{bullet.original}</p>
          <div className="mt-2">
            <ScoreBar score={bullet.score} />
          </div>
        </div>
        <div className="shrink-0 mt-1">
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-800 p-4 space-y-4">
          {/* Issues */}
          {bullet.issues.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-semibold text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Issues Found
              </h4>
              {bullet.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-rose-300 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  {issue}
                </div>
              ))}
            </div>
          )}

          {/* Rewrites */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-brand-400 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> AI Rewrites
            </h4>
            {bullet.rewrites.map((rewrite, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-xs font-bold text-brand-300">{rewrite.label}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(rewrite.text, `${bullet.id}_${i}`)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                  >
                    {copied === `${bullet.id}_${i}` ? (
                      <><CheckCircle className="w-3 h-3 text-emerald-400" /> Copied!</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed border-l-2 border-brand-500 pl-3">{rewrite.text}</p>
                <p className="text-[11px] text-slate-500 italic">{rewrite.improvement}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const BulletRewriterPage: React.FC<BulletRewriterPageProps> = ({ resume }) => {
  const [filter, setFilter] = useState<'all' | 'weak' | 'fair' | 'strong'>('all');

  const bullets = useMemo(() => {
    if (!resume) return [];
    return analyzeBullets(resume);
  }, [resume]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'weak': return bullets.filter(b => b.score < 45);
      case 'fair': return bullets.filter(b => b.score >= 45 && b.score < 75);
      case 'strong': return bullets.filter(b => b.score >= 75);
      default: return bullets;
    }
  }, [bullets, filter]);

  const stats = useMemo(() => ({
    weak: bullets.filter(b => b.score < 45).length,
    fair: bullets.filter(b => b.score >= 45 && b.score < 75).length,
    strong: bullets.filter(b => b.score >= 75).length,
    avg: bullets.length > 0 ? Math.round(bullets.reduce((s, b) => s + b.score, 0) / bullets.length) : 0,
  }), [bullets]);

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
          <PenLine className="w-7 h-7 text-slate-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-300">Upload a Resume First</h2>
          <p className="text-xs text-slate-500 mt-1">The Bullet Rewriter analyzes your existing bullets and generates STAR-format rewrites.</p>
        </div>
      </div>
    );
  }

  if (bullets.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500 text-xs">
        No work experience bullets found in your resume. Add work experience to use the rewriter.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Bullet Point Rewriter</h1>
          <p className="text-xs text-slate-400 mt-1">Every bullet scored 0–100. Weak bullets get 2 STAR-format rewrites instantly.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-brand-400">{stats.avg}</div>
          <div className="text-[11px] text-slate-400">Avg Bullet Score</div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setFilter(filter === 'weak' ? 'all' : 'weak')}
          className={`glass-panel rounded-xl p-4 text-center border transition-all ${filter === 'weak' ? 'border-rose-500/40' : 'border-slate-800/60'}`}>
          <div className="text-2xl font-black text-rose-400">{stats.weak}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Weak Bullets</div>
          <div className="text-[10px] text-rose-400 mt-1">Score &lt; 45</div>
        </button>
        <button onClick={() => setFilter(filter === 'fair' ? 'all' : 'fair')}
          className={`glass-panel rounded-xl p-4 text-center border transition-all ${filter === 'fair' ? 'border-amber-500/40' : 'border-slate-800/60'}`}>
          <div className="text-2xl font-black text-amber-400">{stats.fair}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Fair Bullets</div>
          <div className="text-[10px] text-amber-400 mt-1">Score 45–74</div>
        </button>
        <button onClick={() => setFilter(filter === 'strong' ? 'all' : 'strong')}
          className={`glass-panel rounded-xl p-4 text-center border transition-all ${filter === 'strong' ? 'border-emerald-500/40' : 'border-slate-800/60'}`}>
          <div className="text-2xl font-black text-emerald-400">{stats.strong}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Strong Bullets</div>
          <div className="text-[10px] text-emerald-400 mt-1">Score ≥ 75</div>
        </button>
      </div>

      {/* Filter badge */}
      {filter !== 'all' && (
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Showing {filter} bullets only —</span>
          <button onClick={() => setFilter('all')} className="text-xs text-brand-400 hover:text-brand-300 underline">Clear filter</button>
        </div>
      )}

      {/* Bullet cards */}
      <div className="space-y-3">
        {filtered.map((bullet, i) => (
          <BulletCard key={bullet.id} bullet={bullet} defaultOpen={i === 0 && bullet.score < 45} />
        ))}
      </div>
    </div>
  );
};
