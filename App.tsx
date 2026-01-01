
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import Reports from './components/Reports';
import Students from './components/Students';
import Register from './components/Register';
import Settings from './components/Settings';
import { sampleData } from './constants';
import { Student, AttendanceLog } from './types';

export type Section = 'dashboard' | 'attendance' | 'reports' | 'students' | 'register' | 'settings';

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>('dashboard');
    const [students, setStudents] = useState<Student[]>(sampleData.students);
    const [attendanceLog, setAttendanceLog] = useState<AttendanceLog[]>(sampleData.attendanceLog);
    const [preselectedStudentId, setPreselectedStudentId] = useState<string | null>(null);

    const navigateToRegister = (studentId: string) => {
        setPreselectedStudentId(studentId);
        setActiveSection('register');
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard attendanceLog={attendanceLog} students={students} />;
            case 'attendance':
                return (
                    <Attendance 
                        setActiveSection={setActiveSection} 
                        students={students} 
                        attendanceLog={attendanceLog}
                        setAttendanceLog={setAttendanceLog}
                        setStudents={setStudents}
                    />
                );
            case 'reports':
                return <Reports attendanceLog={attendanceLog} />;
            case 'students':
                return (
                    <Students 
                        students={students} 
                        setStudents={setStudents} 
                        onRegisterFace={navigateToRegister}
                    />
                );
            case 'register':
                return (
                    <Register 
                        students={students} 
                        setStudents={setStudents} 
                        preselectedId={preselectedStudentId}
                        clearPreselected={() => setPreselectedStudentId(null)}
                    />
                );
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard attendanceLog={attendanceLog} students={students} />;
        }
    };
    
    const getSectionTitle = (section: Section): string => {
        const titles: Record<Section, string> = {
            dashboard: 'Dashboard',
            attendance: 'Mark Attendance',
            reports: 'Reports',
            students: 'Manage Students',
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
