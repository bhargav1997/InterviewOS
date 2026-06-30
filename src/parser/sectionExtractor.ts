import { ParsedResume, ContactInfo, WorkExperience, Project, Education, Certification } from '../types';
import { extractSkillsFromText } from '../taxonomy/skills';
import { extractActionVerbs } from '../taxonomy/actionVerbs';

export function parseRawResume(rawText: string, title: string = 'My Resume'): ParsedResume {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Extract contact info
  const contactInfo = extractContactInfo(rawText, lines);
  
  // Segment into main sections
  const sections = segmentSections(lines);
  
  const summary = sections['summary'] || '';
  const skillsText = sections['skills'] || rawText;
  const experienceText = sections['experience'] || '';
  const projectsText = sections['projects'] || '';
  const educationText = sections['education'] || '';
  const certsText = sections['certifications'] || '';
  
  const skills = extractSkillsFromText(skillsText + ' ' + rawText);
  const workExperience = parseWorkExperience(experienceText);
  const projects = parseProjects(projectsText);
  const education = parseEducation(educationText);
  const certifications = parseCertifications(certsText);
  
  const actionVerbsUsed = extractActionVerbs(rawText);
  const yearsOfExperience = calculateYearsOfExperience(workExperience, rawText);
  const hasLeadershipExperience = detectLeadership(rawText, workExperience);
  const industry = detectIndustry(skills.allSkills, rawText);

  return {
    id: `resume_${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    rawText,
    contactInfo,
    summary,
    skills,
    workExperience,
    projects,
    education,
    certifications,
    awards: parseListSection(sections['awards'] || ''),
    languages: parseListSection(sections['languages'] || ''),
    actionVerbsUsed,
    yearsOfExperience,
    hasLeadershipExperience,
    industry
  };
}

function extractContactInfo(rawText: string, lines: string[]): ContactInfo {
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const websiteMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9_-]+\.(?:com|io|dev|me|net)/i);

  const name = lines[0] && lines[0].length < 40 ? lines[0] : 'Candidate Name';

  return {
    name,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    location: extractLocation(lines) || 'City, State',
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    github: githubMatch ? githubMatch[0] : undefined,
    website: websiteMatch ? websiteMatch[0] : undefined,
  };
}

function extractLocation(lines: string[]): string {
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const locMatch = lines[i].match(/\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})\b/);
    if (locMatch) return locMatch[1];
  }
  return '';
}

function segmentSections(lines: string[]): Record<string, string> {
  const sections: Record<string, string> = {};
  let currentSection = 'header';
  
  const headerRegexes: Record<string, RegExp> = {
    summary: /^(professional\s+)?(summary|profile|objective|about\s+me)/i,
    skills: /^(technical\s+)?(skills|technologies|competencies|core\s+competencies)/i,
    experience: /^(work|professional|employment)\s+(experience|history|background)/i,
    projects: /^(projects|personal\s+projects|key\s+projects)/i,
    education: /^(education|academic\s+background|qualification)/i,
    certifications: /^(certifications|licenses|courses|certificates)/i,
    awards: /^(awards|honors|achievements)/i,
    languages: /^(languages|spoken\s+languages)/i
  };

  for (const line of lines) {
    let matchedKey: string | null = null;
    for (const [key, regex] of Object.entries(headerRegexes)) {
      if (regex.test(line)) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      currentSection = matchedKey;
      sections[currentSection] = sections[currentSection] || '';
    } else {
      sections[currentSection] = (sections[currentSection] || '') + '\n' + line;
    }
  }

  return sections;
}

function parseWorkExperience(text: string): WorkExperience[] {
  if (!text.trim()) return [];
  const entries = text.split(/\n(?=[A-Z0-9].*?(?:20\d\d|19\d\d|Present))/i);
  
  return entries.map((entry, index) => {
    const lines = entry.split('\n').map(l => l.trim()).filter(Boolean);
    const titleLine = lines[0] || 'Software Engineer';
    const dateMatch = entry.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d\d|19\d\d)\s*[-–—\s]\s*(Present|Current|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d\d|19\d\d)/i);
    
    const bulletPoints = lines.filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || l.length > 20)
      .map(l => l.replace(/^[•\-\*]\s*/, ''));

    return {
      id: `exp_${index}_${Date.now()}`,
      company: titleLine.split(/[-|–,]/)[0]?.trim() || 'Tech Company',
      role: titleLine.split(/[-|–,]/)[1]?.trim() || titleLine,
      startDate: dateMatch ? dateMatch[1] : '2020',
      endDate: dateMatch ? dateMatch[2] : 'Present',
      location: 'Remote',
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : [entry.substring(0, 150)],
      technologiesUsed: extractSkillsFromText(entry).allSkills
    };
  });
}

function parseProjects(text: string): Project[] {
  if (!text.trim()) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return [{
    id: `proj_${Date.now()}`,
    title: lines[0] || 'Featured Project',
    description: lines.slice(1, 3).join(' '),
    bulletPoints: lines.filter(l => l.length > 20),
    technologies: extractSkillsFromText(text).allSkills
  }];
}

function parseEducation(text: string): Education[] {
  if (!text.trim()) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return [{
    id: `edu_${Date.now()}`,
    institution: lines[0] || 'University',
    degree: text.includes('Master') ? 'Master of Science' : 'Bachelor of Science',
    fieldOfStudy: text.includes('Computer') ? 'Computer Science' : 'Engineering',
    graduationYear: (text.match(/20\d\d/) || ['2022'])[0]
  }];
}

function parseCertifications(text: string): Certification[] {
  if (!text.trim()) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return lines.map((line, idx) => ({
    id: `cert_${idx}`,
    name: line,
    issuer: line.includes('AWS') ? 'Amazon Web Services' : line.includes('Google') ? 'Google' : 'Certified Issuer',
    dateIssued: '2023'
  }));
}

function parseListSection(text: string): string[] {
  return text.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
}

function calculateYearsOfExperience(experiences: WorkExperience[], rawText: string): number {
  const yearMatches = rawText.match(/\b(19\d\d|20\d\d)\b/g);
  if (!yearMatches || yearMatches.length < 2) return 3; // default estimate
  const years = yearMatches.map(Number).sort((a, b) => a - b);
  const span = years[years.length - 1] - years[0];
  return Math.max(1, Math.min(span, 25));
}

function detectLeadership(rawText: string, experiences: WorkExperience[]): boolean {
  const leadershipTerms = ['lead', 'manager', 'director', 'vp', 'head', 'architect', 'mentor', 'supervised', 'managed', 'coached'];
  return leadershipTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(rawText));
}

function detectIndustry(skills: string[], rawText: string): string {
  if (skills.some(s => ['React', 'TypeScript', 'Node.js', 'Python', 'Java', 'AWS'].includes(s))) {
    return 'Software Engineering & Tech';
  }
  if (rawText.toLowerCase().includes('data') || rawText.toLowerCase().includes('sql')) {
    return 'Data Science & Analytics';
  }
  return 'Technology';
}
