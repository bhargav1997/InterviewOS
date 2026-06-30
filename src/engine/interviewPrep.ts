import { ParsedResume, JobDescription, InterviewPrepKit, InterviewQuestion, StarStory, ResearchItem } from '../types';

// ─── Behavioral Question Templates ───────────────────────────────────────────
const BEHAVIORAL_TEMPLATES = [
  { q: 'Tell me about a time you had to meet a tight deadline. How did you handle it?', hint: 'Focus on prioritization, communication with stakeholders, and the outcome.', difficulty: 'Medium' as const },
  { q: 'Describe a situation where you had to work with a difficult teammate. What happened?', hint: 'Show empathy, conflict resolution, and how the team outcome improved.', difficulty: 'Medium' as const },
  { q: 'Tell me about the most complex technical problem you\'ve solved. Walk me through your approach.', hint: 'Structure: problem scope → your investigation → solution → impact.', difficulty: 'Hard' as const },
  { q: 'Give me an example of a time you failed. What did you learn?', hint: 'Recruiters want growth mindset. Own the failure, show what changed.', difficulty: 'Medium' as const },
  { q: 'Tell me about a project you\'re most proud of and why.', hint: 'Choose a project with measurable impact and your direct ownership.', difficulty: 'Easy' as const },
  { q: 'Describe a time you had to learn a new technology very quickly. How did you do it?', hint: 'Show resourcefulness: docs, community, side projects, fast iteration.', difficulty: 'Easy' as const },
  { q: 'Tell me about a time you disagreed with a decision. How did you handle it?', hint: 'Show you can advocate professionally, then commit to the team decision.', difficulty: 'Hard' as const },
  { q: 'Describe a time you had to balance multiple priorities. How did you manage?', hint: 'Talk about your prioritization framework (urgency/importance, stakeholder alignment).', difficulty: 'Medium' as const },
];

const SITUATIONAL_TEMPLATES = [
  { q: 'If you joined our team and discovered a major bug in production on day 1, what would you do?', hint: 'Show calm under pressure: triage, communicate, fix, post-mortem mindset.', difficulty: 'Hard' as const },
  { q: 'How would you approach onboarding to a large codebase you\'ve never seen before?', hint: 'Read docs → run locally → trace a feature end-to-end → talk to the team.', difficulty: 'Medium' as const },
  { q: 'If your manager asked you to build a feature you thought was technically infeasible, what would you do?', hint: 'Show you push back with data, propose alternatives, align on tradeoffs.', difficulty: 'Medium' as const },
  { q: 'How would you design a system that needs to handle 10x more traffic next year?', hint: 'Think horizontal scaling, caching layers, async queues, observability.', difficulty: 'Hard' as const },
];

const COMPANY_TEMPLATES = [
  'Why do you want to work at {company} specifically, not a competitor?',
  'What do you know about {company}\'s core product and who are its main customers?',
  'How does your background align with {company}\'s engineering culture?',
  'What\'s your understanding of the biggest technical challenge {company} is solving?',
  'Where do you see {company} in 5 years and how would you contribute to that?',
];

const QUESTIONS_TO_ASK = [
  'What does success look like for this role in the first 90 days?',
  'What\'s the biggest technical challenge the team is facing right now?',
  'How does the team handle code reviews and knowledge sharing?',
  'What\'s your deployment process and how frequently does the team ship?',
  'What does the on-call rotation look like for this team?',
  'How does the team balance new features vs. technical debt?',
  'What opportunities are there for growth and advancement in this role?',
  'How does the engineering team collaborate with product and design?',
  'What made you personally choose to work at this company?',
  'What tools and processes does the team use for project management?',
];

function generateTechnicalQuestions(jd: JobDescription): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  const skills = jd.technologies.all.slice(0, 6);

  const technicalPatterns = [
    (s: string) => ({ q: `Explain how you would debug a memory leak in a ${s} application.`, hint: `Talk about profiling tools, heap dumps, and your systematic debugging process.` }),
    (s: string) => ({ q: `How have you used ${s} to solve a real production problem? What were the tradeoffs?`, hint: `Be specific: what problem, why ${s}, what alternatives did you consider.` }),
    (s: string) => ({ q: `What are the common performance pitfalls in ${s} and how do you avoid them?`, hint: `Show depth: don't just name problems, explain your prevention strategy.` }),
    (s: string) => ({ q: `How would you architect a system using ${s} for high availability?`, hint: `Think: replication, failover, circuit breakers, monitoring.` }),
  ];

  skills.forEach((skill, i) => {
    const pattern = technicalPatterns[i % technicalPatterns.length](skill);
    questions.push({
      id: `tech_${i}`,
      category: 'Technical',
      question: pattern.q,
      hint: pattern.hint,
      difficulty: i < 2 ? 'Medium' : 'Hard',
    });
  });

  // Add role-specific questions from JD responsibilities
  jd.responsibilities.slice(0, 3).forEach((resp, i) => {
    if (resp.length > 20) {
      questions.push({
        id: `role_${i}`,
        category: 'Role-Specific',
        question: `In your previous experience, how have you handled: "${resp.substring(0, 80)}..."?`,
        hint: 'Use the STAR method. Connect your experience directly to this responsibility.',
        difficulty: 'Medium',
      });
    }
  });

  return questions;
}

