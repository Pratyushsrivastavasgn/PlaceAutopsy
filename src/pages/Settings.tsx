import React, { useState } from 'react';
import { User, Mail, GraduationCap, Calendar, Target, Save, RefreshCw } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import Squares from '../components/Squares';
import type { PlacementStatus } from '../types';

export const Settings: React.FC = () => {
    const { user, setUser, resetState } = useAppContext();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        degree: user?.degree || '',
        branch: user?.branch || '',
        graduationYear: user?.graduationYear || new Date().getFullYear(),
        placementStatus: user?.placementStatus || 'unplaced' as PlacementStatus,
        targetRoles: user?.targetRoles.join(', ') || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            const updatedUser = {
                ...user,
                name: formData.name,
                email: formData.email,
                degree: formData.degree,
                branch: formData.branch,
                graduationYear: formData.graduationYear,
                placementStatus: formData.placementStatus,
                targetRoles: formData.targetRoles.split(',').map((role) => role.trim()).filter(Boolean),
                updatedAt: new Date(),
            };
            setUser(updatedUser);
            alert('Profile updated successfully!');
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            resetState();
            window.location.href = '/';
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Squares Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Squares
                    speed={0.3}
                    squareSize={50}
                    direction="diagonal"
                    borderColor="rgba(245, 158, 11, 0.15)"
                    hoverFillColor="rgba(245, 158, 11, 0.1)"
                />
            </div>
            
            <div className="relative z-10 space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your profile and preferences</p>
            </div>

            {/* Profile Settings */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <User className="h-5 w-5 text-primary-500 mr-2" />
                    Profile Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field w-full"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                className="input-field w-full"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Degree
                            </label>
                            <input
                                type="text"
                                className="input-field w-full"
                                value={formData.degree}
                                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Branch/Major
                            </label>
                            <input
                                type="text"
                                className="input-field w-full"
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Graduation Year
                            </label>
                            <input
                                type="number"
                                className="input-field w-full"
                                value={formData.graduationYear}
                                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                                min={2020}
                                max={2030}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Placement Status
                            </label>
                            <select
                                className="input-field w-full"
                                value={formData.placementStatus}
                                onChange={(e) => setFormData({ ...formData, placementStatus: e.target.value as PlacementStatus })}
                            >
                                <option value="unplaced">Unplaced</option>
                                <option value="partially_placed">Partially Placed</option>
                                <option value="placed">Placed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-2" />
                            Target Roles (comma-separated)
                        </label>
                        <input
                            type="text"
                            className="input-field w-full"
                            value={formData.targetRoles}
                            onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
                            placeholder="Software Engineer, Data Scientist, Product Manager"
                        />
                    </div>

                    <button type="submit" className="btn-primary flex items-center space-x-2">
                        <Save className="h-5 w-5" />
                        <span>Save Changes</span>
                    </button>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="card p-6 border-2 border-red-500/30">
                <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
                <p className="text-gray-400 mb-4">
                    Reset all your data including profile, analytics, skills, and applications. This action cannot be undone.
                </p>
                <button
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                    <RefreshCw className="h-5 w-5" />
                    <span>Reset All Data</span>
                </button>
            </div>
            </div>
        </div>
    );
};
