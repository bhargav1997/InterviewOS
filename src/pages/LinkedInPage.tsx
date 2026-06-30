import React, { useState, useMemo } from 'react';
import { ParsedResume, JobDescription, MatchAnalysis } from '../types';
import { generateLinkedInProfile } from '../engine/linkedinOptimizer';
import { Linkedin, Copy, CheckCircle, Lightbulb, UserCheck, MessageSquare, Plus, ArrowUp } from 'lucide-react';

interface LinkedInPageProps {
  resume: ParsedResume | null;
  jd?: JobDescription | null;
  match?: MatchAnalysis | null;
}

export const LinkedInPage: React.FC<LinkedInPageProps> = ({ resume, jd, match }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const profile = useMemo(() => {
    if (!resume) return null;
    return generateLinkedInProfile(resume, jd);
  }, [resume, jd]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
          <Linkedin className="w-7 h-7 text-slate-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-300">Resume Required</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">Upload your resume in Resume Lab to generate tailored LinkedIn profile optimizations.</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Linkedin className="w-6 h-6 text-[#0A66C2] fill-[#0A66C2] bg-white rounded" />
          LinkedIn Profile Optimizer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Optimize your headline, summary, and skills for recruiter searches based on your parsed resume credentials.
        </p>
      </div>

      {/* Headlines Card */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-brand-400" /> Profile Headlines (Choose One)
        </h3>
        <p className="text-xs text-slate-400">
          LinkedIn headlines are the most heavily weighted search field. Replace your generic title with one of these:
        </p>
        <div className="space-y-3">
          {profile.headlines.map((h, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 space-y-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wide">{h.variant}</span>
                <p className="text-sm text-slate-200 font-medium leading-relaxed mt-1">{h.text}</p>
                <p className="text-[10px] text-slate-500 italic mt-0.5">{h.explanation}</p>
              </div>
              <button
                onClick={() => handleCopy(h.text, `headline_${i}`)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition shrink-0"
              >
                {copied === `headline_${i}` ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* About Section Summary */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-brand-400" /> About Summary Section
          </h3>
          <button
            onClick={() => handleCopy(profile.aboutSection, 'about')}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            {copied === 'about' ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied Summary</> : <><Copy className="w-3.5 h-3.5" /> Copy Summary</>}
          </button>
        </div>
        <p className="text-xs text-slate-400">
          A keyword-dense narrative explaining your expertise and direct alignment with the stack recruiters are searching for:
        </p>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 max-h-60 overflow-y-auto">
          <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
            {profile.aboutSection}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Section */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-400" /> Skills Section Strategy
          </h3>
          <div className="space-y-3.5">
            <div>
              <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Add to LinkedIn (Recruiter Search Matches)</h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skillsToAdd.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ArrowUp className="w-3 h-3" /> Reorder to Top (Pin in Endorsements)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skillsToReorder.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            ⭐ Featured & Posts Strategy
          </h3>
          <ul className="space-y-2.5">
            {profile.featuredSuggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                <span className="text-brand-400 shrink-0 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recruiter Outreach Card */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Recruiter outreach / InMail template
          </h3>
          <button
            onClick={() => handleCopy(profile.connectionMessage, 'outreach')}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            {copied === 'outreach' ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied Template</> : <><Copy className="w-3.5 h-3.5" /> Copy Message</>}
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Use this highly effective, brief introduction message when connecting with engineers or recruiters at the company:
        </p>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "{profile.connectionMessage}"
          </p>
        </div>
      </div>
    </div>
  );
};
