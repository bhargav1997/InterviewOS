export const ACTION_VERBS = [
  'Accelerated', 'Achieved', 'Architected', 'Automated', 'Built', 'Calculated',
  'Centralized', 'Championed', 'Collaborated', 'Constructed', 'Created', 'Decreased',
  'Delivered', 'Designed', 'Developed', 'Devised', 'Directed', 'Eliminated',
  'Engineered', 'Established', 'Expanded', 'Expedited', 'Formulated', 'Generated',
  'Headheaded', 'Implemented', 'Improved', 'Increased', 'Initiated', 'Innovated',
  'Instituted', 'Integrated', 'Introduced', 'Launched', 'Led', 'Leveraged',
  'Managed', 'Maximized', 'Mentored', 'Migrated', 'Minimized', 'Modernized',
  'Negotiated', 'Optimized', 'Orchestrated', 'Outperformed', 'Overhauled', 'Pioneered',
  'Produced', 'Reduced', 'Refactored', 'Revamped', 'Scalable', 'Scaled', 'Spearheaded',
  'Standardized', 'Streamlined', 'Structured', 'Surpassed', 'Transformed', 'Upgraded'
];

export function extractActionVerbs(text: string): string[] {
  const lowerText = text.toLowerCase();
  return ACTION_VERBS.filter(verb => {
    const regex = new RegExp(`\\b${verb.toLowerCase()}\\b`, 'i');
    return regex.test(lowerText);
  });
}
