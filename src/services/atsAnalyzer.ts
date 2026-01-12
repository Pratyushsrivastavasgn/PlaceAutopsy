// Local ATS Resume Analyzer - No API calls needed!
import type { ATSAnalysis, SectionScore, ResumeImprovement, Priority } from '../types';

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
  
  // Analyze each section
  const formatting = analyzeFormatting(resumeText, lines);
  const keywords = analyzeKeywords(text, targetRole);
  const experience = analyzeExperience(text, resumeText);
  const education = analyzeEducation(text);
  const skills = analyzeSkills(text);
  const contact = analyzeContact(text, resumeText);
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    formatting.score * 0.15 +
    keywords.score * 0.25 +
    experience.score * 0.25 +
    education.score * 0.10 +
    skills.score * 0.15 +
    contact.score * 0.10
  );
  
  // Generate improvements
  const improvements = generateImprovements(
    { formatting, keywords, experience, education, skills, contact },
    text
  );
  
  // Find missing keywords
  const missingKeywords = findMissingKeywords(text, targetRole);
  
  // Identify strong and weak points
  const { strongPoints, weakPoints } = identifyStrengthsWeaknesses(
    { formatting, keywords, experience, education, skills, contact },
    text,
    resumeText
  );
  
  // Industry fit analysis
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
  const issues: string[] = [];
  
  // Check length (ideal: 400-800 words for 1 page, up to 1200 for 2 pages)
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 200) {
    score -= 25;
    issues.push('Too short');
    tips.push('Add more detail to your experience and projects');
  } else if (wordCount > 1500) {
    score -= 15;
    issues.push('May be too long');
    tips.push('Consider condensing to 1-2 pages for better ATS parsing');
  }
  
  // Check for section headers
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
  
  // Check for bullet points
  const bulletLines = lines.filter(l => /^[\s]*[•\-\*\►\→]/.test(l) || /^[\s]*\d+\./.test(l));
  if (bulletLines.length < 5) {
    score -= 15;
    tips.push('Use bullet points to list achievements and responsibilities');
  }
  
  // Check for dates
  const datePattern = /\b(19|20)\d{2}\b|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|current/gi;
  const dates = text.match(datePattern) || [];
  if (dates.length < 2) {
    score -= 10;
    tips.push('Include dates for your experience and education');
  }
  
  // Check line length consistency
  const longLines = lines.filter(l => l.length > 120);
  if (longLines.length > lines.length * 0.3) {
    score -= 10;
    tips.push('Break long paragraphs into shorter, scannable bullet points');
  }
  
  const status = getStatus(score);
  const feedback = score >= 80 
    ? 'Well-formatted resume with clear structure'
    : score >= 60
    ? 'Formatting needs some improvements for better ATS compatibility'
    : 'Significant formatting issues may affect ATS parsing';
  
  return { score: Math.max(0, score), status, feedback, tips: tips.slice(0, 3) };
}

function analyzeKeywords(text: string, targetRole?: string): SectionScore {
  let score = 0;
  const tips: string[] = [];
  
  // Count tech keywords
  const foundTechKeywords = TECH_KEYWORDS.filter(kw => text.includes(kw.toLowerCase()));
  const techScore = Math.min(40, foundTechKeywords.length * 3);
  score += techScore;
  
  // Count action verbs
  const foundActionVerbs = ACTION_VERBS.filter(v => text.includes(v.toLowerCase()));
  const actionScore = Math.min(30, foundActionVerbs.length * 3);
  score += actionScore;
  
  // Count soft skills
  const foundSoftSkills = SOFT_SKILLS.filter(s => text.includes(s.toLowerCase()));
  const softScore = Math.min(20, foundSoftSkills.length * 4);
  score += softScore;
  
  // Check for quantified achievements
  const numbers = text.match(/\d+%|\$\d+|\d+\+|\d+x|\d+ (users|customers|projects|team|members)/gi) || [];
  const quantifiedScore = Math.min(10, numbers.length * 2);
  score += quantifiedScore;
  
  if (foundTechKeywords.length < 8) {
    tips.push('Add more technical keywords relevant to your target role');
  }
  if (foundActionVerbs.length < 5) {
    tips.push('Start bullet points with strong action verbs (e.g., "Developed", "Implemented")');
  }
  if (numbers.length < 3) {
    tips.push('Quantify achievements with numbers (%, $, users, etc.)');
  }
  
  const status = getStatus(score);
  const feedback = score >= 80
    ? 'Excellent keyword optimization'
    : score >= 60
    ? 'Good keyword usage, but could be improved'
    : 'Needs more industry-relevant keywords';
  
  return { score: Math.max(0, Math.min(100, score)), status, feedback, tips: tips.slice(0, 3) };
}

