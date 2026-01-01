
import React, { useState, useMemo } from 'react';
import { sampleData } from '../constants';
import { Student } from '../types';

const Students: React.FC = () => {
    const [students, setStudents] = useState<Student[]>(sampleData.students);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredStudents = useMemo(() => {
        return students
            .filter(student => {
                const search = searchTerm.toLowerCase();
                return student.name.toLowerCase().includes(search) ||
                       student.id.toLowerCase().includes(search) ||
                       student.course.toLowerCase().includes(search);
            })
            .filter(student => {
                if (filter === 'all') return true;
                if (filter === 'with-face') return student.faceRegistered;
                if (filter === 'without-face') return !student.faceRegistered;
                if (filter === 'active') return student.status === 'Active';
                if (filter === 'inactive') return student.status === 'Inactive';
                return true;
            });
    }, [students, searchTerm, filter]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-dark">Manage Students</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name, ID or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="all">All Students</option>
                    <option value="with-face">With Face Registered</option>
                    <option value="without-face">Without Face Registered</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Course</th>
                            <th className="px-6 py-3">Face Registered</th>
                            <th className="px-6 py-3">Last Attendance</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">{student.id}</td>
                                <td className="px-6 py-4">{student.name}</td>
                                <td className="px-6 py-4">{student.course}</td>
                                <td className="px-6 py-4">
                                    {student.faceRegistered ? (
                                        <span className="text-green-600 font-semibold">Yes</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">{student.lastAttendance}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Students;
