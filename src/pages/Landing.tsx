import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { TrendingUp, Sparkles, LogOut } from 'lucide-react';
import ColorBends from '@/components/ColorBends';
import { ResumeUpload } from '../components/ResumeUpload';
import { useAppContext } from '../hooks/useAppContext';
import { useAuth } from '../hooks/useAuth';
import { analyzeResume } from '../services/geminiService';
import type { UserProfile } from '../types';

export const Landing: React.FC = () => {
    const navigate = useNavigate();
    const { setUser, setAnalytics, setLoading, setError, skills, isLoading } = useAppContext();
    const { googleUser, isAuthenticated, login, logout } = useAuth();
    const [resumeText, setResumeText] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        degree: '',
        branch: '',
        graduationYear: new Date().getFullYear(),
    });

    // Auto-fill profile data from Google account
    useEffect(() => {
        if (googleUser) {
            setProfileData(prev => ({
                ...prev,
                name: googleUser.name || prev.name,
                email: googleUser.email || prev.email,
            }));
        }
    }, [googleUser]);

    const handleFileProcessed = (text: string, file: File) => {
        setResumeText(text);
        setResumeFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');

        if (!isAuthenticated) {
            setError('Please sign in with Google first');
            return;
        }

        if (!resumeText) {
            setError('Please upload a resume first');
            console.log('No resume text');
            return;
        }

        setLoading(true);
        setError(null);
        console.log('Starting resume analysis...');

        try {
            const response = await analyzeResume({
                resumeText,
                userProfile: profileData,
                skills,
            });
            console.log('Analysis response:', response);

            // Create user profile
            const user: UserProfile = {
                id: googleUser?.id || `user-${Date.now()}`,
                name: profileData.name || response.extractedProfile.name || 'Student',
                email: profileData.email,
                degree: profileData.degree || response.extractedProfile.degree || '',
                branch: profileData.branch || response.extractedProfile.branch || '',
                graduationYear: profileData.graduationYear || response.extractedProfile.graduationYear || new Date().getFullYear(),
                placementStatus: 'unplaced',
                targetRoles: response.extractedProfile.targetRoles || [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            setUser(user);
            setAnalytics(response.analytics);

            navigate('/dashboard');
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* ColorBends Background */}
            <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <ColorBends
                    rotation={40}
                    speed={0.6}
                    colors={["#37ebcd", "#7cff67"]}
                    transparent
                    autoRotate={1}
                    scale={1}
                    frequency={1}
                    warpStrength={1}
                    mouseInfluence={1}
                    parallax={0.5}
                    noise={0.1}
                />
            </div>

            {/* Content */}
            <div className="max-w-4xl w-full relative z-10">
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex items-center justify-center mb-6">
                        <TrendingUp className="h-16 w-16 text-primary-500" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Welcome to <span className="text-primary-500">Analytix</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        AI-Powered Placement Analytics Dashboard
                    </p>
                    <p className="text-gray-500 mt-2">
                        Upload your resume and get comprehensive insights on your placement readiness
                    </p>
                </div>

                <div className="card p-8 animate-slide-up backdrop-blur-sm bg-dark-900/80">
                    {/* Google Sign In Section */}
                    <div className="mb-8">
                        {!isAuthenticated ? (
                            <div className="text-center">
                                <p className="text-gray-400 mb-4">Sign in to get started</p>
                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={login}
                                        onError={() => {
                                            console.error('Google Login Failed');
                                            setError('Google login failed. Please try again.');
                                        }}
                                        theme="filled_black"
                                        size="large"
                                        text="signin_with"
                                        shape="rectangular"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-dark-800 rounded-lg p-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={googleUser?.picture}
                                        alt={googleUser?.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="text-white font-medium">{googleUser?.name}</p>
                                        <p className="text-gray-400 text-sm">{googleUser?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {isAuthenticated && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Sparkles className="h-6 w-6 text-primary-500 mr-2" />
                                    Complete Your Profile
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field w-full"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="input-field w-full"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        placeholder="john@example.com"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Degree
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field w-full"
                                        value={profileData.degree}
                                        onChange={(e) => setProfileData({ ...profileData, degree: e.target.value })}
                                        placeholder="B.Tech, M.Tech, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Branch/Major
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field w-full"
                                        value={profileData.branch}
                                        onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                                        placeholder="Computer Science, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Graduation Year
                                    </label>
                                    <input
                                        type="number"
                                        className="input-field w-full"
                                        value={profileData.graduationYear}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, graduationYear: parseInt(e.target.value) })
                                        }
                                        min={2020}
                                        max={2030}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Upload Resume *
                                </label>
                                <ResumeUpload onFileProcessed={handleFileProcessed} isProcessing={isLoading} />
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center space-x-2"
                                disabled={!resumeText || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        <span>Analyze My Profile</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Your data is processed securely. We respect your privacy.
                </p>
            </div>
        </div>
    );
};
