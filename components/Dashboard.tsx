
import React from 'react';
import { sampleData } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserCheckIcon, UserTimesIcon, ClockIcon, UsersIcon, ArrowUpIcon, ArrowDownIcon } from './icons';

interface CardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
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
            <div className="text-sm text-gray-custom mb-1">{title}</div>
            <div className="text-3xl font-bold text-dark mb-2">{value}</div>
            <div className={`text-xs flex items-center gap-1 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {changeType === 'positive' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                <span>{change}</span>
            </div>
        </div>
    );
};

const chartData = [
    { name: 'Mon', Present: 45, Absent: 5 },
    { name: 'Tue', Present: 42, Absent: 8 },
    { name: 'Wed', Present: 48, Absent: 2 },
    { name: 'Thu', Present: 42, Absent: 8 },
    { name: 'Fri', Present: 40, Absent: 10 },
    { name: 'Sat', Present: 15, Absent: 35 },
    { name: 'Sun', Present: 10, Absent: 40 },
];

const Dashboard: React.FC = () => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    icon={<UserCheckIcon />} 
                    title="Present Today" 
                    value={sampleData.presentCount} 
                    change="5% from yesterday" 
                    changeType="positive" 
                    colorClass="bg-primary/10 text-primary"
                />
                <StatCard 
                    icon={<UserTimesIcon />} 
                    title="Absent Today" 
                    value={sampleData.absentCount} 
                    change="2% from yesterday" 
                    changeType="negative" 
                    colorClass="bg-success/10 text-success"
                />
                <StatCard 
                    icon={<ClockIcon />} 
                    title="Late Arrivals" 
                    value={sampleData.lateCount} 
                    change="3% from yesterday" 
                    changeType="negative" 
                    colorClass="bg-warning/10 text-warning"
                />
                <StatCard 
                    icon={<UsersIcon />} 
                    title="Total Users" 
                    value={sampleData.totalUsers} 
                    change="2 new this week" 
                    changeType="positive" 
                    colorClass="bg-danger/10 text-danger"
                />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-dark">Attendance Overview</h2>
                    <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Present" fill="#4361ee" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Absent" fill="#f72585" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
