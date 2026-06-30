import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  BarChart2, 
  ShieldCheck, 
  Lightbulb, 
  Kanban, 
  Globe, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { ParsedResume, JobDescription, MatchAnalysis, AtsAnalysis, SmartSuggestion, TrackedJob } from '../types';
import { getAllResumes, getActiveResume, setActiveResumeId, getActiveJobDescription, saveActiveJobDescription } from '../services/storageService';
import { getAllTrackedJobs, saveTrackedJob, deleteTrackedJob } from '../services/jobTrackerService';
import { extractJobFromActiveTab } from '../services/tabExtractor';
import { analyzeMatch } from '../engine/matcher';
import { analyzeAtsScore } from '../engine/atsScore';
import { generateSmartSuggestions } from '../engine/suggestions';

export const SidepanelApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'match' | 'ats' | 'suggestions' | 'tracker'>('match');
  const [resumes, setResumes] = useState<ParsedResume[]>([]);
  const [activeResume, setActiveResume] = useState<ParsedResume | null>(null);
  const [activeJd, setActiveJd] = useState<JobDescription | null>(null);
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);

  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedResumes = await getAllResumes();
    const currentActiveResume = await getActiveResume() || (loadedResumes.length > 0 ? loadedResumes[0] : null);
    
    let currentJd = await extractJobFromActiveTab();
    if (currentJd && currentJd.rawText.length > 50) {
      await saveActiveJobDescription(currentJd);
    } else {
      currentJd = await getActiveJobDescription();
    }

    const loadedTracked = await getAllTrackedJobs();

    setResumes(loadedResumes);
    setActiveResume(currentActiveResume);
    setActiveJd(currentJd);
    setTrackedJobs(loadedTracked);

    if (currentActiveResume && currentJd) {
      runAnalysis(currentActiveResume, currentJd);
    }
  };

  const runAnalysis = (resume: ParsedResume | null, jd: JobDescription | null) => {
    if (resume && jd) {
      const match = analyzeMatch(resume, jd);
      const ats = analyzeAtsScore(resume, jd);
      const suggs = generateSmartSuggestions(resume, jd, match);

      setMatchAnalysis(match);
      setAtsAnalysis(ats);
      setSuggestions(suggs);
    }
  };

  const handleScanPage = async () => {
    setIsScanning(true);
    try {
      const extracted = await extractJobFromActiveTab();
      if (extracted && extracted.rawText.length > 50) {
        await saveActiveJobDescription(extracted);
        setActiveJd(extracted);
        runAnalysis(activeResume, extracted);
      }
    } catch (e) {
      console.error('Scan failed:', e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectResume = async (id: string) => {
    await setActiveResumeId(id);
    const selected = resumes.find(r => r.id === id) || null;
    setActiveResume(selected);
    runAnalysis(selected, activeJd);
  };

  const handleDeleteTrackedJob = async (id: string) => {
    await deleteTrackedJob(id);
    setTrackedJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleQuickSaveTrackedJob = async () => {
    if (!activeJd) return;
    const newTrackedJob: TrackedJob = {
      id: `job_${Date.now()}`,
      jobTitle: activeJd.title,
      company: activeJd.company,
      location: activeJd.location,
      url: activeJd.url,
      status: 'Applied',
      notes: 'Saved from Chrome Side Panel',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobDescriptionId: activeJd.id,
      matchScore: matchAnalysis?.overallMatchScore
    };
    await saveTrackedJob(newTrackedJob);
    const updated = await getAllTrackedJobs();
    setTrackedJobs(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'OPEN_FULL_DASHBOARD' });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="p-3.5 bg-slate-900 border-b border-slate-800 sticky top-0 z-20 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-xs tracking-tight">
              Interview<span className="text-brand-500">OS</span> Co-Pilot
            </span>
          </div>

          <button
            onClick={handleScanPage}
            disabled={isScanning}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 px-2.5 py-1 rounded-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Rescan Tab'}
          </button>
        </div>

        {/* Target Job Quick Summary */}
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <div className="text-[10px] text-slate-400 font-medium truncate">Target Job</div>
            <div className="text-xs font-semibold text-slate-200 truncate">{activeJd ? activeJd.title : 'No job scanned'}</div>
            <div className="text-[10px] text-slate-400 truncate">{activeJd ? activeJd.company : 'Open job post to scan'}</div>
          </div>
          {matchAnalysis && (
            <div className="text-right pl-2 border-l border-slate-800">
              <div className="text-base font-black text-brand-400">{matchAnalysis.overallMatchScore}%</div>
              <div className="text-[9px] text-slate-400">Match</div>
            </div>
          )}
        </div>

        {/* Resume Selector Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400">Profile:</span>
          <select
            value={activeResume?.id || ''}
            onChange={(e) => handleSelectResume(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {resumes.map(r => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Navigation Pills */}
      <nav className="flex items-center justify-around bg-slate-900/50 border-b border-slate-800 px-2 py-1.5 text-xs font-medium">
        <button
          onClick={() => setActiveTab('match')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${activeTab === 'match' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <BarChart2 className="w-3 h-3" /> Match
        </button>
        <button
          onClick={() => setActiveTab('ats')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${activeTab === 'ats' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <ShieldCheck className="w-3 h-3" /> ATS
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${activeTab === 'suggestions' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Lightbulb className="w-3 h-3" /> Tailor
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${activeTab === 'tracker' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Kanban className="w-3 h-3" /> Tracker
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {activeTab === 'match' && matchAnalysis && (
          <div className="space-y-4">
            {/* Missing Required Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <h3 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing Key Skills ({matchAnalysis.missingTechnologies.length})
              </h3>
              {matchAnalysis.missingTechnologies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {matchAnalysis.missingTechnologies.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px]">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">Great job! All requested skills are mentioned.</p>
              )}
            </div>

            {/* Matching Technologies */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <h3 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matching Stack ({matchAnalysis.matchingTechnologies.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {matchAnalysis.matchingTechnologies.map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ats' && atsAnalysis && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-slate-200">ATS Audit Breakdown</h3>
                <span className="text-xs font-bold text-emerald-400">{atsAnalysis.totalScore}/100</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {atsAnalysis.criticalIssues.map((issue, i) => (
                  <div key={i} className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex items-start gap-1.5">
                    <AlertCircle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
                {atsAnalysis.criticalIssues.length === 0 && (
                  <p className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                    No critical formatting issues found. Ready for ATS upload!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-200">AI Tailoring Suggestions</h3>
            {suggestions.map((sugg) => (
              <div key={sugg.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-brand-300">{sugg.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-400">{sugg.impact} Impact</span>
                </div>
                <p className="text-[11px] text-slate-400">{sugg.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-200">Quick Application Tracker</h3>
              {savedSuccess ? (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved to Job Tracker!
                </div>
              ) : (
                <button
                  onClick={handleQuickSaveTrackedJob}
                  disabled={!activeJd}
                  className="w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs py-2 rounded-lg transition disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Save Current Job as "Applied"
                </button>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-medium text-slate-400">Recently Saved Jobs ({trackedJobs.length})</h4>
              {trackedJobs.length === 0 ? (
                <p className="text-[11px] text-slate-500 text-center py-3">No jobs saved yet.</p>
              ) : (
                trackedJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex justify-between items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-200 truncate">{job.jobTitle}</div>
                      <div className="text-[10px] text-slate-400 truncate">{job.company}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium shrink-0">
                      {job.status}
                    </span>
                    <button
                      onClick={() => handleDeleteTrackedJob(job.id)}
                      className="p-1 hover:text-rose-400 text-slate-600 transition shrink-0"
                      title="Remove job"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[11px]">
        <span className="text-slate-400">InterviewOS 1.0</span>
        <button
          onClick={handleOpenDashboard}
          className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
        >
          <span>Open Full Workspace</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </footer>
    </div>
  );
};
