import { ParsedResume, JobDescription, AtsAnalysis, AtsCategoryScore } from '../types';

export function analyzeAtsScore(resume: ParsedResume, jd: JobDescription): AtsAnalysis {
  const categories: AtsAnalysis['categories'] = {
    resumeSections: scoreSections(resume),
    formatting: scoreFormatting(resume),
    keywords: scoreKeywords(resume, jd),
    experience: scoreExperience(resume, jd),
    actionVerbs: scoreActionVerbs(resume),
    education: scoreEducation(resume),
    projects: scoreProjects(resume),
    technologyStack: scoreTechStack(resume, jd),
    readability: scoreReadability(resume),
    sectionOrder: scoreSectionOrder(resume),
    bulletQuality: scoreBulletQuality(resume),
    achievements: scoreAchievements(resume),
    metricsUsage: scoreMetrics(resume)
  };

  let totalObtained = 0;
  let totalMax = 0;
  Object.values(categories).forEach(cat => {
    totalObtained += cat.score;
    totalMax += cat.maxScore;
  });

  const totalScore = Math.round((totalObtained / totalMax) * 100);

  const criticalIssues: string[] = [];
  const improvements: string[] = [];

  if (categories.metricsUsage.score < 7) {
    criticalIssues.push('Low usage of quantifiable metrics (%, $, numbers) in bullet points.');
  }
  if (categories.keywords.score < 12) {
    criticalIssues.push(`Missing several core keywords matching ${jd.company}'s job posting.`);
  }
  if (categories.bulletQuality.score < 7) {
    improvements.push('Begin more bullet points with high-impact action verbs.');
  }
  if (categories.technologyStack.score < 8) {
    improvements.push('Group technical skills clearly by languages, frameworks, and cloud tools.');
  }

  return {
    totalScore,
    categories,
    criticalIssues,
    improvements
  };
}

function scoreSections(resume: ParsedResume): AtsCategoryScore {
  let score = 0;
  const feedback: string[] = [];
  if (resume.summary) score += 2;
  if (resume.workExperience.length > 0) score += 3;
  if (resume.education.length > 0) score += 2;
  if (resume.skills.allSkills.length > 0) score += 2;
  if (resume.projects.length > 0) score += 1;

  return { category: 'Resume Sections', score, maxScore: 10, feedback: ['Summary, Experience, Education, and Skills present'] };
}

function scoreFormatting(resume: ParsedResume): AtsCategoryScore {
  const hasGraphics = /<svg|<img|table/i.test(resume.rawText);
  const score = hasGraphics ? 6 : 10;
  return {
    category: 'Formatting',
    score,
    maxScore: 10,
    feedback: hasGraphics ? ['Avoid complex tables or graphics for ATS parsers'] : ['Clean text format compatible with ATS standard readers']
  };
}

function scoreKeywords(resume: ParsedResume, jd: JobDescription): AtsCategoryScore {
  const resumeSkills = new Set(resume.skills.allSkills.map(s => s.toLowerCase()));
  const matches = jd.keywords.filter(k => resumeSkills.has(k.toLowerCase()));
  const ratio = jd.keywords.length > 0 ? matches.length / jd.keywords.length : 0.8;
  const score = Math.min(15, Math.round(ratio * 15));
  return {
    category: 'Keywords',
    score,
    maxScore: 15,
    feedback: [`Matched ${matches.length} out of ${jd.keywords.length} target keywords`]
  };
}

function scoreExperience(resume: ParsedResume, jd: JobDescription): AtsCategoryScore {
  const metYears = resume.yearsOfExperience >= jd.yearsOfExperienceRequired;
  const score = metYears ? 10 : Math.max(4, 10 - (jd.yearsOfExperienceRequired - resume.yearsOfExperience) * 2);
  return {
    category: 'Experience',
    score,
    maxScore: 10,
    feedback: [metYears ? 'Meets or exceeds required experience level' : 'Slightly below target years of experience']
  };
}

