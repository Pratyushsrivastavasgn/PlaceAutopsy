// User and Profile Types
export type UserRole = 'student' | 'mentor' | 'placement_cell_viewer';
export type PlacementStatus = 'unplaced' | 'partially_placed' | 'placed';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type ApplicationStatus = 'rejected' | 'selected' | 'in-progress';
export type ApplicationType = 'on-campus' | 'off-campus' | 'referral';
export type HiringProbability = 'low' | 'medium' | 'high';
export type Priority = 'low' | 'medium' | 'high';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    degree: string;
    branch: string;
    graduationYear: number;
    placementStatus: PlacementStatus;
    targetRoles: string[];
    resumeUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Analytics and KPI Types
export interface KPIData {
    placementReadiness: number; // 0-100
    interviewsAttended: number;
    hiringProbability: HiringProbability;
    profileViews: number;
    skillsAcquired: number;
    projectsCompleted: number;
}

// Skill Types
export interface Skill {
    id: string;
    skill: string;
    currentLevel: SkillLevel;
    requiredLevel?: SkillLevel;
    category: string;
    proofLinks: string[];
    lastUpdated: Date;
}

export interface SkillGap {
    skill: string;
    currentLevel: number; // 0-100
    requiredLevel: number; // 0-100
    gap: number; // difference
    category: string;
    priority: Priority;
}

// Application Types
export interface JobApplication {
    id: string;
    company: string;
    role: string;
    applicationType: ApplicationType;
    status: ApplicationStatus;
    appliedDate: Date;
    interviewDate?: Date;
    feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
    technical?: {
        topics: string[];
        systemDesignLevel: 'weak' | 'moderate' | 'strong';
        codingPerformance: 'weak' | 'moderate' | 'strong';
        notes: string;
    };
    hr?: {
        confidence: ConfidenceLevel;
        communicationIssues: string[];
        culturalFit: 'weak' | 'moderate' | 'strong';
        notes: string;
    };
    overall?: string;
}

// Failure Analysis Types
export interface FailureCategory {
    category: string;
    count: number;
    percentage: number;
    color: string;
}

export interface FailureAnalysis {
    technicalWeaknesses: FailureCategory[];
    hrIssues: FailureCategory[];
    systemDesignGaps: FailureCategory[];
    overallPattern: string;
}

// Action Plan Types
export interface ActionItem {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    category: string;
    estimatedTime: string;
    resources: Resource[];
    completed: boolean;
    deadline?: Date;
}

export interface Resource {
    title: string;
    url: string;
    type: 'course' | 'article' | 'video' | 'book' | 'practice';
}

// Analytics Dashboard Data
export interface AnalyticsData {
    kpis: KPIData;
    skillGaps: SkillGap[];
    failureAnalysis: FailureAnalysis;
    actionPlan: ActionItem[];
    generatedAt: Date;
}

// AI Service API Types
export interface AIAnalysisRequest {
    resumeText: string;
    userProfile: Partial<UserProfile>;
    applications?: JobApplication[];
    skills?: Skill[];
}

export interface AIAnalysisResponse {
    analytics: AnalyticsData;
    extractedProfile: Partial<UserProfile>;
    extractedSkills: Skill[];
    recommendations: string[];
}

// App Context Types
export interface AppState {
    user: UserProfile | null;
    analytics: AnalyticsData | null;
    skills: Skill[];
    applications: JobApplication[];
    isLoading: boolean;
    error: string | null;
}

export interface AppContextType extends AppState {
    setUser: (user: UserProfile | null) => void;
    setAnalytics: (analytics: AnalyticsData | null) => void;
    addSkill: (skill: Skill) => void;
    updateSkill: (id: string, skill: Partial<Skill>) => void;
    deleteSkill: (id: string) => void;
    addApplication: (application: JobApplication) => void;
    updateApplication: (id: string, application: Partial<JobApplication>) => void;
    deleteApplication: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetState: () => void;
}

// Component Props Types
export interface KpiCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        direction: 'up' | 'down';
        value: number;
    };
    color?: string;
}

export interface ActionPlanCardProps {
    action: ActionItem;
    onToggleComplete: (id: string) => void;
}

export interface SkillGapMatrixProps {
    skillGaps: SkillGap[];
}

export interface FailureAnalysisChartProps {
    failureAnalysis: FailureAnalysis;
}

// Resume Analysis Types (ATS Score)
export interface ATSAnalysis {
    overallScore: number; // 0-100
    sections: {
        formatting: SectionScore;
        keywords: SectionScore;
        experience: SectionScore;
        education: SectionScore;
        skills: SectionScore;
        contact: SectionScore;
    };
    improvements: ResumeImprovement[];
    missingKeywords: string[];
    strongPoints: string[];
    weakPoints: string[];
    industryFit: {
        targetRole: string;
        fitScore: number;
        suggestions: string[];
    };
}

export interface SectionScore {
    score: number; // 0-100
    status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    feedback: string;
    tips: string[];
}

export interface ResumeImprovement {
    section: string;
    issue: string;
    suggestion: string;
    priority: Priority;
    impact: 'high' | 'medium' | 'low';
}
