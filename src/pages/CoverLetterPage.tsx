import React, { useState, useMemo } from 'react';
import { ParsedResume, JobDescription, MatchAnalysis, CoverLetterTone } from '../types';
import { generateCoverLetter } from '../engine/coverLetter';
import { Mail, Copy, CheckCircle, RefreshCw, Zap } from 'lucide-react';

interface CoverLetterPageProps {
  resume: ParsedResume | null;
  jd: JobDescription | null;
  match: MatchAnalysis | null;
}

const TONE_OPTIONS: { id: CoverLetterTone; label: string; desc: string; color: string }[] = [
  { id: 'professional', label: '🏢 Professional', desc: 'Formal & polished', color: 'border-slate-600 text-slate-300' },
  { id: 'enthusiastic', label: '🚀 Enthusiastic', desc: 'Energetic & genuine', color: 'border-brand-500 text-brand-400' },
  { id: 'direct', label: '⚡ Direct', desc: 'Confident & concise', color: 'border-emerald-500 text-emerald-400' },
];

export const CoverLetterPage: React.FC<CoverLetterPageProps> = ({ resume, jd, match }) => {
  const [tone, setTone] = useState<CoverLetterTone>('professional');
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'preview' | 'sections'>('preview');

  const letter = useMemo(() => {
    if (!resume || !jd || !match) return null;
    return generateCoverLetter(resume, jd, match, tone);
  }, [resume, jd, match, tone]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  if (!resume || !jd || !match) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
          <Mail className="w-7 h-7 text-slate-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-300">Resume + Job Post Required</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">Upload your resume and scan a job posting to generate a tailored cover letter.</p>
        </div>
      </div>
    );
  }

  if (!letter) return null;

  const SECTIONS = [
    { id: 'opening', label: '1. Opening', content: letter.opening, tip: 'First impression — hooks the reader. Should answer: why this company, why you.' },
    { id: 'body1', label: '2. Proof of Fit', content: letter.body1, tip: 'Strongest evidence you\'re qualified. Uses your best matching experience + specific skills.' },
    { id: 'body2', label: '3. Bridge / Growth', content: letter.body2, tip: 'Addresses any gaps or shows soft skills. Turns weaknesses into growth stories.' },
    { id: 'closing', label: '4. Closing', content: letter.closing, tip: 'Clear call to action. Confident, not desperate.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Cover Letter Generator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tailored for <span className="text-brand-400 font-semibold">{jd.title}</span> at <span className="text-slate-300">{jd.company}</span>
          </p>
        </div>
        <button
          onClick={() => handleCopy(letter.fullText, 'full')}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-brand-600/25"
        >
          {copied === 'full' ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy All</>}
        </button>
      </div>

      {/* Tone Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tone</label>
        <div className="grid grid-cols-3 gap-3">
          {TONE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setTone(opt.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                tone === opt.id
                  ? `${opt.color} bg-slate-900`
                  : 'border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className={`text-sm font-bold ${tone === opt.id ? '' : 'text-slate-400'}`}>{opt.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-xl p-1 w-fit">
        {[{ id: 'preview', label: '📄 Full Letter' }, { id: 'sections', label: '🔧 By Section' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === tab.id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Full Preview */}
      {activeSection === 'preview' && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6">
          <div className="prose prose-invert max-w-none">
            <div className="font-mono text-xs text-slate-500 mb-4">
              To: {letter.recipientName}<br />
              Re: {jd.title} Position
            </div>
            <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">
              {letter.fullText}
            </div>
          </div>
        </div>
      )}

      {/* Section View */}
      {activeSection === 'sections' && (
        <div className="space-y-4">
          {SECTIONS.map(section => (
            <div key={section.id} className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{section.label}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{section.tip}</p>
                </div>
                <button
                  onClick={() => handleCopy(section.content, section.id)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  {copied === section.id ? <><CheckCircle className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-4 border-l-2 border-brand-500/50">
                <p className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pro tips */}
      <div className="glass-panel rounded-2xl border border-amber-500/20 p-5 space-y-3">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Cover Letter Pro Tips
        </h3>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex items-start gap-2"><span className="text-amber-400 shrink-0">→</span> Keep it to <strong className="text-slate-300">3/4 of a page maximum</strong> — hiring managers read hundreds, brevity wins</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 shrink-0">→</span> Research the hiring manager's name on LinkedIn and use it — "Dear Sarah" beats "Dear Hiring Manager"</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 shrink-0">→</span> <strong className="text-slate-300">Quantify one achievement</strong> in the body — a single number makes you memorable</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 shrink-0">→</span> Send as PDF not Word — formatting stays intact and it looks more polished</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 shrink-0">→</span> Apply within <strong className="text-slate-300">48 hours</strong> of posting — ATS often ranks by application date</li>
        </ul>
      </div>
    </div>
  );
};
