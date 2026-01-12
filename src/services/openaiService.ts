import type {
    AIAnalysisRequest,
    AIAnalysisResponse,
} from '../types';

// Mock service with hardcoded data for proof of concept
// No API key required - perfect for testing the UI and flow

export const analyzeResume = async (
    request: AIAnalysisRequest
): Promise<AIAnalysisResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Extract basic info from the request
    const userName = request.userProfile.name || 'John Doe';
    const userDegree = request.userProfile.degree || 'B.Tech';
    const userBranch = request.userProfile.branch || 'Computer Science';
    const userGradYear = request.userProfile.graduationYear || 2024;

    // Return hardcoded mock data
    const mockResponse: AIAnalysisResponse = {
        extractedProfile: {
            name: userName,
            degree: userDegree,
            branch: userBranch,
            graduationYear: userGradYear,
            targetRoles: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer'],
        },
        extractedSkills: [
            {
                id: `skill-${Date.now()}-1`,
                skill: 'React',
                currentLevel: 'intermediate',
                category: 'Frontend',
                proofLinks: [],
                lastUpdated: new Date(),
            },
            {
                id: `skill-${Date.now()}-2`,
                skill: 'JavaScript',
                currentLevel: 'advanced',
                category: 'Programming',
                proofLinks: [],
                lastUpdated: new Date(),
            },
            {
                id: `skill-${Date.now()}-3`,
                skill: 'TypeScript',
                currentLevel: 'intermediate',
                category: 'Programming',
                proofLinks: [],
                lastUpdated: new Date(),
            },
            {
                id: `skill-${Date.now()}-4`,
                skill: 'Node.js',
                currentLevel: 'intermediate',
                category: 'Backend',
                proofLinks: [],
                lastUpdated: new Date(),
            },
            {
                id: `skill-${Date.now()}-5`,
                skill: 'Python',
                currentLevel: 'beginner',
                category: 'Programming',
                proofLinks: [],
                lastUpdated: new Date(),
            },
        ],
        analytics: {
            kpis: {
                placementReadiness: 72,
                interviewsAttended: 5,
                hiringProbability: 'medium',
                profileViews: 23,
                skillsAcquired: 12,
                projectsCompleted: 4,
            },
            skillGaps: [
                {
                    skill: 'System Design',
                    currentLevel: 30,
                    requiredLevel: 70,
                    gap: 40,
                    category: 'Technical',
                    priority: 'high',
                },
                {
                    skill: 'Data Structures & Algorithms',
                    currentLevel: 50,
                    requiredLevel: 85,
                    gap: 35,
                    category: 'Technical',
                    priority: 'high',
                },
                {
                    skill: 'Database Management',
                    currentLevel: 40,
                    requiredLevel: 70,
                    gap: 30,
                    category: 'Technical',
                    priority: 'medium',
                },
            ],
            failureAnalysis: {
                technicalWeaknesses: [
                    {
                        category: 'DSA Problems',
                        count: 8,
                        percentage: 40,
                        color: '#ef4444',
                    },
                    {
                        category: 'System Design',
                        count: 6,
                        percentage: 30,
                        color: '#f59e0b',
                    },
                ],
                hrIssues: [
                    {
                        category: 'Communication',
                        count: 3,
                        percentage: 15,
                        color: '#3b82f6',
                    },
                    {
                        category: 'Confidence',
                        count: 3,
                        percentage: 15,
                        color: '#8b5cf6',
                    },
                ],
                systemDesignGaps: [
                    {
                        category: 'Scalability',
                        count: 4,
                        percentage: 50,
                        color: '#ef4444',
                    },
                    {
                        category: 'Database Design',
                        count: 4,
                        percentage: 50,
                        color: '#f59e0b',
                    },
                ],
                overallPattern: 'Strong foundation in frontend development, but needs improvement in DSA and system design for top-tier companies.',
            },
            actionPlan: [
                {
                    id: `action-${Date.now()}-1`,
                    title: 'Master Data Structures & Algorithms',
                    description: 'Complete 150 LeetCode problems focusing on medium and hard difficulty. Practice daily for 2 hours.',
                    priority: 'high',
                    category: 'technical',
                    estimatedTime: '3 months',
                    completed: false,
                    resources: [
                        {
                            title: 'LeetCode - Top Interview Questions',
                            url: 'https://leetcode.com/explore/interview/card/top-interview-questions-easy/',
                            type: 'practice',
                        },
                        {
                            title: 'NeetCode 150',
                            url: 'https://neetcode.io/',
                            type: 'course',
                        },
                    ],
                },
                {
                    id: `action-${Date.now()}-2`,
                    title: 'Learn System Design Fundamentals',
                    description: 'Study system design patterns, scalability concepts, and practice designing common systems like URL shorteners, chat apps, etc.',
                    priority: 'high',
                    category: 'technical',
                    estimatedTime: '2 months',
                    completed: false,
                    resources: [
                        {
                            title: 'System Design Primer',
                            url: 'https://github.com/donnemartin/system-design-primer',
                            type: 'article',
                        },
                        {
                            title: 'Grokking System Design',
                            url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
                            type: 'course',
                        },
                    ],
                },
                {
                    id: `action-${Date.now()}-3`,
                    title: 'Improve Communication Skills',
                    description: 'Practice mock interviews, record yourself explaining technical concepts, and work on articulating thoughts clearly.',
                    priority: 'medium',
                    category: 'soft-skills',
                    estimatedTime: '1 month',
                    completed: false,
                    resources: [
                        {
                            title: 'Pramp - Free Mock Interviews',
                            url: 'https://www.pramp.com/',
                            type: 'practice',
                        },
                        {
                            title: 'How to Explain Technical Concepts',
                            url: 'https://www.youtube.com/watch?v=example',
                            type: 'video',
                        },
                    ],
                },
            ],
            generatedAt: new Date(),
        },
        recommendations: [
            'Focus on solving medium-level DSA problems daily to build consistency',
            'Create a portfolio website showcasing your React projects',
            'Contribute to open-source projects to gain real-world experience',
            'Practice explaining your projects in under 2 minutes for interviews',
            'Learn one backend framework thoroughly (Node.js/Express or Django)',
        ],
    };

    return mockResponse;
};

export const generateActionPlan = async (
    skillGaps: unknown[],
    failureAnalysis: unknown
): Promise<unknown[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return hardcoded action plan
    return [
        {
            id: `action-${Date.now()}-1`,
            title: 'Practice Coding Daily',
            description: 'Solve at least 2 DSA problems every day on LeetCode or similar platforms.',
            priority: 'high',
            category: 'technical',
            estimatedTime: '3 months',
            completed: false,
            resources: [
                {
                    title: 'LeetCode',
                    url: 'https://leetcode.com',
                    type: 'practice',
                },
            ],
        },
        {
            id: `action-${Date.now()}-2`,
            title: 'Build Full Stack Projects',
            description: 'Create 2-3 full stack projects demonstrating end-to-end development skills.',
            priority: 'medium',
            category: 'technical',
            estimatedTime: '2 months',
            completed: false,
            resources: [
                {
                    title: 'Project Ideas',
                    url: 'https://github.com/florinpop17/app-ideas',
                    type: 'article',
                },
            ],
        },
    ];
};
