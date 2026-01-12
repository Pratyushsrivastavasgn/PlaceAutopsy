// Affinda Resume Parser API Integration
// Free tier: 50 documents/month
// API Docs: https://docs.affinda.com/

import type { ATSAnalysis, SectionScore, ResumeImprovement, Priority } from '../types';

const AFFINDA_API_KEY = import.meta.env.VITE_AFFINDA_API_KEY as string | undefined;
const AFFINDA_WORKSPACE = import.meta.env.VITE_AFFINDA_WORKSPACE as string | undefined;

interface AffindaResumeData {
  name?: { raw?: string; first?: string; last?: string };
  emails?: string[];
  phoneNumbers?: string[];
  linkedin?: string;
  websites?: string[];
  location?: { rawInput?: string; city?: string; state?: string; country?: string };
  education?: Array<{
    organization?: string;
    accreditation?: { education?: string; inputStr?: string };
    grade?: { raw?: string; value?: string };
    dates?: { startDate?: string; completionDate?: string };
  }>;
  workExperience?: Array<{
    jobTitle?: string;
    organization?: string;
    dates?: { startDate?: string; endDate?: string };
    jobDescription?: string;
  }>;
  skills?: Array<{ name?: string; type?: string }>;
  certifications?: string[];
  languages?: Array<{ name?: string }>;
  summary?: string;
  objective?: string;
  totalYearsExperience?: number;
}

interface AffindaResponse {
  data?: AffindaResumeData;
  meta?: {
    ready?: boolean;
    failed?: boolean;
    identifier?: string;
  };
  error?: {
    errorCode?: string;
    errorDetail?: string;
  };
}

