import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MagicBento } from '../MagicBento';
import type { KpiCardProps } from '../../types';

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, trend }) => {
    return (
        <MagicBento 
            className="p-6 animate-fade-in" 
            glowColor="16, 185, 129"
            enableTilt={true}
            enableBorderGlow={true}
            enableSpotlight={true}
            particleCount={6}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <div className="mt-2 flex items-center text-sm">
                            {trend.direction === 'up' ? (
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}>
                                {trend.value}%
                            </span>
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg">
                    {icon}
                </div>
            </div>
        </MagicBento>
    );
};
