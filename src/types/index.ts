// Course Types
export interface CourseBasicInfo {
  name: string;
  code: string;
  credits: string;
  instructor: string;
  category?: "major" | "minor" | "generic" | "other";
}

export interface CourseTimeline {
  firstExamDate: string;
  dropDeadline: string;
}

export interface CourseDependencies {
  isPrerequisite: boolean;
  dependsOn: string[];
}

export interface CourseStatus {
  missedClasses: string;
  currentGrade: string;
}

export interface CourseData {
  basicInfo: CourseBasicInfo;
  timeline: CourseTimeline;
  dependencies: CourseDependencies;
  currentStatus: CourseStatus;
  topics?: string[];
}

export interface CourseWithId extends CourseData {
  id: string;
}

export type AssessmentStatus = "pending" | "in-progress" | "completed";

export interface Course {
  id: string;
  name: string;
  lastAssessed?: Date;
  nextAssessment?: Date;
  status: AssessmentStatus;
  skillGapsCount: number;
  completionRate: number;
  topics?: string[];
  canReassess?: boolean;
  skillGapProgress?: number;
}

export interface AssessmentConfig {
  topics: string[];
  scope: "entire" | "selected";
  isReassessment?: boolean;
}

export interface AssessmentData {
  status: string;
  completedAt: string;
  score: number;
  skillGaps: string[];
  topicPerformance: Record<string, { correct: number; total: number }>;
  totalQuestions: number;
  correctAnswers: number;
  canReassess?: boolean;
  skillGapProgress?: number;
}

// Skill Gap Types
export interface SkillGap {
  id: string;
  skill: string;
  course: string;
  courseName: string;
  severity: "critical" | "moderate" | "manageable";
  urgency: "immediate" | "high" | "medium" | "low";
  daysToAddress: number;
  blocks: string[];
  reason: string;
  impact: string;
  performance: {
    correct: number;
    total: number;
  };
  actionPlanId?: string;
  progress?: number;
  isFixed: boolean; // true = fixed, false = not fixed
  createdAt: string;
  fixedAt?: string;
}

// Action Plan Types
export interface Resource {
  type: "video" | "article" | "practice" | "code";
  title: string;
  url: string;
  duration?: string;
  readTime?: string;
  problems?: number;
  exercises?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  estimatedTime: number;
  completed: boolean;
  completedDate?: string;
  dueDate?: string;
  resources: Resource[];
}

export interface ActionPlan {
  id: string;
  userId: string;
  title: string;
  skillGapId: string;
  skillGap: string;
  course: string;
  courseName: string;
  priority: "critical" | "high" | "medium";
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  weeklyAllocation: number;
  status: "in_progress" | "not_started" | "completed";
  tasks: Task[];
  createdAt: string;
  completedAt?: string;
}

// User Profile Types
export interface UserProfileData {
  uid: string;
  email: string | null;
  demographics: {
    name: string;
    major: string;
    semester: string;
    institution: string;
  };
  courses: CourseData[];
  constraints: {
    hoursAvailable: string;
    partTimeWork: string;
    otherCommitments: string;
    preferredStudyTime: string;
  };
  goals: {
    targetGPA: string;
    priorityCourse: string;
  };
  skillAssessment: {
    priorExperience: string;
    strongestSkill: string;
  };
  psychologicalFactors: {
    stressLevel: string;
    fallingBehind: boolean;
  };
  learningPreferences: {
    learningStyle: string[];
  };
  assessments?: Record<string, AssessmentData>;
  onboardingComplete: boolean;
  createdAt: Date;
}

export interface AssessmentData {
  status: string;
  completedAt: string;
  score: number;
  skillGaps: string[];
  topicPerformance: Record<string, { correct: number; total: number }>;
  totalQuestions: number;
  correctAnswers: number;
  canReassess?: boolean; // true when all skill gaps are fixed
  skillGapProgress?: number; // percentage of fixed skill gaps (0-100)
}

// Filter and View Types
export type SeverityFilter = "all" | "critical" | "moderate" | "manageable";
export type FixedFilter = "all" | "fixed" | "not_fixed";
export type ViewMode = "grid" | "timeline" | "dependencies" | "by_course";


// Onboarding Form Types
export interface OnboardingCourse {
  name: string;
  code: string;
  credits: string;
  instructor: string;
  firstExamDate: string;
  dropDeadline: string;
  isPrerequisite: string;
  dependsOn: string[];
  missedClasses: string;
  currentGrade: string;
}

export interface OnboardingFormData {
  name: string;
  major: string;
  semester: string;
  institution: string;
  courses: OnboardingCourse[];
  currentCourse: OnboardingCourse;
  dependsOnInput: string;
  priorityCourse: string;
  priorExperience: string;
  strongestSkill: string;
  weeklyHours: string;
  otherCommitments: string;
  partTimeWork: string;
  studyTime: string;
  targetGPA: string;
  stressLevel: string;
  fallingBehind: string;
  learningStyle: string[];
}

// Form Field Value Types
export type FormFieldValue = 
  | string 
  | string[] 
  | OnboardingCourse[] 
  | OnboardingCourse;

export type CourseFieldValue = string | string[];