import { ParsedResume, JobDescription, MatchAnalysis, AtsAnalysis, PromptTemplateId } from '../types';
import { PROMPT_TEMPLATES } from './templates';

export function generateOptimizedPrompt(
  resume: ParsedResume,
  jd: JobDescription,
  match: MatchAnalysis,
  ats: AtsAnalysis,
  templateId: PromptTemplateId = 'general_ats'
): string {
  const template = PROMPT_TEMPLATES[templateId] || PROMPT_TEMPLATES.general_ats;
  
  const targetAtsScore = Math.min(98, Math.max(88, ats.totalScore + 15));

  const prompt = `
# SYSTEM INSTRUCTIONS: RESUME OPTIMIZATION & ATS ALIGNMENT ENGINE

${template.roleContext}

Your goal is to optimize the provided candidate resume specifically for the target job posting at **${jd.company}** for the role of **${jd.title}**. You must achieve a Target ATS Score of **${targetAtsScore}%** (Current Score: ${ats.totalScore}%).

---

## ⛔ CRITICAL CONSTRAINTS & TRUTHFULNESS GUARDRAILS (STRICT COMPLIANCE REQUIRED)
1. **NEVER INVENT EXPERIENCE**: Do not invent employment dates, companies, job titles, or responsibilities not present in the original resume.
2. **NEVER INVENT SKILLS**: Do not add technical skills or tools that the candidate has never used or indicated in their profile.
3. **NEVER FAKE CERTIFICATIONS OR EDUCATION**: Do not hallucinate degrees, certifications, or licenses.
4. **PRESERVE FACTUAL TRUTH**: Rewrite and elevate existing achievements truthfully by clarifying context, impact, and phrasing.
5. **HIGHLIGHT TRANSFERABLE SKILLS**: If the candidate lacks an explicit technology, emphasize closely related transferable technologies already present in their resume.

---

## 🎯 SPECIALIZED ROLE INSTRUCTIONS (${template.name.toUpperCase()})
${template.specialInstructions.map(inst => `- ${inst}`).join('\n')}

---

## 📋 PREPROCESSING & CONTEXT ANALYTICS

- **Target Company**: ${jd.company}
- **Target Position**: ${jd.title}
- **Industry Alignment**: ${jd.industry}
- **Candidate Years of Experience**: ${resume.yearsOfExperience} years (Job requires: ${jd.yearsOfExperienceRequired}+ years)
- **Current ATS Score**: ${ats.totalScore}/100
- **Target ATS Score**: ${targetAtsScore}/100
- **Overall Match Score**: ${match.overallMatchScore}%

### 🔑 KEYWORD & SKILL MATCH BREAKDOWN
- **Matching Technologies Detected**: ${match.matchingTechnologies.length > 0 ? match.matchingTechnologies.join(', ') : 'None'}
- **Important Missing Technologies/Keywords**: ${match.missingTechnologies.length > 0 ? match.missingTechnologies.join(', ') : 'None'}
- **Missing Action Verbs to Incorporate**: ${match.missingActionVerbs.length > 0 ? match.missingActionVerbs.join(', ') : 'None'}

---

## 📝 OUTPUT REQUIREMENTS

Please analyze the provided raw context below and return your complete response structured into the following sections:

1. **SUMMARY OF STRATEGIC CHANGES**:
   - Executive overview of how the resume was restructured.
   - Breakdown of high-impact changes made to bullet points.
   - Estimated ATS Score Improvement (from ${ats.totalScore}% to ${targetAtsScore}%).
   - Estimated Interview Readiness Assessment (e.g., High / Very High).

2. **OPTIMIZED RESUME (MARKDOWN FORMAT)**:
   - Provide the complete, fully rewritten resume in clean, recruiter-ready Markdown.
   - Rewrite the Professional Summary to directly align with ${jd.company}'s mission.
   - Reorder and categorize skills to highlight ${jd.title} priorities first.
   - Rewrite every single bullet point under Work Experience and Projects using strong action verbs and quantifying achievements where context permits.

3. **OPTIMIZED RESUME (PLAIN TEXT FORMAT)**:
   - Provide an identical clean plain text version designed for copy-pasting directly into legacy ATS text boxes.

---

## 📄 SOURCE DATA CONTEXT

### [TARGET JOB DESCRIPTION]
**Title**: ${jd.title}
**Company**: ${jd.company}
**Raw Description**:
\`\`\`text
${jd.rawText}
\`\`\`

### [CANDIDATE CURRENT RESUME]
**Candidate Name**: ${resume.contactInfo.name}
**Raw Resume Content**:
\`\`\`text
${resume.rawText}
\`\`\`
`.trim();

  return prompt;
}
