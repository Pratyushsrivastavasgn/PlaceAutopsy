import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ATSAnalysis } from '@/types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  RESUME_ANALYSES: 'resumeAnalyses',
  JOB_APPLICATIONS: 'jobApplications',
  ASSESSMENTS: 'assessments',
} as const;

// User profile
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Resume analysis record
export interface ResumeAnalysisRecord {
  id: string;
  userId: string;
  fileName: string;
  targetRole?: string;
  analysis: ATSAnalysis;
  createdAt: Timestamp;
}

// Job application record
export interface JobApplicationRecord {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  appliedDate: Timestamp;
  notes?: string;
  resumeUsed?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============ USER OPERATIONS ============

export async function createOrUpdateUser(user: {
  id: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, user.id);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    // Update existing user
    await updateDoc(userRef, {
      name: user.name,
      picture: user.picture,
      updatedAt: Timestamp.now(),
    });
  } else {
    // Create new user
    await setDoc(userRef, {
      ...user,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
}

export async function getUser(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as UserProfile;
  }
  return null;
}

// ============ RESUME ANALYSIS OPERATIONS ============

export async function saveResumeAnalysis(
  userId: string,
  fileName: string,
  analysis: ATSAnalysis,
  targetRole?: string
): Promise<string> {
  const analysisRef = doc(collection(db, COLLECTIONS.RESUME_ANALYSES));
  
  await setDoc(analysisRef, {
    userId,
    fileName,
    targetRole,
    analysis,
    createdAt: Timestamp.now(),
  });

  return analysisRef.id;
}

export async function getUserResumeAnalyses(
  userId: string,
  limitCount: number = 10
): Promise<ResumeAnalysisRecord[]> {
  const q = query(
    collection(db, COLLECTIONS.RESUME_ANALYSES),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ResumeAnalysisRecord[];
}

export async function deleteResumeAnalysis(analysisId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.RESUME_ANALYSES, analysisId));
}

// ============ JOB APPLICATION OPERATIONS ============

export async function saveJobApplication(
  userId: string,
  application: Omit<JobApplicationRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const appRef = doc(collection(db, COLLECTIONS.JOB_APPLICATIONS));
  
  await setDoc(appRef, {
    userId,
    ...application,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return appRef.id;
}

export async function getUserJobApplications(
  userId: string,
  limitCount: number = 50
): Promise<JobApplicationRecord[]> {
  const q = query(
    collection(db, COLLECTIONS.JOB_APPLICATIONS),
    where('userId', '==', userId),
    orderBy('appliedDate', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as JobApplicationRecord[];
}

export async function updateJobApplication(
  applicationId: string,
  updates: Partial<JobApplicationRecord>
): Promise<void> {
  const appRef = doc(db, COLLECTIONS.JOB_APPLICATIONS, applicationId);
  await updateDoc(appRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteJobApplication(applicationId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.JOB_APPLICATIONS, applicationId));
}

// ============ ASSESSMENT OPERATIONS ============

export async function saveAssessment(
  userId: string,
  assessmentData: DocumentData
): Promise<string> {
  const assessmentRef = doc(collection(db, COLLECTIONS.ASSESSMENTS));
  
  await setDoc(assessmentRef, {
    userId,
    ...assessmentData,
    createdAt: Timestamp.now(),
  });

  return assessmentRef.id;
}

export async function getUserAssessments(
  userId: string,
  limitCount: number = 20
): Promise<DocumentData[]> {
  const q = query(
    collection(db, COLLECTIONS.ASSESSMENTS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
