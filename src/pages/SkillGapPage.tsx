import React, { useState, useMemo } from 'react';
import { ParsedResume, JobDescription, MatchAnalysis } from '../types';
import { buildSkillGapRoadmap } from '../engine/skillGapRoadmap';
import { BookOpen, AlertCircle, CheckCircle, ExternalLink, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

interface SkillGapPageProps {
  resume: ParsedResume | null;
  jd: JobDescription | null;
  match: MatchAnalysis | null;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({ resume, jd, match }) => {
  const [learnedSkills, setLearnedSkills] = useState<Record<string, boolean>>({});

  const roadmap = useMemo(() => {
    if (!match || !jd) return [];
    return buildSkillGapRoadmap(match, jd);
  }, [match, jd]);

  const toggleLearned = (skillName: string) => {
    setLearnedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  if (!resume || !jd || !match) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
          <BookOpen className="w-7 h-7 text-slate-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-300">Resume + Job Post Required</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">Upload your resume and scan a job posting to generate your personalized skill gap bridge roadmap.</p>
        </div>
      </div>
    );
  }

  if (roadmap.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 glass-panel rounded-2xl p-10 border border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-slate-850 flex items-center justify-center text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-300">100% Match! No Skill Gaps</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Your resume covers every single technology and keyword extracted from the job posting. You are fully aligned!
          </p>
        </div>
      </div>
    );
  }

  const mustHaves = roadmap.filter(item => item.priority === 'Must-Have');
  const niceToHaves = roadmap.filter(item => item.priority === 'Nice-to-Have');
  const bonuses = roadmap.filter(item => item.priority === 'Bonus');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Skill Gap Roadmap</h1>
        <p className="text-xs text-slate-400 mt-1">
          Bridge the difference between your resume and the target role for <span className="text-brand-400 font-semibold">{jd.title}</span>.
        </p>
      </div>

      {/* Progress Card */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Bridge Strategy</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Focus on "Must-Have" skills first. Add learning projects to your resume or practice talking about these concepts using the resources below.
          </p>
        </div>
        <div className="flex items-center gap-4 text-center shrink-0">
          <div>
            <div className="text-2xl font-black text-rose-400">{mustHaves.length}</div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Must-Haves</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-2xl font-black text-amber-400">{niceToHaves.length}</div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Nice-To-Haves</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-2xl font-black text-emerald-400">
              {Object.values(learnedSkills).filter(Boolean).length}/{roadmap.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Bridged</div>
          </div>
        </div>
      </div>

      {/* Skill List */}
      <div className="space-y-4">
        {roadmap.map((item, idx) => {
          const isLearned = !!learnedSkills[item.skill];
          return (
            <div
              key={idx}
              className={`glass-panel rounded-2xl border transition-all p-5 space-y-4 ${
                isLearned 
                  ? 'border-emerald-500/20 bg-emerald-500/5 opacity-75' 
                  : item.priority === 'Must-Have' 
                    ? 'border-rose-500/20' 
                    : 'border-slate-800'
              }`}
            >
              {/* Top details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => toggleLearned(item.skill)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition shrink-0 ${
                      isLearned 
                        ? 'bg-emerald-600 border-emerald-500 text-white' 
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {isLearned && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <h3 className={`text-base font-bold ${isLearned ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {item.skill}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'Must-Have' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : item.priority === 'Nice-to-Have'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.difficulty} • {item.timeToLearn}
                      </span>
                      {item.quickWin && (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/25">
                          <Zap className="w-3 h-3" /> Quick Win
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {!isLearned && (
                <p className="text-xs text-slate-400 leading-relaxed pl-7">
                  {item.description}
                </p>
              )}

              {/* Resources */}
              {!isLearned && item.resources.length > 0 && (
                <div className="pl-7 space-y-2">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Free Learning Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {item.resources.map((res, ri) => (
                      <a
                        key={ri}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 rounded-xl transition group"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 transition truncate">
                            {res.name}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {res.type.toUpperCase()} • {res.timeEstimate}
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 transition shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