function analyzeExperience(text: string, originalText: string): SectionScore {
  let score = 50; // Start at 50
  const tips: string[] = [];
  
  // Check for experience section
  const hasExperience = SECTION_HEADERS.experience.some(h => text.includes(h));
  if (!hasExperience) {
    score -= 30;
    tips.push('Add a clear "Experience" or "Work Experience" section');
  }
  
  // Check for company names and roles
  const rolePatterns = /engineer|developer|intern|analyst|manager|lead|associate|consultant/gi;
  const roles = text.match(rolePatterns) || [];
  score += Math.min(20, roles.length * 5);
  
  // Check for action verbs in experience
  const actionVerbCount = ACTION_VERBS.filter(v => text.includes(v.toLowerCase())).length;
  score += Math.min(15, actionVerbCount * 2);
  
  // Check for quantified achievements
  const metrics = text.match(/\d+%|\$[\d,]+|\d+\s*(users|customers|clients|projects|applications)/gi) || [];
  score += Math.min(15, metrics.length * 5);
  
  if (metrics.length < 2) {
    tips.push('Add quantified achievements (e.g., "Improved performance by 40%")');
  }
  if (actionVerbCount < 5) {
    tips.push('Use more action verbs to describe your accomplishments');
  }
  
  const status = getStatus(score);
  const feedback = score >= 80
    ? 'Strong experience section with good detail'
    : score >= 60
    ? 'Experience section is adequate but could use more impact'
    : 'Experience section needs significant improvement';
  
  return { score: Math.max(0, Math.min(100, score)), status, feedback, tips: tips.slice(0, 3) };
}

function analyzeEducation(text: string): SectionScore {
  let score = 50;
  const tips: string[] = [];
  
  // Check for education section
  const hasEducation = SECTION_HEADERS.education.some(h => text.includes(h));
  if (!hasEducation) {
    score -= 20;
    tips.push('Add a clear "Education" section');
  }
  
  // Check for degree types
  const degrees = /bachelor|master|b\.?tech|m\.?tech|b\.?e|m\.?e|b\.?s|m\.?s|ph\.?d|mba|diploma|associate/gi;
  const foundDegrees = text.match(degrees) || [];
  score += Math.min(25, foundDegrees.length * 15);
  
  // Check for university/college mention
  const institutionPatterns = /university|college|institute|school of|iit|nit|bits|vit/gi;
  const institutions = text.match(institutionPatterns) || [];
  score += Math.min(15, institutions.length * 10);
  
  // Check for GPA/CGPA
  if (/gpa|cgpa|percentage|grade/i.test(text)) {
    score += 10;
  } else {
    tips.push('Consider adding your GPA/CGPA if it\'s strong (3.0+)');
  }
  
  const status = getStatus(score);
  const feedback = score >= 80
    ? 'Education section is well-documented'
    : score >= 60
    ? 'Education section is adequate'
    : 'Education section needs more detail';
  
  return { score: Math.max(0, Math.min(100, score)), status, feedback, tips: tips.slice(0, 3) };
}

