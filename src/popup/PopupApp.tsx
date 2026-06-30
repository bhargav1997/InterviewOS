import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, PanelRight, ExternalLink, FileText, Globe, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { ParsedResume, JobDescription, MatchAnalysis, AtsAnalysis } from '../types';
import { getAllResumes, getActiveResume, setActiveResumeId, getActiveJobDescription, saveActiveJobDescription } from '../services/storageService';
import { extractJobFromActiveTab } from '../services/tabExtractor';
import { analyzeMatch } from '../engine/matcher';
import { analyzeAtsScore } from '../engine/atsScore';

export const PopupApp: React.FC = () => {
  const [resumes, setResumes] = useState<ParsedResume[]>([]);
  const [activeResume, setActiveResume] = useState<ParsedResume | null>(null);
  const [activeJd, setActiveJd] = useState<JobDescription | null>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysis | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const loadedResumes = await getAllResumes();
      const currentActiveResume = await getActiveResume() || (loadedResumes.length > 0 ? loadedResumes[0] : null);
      
      let currentJd = await extractJobFromActiveTab();
      if (currentJd && currentJd.rawText.length > 50) {
        await saveActiveJobDescription(currentJd);
      } else {
        currentJd = await getActiveJobDescription();
      }

      setResumes(loadedResumes);
      setActiveResume(currentActiveResume);
      setActiveJd(currentJd);

      if (currentActiveResume && currentJd) {
        setMatchAnalysis(analyzeMatch(currentActiveResume, currentJd));
        setAtsAnalysis(analyzeAtsScore(currentActiveResume, currentJd));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanPage = async () => {
    setIsScanning(true);
    setScanError(null);
    try {
      const extracted = await extractJobFromActiveTab();
      if (extracted && extracted.rawText.length > 50) {
        await saveActiveJobDescription(extracted);
        setActiveJd(extracted);
        if (activeResume) {
          setMatchAnalysis(analyzeMatch(activeResume, extracted));
          setAtsAnalysis(analyzeAtsScore(activeResume, extracted));
        }
      } else {
        setScanError('No job description found on this page. Try LinkedIn, Indeed, or Greenhouse.');
        setTimeout(() => setScanError(null), 4000);
      }
    } catch (e) {
      console.error('Scan failed:', e);
      setScanError('Scan failed. Refresh the page and try again.');
      setTimeout(() => setScanError(null), 4000);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectResume = async (id: string) => {
    await setActiveResumeId(id);
    const selected = resumes.find(r => r.id === id) || null;
    setActiveResume(selected);
    if (selected && activeJd) {
      setMatchAnalysis(analyzeMatch(selected, activeJd));
      setAtsAnalysis(analyzeAtsScore(selected, activeJd));
    }
  };

  const handleOpenSidePanel = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' });
    }
  };

  const handleOpenDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'OPEN_FULL_DASHBOARD' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-md shadow-brand-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Loading InterviewOS...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1">
              Interview<span className="text-brand-500">OS</span>
            </h1>
            <p className="text-[10px] text-slate-400">Extension Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Ready
        </div>
      </div>

      {/* Target Job Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Job Post</span>
          </div>
          <button
            onClick={handleScanPage}
            disabled={isScanning}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 px-2 py-1 rounded-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Page'}
          </button>
        </div>

        {scanError && (
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] text-rose-400">
            {scanError}
          </div>
        )}
        {activeJd ? (
          <div>
            <h2 className="font-semibold text-xs text-slate-100 truncate">{activeJd.title}</h2>
            <p className="text-[11px] text-slate-400 truncate">{activeJd.company} • {activeJd.location}</p>
            {activeJd.keywords.length > 0 && (
              <p className="text-[10px] text-brand-400 mt-0.5">{activeJd.keywords.length} keywords extracted</p>
            )}
            <p className="text-[9px] text-slate-500 text-right mt-1.5">Tip: Press <kbd className="px-1 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">Alt+Shift+R</kbd> to rescan</p>
          </div>
        ) : (
          <div className="p-2 bg-slate-800/40 rounded-lg text-center text-xs text-slate-400">
            No job post detected on this tab. Open LinkedIn, Indeed, or Greenhouse.
          </div>
        )}
      </div>

      {/* Match Score & ATS Overview */}
      {matchAnalysis && atsAnalysis && (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between items-center text-center">
            <span className="text-[11px] text-slate-400 font-medium">Match Score</span>
            <div className="text-2xl font-black text-brand-400 my-1">
              {matchAnalysis.overallMatchScore}%
            </div>
            <span className="text-[10px] text-slate-400">vs Active Resume</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between items-center text-center">
            <span className="text-[11px] text-slate-400 font-medium">ATS Compatibility</span>
            <div className="text-2xl font-black text-emerald-400 my-1">
              {atsAnalysis.totalScore}<span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[10px] text-slate-400">Format Audit</span>
          </div>
        </div>
      )}

      {/* Active Resume Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-slate-400" />
          Active Profile Resume
        </label>
        {resumes.length > 0 ? (
          <select
            value={activeResume?.id || ''}
            onChange={(e) => handleSelectResume(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {resumes.map(r => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.skills.allSkills.length} skills parsed)
              </option>
            ))}
          </select>
        ) : (
          <div className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            No resumes saved yet. Open Workspace to add one.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 mt-auto space-y-2 border-t border-slate-800/80">
        <button
          onClick={handleOpenSidePanel}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-brand-600/25 transition"
        >
          <div className="flex items-center gap-2">
            <PanelRight className="w-4 h-4" />
            <span>Open Co-Pilot Side Panel</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-75" />
        </button>

        <button
          onClick={handleOpenDashboard}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Launch Full Workspace</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>
      </div>
    </div>
  );
};
