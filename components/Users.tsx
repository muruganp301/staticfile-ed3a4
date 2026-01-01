
import React, { useState, useMemo } from 'react';
import { sampleData } from '../constants';
import { User } from '../types';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(sampleData.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredUsers = useMemo(() => {
        return users
            .filter(user => {
                const search = searchTerm.toLowerCase();
                return user.name.toLowerCase().includes(search) ||
                       user.id.toLowerCase().includes(search) ||
                       user.department.toLowerCase().includes(search);
            })
            .filter(user => {
                if (filter === 'all') return true;
                if (filter === 'with-face') return user.faceRegistered;
                if (filter === 'without-face') return !user.faceRegistered;
                if (filter === 'active') return user.status === 'Active';
                if (filter === 'inactive') return user.status === 'Inactive';
                return true;
            });
    }, [users, searchTerm, filter]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-dark">Manage Users</h2>
                 <button className="bg-primary text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-primary/90 transition">
                    Add New User
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name, ID or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="all">All Users</option>
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
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Face Registered</th>
                            <th className="px-6 py-3">Last Attendance</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">{user.id}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.department}</td>
                                <td className="px-6 py-4">
                                    {user.faceRegistered ? (
                                        <span className="text-green-600 font-semibold">Yes</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">{user.lastAttendance}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-primary hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