function analyzeSkills(text: string): SectionScore {
  let score = 40;
  const tips: string[] = [];
  
  // Check for skills section
  const hasSkills = SECTION_HEADERS.skills.some(h => text.includes(h));
  if (!hasSkills) {
    score -= 20;
    tips.push('Add a clear "Skills" or "Technical Skills" section');
  }
  
  // Count technical skills
  const techSkillsFound = TECH_KEYWORDS.filter(kw => text.includes(kw.toLowerCase()));
  score += Math.min(35, techSkillsFound.length * 3);
  
  // Check for skill categorization
  const categories = /programming|languages|frameworks|databases|tools|technologies|platforms/gi;
  const foundCategories = text.match(categories) || [];
  if (foundCategories.length >= 2) {
    score += 15;
  } else {
    tips.push('Organize skills into categories (Languages, Frameworks, Tools)');
  }
  
  // Check for soft skills
  const softSkillsFound = SOFT_SKILLS.filter(s => text.includes(s.toLowerCase()));
  if (softSkillsFound.length < 2) {
    tips.push('Consider mentioning relevant soft skills');
  } else {
    score += 10;
  }
  
  const status = getStatus(score);
  const feedback = score >= 80
    ? 'Comprehensive skills section'
    : score >= 60
    ? 'Good skills coverage'
    : 'Skills section needs expansion';
  
  return { score: Math.max(0, Math.min(100, score)), status, feedback, tips: tips.slice(0, 3) };
}

function analyzeContact(text: string, originalText: string): SectionScore {
  let score = 0;
  const tips: string[] = [];
  
  // Check for email
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailPattern.test(originalText)) {
    score += 30;
  } else {
    tips.push('Add a professional email address');
  }
  
  // Check for phone
  const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  if (phonePattern.test(originalText)) {
    score += 20;
  } else {
    tips.push('Add a phone number');
  }
  
  // Check for LinkedIn
  if (/linkedin\.com|linkedin/i.test(text)) {
    score += 20;
  } else {
    tips.push('Add your LinkedIn profile URL');
  }
  
  // Check for GitHub/Portfolio
  if (/github\.com|github|portfolio|website/i.test(text)) {
    score += 20;
  } else {
    tips.push('Add GitHub or portfolio link to showcase your work');
  }
  
  // Check for location
  if (/city|state|country|located|based in/i.test(text) || /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(originalText)) {
    score += 10;
  }
  
  const status = getStatus(score);
  const feedback = score >= 80
    ? 'Complete contact information'
    : score >= 60
    ? 'Contact information is adequate'
    : 'Missing important contact details';
  
  return { score: Math.max(0, Math.min(100, score)), status, feedback, tips: tips.slice(0, 3) };
}

function generateImprovements(
  sections: Record<string, SectionScore>,
  text: string
): ResumeImprovement[] {
  const improvements: ResumeImprovement[] = [];
  
  // Add improvements based on section scores
  for (const [sectionName, section] of Object.entries(sections)) {
    if (section.score < 70) {
      const priority: Priority = section.score < 50 ? 'high' : 'medium';
      const impact = section.score < 50 ? 'high' : 'medium';
      
      section.tips.forEach(tip => {
        improvements.push({
          section: sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
          issue: `${sectionName} score is ${section.score}%`,
          suggestion: tip,
          priority,
          impact: impact as 'high' | 'medium' | 'low'
        });
      });
    }
  }
  
  // Add general improvements
  if (!text.includes('achieved') && !text.includes('improved') && !text.includes('increased')) {
    improvements.push({
      section: 'Experience',
      issue: 'Lack of achievement-focused language',
      suggestion: 'Use achievement-oriented phrases like "Achieved", "Improved", "Increased"',
      priority: 'high',
      impact: 'high'
    });
  }
  
  // Sort by priority and impact
  return improvements
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 8);
}

