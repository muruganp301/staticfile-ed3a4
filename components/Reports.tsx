
import React, { useState } from 'react';
import { sampleData } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DownloadIcon } from './icons';

type Tab = 'daily' | 'weekly' | 'monthly';

const chartData = [
    { name: 'Week 1', Present: 45, Late: 5, Absent: 0 },
    { name: 'Week 2', Present: 42, Late: 8, Absent: 0 },
    { name: 'Week 3', Present: 48, Late: 2, Absent: 0 },
    { name: 'Week 4', Present: 40, Late: 10, Absent: 0 },
];

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-medium text-sm transition-colors duration-300 border-b-2 ${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}
    >
        {label}
    </button>
);

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('daily');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'daily':
                return <DailyReportTab />;
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-dark">Attendance Reports</h2>
                <button className="bg-primary text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-primary/90 transition">
                    <DownloadIcon />
                    Export Report
                </button>
            </div>
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-2">
                    <TabButton label="Daily Report" isActive={activeTab === 'daily'} onClick={() => setActiveTab('daily')} />
                    <TabButton label="Weekly Report" isActive={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')} />
                    <TabButton label="Monthly Report" isActive={activeTab === 'monthly'} onClick={() => setActiveTab('monthly')} />
                </nav>
            </div>
            <div>{renderTabContent()}</div>
        </div>
    );
};

const DailyReportTab: React.FC = () => (
    <div>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
             {/* Form Controls */}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs text-gray-700 uppercase">
                    <tr>
                        <th className="px-6 py-3">Employee ID</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Department</th>
                        <th className="px-6 py-3">Time In</th>
                        <th className="px-6 py-3">Time Out</th>
                        <th className="px-6 py-3">Working Hours</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sampleData.dailyReport.map((record) => (
                        <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4">{record.id}</td>
                            <td className="px-6 py-4">{record.name}</td>
                            <td className="px-6 py-4">{record.department}</td>
                            <td className="px-6 py-4">{record.timeIn}</td>
                            <td className="px-6 py-4">{record.timeOut}</td>
                            <td className="px-6 py-4">{record.hours}</td>
                            <td className={`px-6 py-4 font-semibold ${record.status === 'Late' ? 'text-yellow-600' : 'text-green-600'}`}>{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const WeeklyReportTab: React.FC = () => (
     <div className="text-center text-gray-500 p-8">Weekly report content would go here.</div>
);

const MonthlyReportTab: React.FC = () => (
    <div>
        <div className="w-full h-80 mb-6">
             <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Present" stroke="#4361ee" strokeWidth={2} />
                    <Line type="monotone" dataKey="Late" stroke="#f8961e" strokeWidth={2} />
                    <Line type="monotone" dataKey="Absent" stroke="#f72585" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="text-center text-gray-500 p-8">Monthly report table would go here.</div>
    </div>
);

export default Reports;
