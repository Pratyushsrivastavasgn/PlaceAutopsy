import Groq from 'groq-sdk';
import type {
  AIAnalysisRequest,
  AIAnalysisResponse,
  ActionItem,
  SkillGap,
  FailureAnalysis,
} from '../types';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

console.log('Groq API Key loaded:', API_KEY ? 'Yes (length: ' + API_KEY.length + ')' : 'No');

if (!API_KEY) {
  console.warn('Groq API key not found. Please set VITE_GROQ_API_KEY in your .env file');
}

const groq = API_KEY ? new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) : null;

export const analyzeResume = async (
  request: AIAnalysisRequest
): Promise<AIAnalysisResponse> => {
  console.log('analyzeResume called with resume text length:', request.resumeText?.length);
  
  if (!groq) {
    console.error('Groq is null - API key issue');
    throw new Error('Groq API not initialized. Please set VITE_GROQ_API_KEY in your .env file');
  }

  console.log('Calling Groq API...');

  const prompt = `Analyze the following resume and extract information. Return ONLY valid JSON (no markdown, no code blocks).

The JSON must follow this exact structure:
{
  "analytics": {
    "kpis": {
      "placementReadiness": <number 0-100>,
      "interviewsAttended": 0,
      "hiringProbability": "<low|medium|high>",
      "profileViews": 0,
      "skillsAcquired": <number>,
      "projectsCompleted": <number>
    },
    "skillGaps": [
      {
        "skill": "<skill name>",
        "currentLevel": <number 0-100>,
        "requiredLevel": <number 0-100>,
        "gap": <number>,
        "category": "<technical|soft-skills>",
        "priority": "<low|medium|high>"
      }
    ],
    "failureAnalysis": {
      "technicalWeaknesses": [{"category": "<name>", "count": <number>, "percentage": <number>, "color": "#ef4444"}],
      "hrIssues": [{"category": "<name>", "count": <number>, "percentage": <number>, "color": "#eab308"}],
      "systemDesignGaps": [{"category": "<name>", "count": <number>, "percentage": <number>, "color": "#22c55e"}],
      "overallPattern": "<summary string>"
    },
    "actionPlan": [
      {
        "title": "<action title>",
        "description": "<description>",
        "priority": "<low|medium|high>",
        "category": "<technical|interview|soft-skills>",
        "estimatedTime": "<e.g. 2 weeks>",
        "resources": [{"title": "<resource name>", "url": "<url>", "type": "<course|article|video|book|practice>"}]
      }
    ]
  },
  "extractedProfile": {
    "name": "<name>",
    "degree": "<degree>",
    "branch": "<branch/major>",
    "graduationYear": <year number>,
    "targetRoles": ["<role1>", "<role2>"]
  },
  "extractedSkills": [
    {
      "skill": "<skill name>",
      "currentLevel": "<beginner|intermediate|advanced>",
      "category": "<category>"
    }
  ],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}

Generate 3-5 skill gaps, 2-3 items per failure category, 3-5 action plan items, and extract all skills from the resume.

Resume text:
${request.resumeText.substring(0, 3000)}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '';
    console.log('Groq response received, length:', text.length);

    // Clean up the response - remove markdown code blocks if present
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsedResponse = JSON.parse(cleanedText);

    // Add IDs and timestamps to the parsed data
    const processedResponse: AIAnalysisResponse = {
      ...parsedResponse,
      extractedSkills: (parsedResponse.extractedSkills || []).map((skill: Record<string, unknown>, index: number) => ({
        ...skill,
        id: `skill-${Date.now()}-${index}`,
        proofLinks: [],
        lastUpdated: new Date(),
      })),
      analytics: {
        ...parsedResponse.analytics,
        actionPlan: (parsedResponse.analytics?.actionPlan || []).map((action: Record<string, unknown>, index: number) => ({
          ...action,
          id: `action-${Date.now()}-${index}`,
          completed: false,
        })),
        generatedAt: new Date(),
      },
    };

    return processedResponse;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generateActionPlan = async (
  skillGaps: SkillGap[],
  failureAnalysis: FailureAnalysis
): Promise<ActionItem[]> => {
  if (!groq) {
    throw new Error('Groq API not initialized. Please set VITE_GROQ_API_KEY in your .env file');
  }

  const prompt = `Based on the following skill gaps and failure analysis, create a personalized action plan. Return ONLY valid JSON array (no markdown, no code blocks).

Each action item must follow this structure:
{
  "title": "<action title>",
  "description": "<detailed description>",
  "priority": "<low|medium|high>",
  "category": "<technical|interview|soft-skills>",
  "estimatedTime": "<e.g. 2 weeks>",
  "resources": [{"title": "<resource name>", "url": "<valid url>", "type": "<course|article|video|book|practice>"}]
}

Generate 3-5 actionable items.

Skill Gaps:
${JSON.stringify(skillGaps, null, 2)}

Failure Analysis:
${JSON.stringify(failureAnalysis, null, 2)}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '';

    // Clean up the response
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const actions = JSON.parse(cleanedText);
    
    // Handle both array and object with actions property
    const actionArray = Array.isArray(actions) ? actions : (actions.actionPlan || actions.actions || []);
    
    return actionArray.map((action: Record<string, unknown>, index: number) => ({
      ...action,
      id: `action-${Date.now()}-${index}`,
      completed: false,
      resources: action.resources || [],
    }));
  } catch (error) {
    console.error('Error generating action plan:', error);
    throw new Error(`Failed to generate action plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ATS Resume Analysis
export const analyzeResumeATS = async (
  resumeText: string,
  targetRole?: string
): Promise<import('../types').ATSAnalysis> => {
  if (!groq) {
    throw new Error('Groq API not initialized. Please set VITE_GROQ_API_KEY in your .env file');
  }

  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and resume consultant. Analyze the following resume and provide a comprehensive ATS score analysis.

Target Role: ${targetRole || 'General Software/Tech Role'}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "overallScore": <number 0-100>,
  "sections": {
    "formatting": {
      "score": <number 0-100>,
      "status": "<excellent|good|needs-improvement|poor>",
      "feedback": "<detailed feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    "keywords": {
      "score": <number 0-100>,
      "status": "<excellent|good|needs-improvement|poor>",
      "feedback": "<detailed feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    "experience": {
      "score": <number 0-100>,
      "status": "<excellent|good|needs-improvement|poor>",
      "feedback": "<detailed feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    "education": {
      "score": <number 0-100>,
      "status": "<excellent|good|needs-improvement|poor>",
      "feedback": "<detailed feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    "skills": {
      "score": <number 0-100>,
      "status": "<excellent|good|needs-improvement|poor>",
      "feedback": "<detailed feedback>",
      "tips": ["<tip1>", "<tip2>"]
    },
    "contact": {
      "score": <number 0-100>,
      "status": "<excellent|good|needs-improvement|poor>",
      "feedback": "<detailed feedback>",
      "tips": ["<tip1>", "<tip2>"]
    }
  },
  "improvements": [
    {
      "section": "<section name>",
      "issue": "<specific issue>",
      "suggestion": "<actionable suggestion>",
      "priority": "<high|medium|low>",
      "impact": "<high|medium|low>"
    }
  ],
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "strongPoints": ["<strength1>", "<strength2>", "<strength3>"],
  "weakPoints": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "industryFit": {
    "targetRole": "${targetRole || 'Software Developer'}",
    "fitScore": <number 0-100>,
    "suggestions": ["<suggestion1>", "<suggestion2>"]
  }
}

Analyze these aspects:
1. FORMATTING: Check for proper sections, consistent styling, bullet points usage, length appropriateness
2. KEYWORDS: Check for industry-relevant keywords, action verbs, technical terms
3. EXPERIENCE: Quality of experience descriptions, quantified achievements, relevance
4. EDUCATION: Proper education details, relevant coursework, certifications
5. SKILLS: Technical skills listing, soft skills, skill organization
6. CONTACT: Professional email, phone, LinkedIn, portfolio links

Provide 5-8 specific improvements prioritized by impact.
List 5-10 missing keywords for the target role.
Identify 3-5 strong points and 3-5 weak points.

Resume:
${resumeText.substring(0, 4000)}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const cleanedText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error analyzing resume ATS:', error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};