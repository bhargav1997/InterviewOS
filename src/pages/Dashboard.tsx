import React from 'react';
import { CircularScore } from '../components/ui/CircularScore';
import { ProgressBar } from '../components/ui/ProgressBar';
import { KeywordHeatmap } from '../components/ui/KeywordHeatmap';
import { ParsedResume, JobDescription, MatchAnalysis, AtsAnalysis, SmartSuggestion } from '../types';
import { Sparkles, FileText, ArrowRight, Lightbulb, Globe, RefreshCw } from 'lucide-react';

interface DashboardProps {
  resume: ParsedResume | null;
  jd: JobDescription | null;
  match: MatchAnalysis | null;
  ats: AtsAnalysis | null;
  suggestions: SmartSuggestion[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  resume,
  jd,
  match,
  ats,
  suggestions,
  onNavigate
}) => {
  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 glass-panel rounded-2xl p-8 border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
          <FileText className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold text-slate-100">Welcome to InterviewOS</h2>
          <p className="text-sm text-slate-400">
            To unlock intelligent match analysis, rule-based ATS scoring, and custom prompt synthesis, start by uploading your resume.
          </p>
        </div>
        <button
          onClick={() => onNavigate('resume')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-brand-600/30 transition"
        >
          Upload Resume (PDF, DOCX, TXT)
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // No job scanned yet — show clear CTA
  if (!jd || !match || !ats) {
    return (
      <div className="space-y-6">
        {/* Top Banner */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              No Job Post Scanned
            </span>
            <h1 className="text-2xl font-bold text-slate-100">
              {resume.contactInfo.name ? `Welcome, ${resume.contactInfo.name.split(' ')[0]}` : 'InterviewOS Ready'}
            </h1>
            <p className="text-xs text-slate-400">
              Resume loaded. Navigate to a job board and click <strong className="text-brand-400">Scan Active Page</strong> to start your match analysis.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', label: 'Open a Job Post', desc: 'Visit LinkedIn, Indeed, Greenhouse, Lever, or Workday', icon: Globe },
            { step: '2', label: 'Scan Active Page', desc: 'Click "Scan Active Page" in the top navbar or the floating Co-Pilot badge', icon: RefreshCw },
            { step: '3', label: 'Get Your Match Score', desc: 'See ATS score, keyword gaps, and AI-ready prompt instantly', icon: Sparkles },
          ].map(({ step, label, desc, icon: Icon }) => (
            <div key={step} className="glass-panel p-5 rounded-2xl space-y-2 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">{step}</span>
                <Icon className="w-4 h-4 text-brand-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* Pipeline shortcuts */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-base">Optimization Pipeline</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate('analysis')} className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition group">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 flex items-center gap-1">1. Match Engine <ArrowRight className="w-3 h-3" /></span>
              <p className="text-[11px] text-slate-400">Inspect missing tech &amp; weak bullets</p>
            </button>
            <button onClick={() => onNavigate('ats')} className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition group">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 flex items-center gap-1">2. ATS Auditor <ArrowRight className="w-3 h-3" /></span>
              <p className="text-[11px] text-slate-400">Verify section &amp; bullet formatting</p>
            </button>
            <button onClick={() => onNavigate('prompt')} className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition group">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 flex items-center gap-1">3. Prompt Studio <ArrowRight className="w-3 h-3" /></span>
              <p className="text-[11px] text-slate-400">Compile tailored prompt for AI</p>
            </button>
            <button onClick={() => onNavigate('tracker')} className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition group">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 flex items-center gap-1">4. Job Tracker <ArrowRight className="w-3 h-3" /></span>
              <p className="text-[11px] text-slate-400">Save &amp; track application stage</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Active Job Alignment
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            {jd ? `${jd.title} @ ${jd.company}` : 'General Software Engineer Profile'}
          </h1>
          <p className="text-xs text-slate-400">
            Local preprocessing complete. Context ready for AI prompt compilation.
          </p>
        </div>

        <button
          onClick={() => onNavigate('prompt')}
          className="z-10 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Prompt
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Gauge Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">ATS Audit Score</h3>
          <CircularScore score={ats.totalScore} />
          <p className="text-xs text-slate-400">
            Rule-based parsing score across 13 formatting & bullet metrics.
          </p>
        </div>

        {/* Match Scores Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Role Alignment</h3>
          <div className="space-y-3">
            <ProgressBar label="Overall Match Score" value={match.overallMatchScore} color="bg-emerald-500" />
            <ProgressBar label="Skill & Tech Coverage" value={match.skillMatchScore} color="bg-brand-500" />
            <ProgressBar label="Keyword Relevance" value={match.keywordMatchScore} color="bg-indigo-500" />
            <ProgressBar label="Experience Alignment" value={match.experienceMatchScore} color="bg-amber-500" />
          </div>
        </div>

        {/* Keyword Quick Heatmap */}
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skill Snapshot</h3>
          <KeywordHeatmap
            matchingKeywords={match.matchingTechnologies.slice(0, 5)}
            missingKeywords={match.missingTechnologies.slice(0, 5)}
          />
        </div>
      </div>

      {/* Bottom Grid: Smart Suggestions & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Suggestions */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-base">Smart Preprocessing Recommendations</h3>
          </div>
          <div className="space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{s.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      s.impact === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {s.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{s.description}</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 text-center">
                ✓ Your resume aligns well with this job posting!
              </div>
            )}
          </div>
        </div>

        {/* Workflow Quick Launch */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-100 text-base">Optimization Pipeline</h3>
            <p className="text-xs text-slate-400">
              Follow our structured 4-step workflow to prepare your job application.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('analysis')}
              className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition group"
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 transition flex items-center gap-1">
                1. Match Engine <ArrowRight className="w-3 h-3" />
              </span>
              <p className="text-[11px] text-slate-400">Inspect missing tech & weak bullet points</p>
            </button>
            <button
              onClick={() => onNavigate('ats')}
              className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition group"
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 transition flex items-center gap-1">
                2. ATS Auditor <ArrowRight className="w-3 h-3" />
              </span>
              <p className="text-[11px] text-slate-400">Verify section & bullet formatting</p>
            </button>
            <button
              onClick={() => onNavigate('prompt')}
              className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition group"
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 transition flex items-center gap-1">
                3. Prompt Studio <ArrowRight className="w-3 h-3" />
              </span>
              <p className="text-[11px] text-slate-400">Compile tailored prompt for AI</p>
            </button>
            <button
              onClick={() => onNavigate('tracker')}
              className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition group"
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 transition flex items-center gap-1">
                4. Job Tracker <ArrowRight className="w-3 h-3" />
              </span>
              <p className="text-[11px] text-slate-400">Save & track application stage</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
