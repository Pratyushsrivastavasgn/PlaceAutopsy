// Local ATS Resume Analyzer - Fallback when API is not configured
import type { ATSAnalysis, SectionScore, Priority } from '../types';

// Common ATS keywords by category
const TECH_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'angular', 'vue',
  'node.js', 'express', 'mongodb', 'sql', 'postgresql', 'mysql', 'redis',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github', 'gitlab',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'rest', 'api', 'graphql',
  'agile', 'scrum', 'jira', 'ci/cd', 'jenkins', 'terraform', 'linux',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy',
  'data structures', 'algorithms', 'oop', 'design patterns', 'microservices',
  'spring', 'django', 'flask', 'fastapi', '.net', 'rust', 'go', 'kotlin', 'swift'
];

const ACTION_VERBS = [
  'achieved', 'developed', 'implemented', 'designed', 'led', 'managed', 'created',
  'built', 'improved', 'increased', 'reduced', 'optimized', 'delivered', 'launched',
  'collaborated', 'coordinated', 'analyzed', 'architected', 'automated', 'configured',
  'deployed', 'engineered', 'established', 'executed', 'facilitated', 'generated',
  'integrated', 'maintained', 'mentored', 'migrated', 'modernized', 'orchestrated',
  'pioneered', 'refactored', 'resolved', 'scaled', 'streamlined', 'transformed',
  'spearheaded', 'initiated', 'innovated', 'enhanced', 'accelerated'
];

const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
  'critical thinking', 'time management', 'adaptability', 'creativity', 'collaboration',
  'attention to detail', 'organization', 'multitasking', 'decision making'
];

const SECTION_HEADERS = {
  experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
  education: ['education', 'academic', 'qualifications', 'degrees'],
  skills: ['skills', 'technical skills', 'technologies', 'competencies', 'expertise'],
  projects: ['projects', 'personal projects', 'academic projects', 'portfolio'],
  contact: ['email', 'phone', 'linkedin', 'github', 'portfolio', 'address'],
  certifications: ['certifications', 'certificates', 'licenses', 'credentials'],
  summary: ['summary', 'objective', 'profile', 'about me', 'professional summary']
};

export const analyzeResumeLocal = (resumeText: string, targetRole?: string): ATSAnalysis => {
  const text = resumeText.toLowerCase();
  const lines = resumeText.split('\n').filter(l => l.trim());
  
  const formatting = analyzeFormatting(resumeText, lines);
  const keywords = analyzeKeywords(text, targetRole);
  const experience = analyzeExperience(text);
  const education = analyzeEducation(text);
  const skills = analyzeSkills(text);
  const contact = analyzeContact(text, resumeText);
  
  const overallScore = Math.round(
    formatting.score * 0.15 +
    keywords.score * 0.25 +
    experience.score * 0.25 +
    education.score * 0.10 +
    skills.score * 0.15 +
    contact.score * 0.10
  );
  
  const improvements = generateImprovements(
    { formatting, keywords, experience, education, skills, contact },
    text
  );
  
  const missingKeywords = findMissingKeywords(text, targetRole);
  const { strongPoints, weakPoints } = identifyStrengthsWeaknesses(
    { formatting, keywords, experience, education, skills, contact },
    text
  );
  const industryFit = analyzeIndustryFit(text, targetRole);
  
  return {
    overallScore,
    sections: { formatting, keywords, experience, education, skills, contact },
    improvements,
    missingKeywords,
    strongPoints,
    weakPoints,
    industryFit
  };
};

function analyzeFormatting(text: string, lines: string[]): SectionScore {
  let score = 100;
  const tips: string[] = [];
  
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 200) {
    score -= 25;
    tips.push('Add more detail to your experience and projects');
  } else if (wordCount > 1500) {
    score -= 15;
    tips.push('Consider condensing to 1-2 pages');
  }
  
  const lowerText = text.toLowerCase();
  let sectionsFound = 0;
  const requiredSections = ['experience', 'education', 'skills'];
  
  for (const section of requiredSections) {
    if (SECTION_HEADERS[section as keyof typeof SECTION_HEADERS]?.some(h => lowerText.includes(h))) {
      sectionsFound++;
    }
  }
  
  if (sectionsFound < 3) {
    score -= (3 - sectionsFound) * 10;
    tips.push('Add clear section headers: Experience, Education, Skills');
  }
  
  const bulletLines = lines.filter(l => /^[\s]*[•\-\*\►\→]/.test(l));
  if (bulletLines.length < 5) {
    score -= 15;
    tips.push('Use bullet points for achievements');
  }
  
  return { 
    score: Math.max(0, score), 
    status: getStatus(score), 
    feedback: score >= 80 ? 'Well-formatted resume' : 'Formatting needs improvement',
    tips: tips.slice(0, 3) 
  };
}

