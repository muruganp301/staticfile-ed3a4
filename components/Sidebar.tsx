
import React from 'react';
import { Section } from '../App';
import { HomeIcon, CheckCircleIcon, ChartBarIcon, CogIcon, AttendanceLogo, UsersIcon, UserPlusIcon } from './icons';

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
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                    <AttendanceLogo className="w-8 h-8 lg:w-10 lg:h-10 shrink-0" color="white" />
                    <span className="text-xl lg:text-2xl font-bold hidden lg:inline tracking-tight">ZX</span>
                </div>
                <p className="text-[10px] opacity-70 mt-1 hidden lg:block uppercase tracking-widest text-center lg:text-left">Smart Attendance</p>
            </div>

            <ul className="mt-4 flex-grow">
                <NavItem section="dashboard" activeSection={activeSection} setActiveSection={setActiveSection} icon={<HomeIcon />} label="Dashboard" />
                <NavItem section="attendance" activeSection={activeSection} setActiveSection={setActiveSection} icon={<CheckCircleIcon />} label="Mark Attendance" />
                <NavItem section="register" activeSection={activeSection} setActiveSection={setActiveSection} icon={<UserPlusIcon />} label="Register Face" />
                <NavItem section="students" activeSection={activeSection} setActiveSection={setActiveSection} icon={<UsersIcon />} label="Manage Students" />
                <NavItem section="reports" activeSection={activeSection} setActiveSection={setActiveSection} icon={<ChartBarIcon />} label="Reports" />
                <NavItem section="settings" activeSection={activeSection} setActiveSection={setActiveSection} icon={<CogIcon />} label="Settings" />
            </ul>
        </nav>
    );
};

export default Sidebar;
