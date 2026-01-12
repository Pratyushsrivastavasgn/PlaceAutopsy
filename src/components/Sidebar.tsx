import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Briefcase,
    Settings,
    TrendingUp,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Assessments', href: '/assessments', icon: ClipboardList },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            <div className="flex flex-col flex-grow bg-dark-900 border-r border-dark-700 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-6 mb-8">
                    <TrendingUp className="h-8 w-8 text-primary-500" />
                    <span className="ml-3 text-2xl font-bold text-white">PlaceAutopsy</span>
                </div>
                <nav className="flex-1 px-3 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                                        : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                                    }
                `}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                                        }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex-shrink-0 px-6 py-4 border-t border-dark-700">
                    <p className="text-xs text-gray-500">
                        © 2024 Analytix
                    </p>
                </div>
            </div>
        </div>
    );
};
