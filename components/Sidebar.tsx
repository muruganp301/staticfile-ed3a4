
import React from 'react';
import { Section } from '../App';
import { HomeIcon, CheckCircleIcon, ChartBarIcon, UsersIcon, UserPlusIcon, CogIcon, CameraIcon } from './icons';

interface SidebarProps {
    activeSection: Section;
    setActiveSection: (section: Section) => void;
}

const NavItem: React.FC<{
    section: Section;
    activeSection: Section;
    setActiveSection: (section: Section) => void;
    icon: React.ReactNode;
    label: string;
}> = ({ section, activeSection, setActiveSection, icon, label }) => {
    const isActive = activeSection === section;
    return (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(section);
                }}
                className={`flex items-center py-3 px-4 text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-300 relative group ${isActive ? 'bg-white/10 text-white' : ''}`}
            >
                {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-success"></span>}
                <div className="w-8 flex justify-center">{icon}</div>
                <span className="ml-2 whitespace-nowrap opacity-0 lg:opacity-100 transition-opacity duration-300">{label}</span>
            </a>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
    return (
        <nav className="fixed top-0 left-0 h-full bg-gradient-to-b from-primary to-secondary text-white w-16 lg:w-64 transition-all duration-300 z-50 flex flex-col">
            <div className="p-4 border-b border-white/10 text-center">
                <div className="flex items-center justify-center gap-2">
                    <CameraIcon className="w-8 h-8 text-success" />
                    <span className="text-2xl font-bold hidden lg:inline">AutoAttend</span>
                </div>
                <p className="text-xs opacity-80 mt-1 hidden lg:block">Automatic Attendance System</p>
            </div>

            <ul className="mt-4 flex-grow">
                <NavItem section="dashboard" activeSection={activeSection} setActiveSection={setActiveSection} icon={<HomeIcon />} label="Dashboard" />
                <NavItem section="attendance" activeSection={activeSection} setActiveSection={setActiveSection} icon={<CheckCircleIcon />} label="Mark Attendance" />
                <NavItem section="reports" activeSection={activeSection} setActiveSection={setActiveSection} icon={<ChartBarIcon />} label="Reports" />
                <NavItem section="users" activeSection={activeSection} setActiveSection={setActiveSection} icon={<UsersIcon />} label="Manage Users" />
                <NavItem section="register" activeSection={activeSection} setActiveSection={setActiveSection} icon={<UserPlusIcon />} label="Register Face" />
                <NavItem section="settings" activeSection={activeSection} setActiveSection={setActiveSection} icon={<CogIcon />} label="Settings" />
            </ul>
        </nav>
    );
};

export default Sidebar;
