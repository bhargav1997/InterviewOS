import { ParsedResume, JobDescription } from '../types';

const RESUMES_KEY = 'interviewos_resumes';
const ACTIVE_RESUME_KEY = 'interviewos_active_resume_id';
const ACTIVE_JD_KEY = 'interviewos_active_jd';

export async function saveResume(resume: ParsedResume): Promise<void> {
  const resumes = await getAllResumes();
  const existingIndex = resumes.findIndex(r => r.id === resume.id);
  if (existingIndex >= 0) {
    resumes[existingIndex] = resume;
  } else {
    resumes.push(resume);
  }
  
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [RESUMES_KEY]: resumes });
    if (resumes.length === 1) {
      await setActiveResumeId(resume.id);
    }
  } else {
    localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    if (resumes.length === 1) {
      localStorage.setItem(ACTIVE_RESUME_KEY, resume.id);
    }
  }
}

export async function getAllResumes(): Promise<ParsedResume[]> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const result = await chrome.storage.local.get(RESUMES_KEY);
    return (result[RESUMES_KEY] as ParsedResume[]) || [];
  } else {
    const data = localStorage.getItem(RESUMES_KEY);
    return data ? JSON.parse(data) : [];
  }
}

export async function deleteResume(id: string): Promise<void> {
  let resumes = await getAllResumes();
  resumes = resumes.filter(r => r.id !== id);
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [RESUMES_KEY]: resumes });
  } else {
    localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
  }
}

export async function setActiveResumeId(id: string): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [ACTIVE_RESUME_KEY]: id });
  } else {
    localStorage.setItem(ACTIVE_RESUME_KEY, id);
  }
}

export async function getActiveResumeId(): Promise<string | null> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const result = await chrome.storage.local.get(ACTIVE_RESUME_KEY);
    return (result[ACTIVE_RESUME_KEY] as string) || null;
  } else {
    return localStorage.getItem(ACTIVE_RESUME_KEY);
  }
}

export async function getActiveResume(): Promise<ParsedResume | null> {
  const resumes = await getAllResumes();
  const activeId = await getActiveResumeId();
  if (activeId) {
    const found = resumes.find(r => r.id === activeId);
    if (found) return found;
  }
  return resumes.length > 0 ? resumes[0] : null;
}

export async function saveActiveJobDescription(jd: JobDescription): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [ACTIVE_JD_KEY]: jd });
  } else {
    localStorage.setItem(ACTIVE_JD_KEY, JSON.stringify(jd));
  }
}

export async function getActiveJobDescription(): Promise<JobDescription | null> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const result = await chrome.storage.local.get(ACTIVE_JD_KEY);
    return (result[ACTIVE_JD_KEY] as JobDescription) || null;
  } else {
    const data = localStorage.getItem(ACTIVE_JD_KEY);
    return data ? JSON.parse(data) : null;
  }
}
