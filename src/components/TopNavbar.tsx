import React from 'react';
import { Search, User } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';

export const TopNavbar: React.FC = () => {
    const { user } = useAppContext();

    return (
        <div className="sticky top-0 z-50 flex-shrink-0 flex h-16 bg-dark-900 border-b border-dark-700 shadow-lg">
            <div className="flex-1 px-4 flex justify-between items-center md:px-8">
                <div className="flex-1 flex">
                    <div className="w-full flex md:ml-0">
                        <div className="relative w-full text-gray-400 focus-within:text-gray-300">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                                <Search className="h-5 w-5" />
                            </div>
                            <input
                                className="block w-full h-full pl-10 pr-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm"
                                placeholder="Search..."
                                type="search"
                            />
                        </div>
                    </div>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">
                                {user?.name || 'Guest User'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {user?.degree || 'Student'}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                            <User className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