function findMissingKeywords(text: string, targetRole?: string): string[] {
  const roleKeywords: Record<string, string[]> = {
    'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'responsive', 'webpack', 'tailwind'],
    'backend': ['node.js', 'python', 'java', 'api', 'rest', 'database', 'sql', 'microservices', 'docker', 'kubernetes'],
    'fullstack': ['react', 'node.js', 'database', 'api', 'javascript', 'typescript', 'mongodb', 'sql', 'git', 'docker'],
    'data': ['python', 'sql', 'pandas', 'machine learning', 'tensorflow', 'data analysis', 'statistics', 'visualization', 'jupyter'],
    'devops': ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform', 'jenkins', 'linux', 'monitoring', 'automation', 'ansible'],
    'default': ['git', 'agile', 'problem-solving', 'team', 'communication', 'project', 'developed', 'implemented', 'optimized', 'collaborated']
  };
  
  const role = targetRole?.toLowerCase() || 'default';
  const relevantKeywords = roleKeywords[
    Object.keys(roleKeywords).find(k => role.includes(k)) || 'default'
  ];
  
  return relevantKeywords
    .filter(kw => !text.includes(kw.toLowerCase()))
    .slice(0, 10);
}

function identifyStrengthsWeaknesses(
  sections: Record<string, SectionScore>,
  text: string,
  originalText: string
): { strongPoints: string[]; weakPoints: string[] } {
  const strongPoints: string[] = [];
  const weakPoints: string[] = [];
  
  // Analyze sections
  for (const [name, section] of Object.entries(sections)) {
    if (section.score >= 80) {
      strongPoints.push(`Strong ${name} section (${section.score}%)`);
    } else if (section.score < 50) {
      weakPoints.push(`Weak ${name} section needs improvement`);
    }
  }
  
  // Check for quantified achievements
  const metrics = text.match(/\d+%|\$[\d,]+|\d+x/g) || [];
  if (metrics.length >= 3) {
    strongPoints.push('Good use of quantified achievements');
  } else {
    weakPoints.push('Lacks quantified achievements');
  }
  
  // Check for action verbs
  const actionVerbCount = ACTION_VERBS.filter(v => text.includes(v.toLowerCase())).length;
  if (actionVerbCount >= 8) {
    strongPoints.push('Excellent use of action verbs');
  } else if (actionVerbCount < 4) {
    weakPoints.push('Needs more action-oriented language');
  }
  
  // Check for technical depth
  const techKeywordCount = TECH_KEYWORDS.filter(kw => text.includes(kw.toLowerCase())).length;
  if (techKeywordCount >= 12) {
    strongPoints.push('Strong technical keyword coverage');
  } else if (techKeywordCount < 6) {
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
  const suggestions: string[] = [];
  
  const roleKeywordMap: Record<string, string[]> = {
    'frontend': ['react', 'vue', 'angular', 'css', 'javascript', 'typescript', 'ui', 'ux', 'responsive'],
    'backend': ['api', 'database', 'server', 'node', 'python', 'java', 'microservices', 'rest'],
    'fullstack': ['frontend', 'backend', 'api', 'database', 'react', 'node'],
    'data': ['python', 'sql', 'analytics', 'machine learning', 'data', 'statistics'],
    'devops': ['docker', 'kubernetes', 'aws', 'ci/cd', 'infrastructure', 'automation'],
    'mobile': ['android', 'ios', 'react native', 'flutter', 'swift', 'kotlin']
  };
  
  const roleLower = role.toLowerCase();
  const matchedRole = Object.keys(roleKeywordMap).find(r => roleLower.includes(r)) || 'fullstack';
  const expectedKeywords = roleKeywordMap[matchedRole];
  
  const foundKeywords = expectedKeywords.filter(kw => text.includes(kw.toLowerCase()));
  fitScore = Math.min(100, 40 + foundKeywords.length * 8);
  
  const missing = expectedKeywords.filter(kw => !text.includes(kw.toLowerCase()));
  if (missing.length > 0) {
    suggestions.push(`Add keywords: ${missing.slice(0, 3).join(', ')}`);
  }
  
  if (fitScore < 70) {
    suggestions.push(`Tailor your resume more specifically for ${role} positions`);
  }
  
  suggestions.push('Include projects relevant to your target role');
  
  return {
    targetRole: role,
    fitScore,
    suggestions: suggestions.slice(0, 3)
  };
}

function getStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'needs-improvement';
  return 'poor';
}
