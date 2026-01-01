
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserCheckIcon, UserTimesIcon, ClockIcon, ArrowUpIcon, ArrowDownIcon, AttendanceLogo } from './icons';
import { AttendanceLog, Student } from '../types';

interface CardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    change: string;
    changeType: 'positive' | 'negative';
    colorClass: string;
}

const StatCard: React.FC<CardProps> = ({ icon, title, value, change, changeType, colorClass }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass}`}>
                {icon}
            </div>
            <div className="text-sm text-slate-500 mb-1">{title}</div>
            <div className="text-3xl font-bold text-slate-800 mb-2">{value}</div>
            <div className={`text-xs flex items-center gap-1 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {changeType === 'positive' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                <span>{change}</span>
            </div>
        </div>
    );
};

interface DashboardProps {
    attendanceLog: AttendanceLog[];
    students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ attendanceLog, students }) => {
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setChartReady(true), 1);
        return () => clearTimeout(timer);
    }, []);

    const stats = useMemo(() => {
        const today = new Date().toLocaleDateString();
        const presentToday = attendanceLog.filter(log => log.status === 'Present').length;
        const lateToday = attendanceLog.filter(log => log.status === 'Late').length;
        const total = students.length;
        const absent = total - (presentToday + lateToday);

        return {
            present: presentToday,
            late: lateToday,
            absent: Math.max(0, absent),
            total: total
        };
    }, [attendanceLog, students]);

    const chartData = [
        { name: 'Mon', Present: 45, Absent: 5 },
        { name: 'Tue', Present: 42, Absent: 8 },
        { name: 'Wed', Present: 48, Absent: 2 },
        { name: 'Thu', Present: 42, Absent: 8 },
        { name: 'Fri', Present: 40, Absent: 10 },
        { name: 'Today', Present: stats.present + stats.late, Absent: stats.absent },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    icon={<UserCheckIcon />} 
                    title="Present Students" 
                    value={stats.present} 
                    change="Live update" 
                    changeType="positive" 
                    colorClass="bg-primary/10 text-primary"
                />
                <StatCard 
                    icon={<UserTimesIcon />} 
                    title="Absent Students" 
                    value={stats.absent} 
                    change="2% from yesterday" 
                    changeType="negative" 
                    colorClass="bg-success/10 text-success"
                />
                <StatCard 
                    icon={<ClockIcon />} 
                    title="Late Arrivals" 
                    value={stats.late} 
                    change="Updated" 
                    changeType="negative" 
                    colorClass="bg-warning/10 text-warning"
                />
                <StatCard 
                    icon={<AttendanceLogo className="w-6 h-6" color="currentColor" />} 
                    title="Total Students" 
                    value={stats.total} 
                    change="Database total" 
                    changeType="positive" 
                    colorClass="bg-danger/10 text-danger"
                />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <AttendanceLogo className="w-6 h-6 text-primary" color="currentColor" />
                        <h2 className="text-xl font-semibold text-slate-800">Attendance Overview</h2>
                    </div>
                </div>
                <div className="relative w-full h-[300px]">
                    {chartReady && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                                <Legend />
                                <Bar dataKey="Present" fill="#4361ee" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Absent" fill="#f72585" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
