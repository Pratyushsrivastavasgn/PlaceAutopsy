import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type {
    AppContextType,
    UserProfile,
    AnalyticsData,
    Skill,
    JobApplication,
} from '../types';

const initialState: AppContextType = {
    user: null,
    analytics: null,
    skills: [],
    applications: [],
    isLoading: false,
    error: null,
    setUser: () => { },
    setAnalytics: () => { },
    addSkill: () => { },
    updateSkill: () => { },
    deleteSkill: () => { },
    addApplication: () => { },
    updateApplication: () => { },
    deleteApplication: () => { },
    setLoading: () => { },
    setError: () => { },
    resetState: () => { },
};

export const AppContext = createContext<AppContextType>(initialState);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUserState] = useState<UserProfile | null>(null);
    const [analytics, setAnalyticsState] = useState<AnalyticsData | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setErrorState] = useState<string | null>(null);

    const setUser = useCallback((newUser: UserProfile | null) => {
        setUserState(newUser);
        if (newUser) {
            localStorage.setItem('analytix_user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('analytix_user');
        }
    }, []);

    const setAnalytics = useCallback((newAnalytics: AnalyticsData | null) => {
        setAnalyticsState(newAnalytics);
        if (newAnalytics) {
            localStorage.setItem('analytix_analytics', JSON.stringify(newAnalytics));
        } else {
            localStorage.removeItem('analytix_analytics');
        }
    }, []);

    const addSkill = useCallback((skill: Skill) => {
        setSkills((prev) => {
            const updated = [...prev, skill];
            localStorage.setItem('analytix_skills', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updateSkill = useCallback((id: string, updatedSkill: Partial<Skill>) => {
        setSkills((prev) => {
            const updated = prev.map((skill) =>
                skill.id === id ? { ...skill, ...updatedSkill, lastUpdated: new Date() } : skill
            );
            localStorage.setItem('analytix_skills', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const deleteSkill = useCallback((id: string) => {
        setSkills((prev) => {
            const updated = prev.filter((skill) => skill.id !== id);
            localStorage.setItem('analytix_skills', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const addApplication = useCallback((application: JobApplication) => {
        setApplications((prev) => {
            const updated = [...prev, application];
            localStorage.setItem('analytix_applications', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updateApplication = useCallback(
        (id: string, updatedApplication: Partial<JobApplication>) => {
            setApplications((prev) => {
                const updated = prev.map((app) =>
                    app.id === id ? { ...app, ...updatedApplication } : app
                );
                localStorage.setItem('analytix_applications', JSON.stringify(updated));
                return updated;
            });
        },
        []
    );

    const deleteApplication = useCallback((id: string) => {
        setApplications((prev) => {
            const updated = prev.filter((app) => app.id !== id);
            localStorage.setItem('analytix_applications', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    const setError = useCallback((err: string | null) => {
        setErrorState(err);
    }, []);

    const resetState = useCallback(() => {
        setUserState(null);
        setAnalyticsState(null);
        setSkills([]);
        setApplications([]);
        setIsLoading(false);
        setErrorState(null);
        localStorage.clear();
    }, []);

    // Load from localStorage on mount
    React.useEffect(() => {
        const savedUser = localStorage.getItem('analytix_user');
        const savedAnalytics = localStorage.getItem('analytix_analytics');
        const savedSkills = localStorage.getItem('analytix_skills');
        const savedApplications = localStorage.getItem('analytix_applications');

        if (savedUser) setUserState(JSON.parse(savedUser) as UserProfile);
        if (savedAnalytics) setAnalyticsState(JSON.parse(savedAnalytics) as AnalyticsData);
        if (savedSkills) setSkills(JSON.parse(savedSkills) as Skill[]);
        if (savedApplications) setApplications(JSON.parse(savedApplications) as JobApplication[]);
    }, []);

    const value: AppContextType = {
        user,
        analytics,
        skills,
        applications,
        isLoading,
        error,
        setUser,
        setAnalytics,
        addSkill,
        updateSkill,
        deleteSkill,
        addApplication,
        updateApplication,
        deleteApplication,
        setLoading,
        setError,
        resetState,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
