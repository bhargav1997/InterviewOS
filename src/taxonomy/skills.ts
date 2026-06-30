export interface SkillTaxonomy {
  programmingLanguages: string[];
  frameworks: string[];
  libraries: string[];
  cloudTechnologies: string[];
  databases: string[];
  tools: string[];
  softSkills: string[];
}

export const SKILL_TAXONOMY: SkillTaxonomy = {
  programmingLanguages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Golang', 'Rust',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'Dart', 'Elixir', 'Haskell',
    'C', 'Objective-C', 'Shell', 'Bash', 'PowerShell', 'SQL', 'HTML', 'CSS', 'Sass', 'SCSS'
  ],
  frameworks: [
    'React', 'React Native', 'Next.js', 'Vue', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte',
    'Express', 'Express.js', 'NestJS', 'Node.js', 'Spring', 'Spring Boot', 'Django',
    'Flask', 'FastAPI', 'Ruby on Rails', 'Rails', 'Laravel', 'ASP.NET', '.NET Core',
    'Flutter', 'Electron', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'Gatsby'
  ],
  libraries: [
    'Redux', 'Zustand', 'RxJS', 'jQuery', 'Three.js', 'D3.js', 'Chart.js', 'Pandas',
    'NumPy', 'SciPy', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV',
    'SQLAlchemy', 'Prisma', 'TypeORM', 'Hibernate', 'GraphQL', 'Apollo Client',
    'Axios', 'Lodash', 'Webpack', 'Vite', 'Babel'
  ],
  cloudTechnologies: [
    'AWS', 'Amazon Web Services', 'Azure', 'Microsoft Azure', 'GCP', 'Google Cloud',
    'Google Cloud Platform', 'Heroku', 'Vercel', 'Netlify', 'DigitalOcean', 'Cloudflare',
    'Kubernetes', 'K8s', 'Docker', 'Terraform', 'Ansible', 'Serverless', 'Lambda',
    'S3', 'EC2', 'ECS', 'EKS', 'CloudFront', 'Route53', 'IAM'
  ],
  databases: [
    'PostgreSQL', 'Postgres', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
    'SQLite', 'Oracle', 'SQL Server', 'Cassandra', 'MariaDB', 'Neo4j', 'Supabase',
    'Firebase', 'Firestore', 'CockroachDB', 'Snowflake', 'BigQuery'
  ],
  tools: [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Trello', 'Postman',
    'Swagger', 'Insomnia', 'VS Code', 'IntelliJ', 'Docker', 'Jenkins', 'CircleCI',
    'GitHub Actions', 'ArgoCD', 'Prometheus', 'Grafana', 'Datadog', 'Sentry',
    'Figma', 'Adobe XD', 'Linux', 'Unix', 'Nginx', 'Apache'
  ],
  softSkills: [
    'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
    'Time Management', 'Adaptability', 'Agile', 'Scrum', 'Kanban', 'Mentorship',
    'Cross-functional Collaboration', 'Stakeholder Management', 'Strategic Planning',
    'Conflict Resolution', 'Presentation', 'Decision Making', 'Customer Focus'
  ]
};

export function extractSkillsFromText(text: string): {
  programmingLanguages: string[];
  frameworks: string[];
  libraries: string[];
  cloudTechnologies: string[];
  databases: string[];
  tools: string[];
  softSkills: string[];
  allSkills: string[];
} {
  const lowerText = text.toLowerCase();
  
  const findMatches = (list: string[]): string[] => {
    return list.filter(item => {
      // Use regex boundary match to avoid false positives (e.g. 'c' in 'cat')
      const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#])${escaped}(?:$|[^a-zA-Z0-9+#])`, 'i');
      return regex.test(lowerText);
    });
  };

  const programmingLanguages = findMatches(SKILL_TAXONOMY.programmingLanguages);
  const frameworks = findMatches(SKILL_TAXONOMY.frameworks);
  const libraries = findMatches(SKILL_TAXONOMY.libraries);
  const cloudTechnologies = findMatches(SKILL_TAXONOMY.cloudTechnologies);
  const databases = findMatches(SKILL_TAXONOMY.databases);
  const tools = findMatches(SKILL_TAXONOMY.tools);
  const softSkills = findMatches(SKILL_TAXONOMY.softSkills);

  const allSet = new Set([
    ...programmingLanguages,
    ...frameworks,
    ...libraries,
    ...cloudTechnologies,
    ...databases,
    ...tools,
    ...softSkills
  ]);

  return {
    programmingLanguages,
    frameworks,
    libraries,
    cloudTechnologies,
    databases,
    tools,
    softSkills,
    allSkills: Array.from(allSet)
  };
}
