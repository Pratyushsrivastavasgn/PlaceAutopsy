import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Briefcase, Calendar, Building } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import Squares from '../components/Squares';
import type { JobApplication, ApplicationStatus, ApplicationType } from '../types';

export const Jobs: React.FC = () => {
    const { applications, addApplication, updateApplication, deleteApplication } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        applicationType: 'on-campus' as ApplicationType,
        status: 'in-progress' as ApplicationStatus,
        appliedDate: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newApplication: JobApplication = {
            id: `app-${Date.now()}`,
            company: formData.company,
            role: formData.role,
            applicationType: formData.applicationType,
            status: formData.status,
            appliedDate: new Date(formData.appliedDate),
        };

        if (editingId) {
            updateApplication(editingId, newApplication);
            setEditingId(null);
        } else {
            addApplication(newApplication);
        }

        setFormData({
            company: '',
            role: '',
            applicationType: 'on-campus',
            status: 'in-progress',
            appliedDate: new Date().toISOString().split('T')[0],
        });
        setIsAdding(false);
    };

    const handleEdit = (app: JobApplication) => {
        setFormData({
            company: app.company,
            role: app.role,
            applicationType: app.applicationType,
            status: app.status,
            appliedDate: new Date(app.appliedDate).toISOString().split('T')[0],
        });
        setEditingId(app.id);
        setIsAdding(true);
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'selected':
                return 'bg-green-500/20 text-green-400 border-green-500';
            case 'rejected':
                return 'bg-red-500/20 text-red-400 border-red-500';
            case 'in-progress':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
        }
    };

    const getTypeColor = (type: ApplicationType) => {
        switch (type) {
            case 'on-campus':
                return 'bg-blue-500/20 text-blue-400';
            case 'off-campus':
                return 'bg-purple-500/20 text-purple-400';
            case 'referral':
                return 'bg-pink-500/20 text-pink-400';
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
                    borderColor="rgba(139, 92, 246, 0.15)"
                    hoverFillColor="rgba(139, 92, 246, 0.1)"
                />
            </div>
            
            <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Job Applications</h1>
                    <p className="text-gray-400 mt-1">Track your job applications and interview progress</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Application</span>
                </button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="card p-6 animate-slide-up">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {editingId ? 'Edit Application' : 'Add New Application'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="e.g., Google, Microsoft"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Application Type</label>
                                <select
                                    className="input-field w-full"
                                    value={formData.applicationType}
                                    onChange={(e) => setFormData({ ...formData, applicationType: e.target.value as ApplicationType })}
                                >
                                    <option value="on-campus">On-Campus</option>
                                    <option value="off-campus">Off-Campus</option>
                                    <option value="referral">Referral</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                <select
                                    className="input-field w-full"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                                >
                                    <option value="in-progress">In Progress</option>
                                    <option value="selected">Selected</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Applied Date</label>
                                <input
                                    type="date"
                                    required
                                    className="input-field w-full"
                                    value={formData.appliedDate}
                                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update Application' : 'Add Application'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                    setFormData({
                                        company: '',
                                        role: '',
                                        applicationType: 'on-campus',
                                        status: 'in-progress',
                                        appliedDate: new Date().toISOString().split('T')[0],
                                    });
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Applications List */}
            <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                    <div key={app.id} className="card p-6 hover:shadow-xl transition-shadow animate-fade-in">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="p-3 bg-primary-500/20 rounded-lg">
                                    <Building className="h-6 w-6 text-primary-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-xl font-semibold text-white">{app.company}</h3>
                                        <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                                            {app.status.replace('-', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mb-3">{app.role}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${getTypeColor(app.applicationType)}`}>
                                            {app.applicationType.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(app)}
                                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                                >
                                    <Edit2 className="h-4 w-4 text-gray-400 hover:text-primary-500" />
                                </button>
                                <button
                                    onClick={() => deleteApplication(app.id)}
                                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {applications.length === 0 && !isAdding && (
                <div className="card p-12 text-center">
                    <Briefcase className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-6">Start tracking your job applications</p>
                    <button onClick={() => setIsAdding(true)} className="btn-primary">
                        Add Your First Application
                    </button>
                </div>
            )}
            </div>
        </div>
    );
};
