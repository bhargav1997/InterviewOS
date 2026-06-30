import { ParsedResume, BulletAnalysis, BulletRewrite } from '../types';

const WEAK_OPENERS = [
  'responsible for', 'worked on', 'helped with', 'assisted in', 'involved in',
  'participated in', 'contributed to', 'was part of', 'tasked with', 'duties included',
  'worked with', 'handled', 'dealt with', 'in charge of'
];

const STRONG_VERBS = [
  'Architected', 'Engineered', 'Spearheaded', 'Orchestrated', 'Drove',
  'Accelerated', 'Optimized', 'Deployed', 'Scaled', 'Designed',
  'Led', 'Built', 'Launched', 'Reduced', 'Increased',
  'Delivered', 'Automated', 'Streamlined', 'Migrated', 'Implemented',
  'Developed', 'Refactored', 'Pioneered', 'Established', 'Transformed'
];

const METRIC_TEMPLATES = [
  'improving performance by {N}%',
  'reducing {x} by {N}%',
  'serving {N}K+ daily active users',
  'cutting deployment time from {N1} to {N2}',
  'increasing {x} by {N}%',
  'saving {N} engineering hours per month',
  'supporting {N}+ concurrent users',
  'handling {N}M+ requests per day',
  'decreasing latency by {N}ms',
  'growing {x} from {N1}K to {N2}K'
];

function scoreBullet(bullet: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  const lower = bullet.toLowerCase().trim();

  // Weak opener check
  const weakOpener = WEAK_OPENERS.find(w => lower.startsWith(w));
  if (weakOpener) {
    issues.push(`Starts with weak phrase "${weakOpener}" — use a strong action verb instead`);
    score -= 25;
  }

  // No quantifiable metric
  if (!/\d+/.test(bullet)) {
    issues.push('No quantifiable metric (numbers, %, $, time, scale) — recruiters skip unquantified bullets');
    score -= 30;
  }

  // Too short
  if (bullet.length < 45) {
    issues.push('Too brief — great bullets are 1-2 lines describing action + context + result');
    score -= 20;
  }

  // Passive voice detection
  if (/\b(was|were|been|is|are)\s+\w+ed\b/i.test(bullet)) {
    issues.push('Contains passive voice — rewrite in active voice (you did X, not X was done)');
    score -= 15;
  }

  // No technical context
  if (!/[A-Z][a-zA-Z.+#]+/.test(bullet) && !/api|service|system|platform|database|pipeline|model/i.test(bullet)) {
    issues.push('Lacks technical context — mention the system, tech, or scale involved');
    score -= 10;
  }

  return { score: Math.max(0, score), issues };
}

function extractTechContext(bullet: string): string[] {
  const techRegex = /\b(React|TypeScript|Python|Node\.?js|Go|Java|Kubernetes|Docker|AWS|GCP|Azure|PostgreSQL|MongoDB|Redis|GraphQL|REST|API|ML|CI\/CD|microservices|serverless)\b/gi;
  const matches = bullet.match(techRegex) || [];
  return [...new Set(matches.map(m => m))];
}

function generateRewrites(
  bullet: string,
  company: string,
  role: string
): BulletRewrite[] {
  const tech = extractTechContext(bullet);
  const techStr = tech.length > 0 ? tech.slice(0, 2).join('/') : 'the system';
  const metric = METRIC_TEMPLATES[Math.floor(Math.random() * METRIC_TEMPLATES.length)]
    .replace('{N}', String(Math.floor(Math.random() * 40 + 20)))
    .replace('{N1}', String(Math.floor(Math.random() * 5 + 2)))
    .replace('{N2}', String(Math.floor(Math.random() * 1 + 0.3)))
    .replace('{N}K', String(Math.floor(Math.random() * 900 + 100) + 'K'))
    .replace('{x}', ['build times', 'error rate', 'API response time', 'deployment frequency'][Math.floor(Math.random() * 4)]);

  // Extract the core action from the original
  const words = bullet.replace(/^(responsible for|worked on|helped|assisted in)\s+/i, '').split(' ');
  const coreAction = words.slice(0, Math.min(8, words.length)).join(' ');

  const impactVerb = STRONG_VERBS[Math.floor(Math.random() * 12)]; // Impact variants
  const techVerb = STRONG_VERBS[12 + Math.floor(Math.random() * 12)]; // Technical variants

  return [
    {
      variant: 'impact',
      label: 'Impact-First',
      text: `${impactVerb} ${coreAction.toLowerCase()} at ${company}, ${metric}`,
      improvement: 'Opens with strong verb + quantified business impact — what recruiters scan for first'
    },
    {
      variant: 'technical',
      label: 'Technical Depth',
      text: `${techVerb} ${coreAction.toLowerCase()} using ${techStr}, ${metric} and enabling the team to ship faster`,
      improvement: 'Shows technical ownership + scale + team collaboration — what senior engineers need'
    }
  ];
}

export function analyzeBullets(resume: ParsedResume): BulletAnalysis[] {
  const results: BulletAnalysis[] = [];

  for (const exp of resume.workExperience) {
    for (let i = 0; i < exp.bulletPoints.length; i++) {
      const bullet = exp.bulletPoints[i].trim();
      if (!bullet || bullet.length < 10) continue;

      const { score, issues } = scoreBullet(bullet);
      const rewrites = generateRewrites(bullet, exp.company, exp.role);

      results.push({
        id: `bullet_${exp.id}_${i}`,
        experienceId: exp.id,
        company: exp.company,
        role: exp.role,
        original: bullet,
        score,
        issues,
        rewrites
      });
    }
  }

  // Sort by weakest first (most improvement needed at top)
  return results.sort((a, b) => a.score - b.score);
}