function buildStarStories(resume: ParsedResume): StarStory[] {
  const stories: StarStory[] = [];

  for (const exp of resume.workExperience) {
    for (let i = 0; i < Math.min(3, exp.bulletPoints.length); i++) {
      const bullet = exp.bulletPoints[i].trim();
      if (!bullet || bullet.length < 15) continue;

      stories.push({
        bulletId: `story_${exp.id}_${i}`,
        experienceId: exp.id,
        company: exp.company,
        role: exp.role,
        originalBullet: bullet,
        scaffold: {
          situation: `At ${exp.company}, our team was facing [describe the specific context or challenge]...`,
          task: `My responsibility was to [what you were asked to do or owned]...`,
          action: `I [strong action verb] by [specific steps you took, tools used, decisions made]...`,
          result: `The outcome was [quantify: %, time saved, users impacted, revenue, etc]...`,
        }
      });
    }
  }

  return stories;
}

function buildResearchChecklist(jd: JobDescription, resume: ParsedResume): ResearchItem[] {
  const company = jd.company;
  return [
    {
      category: 'Company Fundamentals',
      icon: '🏢',
      items: [
        `What does ${company} do — their core product and target customer`,
        `${company}'s mission statement and company values (usually on their About page)`,
        `${company}'s most recent news, product launches, or press releases`,
        `Who are ${company}'s main competitors and how do they differentiate?`,
        `${company}'s approximate ARR / user base / scale (check Crunchbase, LinkedIn)`,
      ]
    },
    {
      category: 'Engineering Culture',
      icon: '⚙️',
      items: [
        `Check ${company}'s engineering blog for how they solve technical problems`,
        `Look for ${company} engineers on LinkedIn — what's their background?`,
        `Find ${company} talks on YouTube or tech conference videos`,
        `Check Glassdoor reviews specifically from engineers at ${company}`,
        `Look at ${company}'s open-source GitHub repos if any`,
      ]
    },
    {
      category: 'The Role',
      icon: '🎯',
      items: [
        `Re-read the job description — underline every skill and responsibility`,
        `Map each JD requirement to a specific story from your resume`,
        `Identify 1-2 areas where you're not a perfect fit — prepare honest answers`,
        `Research the team if named in the JD — look up interviewers on LinkedIn`,
        `Prepare specific examples for every "required" skill in the JD`,
      ]
    },
    {
      category: 'Market Context',
      icon: '📊',
      items: [
        `What is the market salary range for ${jd.title} at ${company}'s size? (Levels.fyi, Glassdoor)`,
        `What's the average tenure for engineers at ${company}? (LinkedIn)`,
        `Is ${company} growing or contracting? (Check recent funding, layoffs news)`,
        `Look at ${company}'s tech stack on StackShare or their job descriptions`,
      ]
    }
  ];
}

export function buildInterviewPrepKit(resume: ParsedResume, jd: JobDescription): InterviewPrepKit {
  // Behavioral questions (universal)
  const behavioralQs: InterviewQuestion[] = BEHAVIORAL_TEMPLATES.map((t, i) => ({
    id: `beh_${i}`,
    category: 'Behavioral' as const,
    question: t.q,
    hint: t.hint,
    difficulty: t.difficulty,
    starScaffold: {
      situation: 'At [Company], we were facing [challenge/context]...',
      task: 'I was responsible for [what you specifically owned]...',
      action: 'I [action verb] by [specific steps, decisions, tools]...',
      result: 'The result was [quantify: %, time, users, revenue, team impact]...',
    }
  }));

  // Situational questions
  const situationalQs: InterviewQuestion[] = SITUATIONAL_TEMPLATES.map((t, i) => ({
    id: `sit_${i}`,
    category: 'Situational' as const,
    question: t.q,
    hint: t.hint,
    difficulty: t.difficulty,
  }));

  // Company-specific questions
  const companyQs: InterviewQuestion[] = COMPANY_TEMPLATES.map((template, i) => ({
    id: `co_${i}`,
    category: 'Company' as const,
    question: template.replace(/{company}/g, jd.company),
    hint: `Research ${jd.company}'s blog, mission page, and recent news before answering this.`,
    difficulty: 'Medium' as const,
  }));

  // Technical + Role-specific questions
  const technicalQs = generateTechnicalQuestions(jd);

  // STAR stories from resume bullets
  const starStories = buildStarStories(resume);

  // Research checklist
  const researchChecklist = buildResearchChecklist(jd, resume);

  return {
    predictedQuestions: [...behavioralQs, ...situationalQs, ...companyQs, ...technicalQs],
    starStories,
    researchChecklist,
    questionsToAsk: QUESTIONS_TO_ASK,
  };
}
