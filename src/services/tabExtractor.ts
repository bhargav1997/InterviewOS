import { JobDescription } from '../types';
import { extractSkillsFromText } from '../taxonomy/skills';
import { extractActionVerbs } from '../taxonomy/actionVerbs';

export async function extractJobFromActiveTab(): Promise<JobDescription | null> {
  if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.tabs.query) {
    return null;
  }

  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.id || activeTab.url?.startsWith('chrome://') || activeTab.url?.startsWith('chrome-extension://')) {
        resolve(null);
        return;
      }

      // Try message passing to content script first (content script has richer selectors)
      chrome.tabs.sendMessage(activeTab.id, { type: 'EXTRACT_JOB_DETAILS' }, (response) => {
        if (chrome.runtime.lastError || !response?.data) {
          // Fallback: executeScript to extract raw text and enrich with taxonomy
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id! },
            func: () => {
              const selectors = [
                // LinkedIn
                '.job-details-jobs-unified-top-card__job-title',
                '.jobs-unified-top-card__job-title',
                // Indeed
                '.jobsearch-JobInfoHeader-title',
                // General
                'h1'
              ];
              const titleEl = selectors.map(s => document.querySelector(s)).find(Boolean);
              const title = titleEl?.textContent?.trim() || document.title;

              const companySelectors = [
                '.job-details-jobs-unified-top-card__company-name',
                '.jobs-unified-top-card__company-name',
                '[data-company-name="true"]',
                '.jobsearch-InlineCompanyRating-companyHeader',
                '.company-name',
              ];
              const companyEl = companySelectors.map(s => document.querySelector(s)).find(Boolean);
              const company = companyEl?.textContent?.trim() || '';

              const locationSelectors = [
                '.job-details-jobs-unified-top-card__bullet',
                '.jobs-unified-top-card__bullet',
                '[data-testid="job-location"]',
                '.location',
              ];
              const locationEl = locationSelectors.map(s => document.querySelector(s)).find(Boolean);
              const location = locationEl?.textContent?.trim() || 'Remote';

              const contentSelectors = [
                '#job-details',
                '.jobs-description-content',
                '.jobs-description__content',
                '#jobDescriptionText',
                '[data-automation-id="jobPostingDescription"]',
                '.section.page-centered',
                '#content',
                '.pos-description',
                'main article',
                'main',
                'article',
              ];
              const contentEl = contentSelectors.map(s => document.querySelector(s)).find(e => e && (e.textContent?.length || 0) > 100);
              const rawText = (contentEl?.textContent || document.body.textContent || '').replace(/\s+/g, ' ').trim();

              return {
                title: title || 'Software Engineer',
                company: company || 'Technology Company',
                location: location || 'Remote',
                url: window.location.href,
                rawText,
              };
            }
          }).then((results) => {
            if (!results?.[0]?.result) {
              resolve(null);
              return;
            }
            const raw = results[0].result as {
              title: string; company: string; location: string; url: string; rawText: string;
            };

            if (!raw.rawText || raw.rawText.length < 50) {
              resolve(null);
              return;
            }

            // Enrich with taxonomy — this is the critical step
            const skills = extractSkillsFromText(raw.rawText);
            const actionVerbs = extractActionVerbs(raw.rawText);
            const yearsMatch = raw.rawText.match(/(\d+)\+?\s*years?(?:\s*of)?\s*experience/i);
            const yearsOfExperienceRequired = yearsMatch ? parseInt(yearsMatch[1], 10) : 2;

            const lines = raw.rawText.split(/(?<=[.!?])\s+/);
            const responsibilities = lines
              .filter(l => /responsible|deliver|manage|build|develop|maintain|lead|design|implement/i.test(l))
              .slice(0, 8);
            const requirements = lines
              .filter(l => /require|must have|proficiency|degree|experience in|minimum|preferred/i.test(l))
              .slice(0, 8);

            resolve({
              id: `jd_${Date.now()}`,
              title: raw.title,
              company: raw.company,
              employmentType: raw.rawText.toLowerCase().includes('contract') ? 'Contract' : 'Full-time',
              location: raw.location,
              url: raw.url,
              extractedAt: new Date().toISOString(),
              rawText: raw.rawText,
              responsibilities,
              requirements,
              preferredQualifications: [],
              requiredSkills: skills.allSkills.slice(0, 15),
              niceToHaveSkills: skills.allSkills.slice(15),
              educationRequirements: ['Bachelor Degree in Computer Science or equivalent'],
              yearsOfExperienceRequired,
              keywords: skills.allSkills,
              technologies: {
                programmingLanguages: skills.programmingLanguages,
                frameworks: skills.frameworks,
                libraries: skills.libraries,
                cloudTechnologies: skills.cloudTechnologies,
                databases: skills.databases,
                tools: skills.tools,
                all: skills.allSkills
              },
              certifications: [],
              softSkills: skills.softSkills,
              actionVerbs,
              industry: skills.allSkills.length > 5 ? 'Software Engineering & Tech' : 'Technology'
            });
          }).catch((err) => {
            console.warn('InterviewOS: Direct script execution failed:', err);
            resolve(null);
          });
        } else {
          resolve(response.data as JobDescription);
        }
      });
    });
  });
}
