
import React, { useState, useMemo } from 'react';
import { Student } from '../types';

interface StudentsProps {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    onRegisterFace?: (studentId: string) => void;
}

const Students: React.FC<StudentsProps> = ({ students, setStudents, onRegisterFace }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [sectionFilter, setSectionFilter] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [newStudent, setNewStudent] = useState({
        id: '',
        name: '',
        course: '',
        section: 'Section A',
    });

    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

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
            })
            .filter(student => {
                if (sectionFilter === 'all') return true;
                return student.section === sectionFilter;
            });
    }, [students, searchTerm, filter, sectionFilter]);

    const handleRemoveStudent = (id: string) => {
        if (confirm(`Are you sure you want to remove student ${id}?`)) {
            setStudents(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        const studentToAdd: Student = {
            ...newStudent,
            faceRegistered: false,
            lastAttendance: 'Never',
            status: 'Active'
        };
        setStudents(prev => [studentToAdd, ...prev]);
        setIsAddModalOpen(false);
        setNewStudent({ id: '', name: '', course: '', section: 'Section A' });
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;

        setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
        setIsEditModalOpen(false);
        setEditingStudent(null);
    };

    const sections = useMemo(() => Array.from(new Set(students.map(s => s.section))).sort(), [students]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-slate-800">Manage Students</h2>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#4c6ef5] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#3b5bdb] transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Student
                </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by name, ID or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-[#3a3a3a] text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none border-none shadow-sm"
                />
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-[#3a3a3a] text-white rounded-md px-4 py-3 focus:outline-none border-none shadow-sm min-w-[150px]"
                >
                    <option value="all">Status: All</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                </select>
                <select 
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="bg-[#3a3a3a] text-white rounded-md px-4 py-3 focus:outline-none border-none shadow-sm min-w-[150px]"
                >
                    <option value="all">Section: All</option>
                    {sections.map(sec => (
                        <option key={sec} value={sec}>Section: {sec}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-[#f8f9fc] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Section</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Face</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-5 font-semibold text-slate-800">{student.id}</td>
                                <td className="px-6 py-5 font-medium text-slate-800">{student.name}</td>
                                <td className="px-6 py-5 text-slate-600">{student.course}</td>
                                <td className="px-6 py-5">
                                    <span className="bg-[#edf2f7] px-3 py-1 rounded text-xs font-bold text-slate-600">
                                        {student.section}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    {student.faceRegistered ? (
                                        <span className="text-[#38a169] flex items-center gap-1.5 font-medium">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                            Yes
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => onRegisterFace?.(student.id)}
                                            className="text-primary hover:underline font-bold flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Register
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        student.status === 'Active' 
                                        ? 'bg-[#c6f6d5] text-[#22543d]' 
                                        : 'bg-[#fed7d7] text-[#742a2a]'
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button 
                                            onClick={() => openEditModal(student)}
                                            title="Edit Student"
                                            className="text-primary hover:bg-primary/10 p-2 rounded-md transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleRemoveStudent(student.id)}
                                            title="Delete Student"
                                            className="text-danger hover:bg-danger/10 p-2 rounded-md transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Student Modal - EXACT MATCH TO SCREENSHOT */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-[#1e293b]">Add New Student</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddStudent} className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Student ID</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. STU999"
                                    value={newStudent.id}
                                    onChange={e => setNewStudent({...newStudent, id: e.target.value})}
                                    className="w-full bg-[#3a3a3a] text-white rounded-lg px-4 py-3 focus:outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. John Doe"
                                    value={newStudent.name}
                                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                                    className="w-full bg-[#3a3a3a] text-white rounded-lg px-4 py-3 focus:outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Course</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. Computer Science"
                                    value={newStudent.course}
                                    onChange={e => setNewStudent({...newStudent, course: e.target.value})}
                                    className="w-full bg-[#3a3a3a] text-white rounded-lg px-4 py-3 focus:outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Section</label>
                                <select 
                                    value={newStudent.section}
                                    onChange={e => setNewStudent({...newStudent, section: e.target.value})}
                                    className="w-full bg-[#3a3a3a] text-white rounded-lg px-4 py-3 focus:outline-none transition-all"
                                >
                                    <option value="Section A">Section A</option>
                                    <option value="Section B">Section B</option>
                                    <option value="Section C">Section C</option>
                                    <option value="Section D">Section D</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-3.5 border border-[#e2e8f0] rounded-xl text-[#64748b] font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-3.5 bg-[#4c6ef5] text-white rounded-xl font-bold hover:bg-[#3b5bdb] transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {isEditModalOpen && editingStudent && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-[#1e293b]">Edit Student Details</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Student ID (Locked)</label>
                                <input 
                                    disabled
                                    type="text" 
                                    value={editingStudent.id}
                                    className="w-full bg-[#f8f9fc] border border-[#edf2f7] rounded-lg px-4 py-3 text-[#94a3b8] font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={editingStudent.name}
                                    onChange={e => setEditingStudent({...editingStudent, name: e.target.value})}
                                    className="w-full bg-[#3a3a3a] text-white rounded-lg px-4 py-3 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Course</label>
                                <input 
                                    required
                                    type="text" 
                                    value={editingStudent.course}
                                    onChange={e => setEditingStudent({...editingStudent, course: e.target.value})}
                                    className="w-full bg-[#3a3a3a] text-white rounded-lg px-4 py-3 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Section</label>
                                    <select 
                                        value={editingStudent.section}
                                        onChange={e => setEditingStudent({...editingStudent, section: e.target.value})}
                                        className="w-full bg-[#3a3a3a] text-white rounded-lg px-4 py-3 focus:outline-none transition-all"
                                    >
                                        <option value="Section A">Section A</option>
                                        <option value="Section B">Section B</option>
                                        <option value="Section C">Section C</option>
                                        <option value="Section D">Section D</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6b859e] uppercase mb-2 tracking-wide">Status</label>
                                    <select 
                                        value={editingStudent.status}
                                        onChange={e => setEditingStudent({...editingStudent, status: e.target.value as 'Active' | 'Inactive'})}
                                        className="w-full bg-[#3a3a3a] text-white rounded-lg px-4 py-3 focus:outline-none transition-all"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-4 py-3.5 border border-[#e2e8f0] rounded-xl text-[#64748b] font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-3.5 bg-[#4c6ef5] text-white rounded-xl font-bold hover:bg-[#3b5bdb] transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
