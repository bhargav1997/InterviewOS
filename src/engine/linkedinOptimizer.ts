import { ParsedResume, JobDescription, LinkedInProfile, LinkedInHeadline } from '../types';

export function generateLinkedInProfile(
  resume: ParsedResume,
  jd?: JobDescription | null
): LinkedInProfile {
  // Extract details entirely from the resume
  const name = resume.contactInfo.name || 'Engineer';
  const role = resume.workExperience[0]?.role || resume.industry || 'Software Engineer';
  const company = resume.workExperience[0]?.company || '';
  const years = resume.yearsOfExperience || 3;

  // Extract skills entirely from the resume taxonomy
  const topLang = resume.skills.programmingLanguages[0] || 'TypeScript';
  const topFramework = resume.skills.frameworks[0] || 'React';
  const topCloud = resume.skills.cloudTechnologies[0] || 'AWS';
  const topDb = resume.skills.databases[0] || 'PostgreSQL';

  // Gather a balanced set of top skills from the resume
  const topSkills = [
    ...resume.skills.programmingLanguages.slice(0, 3),
    ...resume.skills.frameworks.slice(0, 2),
    ...resume.skills.cloudTechnologies.slice(0, 1)
  ].filter(Boolean);

  if (topSkills.length === 0) {
    topSkills.push('Software Engineering', 'System Design', 'Agile Development');
  }

  // ─── 3 Headline Variants based on Resume ──────────────────────────────────
  const headlines: LinkedInHeadline[] = [
    {
      variant: 'Role + Core Stack + Value',
      text: `${role} | ${topSkills.slice(0, 4).join(' · ')} | Delivering Scalable Software Solutions`,
      explanation: 'Search-optimized: lists your actual job title and top resume skills. Best for recruiter searches.'
    },
    {
      variant: 'Experience + Stack + Focus',
      text: `${years}+ Years Experience | ${role} ${company ? `@ ${company}` : ''} | ${topLang}, ${topFramework}, ${topCloud}, ${topDb}`,
      explanation: 'Credential-focused: highlights your total years of experience, current/past employer, and primary tech stack.'
    },
    {
      variant: 'Value-First / Problem Solver',
      text: `${role} | Specializing in ${topLang}/${topFramework} & Cloud Architecture | Building High-Performance Applications`,
      explanation: 'Value-first: emphasizes the specific domains and engineering practices you excel in.'
    }
  ];

  // ─── LinkedIn Summary (About Section) based on Resume ───────────────────
  const summary = `I'm a passionate ${role} with ${years}+ years of professional experience building and scaling software products. Over my career, I've developed deep expertise in ${topSkills.join(', ')}.

Technical Stack:
• Languages: ${resume.skills.programmingLanguages.slice(0, 5).join(', ') || 'JavaScript, TypeScript'}
• Frameworks/Libraries: ${resume.skills.frameworks.slice(0, 5).join(', ') || 'React, Node.js'}
• Cloud/DevOps: ${resume.skills.cloudTechnologies.slice(0, 4).join(', ') || 'AWS, Docker'}
• Databases: ${resume.skills.databases.slice(0, 4).join(', ') || 'PostgreSQL, MongoDB'}

What I bring to a team:
→ Pragmatic problem-solving: Designing architectures that scale but remain clean and maintainable.
→ Strong technical ownership: Delivering robust, fully-tested features from discovery through to deployment.
→ Collaborative mindset: Mentoring peers, participating in high-value code reviews, and aligning with product stakeholders.

${resume.workExperience[0] ? `In my current role at ${resume.workExperience[0].company}, I ${resume.workExperience[0].bulletPoints[0]?.toLowerCase() || 'own the development of critical frontend/backend services'}.` : ''}

I'm always excited to connect with other builders, discuss engineering challenges, or explore new opportunities. Feel free to connect or reach out!`;

  // ─── Skills strategy based on Resume ─────────────────────────────────────
  // Recommend highlighting these skills in the LinkedIn "Skills" section
  const skillsToAdd = [
    ...resume.skills.programmingLanguages.slice(0, 4),
    ...resume.skills.frameworks.slice(0, 4),
    ...resume.skills.cloudTechnologies.slice(0, 2)
  ].filter(Boolean);

  const skillsToReorder = topSkills;

  // ─── Featured Section Suggestions based on Resume projects ────────────────
  const featuredSuggestions: string[] = [];
  if (resume.projects.length > 0) {
    featuredSuggestions.push(`Pin a link or demo of your project "${resume.projects[0].title}" — it showcases your practical skills in ${resume.projects[0].technologies.slice(0, 3).join('/')}`);
  }
  if (resume.contactInfo.github) {
    featuredSuggestions.push(`Feature your GitHub profile (${resume.contactInfo.github}) to highlight your open-source contributions`);
  }
  featuredSuggestions.push(`Write a short LinkedIn post about your experience working with ${topLang} and ${topFramework} — active profiles get 3x more recruiter views`);
  featuredSuggestions.push(`Feature testimonials or recommendations from colleagues at ${company || 'your previous roles'} to build social proof`);

  // ─── Recruiter outreach template based on Resume ─────────────────────────
  const targetRoleName = jd?.title || role;
  const targetCompany = jd?.company || 'your company';
  const connectionMessage = `Hi [Name], I noticed you recruit for engineering roles at ${targetCompany}. I'm a ${role} specializing in ${topLang} and ${topFramework} with ${years}+ years of experience. I'd love to connect to keep in touch for future opportunities on your team. Thanks!`;

  return {
    headlines,
    summary,
    aboutSection: summary,
    skillsToAdd,
    skillsToReorder,
    featuredSuggestions,
    connectionMessage,
  };
}
