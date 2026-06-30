import React, { useState, useMemo } from 'react';
import { ParsedResume, JobDescription, InterviewQuestion } from '../types';
import { buildInterviewPrepKit } from '../engine/interviewPrep';
import { BrainCircuit, ChevronDown, ChevronUp, Copy, CheckCircle, BookOpen, Star, Search, MessageSquare, HelpCircle } from 'lucide-react';

interface InterviewPrepPageProps {
  resume: ParsedResume | null;
  jd: JobDescription | null;
}

const CATEGORY_META: Record<string, { color: string; bg: string; border: string }> = {
  'Behavioral': { color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
  'Technical': { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  'Situational': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  'Company': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'Role-Specific': { color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
};

const DIFFICULTY_META: Record<string, string> = {
  'Easy': 'text-emerald-400 bg-emerald-500/10',
  'Medium': 'text-amber-400 bg-amber-500/10',
  'Hard': 'text-rose-400 bg-rose-500/10',
};

function QuestionCard({ q }: { q: InterviewQuestion }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const meta = CATEGORY_META[q.category] || CATEGORY_META['Behavioral'];

  const handleCopy = () => {
    navigator.clipboard.writeText(q.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-slate-900/60 border rounded-xl overflow-hidden ${open ? meta.border : 'border-slate-800'}`}>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-start gap-3 p-4 text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} border ${meta.border}`}>
              {q.category}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_META[q.difficulty]}`}>
              {q.difficulty}
            </span>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">{q.question}</p>
        </div>
        <div className="shrink-0 mt-1">
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-800 px-4 pb-4 pt-3 space-y-3">
          <div className={`flex items-start gap-2 p-3 rounded-lg ${meta.bg} border ${meta.border}`}>
            <Star className={`w-3.5 h-3.5 ${meta.color} shrink-0 mt-0.5`} />
            <p className="text-xs text-slate-300 leading-relaxed">{q.hint}</p>
          </div>

          {q.starScaffold && (
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">STAR Scaffold</h5>
              {(['situation', 'task', 'action', 'result'] as const).map(key => (
                <div key={key} className="bg-slate-800/40 rounded-lg px-3 py-2">
                  <span className="text-[10px] font-bold text-brand-400 uppercase">{key}: </span>
                  <span className="text-xs text-slate-400">{q.starScaffold![key]}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-emerald-400 transition"
          >
            {copied ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy question</>}
          </button>
        </div>
      )}
    </div>
  );
}

export const InterviewPrepPage: React.FC<InterviewPrepPageProps> = ({ resume, jd }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'star' | 'research' | 'ask'>('questions');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copied, setCopied] = useState<string | null>(null);

  const kit = useMemo(() => {
    if (!resume || !jd) return null;
    return buildInterviewPrepKit(resume, jd);
  }, [resume, jd]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!resume || !jd) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
          <BrainCircuit className="w-7 h-7 text-slate-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-300">Resume + Job Post Required</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">Upload your resume and scan a job posting to generate your personalized interview prep kit.</p>
        </div>
      </div>
    );
  }

  if (!kit) return null;

  const categories = ['All', 'Behavioral', 'Technical', 'Situational', 'Company', 'Role-Specific'];
  const filteredQs = categoryFilter === 'All' ? kit.predictedQuestions : kit.predictedQuestions.filter(q => q.category === categoryFilter);

  const tabs = [
    { id: 'questions', label: `Questions (${kit.predictedQuestions.length})`, icon: HelpCircle },
    { id: 'star', label: `STAR Stories (${kit.starStories.length})`, icon: Star },
    { id: 'research', label: 'Research Kit', icon: Search },
    { id: 'ask', label: 'Ask Them', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Interview Prep Kit</h1>
        <p className="text-xs text-slate-400 mt-1">
          Personalized for <span className="text-brand-400 font-semibold">{jd.title}</span> at <span className="text-slate-300">{jd.company}</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-xl p-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredQs.map(q => <QuestionCard key={q.id} q={q} />)}
          </div>
        </div>
      )}

      {/* STAR Stories Tab */}
      {activeTab === 'star' && (
        <div className="space-y-4">
          <div className="p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl">
            <p className="text-xs text-brand-300 leading-relaxed">
              <span className="font-bold">How to use STAR stories:</span> Each bullet from your resume is scaffolded into a STAR story template. Fill in the blanks with specific details, numbers, and outcomes. Practice saying each story out loud until it takes 90–120 seconds.
            </p>
          </div>
          {kit.starStories.map(story => (
            <div key={story.bulletId} className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{story.role} @ {story.company}</div>
                <p className="text-sm text-brand-300 font-medium">{story.originalBullet}</p>
              </div>
              <div className="space-y-2">
                {(['situation', 'task', 'action', 'result'] as const).map(key => (
                  <div key={key} className="flex gap-3">
                    <div className="w-20 shrink-0">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                        key === 'situation' ? 'bg-slate-700 text-slate-300' :
                        key === 'task' ? 'bg-indigo-500/20 text-indigo-400' :
                        key === 'action' ? 'bg-brand-500/20 text-brand-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>{key}</span>
                    </div>
                    <p className="text-xs text-slate-400 italic leading-relaxed flex-1">{story.scaffold[key]}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleCopy(Object.entries(story.scaffold).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('\n\n'), story.bulletId)}
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-emerald-400 transition"
              >
                {copied === story.bulletId ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy scaffold</>}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Research Tab */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          {kit.researchChecklist.map((section, si) => (
            <div key={si} className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>{section.icon}</span> {section.category}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <div className="w-5 h-5 rounded border border-slate-700 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Ask Them Tab */}
      {activeTab === 'ask' && (
        <div className="space-y-3">
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <p className="text-xs text-emerald-300">Asking insightful questions shows preparation and genuine interest. Pick 3–4 from below and customize them. <span className="font-bold">Never ask about salary or vacation in the first round.</span></p>
          </div>
          {kit.questionsToAsk.map((q, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-brand-400 font-bold text-sm shrink-0">{i + 1}.</span>
              <p className="text-sm text-slate-300 flex-1">{q}</p>
              <button
                onClick={() => handleCopy(q, `ask_${i}`)}
                className="shrink-0 p-1.5 hover:text-emerald-400 text-slate-500 transition"
              >
                {copied === `ask_${i}` ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
