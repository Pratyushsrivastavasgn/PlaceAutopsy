import React from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink } from 'lucide-react';
import { MagicBento } from '../MagicBento';
import type { ActionPlanCardProps } from '../../types';

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ action, onToggleComplete }) => {
    const priorityColors = {
        high: 'border-red-500 bg-red-500/10',
        medium: 'border-yellow-500 bg-yellow-500/10',
        low: 'border-green-500 bg-green-500/10',
    };

    const priorityTextColors = {
        high: 'text-red-400',
        medium: 'text-yellow-400',
        low: 'text-green-400',
    };

    const glowColors: Record<string, string> = {
        high: '239, 68, 68',
        medium: '245, 158, 11',
        low: '16, 185, 129',
    };

    return (
        <MagicBento
            className={`p-5 border-l-4 ${priorityColors[action.priority]}`}
            glowColor={glowColors[action.priority]}
            enableTilt={true}
            enableBorderGlow={true}
            enableSpotlight={true}
            clickEffect={true}
            particleCount={6}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                    <button
                        onClick={() => onToggleComplete(action.id)}
                        className="mt-1 focus:outline-none"
                    >
                        {action.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-primary-500" />
                        ) : (
                            <Circle className="h-6 w-6 text-gray-500 hover:text-primary-500 transition-colors" />
                        )}
                    </button>
                    <div className="flex-1">
                        <h4
                            className={`text-lg font-semibold ${action.completed ? 'text-gray-500 line-through' : 'text-white'
                                }`}
                        >
                            {action.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">{action.description}</p>
                    </div>
                </div>
                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityTextColors[action.priority]} border ${action.priority === 'high'
                            ? 'border-red-500'
                            : action.priority === 'medium'
                                ? 'border-yellow-500'
                                : 'border-green-500'
                        }`}
                >
                    {action.priority.toUpperCase()}
                </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{action.estimatedTime}</span>
                </div>
                <div className="px-2 py-1 bg-dark-900 rounded text-xs">{action.category}</div>
                {action.deadline && (
                    <div className="text-xs">
                        Due: {new Date(action.deadline).toLocaleDateString()}
                    </div>
                )}
            </div>

            {action.resources.length > 0 && (
                <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-gray-400 uppercase">Resources</h5>
                    <div className="space-y-1">
                        {action.resources.map((resource, index) => (
                            <a
                                key={index}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 bg-dark-900 rounded hover:bg-dark-800 transition-colors group"
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs px-2 py-1 bg-primary-500/20 text-primary-400 rounded">
                                        {resource.type}
                                    </span>
                                    <span className="text-sm text-gray-300 group-hover:text-white">
                                        {resource.title}
                                    </span>
                                </div>
                                <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-primary-500" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </MagicBento>
    );
};
