import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target,
    Users,
    TrendingUp,
    Award,
    Briefcase,
    Code,
} from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { KpiCard } from '../components/dashboard/KpiCard';
import { SkillGapMatrix } from '../components/dashboard/SkillGapMatrix';
import { FailureAnalysisChart } from '../components/dashboard/FailureAnalysisChart';
import { ActionPlanCard } from '../components/dashboard/ActionPlanCard';
import Squares from '../components/Squares';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, analytics, setAnalytics } = useAppContext();

    React.useEffect(() => {
        if (!user || !analytics) {
            navigate('/');
        }
    }, [user, analytics, navigate]);

    if (!analytics) {
        return null;
    }

    const handleToggleActionComplete = (id: string) => {
        if (!analytics) return;

        const updatedActionPlan = analytics.actionPlan.map((action) =>
            action.id === id ? { ...action, completed: !action.completed } : action
        );

        setAnalytics({
            ...analytics,
            actionPlan: updatedActionPlan,
        });
    };

    const kpis = analytics.kpis;

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Squares Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Squares
                    speed={0.3}
                    squareSize={50}
                    direction="diagonal"
                    borderColor="rgba(99, 102, 241, 0.15)"
                    hoverFillColor="rgba(99, 102, 241, 0.1)"
                />
            </div>
            
            <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">
                        Welcome back, {user?.name}! Here's your placement analytics overview.
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard
                    title="Placement Readiness"
                    value={`${kpis.placementReadiness}%`}
                    icon={<Target className="h-6 w-6 text-white" />}
                    trend={{ direction: 'up', value: 5 }}
                    color="primary"
                />
                <KpiCard
                    title="Interviews Attended"
                    value={kpis.interviewsAttended}
                    icon={<Users className="h-6 w-6 text-white" />}
                    color="primary"
                />
                <KpiCard
                    title="Hiring Probability"
                    value={kpis.hiringProbability.toUpperCase()}
                    icon={<TrendingUp className="h-6 w-6 text-white" />}
                    color="primary"
                />
                <KpiCard
                    title="Skills Acquired"
                    value={kpis.skillsAcquired}
                    icon={<Code className="h-6 w-6 text-white" />}
                    trend={{ direction: 'up', value: 12 }}
                    color="primary"
                />
                <KpiCard
                    title="Projects Completed"
                    value={kpis.projectsCompleted}
                    icon={<Award className="h-6 w-6 text-white" />}
                    color="primary"
                />
                <KpiCard
                    title="Profile Views"
                    value={kpis.profileViews}
                    icon={<Briefcase className="h-6 w-6 text-white" />}
                    trend={{ direction: 'up', value: 8 }}
                    color="primary"
                />
            </div>

            {/* Skill Gap Matrix */}
            {analytics.skillGaps.length > 0 && (
                <SkillGapMatrix skillGaps={analytics.skillGaps} />
            )}

            {/* Failure Analysis */}
            {analytics.failureAnalysis && (
                <FailureAnalysisChart failureAnalysis={analytics.failureAnalysis} />
            )}

            {/* Action Plan */}
            {analytics.actionPlan.length > 0 && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-white mb-6">Recommended Action Plan</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {analytics.actionPlan.map((action) => (
                            <ActionPlanCard
                                key={action.id}
                                action={action}
                                onToggleComplete={handleToggleActionComplete}
                            />
                        ))}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};
