import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MagicBento } from '../MagicBento';
import type { FailureAnalysisChartProps } from '../../types';

export const FailureAnalysisChart: React.FC<FailureAnalysisChartProps> = ({ failureAnalysis }) => {
    const allCategories = [
        ...failureAnalysis.technicalWeaknesses,
        ...failureAnalysis.hrIssues,
        ...failureAnalysis.systemDesignGaps,
    ].map(item => ({
        ...item,
        name: item.category,
        value: item.percentage,
    }));

    const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];

    return (
        <MagicBento 
            className="p-6 animate-fade-in" 
            glowColor="239, 68, 68"
            spotlightRadius={400}
            enableTilt={true}
            enableBorderGlow={true}
            enableSpotlight={true}
            particleCount={10}
        >
            <h3 className="text-xl font-bold text-white mb-6">Failure Analysis</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={allCategories}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {allCategories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Technical Weaknesses</h4>
                        <div className="space-y-2">
                            {failureAnalysis.technicalWeaknesses.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-white">{item.category}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-300">
                                        {item.count} ({item.percentage}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">HR Issues</h4>
                        <div className="space-y-2">
                            {failureAnalysis.hrIssues.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-white">{item.category}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-300">
                                        {item.count} ({item.percentage}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">System Design Gaps</h4>
                        <div className="space-y-2">
                            {failureAnalysis.systemDesignGaps.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-white">{item.category}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-300">
                                        {item.count} ({item.percentage}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-dark-900 rounded-lg border border-dark-700">
                <h4 className="text-sm font-semibold text-primary-400 mb-2">Overall Pattern</h4>
                <p className="text-sm text-gray-300">{failureAnalysis.overallPattern}</p>
            </div>
        </MagicBento>
    );
};
