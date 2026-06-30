import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ResumePage } from './pages/ResumePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { AtsPage } from './pages/AtsPage';
import { PromptPage } from './pages/PromptPage';
import { TrackerPage } from './pages/TrackerPage';
import { SettingsPage } from './pages/SettingsPage';
import { BulletRewriterPage } from './pages/BulletRewriterPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LinkedInPage } from './pages/LinkedInPage';

import { ParsedResume, JobDescription, MatchAnalysis, AtsAnalysis, SmartSuggestion, TrackedJob } from './types';
import { getAllResumes, getActiveResume, saveResume, deleteResume, setActiveResumeId, getActiveJobDescription, saveActiveJobDescription } from './services/storageService';
import { getAllTrackedJobs, saveTrackedJob, updateJobStatus, deleteTrackedJob } from './services/jobTrackerService';
import { analyzeMatch } from './engine/matcher';
import { analyzeAtsScore } from './engine/atsScore';
import { generateSmartSuggestions } from './engine/suggestions';
import { parseRawResume } from './parser/sectionExtractor';

import { extractJobFromActiveTab } from './services/tabExtractor';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resumes, setResumes] = useState<ParsedResume[]>([]);
  const [activeResume, setActiveResume] = useState<ParsedResume | null>(null);
  const [activeJd, setActiveJd] = useState<JobDescription | null>(null);
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);

  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const loadedResumes = await getAllResumes();
    const currentActiveResume = await getActiveResume() || (loadedResumes.length > 0 ? loadedResumes[0] : null);
    
    // Attempt live scraping from current active Chrome tab first
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

    runAnalysis(currentActiveResume, currentJd);
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

  const handleSaveResume = async (resume: ParsedResume) => {
    await saveResume(resume);
    const updated = await getAllResumes();
    setResumes(updated);
    setActiveResume(resume);
    runAnalysis(resume, activeJd);
  };

  const handleDeleteResume = async (id: string) => {
    await deleteResume(id);
    const updated = await getAllResumes();
    setResumes(updated);
    const newActive = updated[0] || null;
    setActiveResume(newActive);
    runAnalysis(newActive, activeJd);
  };

  const handleSetActiveResume = async (id: string) => {
    await setActiveResumeId(id);
    const found = resumes.find(r => r.id === id) || null;
    setActiveResume(found);
    runAnalysis(found, activeJd);
  };

  const handleRefreshJd = async () => {
    const extracted = await extractJobFromActiveTab();
    if (extracted && extracted.rawText.length > 50) {
      await saveActiveJobDescription(extracted);
      setActiveJd(extracted);
      runAnalysis(activeResume, extracted);
    }
  };

  const handleSaveTrackedJob = async (job: TrackedJob) => {
    await saveTrackedJob(job);
    const updated = await getAllTrackedJobs();
    setTrackedJobs(updated);
  };

  const handleUpdateJobStatus = async (id: string, status: any) => {
    await updateJobStatus(id, status);
    const updated = await getAllTrackedJobs();
    setTrackedJobs(updated);
  };

  const handleDeleteTrackedJob = async (id: string) => {
    await deleteTrackedJob(id);
    const updated = await getAllTrackedJobs();
    setTrackedJobs(updated);
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeResume={activeResume}
      activeJd={activeJd}
      onRefreshJd={handleRefreshJd}
    >
      {activeTab === 'dashboard' && (
        <Dashboard
          resume={activeResume}
          jd={activeJd}
          match={matchAnalysis}
          ats={atsAnalysis}
          suggestions={suggestions}
          onNavigate={setActiveTab}
        />
      )}
      {activeTab === 'resume' && (
        <ResumePage
          resumes={resumes}
          activeResume={activeResume}
          onSaveResume={handleSaveResume}
          onDeleteResume={handleDeleteResume}
          onSetActive={handleSetActiveResume}
        />
      )}
      {activeTab === 'analysis' && <AnalysisPage match={matchAnalysis} jd={activeJd} />}
      {activeTab === 'ats' && <AtsPage ats={atsAnalysis} />}
      {activeTab === 'prompt' && (
        <PromptPage resume={activeResume} jd={activeJd} match={matchAnalysis} ats={atsAnalysis} />
      )}
      {activeTab === 'tracker' && (
        <TrackerPage
          jobs={trackedJobs}
          onSaveJob={handleSaveTrackedJob}
          onUpdateStatus={handleUpdateJobStatus}
          onDeleteJob={handleDeleteTrackedJob}
        />
      )}
      {activeTab === 'bullet' && <BulletRewriterPage resume={activeResume} />}
      {activeTab === 'interview' && <InterviewPrepPage resume={activeResume} jd={activeJd} />}
      {activeTab === 'cover' && <CoverLetterPage resume={activeResume} jd={activeJd} match={matchAnalysis} />}
      {activeTab === 'skillgap' && <SkillGapPage resume={activeResume} jd={activeJd} match={matchAnalysis} />}
      {activeTab === 'linkedin' && <LinkedInPage resume={activeResume} jd={activeJd} match={matchAnalysis} />}
      {activeTab === 'settings' && <SettingsPage />}
    </Layout>
  );
}