function scoreActionVerbs(resume: ParsedResume): AtsCategoryScore {
  const count = resume.actionVerbsUsed.length;
  const score = count >= 8 ? 10 : Math.max(3, count * 1.2);
  return {
    category: 'Action Verbs',
    score: Math.round(score),
    maxScore: 10,
    feedback: [`Identified ${count} strong action verbs across work experience`]
  };
}

function scoreEducation(resume: ParsedResume): AtsCategoryScore {
  const score = resume.education.length > 0 ? 5 : 2;
  return { category: 'Education', score, maxScore: 5, feedback: ['Education section clearly structured'] };
}

function scoreProjects(resume: ParsedResume): AtsCategoryScore {
  const score = resume.projects.length > 0 ? 5 : 2;
  return { category: 'Projects', score, maxScore: 5, feedback: ['Technical projects demonstrate practical execution'] };
}

function scoreTechStack(resume: ParsedResume, jd: JobDescription): AtsCategoryScore {
  const score = resume.skills.allSkills.length >= 10 ? 10 : 6;
  return { category: 'Technology Stack', score, maxScore: 10, feedback: ['Comprehensive skill categorization'] };
}

function scoreReadability(resume: ParsedResume): AtsCategoryScore {
  const words = resume.rawText.trim().split(/\s+/).filter(Boolean).length;
  let totalBullets = 0;
  resume.workExperience.forEach(e => totalBullets += e.bulletPoints.length);
  const avgWordsPerBullet = totalBullets > 0 ? Math.round(words / totalBullets) : 15;
  const isOptimal = avgWordsPerBullet >= 10 && avgWordsPerBullet <= 30;
  const score = isOptimal ? 5 : Math.max(2, 5 - Math.abs(avgWordsPerBullet - 20) / 5);
  return {
    category: 'Readability',
    score: Math.round(score),
    maxScore: 5,
    feedback: [isOptimal ? `Optimal sentence flow (~${avgWordsPerBullet} words per section)` : `Sentence density is ${avgWordsPerBullet > 30 ? 'too dense' : 'too short'}`]
  };
}

function scoreSectionOrder(resume: ParsedResume): AtsCategoryScore {
  const text = resume.rawText.toLowerCase();
  const expIdx = text.indexOf('experience') !== -1 ? text.indexOf('experience') : text.indexOf('work');
  const eduIdx = text.indexOf('education');
  const skillIdx = text.indexOf('skill');

  let score = 10;
  const feedback: string[] = [];

  if (expIdx !== -1 && eduIdx !== -1 && expIdx > eduIdx) {
    score -= 2;
    feedback.push('Consider placing Work Experience before Education for standard ATS parsing');
  } else {
    feedback.push('Standard ATS section hierarchy verified');
  }

  return { category: 'Section Order', score: Math.max(4, score), maxScore: 10, feedback };
}

function scoreBulletQuality(resume: ParsedResume): AtsCategoryScore {
  let strongBullets = 0;
  let totalBullets = 0;
  resume.workExperience.forEach(exp => {
    exp.bulletPoints.forEach(b => {
      totalBullets++;
      if (b.length > 30 && b.length < 180) strongBullets++;
    });
  });
  const ratio = totalBullets > 0 ? strongBullets / totalBullets : 0.8;
  return { category: 'Bullet Quality', score: Math.round(ratio * 10), maxScore: 10, feedback: [`${Math.round(ratio * 100)}% of bullet points have optimal character length`] };
}

function scoreAchievements(resume: ParsedResume): AtsCategoryScore {
  const hasMetrics = /\d+%|\$\d+|\b(increased|decreased|reduced|improved)\b/i.test(resume.rawText);
  return { category: 'Achievements', score: hasMetrics ? 5 : 2, maxScore: 5, feedback: [hasMetrics ? 'Demonstrates quantifiable outcome achievements' : 'Add more impact driven statements'] };
}

function scoreMetrics(resume: ParsedResume): AtsCategoryScore {
  const matches = (resume.rawText.match(/\b\d+(?:%|\s*k|\s*m|\s*users|\s*ms)?\b/gi) || []).length;
  const score = Math.min(5, Math.max(1, Math.round(matches / 2)));
  return { category: 'Metrics Usage', score, maxScore: 5, feedback: [`Detected ${matches} instances of numeric metrics`] };
}
