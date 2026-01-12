import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ExternalLink, Award } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import Squares from '../components/Squares';
import type { Skill, SkillLevel } from '../types';

export const Assessments: React.FC = () => {
    const { skills, addSkill, updateSkill, deleteSkill, analytics } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        skill: '',
        currentLevel: 'beginner' as SkillLevel,
        category: 'technical',
        proofLinks: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newSkill: Skill = {
            id: `skill-${Date.now()}`,
            skill: formData.skill,
            currentLevel: formData.currentLevel,
            category: formData.category,
            proofLinks: formData.proofLinks.split(',').map((link) => link.trim()).filter(Boolean),
            lastUpdated: new Date(),
        };

        if (editingId) {
            updateSkill(editingId, newSkill);
            setEditingId(null);
        } else {
            addSkill(newSkill);
        }

        setFormData({ skill: '', currentLevel: 'beginner', category: 'technical', proofLinks: '' });
        setIsAdding(false);
    };

    const handleEdit = (skill: Skill) => {
        setFormData({
            skill: skill.skill,
            currentLevel: skill.currentLevel,
            category: skill.category,
            proofLinks: skill.proofLinks.join(', '),
        });
        setEditingId(skill.id);
        setIsAdding(true);
    };

    const getLevelColor = (level: SkillLevel) => {
        switch (level) {
            case 'advanced':
                return 'bg-green-500/20 text-green-400 border-green-500';
            case 'intermediate':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
            case 'beginner':
                return 'bg-blue-500/20 text-blue-400 border-blue-500';
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
                    borderColor="rgba(16, 185, 129, 0.15)"
                    hoverFillColor="rgba(16, 185, 129, 0.1)"
                />
            </div>
            
            <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Skills Assessment</h1>
                    <p className="text-gray-400 mt-1">Manage your skills inventory and track proficiency levels</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Skill</span>
                </button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="card p-6 animate-slide-up">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {editingId ? 'Edit Skill' : 'Add New Skill'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Skill Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full"
                                    value={formData.skill}
                                    onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                                    placeholder="e.g., React, Python, DSA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Proficiency Level</label>
                                <select
                                    className="input-field w-full"
                                    value={formData.currentLevel}
                                    onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value as SkillLevel })}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                <select
                                    className="input-field w-full"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="technical">Technical</option>
                                    <option value="soft">Soft Skills</option>
                                    <option value="domain">Domain Knowledge</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Proof Links (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    className="input-field w-full"
                                    value={formData.proofLinks}
                                    onChange={(e) => setFormData({ ...formData, proofLinks: e.target.value })}
                                    placeholder="GitHub URL, Project URL, etc."
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update Skill' : 'Add Skill'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                    setFormData({ skill: '', currentLevel: 'beginner', category: 'technical', proofLinks: '' });
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                    <div key={skill.id} className="card p-6 hover:shadow-xl transition-shadow animate-fade-in">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Award className="h-5 w-5 text-primary-500" />
                                <h3 className="text-lg font-semibold text-white">{skill.skill}</h3>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(skill)}
                                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                                >
                                    <Edit2 className="h-4 w-4 text-gray-400 hover:text-primary-500" />
                                </button>
                                <button
                                    onClick={() => deleteSkill(skill.id)}
                                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <span className={`text-xs px-3 py-1 rounded-full border ${getLevelColor(skill.currentLevel)}`}>
                                    {skill.currentLevel.toUpperCase()}
                                </span>
                            </div>

                            <div className="text-sm">
                                <span className="text-gray-400">Category:</span>
                                <span className="ml-2 text-white">{skill.category}</span>
                            </div>

                            {skill.proofLinks.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-2">Proof Links:</p>
                                    <div className="space-y-1">
                                        {skill.proofLinks.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-xs text-primary-400 hover:text-primary-300 transition-colors"
                                            >
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                <span className="truncate">{link}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-xs text-gray-500">
                                Last updated: {new Date(skill.lastUpdated).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {skills.length === 0 && !isAdding && (
                <div className="card p-12 text-center">
                    <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No skills added yet</h3>
                    <p className="text-gray-500 mb-6">Start building your skills inventory</p>
                    <button onClick={() => setIsAdding(true)} className="btn-primary">
                        Add Your First Skill
                    </button>
                </div>
            )}
            </div>
        </div>
    );
};