export const analyzeResumeWithAffinda = async (
  file: File,
  targetRole?: string
): Promise<ATSAnalysis> => {
  if (!AFFINDA_API_KEY) {
    throw new Error('Affinda API key not found. Please set VITE_AFFINDA_API_KEY in your .env file');
  }

  if (!AFFINDA_WORKSPACE) {
    throw new Error('Affinda workspace not found. Please set VITE_AFFINDA_WORKSPACE in your .env file');
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('workspace', AFFINDA_WORKSPACE);
  formData.append('wait', 'true');
  formData.append('deleteAfterParse', 'true'); // Don't store data for privacy

  try {
    const response = await fetch('https://api.affinda.com/v3/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AFFINDA_API_KEY}`,
      },
      body: formData,
    });

    console.log('Affinda response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Affinda API error response:', errorText);
      throw new Error(`Affinda API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Affinda response received');

    // V3 API: Check if extractor is configured and data is present
    if (!result.extractor || result.extractor === '') {
      console.warn('Affinda workspace has no extractor configured. Please set up a Resume Parser in your Affinda workspace.');
      throw new Error('Affinda workspace not configured. Please set up a Resume Parser extractor at https://app.affinda.com/');
    }

    // Check for errors
    if (result.error?.errorCode || result.error?.errorDetail) {
      throw new Error(result.error.errorDetail || 'Failed to parse resume');
    }

    // V3 API: data should contain the parsed resume info
    const resumeData = result.data;
    
    if (!resumeData || Object.keys(resumeData).length === 0) {
      throw new Error('Resume parsing returned empty data. Check your Affinda workspace configuration.');
    }

    // Convert Affinda response to our ATSAnalysis format
    return convertToATSAnalysis(resumeData, targetRole);
  } catch (error) {
    console.error('Affinda API error:', error);
    throw error;
  }
};

function convertToATSAnalysis(data: AffindaResumeData, targetRole?: string): ATSAnalysis {
  // Analyze each section based on Affinda's parsed data
  const contact = analyzeContactSection(data);
  const experience = analyzeExperienceSection(data);
  const education = analyzeEducationSection(data);
  const skills = analyzeSkillsSection(data);
  const formatting = analyzeFormattingSection(data);
  const keywords = analyzeKeywordsSection(data, targetRole);

  // Calculate overall score
  const overallScore = Math.round(
    contact.score * 0.10 +
    experience.score * 0.30 +
    education.score * 0.15 +
    skills.score * 0.20 +
    formatting.score * 0.10 +
    keywords.score * 0.15
  );

  // Generate improvements
  const improvements = generateImprovements(
    { contact, experience, education, skills, formatting, keywords },
    data
  );

  // Identify strengths and weaknesses
  const { strongPoints, weakPoints } = identifyStrengthsWeaknesses(data);

  // Find missing keywords
  const missingKeywords = findMissingKeywords(data.skills || [], targetRole);

  // Industry fit
  const industryFit = analyzeIndustryFit(data, targetRole);

  return {
    overallScore,
    sections: { formatting, keywords, experience, education, skills, contact },
    improvements,
    missingKeywords,
    strongPoints,
    weakPoints,
    industryFit,
  };
}

function analyzeContactSection(data: AffindaResumeData): SectionScore {
  let score = 0;
  const tips: string[] = [];

  // Email
  if (data.emails && data.emails.length > 0) {
    score += 25;
  } else {
    tips.push('Add a professional email address');
  }

  // Phone
  if (data.phoneNumbers && data.phoneNumbers.length > 0) {
    score += 25;
  } else {
    tips.push('Add a phone number');
  }

  // LinkedIn
  if (data.linkedin) {
    score += 25;
  } else {
    tips.push('Add your LinkedIn profile URL');
  }

  // Websites/Portfolio
  if (data.websites && data.websites.length > 0) {
    score += 15;
  } else {
    tips.push('Add GitHub or portfolio link');
  }

  // Location
  if (data.location?.city || data.location?.rawInput) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    status: getStatus(score),
    feedback: score >= 80 ? 'Complete contact information' : 'Missing some contact details',
    tips: tips.slice(0, 3),
  };
}

function analyzeExperienceSection(data: AffindaResumeData): SectionScore {
  let score = 0;
  const tips: string[] = [];
  const experiences = data.workExperience || [];

  if (experiences.length === 0) {
    tips.push('Add your work experience');
    return {
      score: 20,
      status: 'poor',
      feedback: 'No work experience found',
      tips,
    };
  }

  // Base score for having experience
  score += 30;

  // Points for number of experiences
  score += Math.min(20, experiences.length * 5);

  // Check for job titles
  const hasJobTitles = experiences.filter(e => e.jobTitle).length;
  score += Math.min(15, hasJobTitles * 5);

  // Check for descriptions
  const hasDescriptions = experiences.filter(e => e.jobDescription && e.jobDescription.length > 50).length;
  score += Math.min(20, hasDescriptions * 7);

  // Check for dates
  const hasDates = experiences.filter(e => e.dates?.startDate).length;
  score += Math.min(15, hasDates * 5);

  if (hasDescriptions < experiences.length) {
    tips.push('Add detailed descriptions with quantified achievements');
  }

  // Check for total experience
  if (data.totalYearsExperience && data.totalYearsExperience >= 2) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    status: getStatus(score),
    feedback: score >= 80 
      ? 'Strong work experience section' 
      : score >= 60 
      ? 'Good experience, could use more detail'
      : 'Experience section needs improvement',
    tips: tips.slice(0, 3),
  };
}

function analyzeEducationSection(data: AffindaResumeData): SectionScore {
  let score = 0;
  const tips: string[] = [];
  const education = data.education || [];

  if (education.length === 0) {
    tips.push('Add your education details');
    return {
      score: 30,
      status: 'poor',
      feedback: 'No education information found',
      tips,
    };
  }

  // Base score for having education
  score += 40;

  // Check for degree
  const hasDegree = education.some(e => e.accreditation?.education || e.accreditation?.inputStr);
  if (hasDegree) {
    score += 25;
  } else {
    tips.push('Specify your degree type clearly');
  }

  // Check for institution
  const hasInstitution = education.some(e => e.organization);
  if (hasInstitution) {
    score += 20;
  }

  // Check for GPA/grades
  const hasGrade = education.some(e => e.grade?.value || e.grade?.raw);
  if (hasGrade) {
    score += 15;
  } else {
    tips.push('Add your GPA if it\'s 3.0 or above');
  }

  return {
    score: Math.min(100, score),
    status: getStatus(score),
    feedback: score >= 80 ? 'Well-documented education' : 'Education section could be improved',
    tips: tips.slice(0, 3),
  };
}

function analyzeSkillsSection(data: AffindaResumeData): SectionScore {
  let score = 0;
  const tips: string[] = [];
  const skills = data.skills || [];

  if (skills.length === 0) {
    tips.push('Add a dedicated skills section');
    return {
      score: 20,
      status: 'poor',
      feedback: 'No skills detected',
      tips,
    };
  }

  // Base score
  score += 30;

  // Points for number of skills
  score += Math.min(40, skills.length * 3);

  // Check for technical skills
  const techSkills = skills.filter(s => 
    s.type?.toLowerCase().includes('technical') || 
    s.type?.toLowerCase().includes('hard')
  );
  if (techSkills.length >= 5) {
    score += 20;
  } else {
    tips.push('Add more technical skills relevant to your target role');
  }

  // Soft skills
  const softSkills = skills.filter(s => 
    s.type?.toLowerCase().includes('soft')
  );
  if (softSkills.length >= 2) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    status: getStatus(score),
    feedback: score >= 80 
      ? 'Comprehensive skills section' 
      : `Found ${skills.length} skills, consider adding more`,
    tips: tips.slice(0, 3),
  };
}

function analyzeFormattingSection(data: AffindaResumeData): SectionScore {
  let score = 70; // Base score - Affinda successfully parsed it
  const tips: string[] = [];

  // Check for name
  if (data.name?.raw || data.name?.first) {
    score += 10;
  } else {
    tips.push('Ensure your name is clearly visible at the top');
  }

  // Check for summary/objective
  if (data.summary || data.objective) {
    score += 10;
  } else {
    tips.push('Add a professional summary at the top of your resume');
  }

  // Well-structured sections bonus
  const hasSections = [
    data.workExperience?.length,
    data.education?.length,
    data.skills?.length,
  ].filter(Boolean).length;

  score += hasSections * 5;

  return {
    score: Math.min(100, score),
    status: getStatus(score),
    feedback: score >= 80 
      ? 'Well-formatted, ATS-friendly resume' 
      : 'Good structure, minor improvements possible',
    tips: tips.slice(0, 3),
  };
}

function analyzeKeywordsSection(data: AffindaResumeData, targetRole?: string): SectionScore {
  let score = 40;
  const tips: string[] = [];
  const skills = data.skills || [];

  const roleKeywords: Record<string, string[]> = {
    'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html'],
    'backend': ['node', 'python', 'java', 'api', 'database', 'sql', 'rest'],
    'fullstack': ['react', 'node', 'database', 'api', 'javascript'],
    'data': ['python', 'sql', 'machine learning', 'pandas', 'analytics'],
    'devops': ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform'],
  };

  const role = targetRole?.toLowerCase() || 'fullstack';
  const matchedRole = Object.keys(roleKeywords).find(r => role.includes(r)) || 'fullstack';
  const expectedKeywords = roleKeywords[matchedRole];

  const skillNames = skills.map(s => s.name?.toLowerCase() || '');
  const foundKeywords = expectedKeywords.filter(kw => 
    skillNames.some(s => s.includes(kw))
  );

  score += foundKeywords.length * 10;

  if (foundKeywords.length < expectedKeywords.length / 2) {
    tips.push(`Add more ${matchedRole} keywords: ${expectedKeywords.slice(0, 3).join(', ')}`);
  }

  // Check for action verbs in experience
  const descriptions = (data.workExperience || [])
    .map(e => e.jobDescription || '')
    .join(' ')
    .toLowerCase();

  const actionVerbs = ['developed', 'implemented', 'designed', 'led', 'created', 'built', 'improved'];
  const foundVerbs = actionVerbs.filter(v => descriptions.includes(v));
  score += foundVerbs.length * 5;

  if (foundVerbs.length < 3) {
    tips.push('Use more action verbs in your experience descriptions');
  }

  return {
    score: Math.min(100, score),
    status: getStatus(score),
    feedback: score >= 80 
      ? 'Strong keyword optimization' 
      : 'Add more industry-relevant keywords',
    tips: tips.slice(0, 3),
  };
}

function generateImprovements(
  sections: Record<string, SectionScore>,
  data: AffindaResumeData
): ResumeImprovement[] {
  const improvements: ResumeImprovement[] = [];

  for (const [sectionName, section] of Object.entries(sections)) {
    if (section.score < 70) {
      section.tips.forEach(tip => {
        improvements.push({
          section: sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
          issue: `${sectionName} score is ${section.score}%`,
          suggestion: tip,
          priority: section.score < 50 ? 'high' : 'medium',
          impact: section.score < 50 ? 'high' : 'medium',
        });
      });
    }
  }

  // Add specific improvements
  if (!data.summary && !data.objective) {
    improvements.unshift({
      section: 'Summary',
      issue: 'Missing professional summary',
      suggestion: 'Add a 2-3 sentence summary highlighting your key qualifications',
      priority: 'high',
      impact: 'high',
    });
  }

  return improvements.slice(0, 8);
}

function identifyStrengthsWeaknesses(data: AffindaResumeData): {
  strongPoints: string[];
  weakPoints: string[];
} {
  const strongPoints: string[] = [];
  const weakPoints: string[] = [];

  // Experience
  if ((data.workExperience?.length || 0) >= 2) {
    strongPoints.push(`${data.workExperience!.length} work experiences listed`);
  } else if (!data.workExperience?.length) {
    weakPoints.push('No work experience listed');
  }

  // Skills
  if ((data.skills?.length || 0) >= 10) {
    strongPoints.push(`Strong skills section with ${data.skills!.length} skills`);
  } else if ((data.skills?.length || 0) < 5) {
    weakPoints.push('Limited skills listed');
  }

  // Education
  if (data.education?.length) {
    strongPoints.push('Education clearly documented');
  } else {
    weakPoints.push('Missing education section');
  }

  // Contact
  if (data.emails?.length && data.phoneNumbers?.length) {
    strongPoints.push('Complete contact information');
  } else {
    weakPoints.push('Incomplete contact information');
  }

  // LinkedIn
  if (data.linkedin) {
    strongPoints.push('LinkedIn profile included');
  } else {
    weakPoints.push('No LinkedIn profile');
  }

  // Summary
  if (data.summary || data.objective) {
    strongPoints.push('Professional summary present');
  } else {
    weakPoints.push('Missing professional summary');
  }

  return {
    strongPoints: strongPoints.slice(0, 5),
    weakPoints: weakPoints.slice(0, 5),
  };
}

function findMissingKeywords(
  skills: Array<{ name?: string }>,
  targetRole?: string
): string[] {
  const roleKeywords: Record<string, string[]> = {
    'frontend': ['React', 'TypeScript', 'CSS', 'HTML5', 'Redux', 'Webpack', 'Testing', 'Git'],
    'backend': ['Node.js', 'Python', 'SQL', 'REST API', 'Docker', 'MongoDB', 'AWS', 'Git'],
    'fullstack': ['React', 'Node.js', 'SQL', 'MongoDB', 'API', 'Docker', 'Git', 'TypeScript'],
    'data': ['Python', 'SQL', 'Pandas', 'Machine Learning', 'TensorFlow', 'Statistics', 'Visualization'],
    'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Jenkins', 'Monitoring'],
  };

  const role = targetRole?.toLowerCase() || 'fullstack';
  const matchedRole = Object.keys(roleKeywords).find(r => role.includes(r)) || 'fullstack';
  const expected = roleKeywords[matchedRole];

  const skillNames = skills.map(s => s.name?.toLowerCase() || '');

  return expected.filter(kw => 
    !skillNames.some(s => s.includes(kw.toLowerCase()))
  ).slice(0, 10);
}

function analyzeIndustryFit(
  data: AffindaResumeData,
  targetRole?: string
): ATSAnalysis['industryFit'] {
  const role = targetRole || 'Software Developer';
  const skills = data.skills || [];
  const experience = data.workExperience || [];

  // Calculate fit score
  let fitScore = 40; // Base

  // Skills match
  const roleKeywords: Record<string, string[]> = {
    'frontend': ['react', 'vue', 'angular', 'javascript', 'css'],
    'backend': ['node', 'python', 'java', 'api', 'database'],
    'fullstack': ['react', 'node', 'database', 'api'],
    'data': ['python', 'sql', 'machine learning', 'analytics'],
  };

  const roleLower = role.toLowerCase();
  const matchedRole = Object.keys(roleKeywords).find(r => roleLower.includes(r)) || 'fullstack';
  const expected = roleKeywords[matchedRole];

  const skillNames = skills.map(s => s.name?.toLowerCase() || '');
  const matchedSkills = expected.filter(kw => skillNames.some(s => s.includes(kw)));
  fitScore += matchedSkills.length * 10;

  // Experience relevance
  const expDescriptions = experience.map(e => e.jobDescription || '').join(' ').toLowerCase();
  const expTitleMatch = experience.some(e => 
    e.jobTitle?.toLowerCase().includes(roleLower.split(' ')[0])
  );
  if (expTitleMatch) fitScore += 15;

  const suggestions: string[] = [];
  if (matchedSkills.length < expected.length / 2) {
    suggestions.push(`Add more ${matchedRole}-specific skills`);
  }
  suggestions.push('Tailor your resume to match the job description');
  suggestions.push('Include projects relevant to your target role');

  return {
    targetRole: role,
    fitScore: Math.min(100, fitScore),
    suggestions: suggestions.slice(0, 3),
  };
}

function getStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'needs-improvement';
  return 'poor';
}

// Export a fallback local analyzer for when API is not configured
export { analyzeResumeLocal } from './atsAnalyzerLocal';
