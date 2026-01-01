
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AttendanceLog } from '../types';

type Tab = 'daily' | 'weekly' | 'monthly';

interface ReportsProps {
    attendanceLog: AttendanceLog[];
}

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 font-medium text-sm transition-all duration-300 border-b-2 whitespace-nowrap ${isActive ? 'border-[#4361ee] text-[#4361ee]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
    >
        {label}
    </button>
);

const Reports: React.FC<ReportsProps> = ({ attendanceLog }) => {
    const [activeTab, setActiveTab] = useState<Tab>('daily');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'daily':
                return <DailyReportTab attendanceLog={attendanceLog} />;
            case 'weekly':
                return <WeeklyReportTab />;
            case 'monthly':
                return <MonthlyReportTab />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">Attendance Reports</h2>
                <button className="bg-[#4c6ef5] text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-[#3b5bdb] transition shadow-md shadow-blue-500/20">
                    Export Report
                </button>
            </div>
            <div className="border-b border-gray-100 mb-6">
                <nav className="flex space-x-8">
                    <TabButton label="Daily Report" isActive={activeTab === 'daily'} onClick={() => setActiveTab('daily')} />
                    <TabButton label="Weekly Report" isActive={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')} />
                    <TabButton label="Monthly Report" isActive={activeTab === 'monthly'} onClick={() => setActiveTab('monthly')} />
                </nav>
            </div>
            <div>{renderTabContent()}</div>
        </div>
    );
};

const DailyReportTab: React.FC<{ attendanceLog: AttendanceLog[] }> = ({ attendanceLog }) => (
    <div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#f8f9fc]">
                    <tr>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Time In</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Method</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {attendanceLog.map((record, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-5 font-semibold text-slate-800">{record.id}</td>
                            <td className="px-6 py-5 font-medium text-slate-800">{record.name}</td>
                            <td className="px-6 py-5 text-slate-700 font-medium">{record.time}</td>
                            <td className="px-6 py-5">
                                <span className={`font-bold ${record.status === 'Late' ? 'text-[#d69e2e]' : 'text-[#38a169]'}`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-slate-600 text-right">{record.method}</td>
                        </tr>
                    ))}
                    {attendanceLog.length === 0 && (
                         <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400">No attendance records found for today.</td>
                         </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const WeeklyReportTab: React.FC = () => (
     <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 2v-6m-8 10H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-7" />
        </svg>
        <p className="text-lg font-medium">Weekly report summary is being generated...</p>
        <p className="text-sm">Check back shortly for visual analytics.</p>
     </div>
);

const MonthlyReportTab: React.FC = () => {
    const [chartReady, setChartReady] = useState(false);
    const chartData = [
        { name: 'Week 1', Present: 45, Late: 5, Absent: 0 },
        { name: 'Week 2', Present: 42, Late: 8, Absent: 0 },
        { name: 'Week 3', Present: 48, Late: 2, Absent: 0 },
        { name: 'Week 4', Present: 40, Late: 10, Absent: 0 },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setChartReady(true), 1);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <div className="bg-slate-50/50 p-4 rounded-xl mb-6 border border-slate-100">
                <div className="relative w-full h-80">
                    {chartReady && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                                <Legend wrapperStyle={{paddingTop: '20px'}} />
                                <Line type="monotone" dataKey="Present" stroke="#4361ee" strokeWidth={3} dot={{r: 4, fill: '#4361ee'}} activeDot={{r: 6}} />
                                <Line type="monotone" dataKey="Late" stroke="#f8961e" strokeWidth={3} dot={{r: 4, fill: '#f8961e'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