function analyzeKeywords(text: string, _targetRole?: string): SectionScore {
  let score = 0;
  const tips: string[] = [];
  
  const foundTechKeywords = TECH_KEYWORDS.filter(kw => text.includes(kw.toLowerCase()));
  score += Math.min(40, foundTechKeywords.length * 3);
  
  const foundActionVerbs = ACTION_VERBS.filter(v => text.includes(v.toLowerCase()));
  score += Math.min(30, foundActionVerbs.length * 3);
  
  const foundSoftSkills = SOFT_SKILLS.filter(s => text.includes(s.toLowerCase()));
  score += Math.min(20, foundSoftSkills.length * 4);
  
  const numbers = text.match(/\d+%|\$\d+|\d+\+|\d+x/gi) || [];
  score += Math.min(10, numbers.length * 2);
  
  if (foundTechKeywords.length < 8) {
    tips.push('Add more technical keywords');
  }
  if (foundActionVerbs.length < 5) {
    tips.push('Use more action verbs');
  }
  
  return { 
    score: Math.min(100, score), 
    status: getStatus(score),
    feedback: score >= 80 ? 'Excellent keywords' : 'Needs more keywords',
    tips: tips.slice(0, 3) 
  };
}

function analyzeExperience(text: string): SectionScore {
  let score = 50;
  const tips: string[] = [];
  
  const hasExperience = SECTION_HEADERS.experience.some(h => text.includes(h));
  if (!hasExperience) {
    score -= 30;
    tips.push('Add an Experience section');
  }
  
  const rolePatterns = /engineer|developer|intern|analyst|manager|lead/gi;
  const roles = text.match(rolePatterns) || [];
  score += Math.min(20, roles.length * 5);
  
  const actionVerbCount = ACTION_VERBS.filter(v => text.includes(v.toLowerCase())).length;
  score += Math.min(15, actionVerbCount * 2);
  
  const metrics = text.match(/\d+%|\$[\d,]+/gi) || [];
  score += Math.min(15, metrics.length * 5);
  
  if (metrics.length < 2) {
    tips.push('Add quantified achievements');
  }
  
  return { 
    score: Math.min(100, score), 
    status: getStatus(score),
    feedback: score >= 80 ? 'Strong experience' : 'Experience needs improvement',
    tips: tips.slice(0, 3) 
  };
}

function analyzeEducation(text: string): SectionScore {
  let score = 50;
  const tips: string[] = [];
  
  const hasEducation = SECTION_HEADERS.education.some(h => text.includes(h));
  if (!hasEducation) {
    score -= 20;
    tips.push('Add an Education section');
  }
  
  const degrees = /bachelor|master|b\.?tech|m\.?tech|b\.?s|m\.?s|ph\.?d|mba/gi;
  const foundDegrees = text.match(degrees) || [];
  score += Math.min(25, foundDegrees.length * 15);
  
  if (/university|college|institute/gi.test(text)) {
    score += 15;
  }
  
  if (/gpa|cgpa/i.test(text)) {
    score += 10;
  } else {
    tips.push('Add GPA if 3.0+');
  }
  
  return { 
    score: Math.min(100, score), 
    status: getStatus(score),
    feedback: score >= 80 ? 'Well-documented education' : 'Education needs detail',
    tips: tips.slice(0, 3) 
  };
}

function analyzeSkills(text: string): SectionScore {
  let score = 40;
  const tips: string[] = [];
  
  const hasSkills = SECTION_HEADERS.skills.some(h => text.includes(h));
  if (!hasSkills) {
    score -= 20;
    tips.push('Add a Skills section');
  }
  
  const techSkillsFound = TECH_KEYWORDS.filter(kw => text.includes(kw.toLowerCase()));
  score += Math.min(35, techSkillsFound.length * 3);
  
  const categories = /programming|languages|frameworks|databases|tools/gi;
  if (categories.test(text)) {
    score += 15;
  } else {
    tips.push('Categorize your skills');
  }
  
  return { 
    score: Math.min(100, score), 
    status: getStatus(score),
    feedback: score >= 80 ? 'Comprehensive skills' : 'Expand skills section',
    tips: tips.slice(0, 3) 
  };
}

