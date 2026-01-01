
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import Reports from './components/Reports';
import Users from './components/Users';
import Register from './components/Register';
import Settings from './components/Settings';

export type Section = 'dashboard' | 'attendance' | 'reports' | 'users' | 'register' | 'settings';

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>('dashboard');

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'attendance':
                return <Attendance setActiveSection={setActiveSection} />;
            case 'reports':
                return <Reports />;
            case 'users':
                return <Users />;
            case 'register':
                return <Register />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };
    
    const getSectionTitle = (section: Section): string => {
        const titles: Record<Section, string> = {
            dashboard: 'Dashboard',
            attendance: 'Mark Attendance',
            reports: 'Reports',
            users: 'Manage Users',
            register: 'Register Face',
            settings: 'Settings'
        };
        return titles[section];
    }

    return (
        <div className="flex min-h-screen font-sans">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <main className="flex-1 transition-all duration-300 ml-16 lg:ml-64">
                 <div className="p-3 md:p-6">
                    <Header title={getSectionTitle(activeSection)} />
                    {renderSection()}
                 </div>
            </main>
        </div>
    );
};

export default App;
