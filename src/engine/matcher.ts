import { ParsedResume, JobDescription, MatchAnalysis } from '../types';

export function analyzeMatch(resume: ParsedResume, jd: JobDescription): MatchAnalysis {
  const resumeSkillsSet = new Set(resume.skills.allSkills.map(s => s.toLowerCase()));
  const jdSkillsSet = new Set(jd.keywords.map(k => k.toLowerCase()));
  
  // Calculate matching vs missing technologies
  const matchingTechnologies: string[] = [];
  const missingTechnologies: string[] = [];

  jd.keywords.forEach(tech => {
    if (resumeSkillsSet.has(tech.toLowerCase())) {
      matchingTechnologies.push(tech);
    } else {
      missingTechnologies.push(tech);
    }
  });

  // Skill match score
  const skillMatchScore = jd.keywords.length > 0 
    ? Math.round((matchingTechnologies.length / jd.keywords.length) * 100)
    : 85;

  // Keyword match score
  const keywordMatchScore = Math.min(100, Math.round(skillMatchScore * 1.05));

  // Experience match score
  const expDiff = resume.yearsOfExperience - jd.yearsOfExperienceRequired;
  const experienceMatchScore = expDiff >= 0 ? 100 : Math.max(50, 100 + expDiff * 15);

  // Education & Project match scores
  const educationMatchScore = resume.education.length > 0 ? 95 : 70;
  const projectMatchScore = resume.projects.length > 0 ? 90 : 65;

  // Overall weighted match score
  const overallMatchScore = Math.round(
    skillMatchScore * 0.4 +
    keywordMatchScore * 0.2 +
    experienceMatchScore * 0.2 +
    educationMatchScore * 0.1 +
    projectMatchScore * 0.1
  );

  // Analyze weak bullet points
  const weakBulletPoints: { experienceId: string; bullet: string; reason: string }[] = [];
  resume.workExperience.forEach(exp => {
    exp.bulletPoints.forEach(bullet => {
      const hasNumber = /\d+/.test(bullet);
      const isShort = bullet.length < 40;
      if (!hasNumber || isShort) {
        weakBulletPoints.push({
          experienceId: exp.id,
          bullet,
          reason: !hasNumber ? 'Lacks quantifiable metrics (e.g. %, $, numbers)' : 'Bullet point is too brief'
        });
      }
    });
  });

  // Duplicate skills detection
  const duplicateSkills = resume.skills.allSkills.filter(
    (item, index) => resume.skills.allSkills.findIndex(s => s.toLowerCase() === item.toLowerCase()) !== index
  );

  // Missing action verbs
  const missingActionVerbs = jd.actionVerbs.filter(verb => !resume.actionVerbsUsed.includes(verb));

  // Word count & page length estimation
  const wordCount = resume.rawText.split(/\s+/).length;
  const estimatedPages = Math.ceil(wordCount / 450);
  const status = wordCount < 300 ? 'Too Short' : wordCount > 1000 ? 'Too Long' : 'Optimal';

  // Keyword density
  const keywordDensity = matchingTechnologies.slice(0, 8).map(tech => {
    const regex = new RegExp(`\\b${tech}\\b`, 'gi');
    const count = (resume.rawText.match(regex) || []).length;
    return {
      keyword: tech,
      count,
      densityPercent: Number(((count / Math.max(1, wordCount)) * 100).toFixed(2))
    };
  });

  return {
    overallMatchScore,
    skillMatchScore,
    keywordMatchScore,
    experienceMatchScore,
    educationMatchScore,
    projectMatchScore,
    missingTechnologies,
    matchingTechnologies,
    duplicateSkills,
    missingActionVerbs: missingActionVerbs.slice(0, 10),
    weakBulletPoints: weakBulletPoints.slice(0, 5),
    resumeLengthAnalysis: {
      wordCount,
      estimatedPages,
      status
    },
    formattingScore: Math.max(60, Math.round(100 - (weakBulletPoints.length * 5) - (duplicateSkills.length * 3))),
    atsCompatibilityScore: Math.min(100, Math.round(overallMatchScore * 0.85 + skillMatchScore * 0.15)),
    keywordDensity,
    importantKeywordsMissing: missingTechnologies.slice(0, 8),
    repeatedKeywords: Array.from(new Set(duplicateSkills)),
    skillCoveragePercent: skillMatchScore,
    industryAlignmentScore: Math.min(100, Math.round(skillMatchScore * 0.9 + (resume.yearsOfExperience > 0 ? 10 : 0))),
    leadershipAlignmentScore: resume.hasLeadershipExperience ? 95 : 70
  };
}
