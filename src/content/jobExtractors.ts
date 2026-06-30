import { JobDescription } from '../types';
import { extractSkillsFromText } from '../taxonomy/skills';
import { extractActionVerbs } from '../taxonomy/actionVerbs';

// Helper to filter out generic page headings / SEO search queries
function cleanTitle(title: string): string {
  const t = title.replace(/\s+/g, ' ').trim();
  if (
    !t ||
    /jobs\s+in|hiring\s+in|careers\s+in|work\s+from\s+home|remote\s+jobs|job\s+search/i.test(t) ||
    t.toLowerCase() === 'indeed' ||
    t.toLowerCase() === 'linkedin' ||
    t.length > 85 // Extremely long titles are usually page headings/SEO strings, not job roles
  ) {
    return '';
  }
  return t;
}

export function extractJobDescriptionFromDOM(): JobDescription {
  const url = window.location.href;
  const hostname = window.location.hostname;

  let title = '';
  let company = '';
  let location = '';
  let rawText = '';

  // Scope queries to the active job description pane to prevent matching page navigation/search headings
  if (hostname.includes('linkedin.com')) {
    const pane = document.querySelector('.jobs-search__job-details, .jobs-details, #main') || document;
    
    title = cleanTitle(getText('.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, .jobs-details-top-card__job-title', pane));
    if (!title) {
      title = cleanTitle(getText('h1, h2', pane));
    }
    
    company = getText('.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .jobs-details-top-card__company-url', pane);
    location = getText('.job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet, .jobs-details-top-card__bullet', pane);
    rawText = getText('#job-details, .jobs-description-content, .jobs-description__content', pane);

  } else if (hostname.includes('indeed.com')) {
    const pane = document.querySelector('.jobsearch-ViewJobLayout-jobDisplay, #vjs-container, .jobsearch-RightPane') || document;
    
    title = cleanTitle(getText('.jobsearch-JobInfoHeader-title, .jobsearch-JobInfoHeader-title-container h1, [data-testid="simulated-header-title"]', pane));
    if (!title) {
      title = cleanTitle(getText('h1, h2', pane));
    }
    
    company = getText('[data-company-name="true"], .jobsearch-InlineCompanyRating-companyHeader a, .jobsearch-InlineCompanyRating-companyHeader', pane);
    location = getText('[data-testid="job-location"], .jobsearch-JobInfoHeader-subtitle', pane);
    rawText = getText('#jobDescriptionText', pane);

  } else if (hostname.includes('greenhouse.io')) {
    title = cleanTitle(getText('.app-title, h1.heading'));
    company = getText('.company-name');
    location = getText('.location');
    rawText = getText('#content, .body');

  } else if (hostname.includes('lever.co')) {
    title = cleanTitle(getText('.posting-header h2'));
    company = document.title.split('-')[0]?.trim() || '';
    location = getText('.posting-categories .location');
    rawText = getText('.section.page-centered');

  } else if (hostname.includes('workday.com') || hostname.includes('myworkdayjobs.com')) {
    const pane = document.querySelector('[data-automation-id="jobPostingHeader"], .wd-workday') || document;
    title = cleanTitle(getText('[data-automation-id="jobPostingHeader"], h2', pane));
    company = getText('[data-automation-id="company"]', pane);
    location = getText('[data-automation-id="locations"]', pane);
    rawText = getText('[data-automation-id="jobPostingDescription"]', pane);

  } else if (hostname.includes('ashbyhq.com')) {
    title = cleanTitle(getText('h1'));
    company = document.title.split('at')[1]?.trim() || 'Company';
    location = getText('._location_1v94u_13, ._subtitle_1v94u_19');
    rawText = getText('._description_1v94u_25, ._container_1241z_1');

  } else if (hostname.includes('bamboohr.com')) {
    title = cleanTitle(getText('h2, .jss-e1'));
    company = document.title.split('-')[0]?.trim() || '';
    location = getText('.jss-e3');
    rawText = getText('.pos-description');
  }

  // Generic fallback if specific selectors failed
  if (!rawText || rawText.length < 50) {
    const pane = document.querySelector('main, article, #content, .content, .job-description') || document;
    title = title || cleanTitle(getText('h1, h2', pane)) || cleanTitle(document.title) || 'Software Engineer';
    company = company || getMeta('author') || 'Company';
    location = location || 'Remote / Unspecified';
    rawText = pane.textContent || '';
  }

  // Double check title fallback to make sure we never yield empty string or SEO phrase
  title = title || 'Software Engineer';
  company = company || 'Technology Company';

  // Clean raw text
  rawText = rawText.replace(/\s+/g, ' ').trim();

  const skills = extractSkillsFromText(rawText);
  const actionVerbs = extractActionVerbs(rawText);
  const yearsMatch = rawText.match(/(\d+)\+?\s*years(?:\s*of)?\s*experience/i);
  const yearsOfExperienceRequired = yearsMatch ? parseInt(yearsMatch[1], 10) : 3;

  const lines = rawText.split(/(?<=[.!?])\s+/);
  const responsibilities = lines.filter(l => /responsible|deliver|manage|build|develop|maintain|lead/i.test(l)).slice(0, 8);
  const requirements = lines.filter(l => /require|must have|proficiency|degree|experience in/i.test(l)).slice(0, 8);

  return {
    id: `jd_${Date.now()}`,
    title: title.trim(),
    company: company.trim(),
    employmentType: rawText.toLowerCase().includes('contract') ? 'Contract' : 'Full-time',
    location: location.trim() || 'Remote',
    url,
    extractedAt: new Date().toISOString(),
    rawText,
    responsibilities,
    requirements,
    preferredQualifications: [],
    requiredSkills: skills.allSkills.slice(0, 10),
    niceToHaveSkills: skills.allSkills.slice(10),
    educationRequirements: ['Bachelor Degree in Computer Science or equivalent'],
    yearsOfExperienceRequired,
    keywords: skills.allSkills,
    technologies: {
      ...skills,
      all: skills.allSkills
    },
    certifications: [],
    softSkills: skills.softSkills,
    actionVerbs,
    industry: 'Technology'
  };
}

function getText(selector: string, parent: Element | Document = document): string {
  const el = parent.querySelector(selector);
  return el ? el.textContent || '' : '';
}

function getMeta(name: string): string {
  const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  return el ? el.getAttribute('content') || '' : '';
}
