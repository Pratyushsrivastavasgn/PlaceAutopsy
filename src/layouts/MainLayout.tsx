import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-dark-950">
            <Sidebar />
            <div className="md:pl-64 flex flex-col flex-1">
                <TopNavbar />
                <main className="flex-1">
                    <div className="py-6 px-4 sm:px-6 md:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
