import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { MagicBento } from '../MagicBento';
import type { SkillGapMatrixProps } from '../../types';

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({ skillGaps }) => {
    const chartData = skillGaps.map((gap) => ({
        skill: gap.skill,
        current: gap.currentLevel,
        required: gap.requiredLevel,
        gap: gap.gap,
    }));

    const getBarColor = (gap: number) => {
        if (gap > 50) return '#ef4444'; // red
        if (gap > 25) return '#f59e0b'; // orange
        return '#10b981'; // green
    };

    return (
        <MagicBento 
            className="p-6 animate-fade-in" 
            glowColor="99, 102, 241"
            spotlightRadius={400}
            enableTilt={true}
            enableBorderGlow={true}
            enableSpotlight={true}
            particleCount={10}
        >
            <h3 className="text-xl font-bold text-white mb-6">Skill Gap Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="skill" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                    />
                    <Legend />
                    <Bar dataKey="current" fill="#10b981" name="Current Level" />
                    <Bar dataKey="required" fill="#6366f1" name="Required Level" />
                </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillGaps.slice(0, 6).map((gap, index) => (
                    <div key={index} className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-semibold text-white">{gap.skill}</h4>
                            <span
                                className={`text-xs px-2 py-1 rounded ${gap.priority === 'high'
                                        ? 'bg-red-500/20 text-red-400'
                                        : gap.priority === 'medium'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-green-500/20 text-green-400'
                                    }`}
                            >
                                {gap.priority}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Current:</span>
                                <span className="text-primary-400">{gap.currentLevel}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Required:</span>
                                <span className="text-indigo-400">{gap.requiredLevel}%</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-gray-400">Gap:</span>
                                <span style={{ color: getBarColor(gap.gap) }}>{gap.gap}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </MagicBento>
    );
};
