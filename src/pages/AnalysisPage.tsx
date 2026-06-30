import React from 'react';
import { MatchAnalysis, JobDescription } from '../types';
import { ProgressBar } from '../components/ui/ProgressBar';
import { KeywordHeatmap } from '../components/ui/KeywordHeatmap';
import { AlertTriangle, CheckCircle2, AlertCircle, Sparkles, FileText, Globe } from 'lucide-react';

interface AnalysisPageProps {
  match: MatchAnalysis | null;
  jd: JobDescription | null;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ match, jd }) => {
  if (!match) {
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
          <h2 className="text-sm font-bold text-slate-300">Match Engine Needs Both Inputs</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Upload your resume and scan a job post to unlock skill gap analysis, keyword matrix, and bullet point audits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Intelligent Match Engine</h1>
          <p className="text-xs text-slate-400">Deep local comparison between your resume and target posting.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-400 bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20 font-semibold">
          <Sparkles className="w-4 h-4" />
          Overall Match: {match.overallMatchScore}%
        </div>
      </div>

      {/* Breakdown Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Match Scores</h3>
          <div className="space-y-3">
            <ProgressBar label="Skill & Tech Stack Match" value={match.skillMatchScore} color="bg-emerald-500" />
            <ProgressBar label="Keyword Alignment" value={match.keywordMatchScore} color="bg-brand-500" />
            <ProgressBar label="Experience Alignment" value={match.experienceMatchScore} color="bg-indigo-500" />
            <ProgressBar label="Education Match" value={match.educationMatchScore} color="bg-amber-500" />
            <ProgressBar label="Project Relevance" value={match.projectMatchScore} color="bg-purple-500" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3 lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Keyword & Technology Matrix</h3>
          <KeywordHeatmap matchingKeywords={match.matchingTechnologies} missingKeywords={match.missingTechnologies} />
        </div>
      </div>

      {/* Weak Bullet Points Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-100 text-base">Weak Bullet Points Inspector</h3>
          </div>
          <p className="text-xs text-slate-400">
            These bullet points were identified as lacking quantifiable numbers or having weak impact:
          </p>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {match.weakBulletPoints.length > 0 ? (
              match.weakBulletPoints.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <p className="text-xs font-medium text-slate-200">"{item.bullet}"</p>
                  <p className="text-[11px] text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Fix: {item.reason}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/40 text-xs text-emerald-400 text-center">
                All bullet points contain strong metrics!
              </div>
            )}
          </div>
        </div>

        {/* Action Verbs & Length Analysis */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-100 text-base">Missing Target Action Verbs</h3>
            <div className="flex flex-wrap gap-2">
              {match.missingActionVerbs.length > 0 ? (
                match.missingActionVerbs.map((verb, i) => (
                  <span key={i} className="px-2.5 py-1 rounded text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    + {verb}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No missing action verbs detected.</span>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-100 text-base">Resume Length & Formatting Audit</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-lg font-bold text-brand-400">{match.resumeLengthAnalysis.wordCount}</span>
                <p className="text-[10px] text-slate-400">Total Words</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-lg font-bold text-indigo-400">~{match.resumeLengthAnalysis.estimatedPages}</span>
                <p className="text-[10px] text-slate-400">Estimated Pages</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400">{match.resumeLengthAnalysis.status}</span>
                <p className="text-[10px] text-slate-400">Length Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
