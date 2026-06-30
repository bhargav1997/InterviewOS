import { ParsedResume, JobDescription, MatchAnalysis, SmartSuggestion } from '../types';

export function generateSmartSuggestions(resume: ParsedResume, jd: JobDescription, match: MatchAnalysis): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];

  if (match.missingTechnologies.length > 0) {
    suggestions.push({
      id: 'sugg_tech_1',
      type: 'technology',
      title: `Emphasize target technologies: ${match.missingTechnologies.slice(0, 3).join(', ')}`,
      description: `The job posting for ${jd.title} explicitly mentions ${match.missingTechnologies.slice(0, 3).join(', ')}. If you have experience with these, ensure they appear in your Skills section and Work Experience.`,
      impact: 'High'
    });
  }

  if (match.weakBulletPoints.length > 0) {
    suggestions.push({
      id: 'sugg_metric_1',
      type: 'metric',
      title: 'Add measurable metrics to bullet points',
      description: `We detected ${match.weakBulletPoints.length} bullet points that lack quantifiable achievements (%, $, time saved, users impacted). Quantified achievements increase interview callback rates by 40%.`,
      impact: 'High'
    });
  }

  if (resume.projects.length > 0) {
    suggestions.push({
      id: 'sugg_proj_1',
      type: 'project',
      title: `Highlight ${resume.projects[0].title} project`,
      description: `Your project '${resume.projects[0].title}' contains technologies aligned with ${jd.company}'s Tech stack. Move this project near the top of your resume.`,
      impact: 'Medium'
    });
  }

  if (match.missingActionVerbs.length > 0) {
    suggestions.push({
      id: 'sugg_verb_1',
      type: 'action_verb',
      title: `Incorporate key action verbs: ${match.missingActionVerbs.slice(0, 3).join(', ')}`,
      description: `Replace passive phrasing in your experience bullets with strong action verbs like ${match.missingActionVerbs.slice(0, 3).join(', ')} to boost ATS parsing score.`,
      impact: 'Medium'
    });
  }

  return suggestions;
}
