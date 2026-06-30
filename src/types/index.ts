export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid' | 'Internship';

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  bulletPoints: string[];
  technologiesUsed: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
  technologies: string[];
  link?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateIssued: string;
  expirationDate?: string;
}

export interface ParsedResume {
  id: string;
  title: string;
  createdAt: string;
  rawText: string;
  contactInfo: ContactInfo;
  summary: string;
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    libraries: string[];
    cloudTechnologies: string[];
    databases: string[];
    tools: string[];
    softSkills: string[];
    allSkills: string[];
  };
  workExperience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  awards: string[];
  languages: string[];
  actionVerbsUsed: string[];
  yearsOfExperience: number;
  hasLeadershipExperience: boolean;
  industry: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  employmentType: string;
  location: string;
  url: string;
  extractedAt: string;
  rawText: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  educationRequirements: string[];
  yearsOfExperienceRequired: number;
  keywords: string[];
  technologies: {
    programmingLanguages: string[];
    frameworks: string[];
    libraries: string[];
    cloudTechnologies: string[];
    databases: string[];
    tools: string[];
    all: string[];
  };
  certifications: string[];
  softSkills: string[];
  actionVerbs: string[];
  industry: string;
}

export interface MatchAnalysis {
  overallMatchScore: number;
  skillMatchScore: number;
  keywordMatchScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  projectMatchScore: number;
  
  missingTechnologies: string[];
  matchingTechnologies: string[];
  duplicateSkills: string[];
  missingActionVerbs: string[];
  weakBulletPoints: {
    experienceId: string;
    bullet: string;
    reason: string;
  }[];
  
  resumeLengthAnalysis: {
    wordCount: number;
    estimatedPages: number;
    status: 'Too Short' | 'Optimal' | 'Too Long';
  };
  
  formattingScore: number;
  atsCompatibilityScore: number;
  keywordDensity: { keyword: string; count: number; densityPercent: number }[];
  importantKeywordsMissing: string[];
  repeatedKeywords: string[];
  skillCoveragePercent: number;
  industryAlignmentScore: number;
  leadershipAlignmentScore: number;
}

export interface AtsCategoryScore {
  category: string;
  score: number;
  maxScore: number;
  feedback: string[];
}

export interface AtsAnalysis {
  totalScore: number;
  categories: {
    resumeSections: AtsCategoryScore;
    formatting: AtsCategoryScore;
    keywords: AtsCategoryScore;
    experience: AtsCategoryScore;
    actionVerbs: AtsCategoryScore;
    education: AtsCategoryScore;
    projects: AtsCategoryScore;
    technologyStack: AtsCategoryScore;
    readability: AtsCategoryScore;
    sectionOrder: AtsCategoryScore;
    bulletQuality: AtsCategoryScore;
    achievements: AtsCategoryScore;
    metricsUsage: AtsCategoryScore;
  };
  criticalIssues: string[];
  improvements: string[];
}

export type PromptTemplateId = 
  | 'general_ats'
  | 'senior_software_engineer'
  | 'frontend_developer'
  | 'backend_developer'
  | 'fullstack_developer'
  | 'react_developer'
  | 'java_developer'
  | 'python_developer'
  | 'data_analyst'
  | 'devops_engineer'
  | 'cloud_engineer'
  | 'remote_jobs'
  | 'startup_jobs'
  | 'government_jobs'
  | 'healthcare_jobs'
  | 'finance_jobs';

export interface PromptTemplate {
  id: PromptTemplateId;
  name: string;
  description: string;
  roleContext: string;
  specialInstructions: string[];
}

export type JobApplicationStatus = 
  | 'Saved'
  | 'Applied'
  | 'Interview'
  | 'Rejected'
  | 'Offer'
  | 'Ghosted'
  | 'Wishlist';

export interface TrackedJob {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  url: string;
  status: JobApplicationStatus;
  appliedDate?: string;
  salary?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  jobDescriptionId?: string;
  matchScore?: number;
}

export interface SmartSuggestion {
  id: string;
  type: 'project' | 'skill' | 'certification' | 'experience' | 'technology' | 'metric' | 'action_verb';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

// ─── Feature 1: Bullet Point Rewriter ────────────────────────────────────────
export interface BulletRewrite {
  variant: 'impact' | 'technical';
  label: string;
  text: string;
  improvement: string;
}

export interface BulletAnalysis {
  id: string;
  experienceId: string;
  company: string;
  role: string;
  original: string;
  score: number; // 0-100
  issues: string[];
  rewrites: BulletRewrite[];
}

// ─── Feature 2: Interview Prep Kit ───────────────────────────────────────────
export interface InterviewQuestion {
  id: string;
  category: 'Behavioral' | 'Technical' | 'Situational' | 'Company' | 'Role-Specific';
  question: string;
  hint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starScaffold?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface StarStory {
  bulletId: string;
  experienceId: string;
  company: string;
  role: string;
  originalBullet: string;
  scaffold: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface ResearchItem {
  category: string;
  icon: string;
  items: string[];
}

export interface InterviewPrepKit {
  predictedQuestions: InterviewQuestion[];
  starStories: StarStory[];
  researchChecklist: ResearchItem[];
  questionsToAsk: string[];
}

// ─── Feature 3: Cover Letter ──────────────────────────────────────────────────
export type CoverLetterTone = 'professional' | 'enthusiastic' | 'direct';

export interface CoverLetter {
  tone: CoverLetterTone;
  recipientName: string;
  opening: string;
  body1: string;
  body2: string;
  closing: string;
  fullText: string;
}

// ─── Feature 4: Skill Gap Roadmap ────────────────────────────────────────────
export type SkillPriority = 'Must-Have' | 'Nice-to-Have' | 'Bonus';
export type SkillDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningResource {
  name: string;
  url: string;
  type: 'course' | 'docs' | 'project' | 'video' | 'book';
  free: boolean;
  timeEstimate: string;
}

export interface SkillGapItem {
  skill: string;
  priority: SkillPriority;
  difficulty: SkillDifficulty;
  timeToLearn: string;
  quickWin: boolean;
  description: string;
  resources: LearningResource[];
  learned?: boolean;
}

// ─── Feature 5: LinkedIn Optimizer ───────────────────────────────────────────
export interface LinkedInHeadline {
  variant: string;
  text: string;
  explanation: string;
}

export interface LinkedInProfile {
  headlines: LinkedInHeadline[];
  summary: string;
  aboutSection: string;
  skillsToAdd: string[];
  skillsToReorder: string[];
  featuredSuggestions: string[];
  connectionMessage: string;
}

