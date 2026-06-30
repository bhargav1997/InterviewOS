import { TrackedJob, JobApplicationStatus } from '../types';

const TRACKED_JOBS_KEY = 'interviewos_tracked_jobs';

export async function getAllTrackedJobs(): Promise<TrackedJob[]> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const result = await chrome.storage.local.get(TRACKED_JOBS_KEY);
    return (result[TRACKED_JOBS_KEY] as TrackedJob[]) || [];
  } else {
    const data = localStorage.getItem(TRACKED_JOBS_KEY);
    return data ? JSON.parse(data) : [];
  }
}

export async function saveTrackedJob(job: TrackedJob): Promise<void> {
  const jobs = await getAllTrackedJobs();
  const index = jobs.findIndex(j => j.id === job.id);
  if (index >= 0) {
    jobs[index] = { ...job, updatedAt: new Date().toISOString() };
  } else {
    jobs.unshift({ ...job, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [TRACKED_JOBS_KEY]: jobs });
  } else {
    localStorage.setItem(TRACKED_JOBS_KEY, JSON.stringify(jobs));
  }
}

export async function updateJobStatus(id: string, status: JobApplicationStatus): Promise<void> {
  const jobs = await getAllTrackedJobs();
  const job = jobs.find(j => j.id === id);
  if (job) {
    job.status = status;
    job.updatedAt = new Date().toISOString();
    if (status === 'Applied' && !job.appliedDate) {
      job.appliedDate = new Date().toLocaleDateString();
    }
    await saveTrackedJob(job);
  }
}

export async function deleteTrackedJob(id: string): Promise<void> {
  let jobs = await getAllTrackedJobs();
  jobs = jobs.filter(j => j.id !== id);
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [TRACKED_JOBS_KEY]: jobs });
  } else {
    localStorage.setItem(TRACKED_JOBS_KEY, JSON.stringify(jobs));
  }
}

function getSampleTrackedJobs(): TrackedJob[] {
  return [
    {
      id: 'job_sample_1',
      jobTitle: 'Senior Frontend Engineer',
      company: 'Stripe',
      location: 'Remote',
      url: 'https://stripe.com/jobs/123',
      status: 'Interview',
      appliedDate: '2026-06-20',
      salary: '$180,000 - $210,000',
      notes: 'Passed initial recruiter screen. System design interview scheduled for next Tuesday.',
      createdAt: '2026-06-18T10:00:00Z',
      updatedAt: '2026-06-24T14:30:00Z',
      matchScore: 94
    },
    {
      id: 'job_sample_2',
      jobTitle: 'Full Stack Developer',
      company: 'Vercel',
      location: 'San Francisco, CA (Hybrid)',
      url: 'https://vercel.com/careers/456',
      status: 'Applied',
      appliedDate: '2026-06-25',
      salary: '$170,000 - $195,000',
      notes: 'Applied using customized Next.js & React prompt output.',
      createdAt: '2026-06-25T09:15:00Z',
      updatedAt: '2026-06-25T09:15:00Z',
      matchScore: 88
    },
    {
      id: 'job_sample_3',
      jobTitle: 'Lead Software Architect',
      company: 'Datadog',
      location: 'Remote',
      url: 'https://datadog.com/careers/789',
      status: 'Wishlist',
      notes: 'Targeting for Q3 application batch.',
      createdAt: '2026-06-27T16:00:00Z',
      updatedAt: '2026-06-27T16:00:00Z',
      matchScore: 91
    }
  ];
}
