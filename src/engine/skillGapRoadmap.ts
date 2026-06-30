import { MatchAnalysis, JobDescription, SkillGapItem, LearningResource } from '../types';

type SkillDb = Record<string, {
  priority: 'Must-Have' | 'Nice-to-Have' | 'Bonus';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToLearn: string;
  quickWin: boolean;
  description: string;
  resources: LearningResource[];
}>;

const SKILL_DATABASE: SkillDb = {
  'Docker': {
    priority: 'Must-Have', difficulty: 'Beginner', timeToLearn: '1–2 weeks', quickWin: true,
    description: 'Container runtime for packaging and running applications consistently across environments.',
    resources: [
      { name: 'Docker Official Get Started', url: 'https://docs.docker.com/get-started/', type: 'docs', free: true, timeEstimate: '3 hours' },
      { name: 'Docker for Developers (YouTube)', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', type: 'video', free: true, timeEstimate: '2 hours' },
      { name: 'Build a Dockerized Node.js App', url: 'https://nodejs.org/en/docs/guides/nodejs-docker-webapp', type: 'project', free: true, timeEstimate: '4 hours' },
    ]
  },
  'Kubernetes': {
    priority: 'Must-Have', difficulty: 'Advanced', timeToLearn: '4–6 weeks', quickWin: false,
    description: 'Container orchestration platform for deploying and scaling containerized applications.',
    resources: [
      { name: 'Kubernetes Official Tutorials', url: 'https://kubernetes.io/docs/tutorials/', type: 'docs', free: true, timeEstimate: '8 hours' },
      { name: 'Kubernetes for Absolute Beginners', url: 'https://www.udemy.com/course/learn-kubernetes/', type: 'course', free: false, timeEstimate: '6 hours' },
      { name: 'Play with Kubernetes', url: 'https://labs.play-with-k8s.com/', type: 'project', free: true, timeEstimate: '3 hours' },
    ]
  },
  'GraphQL': {
    priority: 'Nice-to-Have', difficulty: 'Intermediate', timeToLearn: '1–2 weeks', quickWin: true,
    description: 'API query language enabling clients to request exactly the data they need.',
    resources: [
      { name: 'How to GraphQL', url: 'https://www.howtographql.com/', type: 'course', free: true, timeEstimate: '5 hours' },
      { name: 'GraphQL Docs', url: 'https://graphql.org/learn/', type: 'docs', free: true, timeEstimate: '2 hours' },
      { name: 'Build a GraphQL API with Node.js', url: 'https://www.apollographql.com/docs/apollo-server/', type: 'project', free: true, timeEstimate: '4 hours' },
    ]
  },
  'AWS': {
    priority: 'Must-Have', difficulty: 'Intermediate', timeToLearn: '3–4 weeks', quickWin: false,
    description: 'Amazon\'s cloud platform — S3, Lambda, EC2, RDS, and 200+ services.',
    resources: [
      { name: 'AWS Free Tier Hands-On', url: 'https://aws.amazon.com/free/', type: 'project', free: true, timeEstimate: '10 hours' },
      { name: 'AWS Cloud Practitioner (Stephane Maarek)', url: 'https://www.udemy.com/course/aws-certified-cloud-practitioner-new/', type: 'course', free: false, timeEstimate: '14 hours' },
      { name: 'AWS Official Tutorials', url: 'https://aws.amazon.com/getting-started/', type: 'docs', free: true, timeEstimate: '5 hours' },
    ]
  },
  'TypeScript': {
    priority: 'Must-Have', difficulty: 'Beginner', timeToLearn: '3–5 days', quickWin: true,
    description: 'Typed superset of JavaScript — catching errors at compile time, improving code quality.',
    resources: [
      { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/', type: 'docs', free: true, timeEstimate: '4 hours' },
      { name: 'TypeScript for JavaScript Programmers', url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html', type: 'docs', free: true, timeEstimate: '1 hour' },
      { name: 'Total TypeScript (Free Tutorials)', url: 'https://www.totaltypescript.com/tutorials', type: 'course', free: true, timeEstimate: '6 hours' },
    ]
  },
  'Redis': {
    priority: 'Nice-to-Have', difficulty: 'Beginner', timeToLearn: '3–5 days', quickWin: true,
    description: 'In-memory data structure store used for caching, sessions, and real-time leaderboards.',
    resources: [
      { name: 'Redis University (Free)', url: 'https://university.redis.com/', type: 'course', free: true, timeEstimate: '4 hours' },
      { name: 'Redis Quick Start', url: 'https://redis.io/docs/getting-started/', type: 'docs', free: true, timeEstimate: '1 hour' },
    ]
  },
  'PostgreSQL': {
    priority: 'Must-Have', difficulty: 'Intermediate', timeToLearn: '1–2 weeks', quickWin: false,
    description: 'Advanced relational database with strong ACID compliance and JSON support.',
    resources: [
      { name: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', type: 'docs', free: true, timeEstimate: '5 hours' },
      { name: 'PG Exercises', url: 'https://pgexercises.com/', type: 'project', free: true, timeEstimate: '4 hours' },
    ]
  },
  'Python': {
    priority: 'Must-Have', difficulty: 'Beginner', timeToLearn: '2–3 weeks', quickWin: false,
    description: 'Versatile language used in backend, data science, scripting, and ML.',
    resources: [
      { name: 'Python.org Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'docs', free: true, timeEstimate: '8 hours' },
      { name: 'Automate the Boring Stuff (Free)', url: 'https://automatetheboringstuff.com/', type: 'book', free: true, timeEstimate: '15 hours' },
      { name: 'Exercism Python Track', url: 'https://exercism.org/tracks/python', type: 'project', free: true, timeEstimate: '10 hours' },
    ]
  },
  'React': {
    priority: 'Must-Have', difficulty: 'Intermediate', timeToLearn: '2–3 weeks', quickWin: false,
    description: 'Facebook\'s UI library for building component-based web applications.',
    resources: [
      { name: 'React Official Docs (react.dev)', url: 'https://react.dev/learn', type: 'docs', free: true, timeEstimate: '6 hours' },
      { name: 'Build a React App from Scratch', url: 'https://react.dev/learn/tutorial-tic-tac-toe', type: 'project', free: true, timeEstimate: '3 hours' },
    ]
  },
  'Go': {
    priority: 'Nice-to-Have', difficulty: 'Intermediate', timeToLearn: '2–3 weeks', quickWin: false,
    description: 'Google\'s statically typed compiled language, popular for microservices and CLIs.',
    resources: [
      { name: 'A Tour of Go', url: 'https://tour.golang.org/', type: 'docs', free: true, timeEstimate: '5 hours' },
      { name: 'Go by Example', url: 'https://gobyexample.com/', type: 'docs', free: true, timeEstimate: '4 hours' },
    ]
  },
  'Terraform': {
    priority: 'Nice-to-Have', difficulty: 'Intermediate', timeToLearn: '1–2 weeks', quickWin: false,
    description: 'Infrastructure-as-Code tool for provisioning cloud resources declaratively.',
    resources: [
      { name: 'HashiCorp Learn (Terraform)', url: 'https://learn.hashicorp.com/terraform', type: 'docs', free: true, timeEstimate: '6 hours' },
      { name: 'Terraform: Up and Running', url: 'https://www.terraformupandrunning.com/', type: 'book', free: false, timeEstimate: '12 hours' },
    ]
  },
};

function getDefaultSkillEntry(skill: string): SkillGapItem {
  return {
    skill,
    priority: 'Nice-to-Have',
    difficulty: 'Intermediate',
    timeToLearn: '1–3 weeks',
    quickWin: false,
    description: `${skill} is listed as a requirement for this role. Building hands-on experience through projects is the fastest path.`,
    resources: [
      { name: `${skill} Official Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation')}`, type: 'docs', free: true, timeEstimate: '2-4 hours' },
      { name: `${skill} Tutorial on YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial for beginners')}`, type: 'video', free: true, timeEstimate: '2 hours' },
    ],
  };
}

export function buildSkillGapRoadmap(match: MatchAnalysis, jd: JobDescription): SkillGapItem[] {
  const gaps = match.missingTechnologies.length > 0
    ? match.missingTechnologies
    : match.importantKeywordsMissing;

  // Categorize: required skills get Must-Have priority
  const requiredSet = new Set(jd.requiredSkills.map(s => s.toLowerCase()));
  const niceToHaveSet = new Set(jd.niceToHaveSkills.map(s => s.toLowerCase()));

  return gaps.map(skill => {
    const dbEntry = SKILL_DATABASE[skill] || getDefaultSkillEntry(skill);
    const isRequired = requiredSet.has(skill.toLowerCase());
    const isNiceToHave = niceToHaveSet.has(skill.toLowerCase());

    return {
      ...dbEntry,
      skill,
      priority: isRequired ? 'Must-Have' : isNiceToHave ? 'Nice-to-Have' : dbEntry.priority,
    };
  }).sort((a, b) => {
    const order = { 'Must-Have': 0, 'Nice-to-Have': 1, 'Bonus': 2 };
    if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
    // Within same priority, quick wins first
    return Number(b.quickWin) - Number(a.quickWin);
  });
}