function analyzeContact(text: string, originalText: string): SectionScore {
  let score = 0;
  const tips: string[] = [];
  
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(originalText)) {
    score += 30;
  } else {
    tips.push('Add email address');
  }
  
  if (/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(originalText)) {
    score += 20;
  } else {
    tips.push('Add phone number');
  }
  
  if (/linkedin/i.test(text)) {
    score += 20;
  } else {
    tips.push('Add LinkedIn profile');
  }
  
  if (/github|portfolio/i.test(text)) {
    score += 20;
  } else {
    tips.push('Add GitHub link');
  }
  
  score += 10; // Location bonus
  
  return { 
    score: Math.min(100, score), 
    status: getStatus(score),
    feedback: score >= 80 ? 'Complete contact info' : 'Missing contact details',
    tips: tips.slice(0, 3) 
  };
}

function generateImprovements(
  sections: Record<string, SectionScore>,
  text: string
): ATSAnalysis['improvements'] {
  const improvements: ATSAnalysis['improvements'] = [];
  
  for (const [sectionName, section] of Object.entries(sections)) {
    if (section.score < 70) {
      const priority: Priority = section.score < 50 ? 'high' : 'medium';
      section.tips.forEach(tip => {
        improvements.push({
          section: sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
          issue: `Score: ${section.score}%`,
          suggestion: tip,
          priority,
          impact: priority
        });
      });
    }
  }
  
  return improvements.slice(0, 8);
}

function findMissingKeywords(text: string, targetRole?: string): string[] {
  const roleKeywords: Record<string, string[]> = {
    'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html'],
    'backend': ['node.js', 'python', 'java', 'api', 'rest', 'database', 'sql'],
    'fullstack': ['react', 'node.js', 'database', 'api', 'javascript', 'typescript'],
    'default': ['git', 'agile', 'problem-solving', 'developed', 'implemented']
  };
  
  const role = targetRole?.toLowerCase() || 'default';
  const relevant = roleKeywords[Object.keys(roleKeywords).find(k => role.includes(k)) || 'default'];
  
  return relevant.filter(kw => !text.includes(kw.toLowerCase())).slice(0, 10);
}

function identifyStrengthsWeaknesses(
  sections: Record<string, SectionScore>,
  text: string
): { strongPoints: string[]; weakPoints: string[] } {
  const strongPoints: string[] = [];
  const weakPoints: string[] = [];
  
  for (const [name, section] of Object.entries(sections)) {
    if (section.score >= 80) {
      strongPoints.push(`Strong ${name} (${section.score}%)`);
    } else if (section.score < 50) {
      weakPoints.push(`Weak ${name} section`);
    }
  }
  
  const techCount = TECH_KEYWORDS.filter(kw => text.includes(kw.toLowerCase())).length;
  if (techCount >= 12) {
    strongPoints.push('Good technical coverage');
  } else if (techCount < 6) {
    weakPoints.push('Limited technical keywords');
  }
  
  return {
    strongPoints: strongPoints.slice(0, 5),
    weakPoints: weakPoints.slice(0, 5)
  };
}

function analyzeIndustryFit(text: string, targetRole?: string): ATSAnalysis['industryFit'] {
  const role = targetRole || 'Software Developer';
  let fitScore = 50;
  
  const roleKeywordMap: Record<string, string[]> = {
    'frontend': ['react', 'vue', 'angular', 'css', 'javascript'],
    'backend': ['api', 'database', 'server', 'node', 'python'],
    'fullstack': ['frontend', 'backend', 'api', 'database', 'react'],
    'data': ['python', 'sql', 'analytics', 'machine learning']
  };
  
  const roleLower = role.toLowerCase();
  const matchedRole = Object.keys(roleKeywordMap).find(r => roleLower.includes(r)) || 'fullstack';
  const expected = roleKeywordMap[matchedRole];
  
  const found = expected.filter(kw => text.includes(kw.toLowerCase()));
  fitScore = Math.min(100, 40 + found.length * 12);
  
  return {
    targetRole: role,
    fitScore,
    suggestions: ['Tailor resume for target role', 'Add relevant projects']
  };
}

function getStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'needs-improvement';
  return 'poor';
}
