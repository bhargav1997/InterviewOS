import { ParsedResume, JobDescription, MatchAnalysis, CoverLetter, CoverLetterTone } from '../types';

function extractCompanySignals(jd: JobDescription): string {
  const text = jd.rawText.toLowerCase();
  if (text.includes('mission') || text.includes('impact')) return 'mission-driven impact';
  if (text.includes('scale') || text.includes('millions')) return 'engineering at scale';
  if (text.includes('fast') || text.includes('move quickly')) return 'rapid product iteration';
  if (text.includes('collaborate') || text.includes('cross-functional')) return 'cross-functional collaboration';
  return 'engineering excellence';
}

function getBestMatchingExperience(resume: ParsedResume, match: MatchAnalysis): string {
  // Find the experience that has the most matching tech
  const bestExp = resume.workExperience[0];
  if (!bestExp) return 'my previous engineering role';
  const relevantBullet = bestExp.bulletPoints.find(b => /\d/.test(b)) || bestExp.bulletPoints[0];
  return relevantBullet
    ? `At ${bestExp.company}, ${relevantBullet.substring(0, 120).toLowerCase()}...`
    : `my ${resume.yearsOfExperience}+ years at ${bestExp.company}`;
}

function getTopMissingSkill(match: MatchAnalysis): string | null {
  return match.missingTechnologies.length > 0 ? match.missingTechnologies[0] : null;
}

export function generateCoverLetter(
  resume: ParsedResume,
  jd: JobDescription,
  match: MatchAnalysis,
  tone: CoverLetterTone = 'professional'
): CoverLetter {
  const name = resume.contactInfo.name || 'Candidate';
  const email = resume.contactInfo.email || '';
  const topSkills = match.matchingTechnologies.slice(0, 3).join(', ');
  const missingSkill = getTopMissingSkill(match);
  const companySignal = extractCompanySignals(jd);
  const bestExp = getBestMatchingExperience(resume, match);

  const toneMap = {
    professional: {
      opener: 'I am writing to express my interest in',
      excitement: 'I am particularly drawn to',
      close: 'I look forward to discussing how my background can contribute to',
    },
    enthusiastic: {
      opener: 'I\'m genuinely excited to apply for',
      excitement: 'What energizes me most about',
      close: 'I\'d love to connect and explore how I can help',
    },
    direct: {
      opener: 'I\'m a strong candidate for',
      excitement: 'The reason I\'m applying specifically to',
      close: 'I\'m confident I can hit the ground running at',
    }
  };

  const t = toneMap[tone];

  const opening = `${t.opener} the ${jd.title} position at ${jd.company}.

${t.excitement} ${jd.company} is your focus on ${companySignal}${topSkills ? ` and the opportunity to work with ${topSkills}` : ''}. With ${resume.yearsOfExperience}+ years of hands-on engineering experience, I bring both the technical depth and the collaborative mindset your team needs.`;

  const body1 = `In my recent experience, ${bestExp}

My track record includes ${topSkills || jd.requiredSkills.slice(0, 3).join(', ')} — directly aligning with the core requirements outlined in your posting. I'm especially excited about the chance to apply this expertise at the scale ${jd.company} operates.`;

  const body2 = missingSkill
    ? `While I'm actively deepening my expertise in ${missingSkill}, my foundation in adjacent technologies means I can contribute immediately while closing this gap quickly — I've consistently done this throughout my career when stepping into new technical domains.`
    : `Beyond technical skills, I bring strong communication and cross-functional collaboration experience. I believe great engineering isn't just about code — it's about understanding the product, aligning with stakeholders, and shipping with confidence.`;

  const closing = `${t.close} ${jd.company}. I'd welcome the chance to learn more about the team's goals and share more about how I can help achieve them.

Sincerely,
${name}${email ? `\n${email}` : ''}${resume.contactInfo.linkedin ? `\n${resume.contactInfo.linkedin}` : ''}`;

  const fullText = [opening, body1, body2, closing].join('\n\n');

  return {
    tone,
    recipientName: `Hiring Manager at ${jd.company}`,
    opening,
    body1,
    body2,
    closing,
    fullText: `Dear Hiring Manager,\n\n${fullText}`,
  };
}
