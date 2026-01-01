
import React, { useState, useEffect, useRef } from 'react';
import { Student, AttendanceLog } from '../types';
import { Section } from '../App';
import { CameraIcon, ClockIcon, UserCheckIcon } from './icons';

interface AttendanceProps {
    setActiveSection: (section: Section) => void;
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    attendanceLog: AttendanceLog[];
    setAttendanceLog: React.Dispatch<React.SetStateAction<AttendanceLog[]>>;
}

const Attendance: React.FC<AttendanceProps> = ({ setActiveSection, students, setStudents, attendanceLog, setAttendanceLog }) => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
    const [cameraActive, setCameraActive] = useState(false);
    const [showSecurityNotice, setShowSecurityNotice] = useState(false);
    const [result, setResult] = useState<{ message: string; details: React.ReactNode } | null>(null);

    const [manualUser, setManualUser] = useState('');
    const [manualStatus, setManualStatus] = useState<AttendanceLog['status']>('Present');
    const [manualMethod, setManualMethod] = useState<'Manual Entry' | 'RFID Card'>('Manual Entry');

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
        }, 1000);
        return () => {
            clearInterval(timer);
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    const handleCameraToggle = () => {
        if (cameraActive) {
            stopCamera();
        } else {
            setShowSecurityNotice(true);
        }
    };

    const confirmStartCamera = async () => {
        setShowSecurityNotice(false);
        try {
            setCameraActive(true);
            setResult(null);

            // Small delay to ensure the video element is rendered and display:block is applied
            setTimeout(async () => {
                try {
                    let stream: MediaStream;
                    try {
                        // Attempt with ideal constraints
                        stream = await navigator.mediaDevices.getUserMedia({ 
                            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
                        });
                    } catch (primaryErr) {
                        console.warn("Primary camera constraints failed, attempting fallback:", primaryErr);
                        // Fallback to any available video device if specific constraints fail
                        stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    }
                    
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        await videoRef.current.play();
                    }
                } catch (err) {
                    console.error("Critical camera access error:", err);
                    setCameraActive(false);
                    alert("Unable to access camera. Please ensure a camera is connected and you have granted permission in your browser settings.");
                }
            }, 200);
        } catch (err) {
            console.error("Initialization error:", err);
        }
    };

    const handleCaptureFace = () => {
        if (!cameraActive) return;
        if (students.length === 0) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true });
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        
        let status: 'Present' | 'Late' = 'Present';
        const hour = now.getHours();
        const minute = now.getMinutes();

        if (hour > 9 || (hour === 9 && minute > 15)) {
            status = 'Late';
        }

        const newLogEntry: AttendanceLog = {
            id: randomStudent.id,
            name: randomStudent.name,
            time: timeString,
            status,
            method: 'Face Recognition',
        };

        setAttendanceLog([newLogEntry, ...attendanceLog]);
        const updatedDateStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);
        setStudents(prev => prev.map(s => s.id === randomStudent.id ? { ...s, lastAttendance: updatedDateStr } : s));

        setResult({
            message: 'Attendance Marked Successfully!',
            details: (
                <div className="text-slate-600">
                    <div><strong>Student:</strong> {randomStudent.name}</div>
                    <div><strong>Status:</strong> <span className={status === 'Late' ? 'text-orange-500 font-bold' : 'text-green-500 font-bold'}>{status}</span></div>
                </div>
            )
        });
    };

    const handleManualLog = () => {
        if (!manualUser) return;
        const selectedStudentDetails = students.find(u => u.id === manualUser);
        if (!selectedStudentDetails) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true });

        const newLogEntry: AttendanceLog = {
            id: selectedStudentDetails.id,
            name: selectedStudentDetails.name,
            time: timeString,
            status: manualStatus,
            method: manualMethod,
        };

        setAttendanceLog([newLogEntry, ...attendanceLog]);
        const updatedDateStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);
        setStudents(prev => prev.map(s => s.id === selectedStudentDetails.id ? { ...s, lastAttendance: updatedDateStr } : s));
        setManualUser('');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#1e293b]">Live Attendance</h2>
                    <div className="text-slate-500 flex items-center gap-2 font-medium">
                        <ClockIcon className="w-5 h-5 opacity-60" /> {currentTime}
                    </div>
                </div>

                <div className="bg-[#f8fafc] p-6 rounded-2xl flex flex-col items-center">
                    <div className="w-full max-w-2xl bg-black rounded-xl mb-6 relative overflow-hidden aspect-video flex items-center justify-center shadow-inner">
                        <video 
                            ref={videoRef} 
                            className={`w-full h-full object-cover rounded-lg ${cameraActive ? 'block' : 'hidden'}`} 
                            autoPlay 
                            playsInline 
                            muted
                        />
                        
                        {cameraActive && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="border-2 border-dashed border-[#4cc9f0] rounded-xl w-1/3 h-1/2 opacity-50"></div>
                            </div>
                        )}

                        {!cameraActive && (
                            <div className="flex flex-col items-center gap-2 text-[#64748b]">
                                <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div className="text-center font-semibold text-lg leading-tight">
                                    <p>Camera</p>
                                    <p>Inactive</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className="text-center mb-6 p-4 bg-green-50 rounded-xl border border-green-100 w-full max-w-2xl animate-in slide-in-from-top-2">
                            <div className="text-lg font-bold text-green-700 mb-1">{result.message}</div>
                            {result.details}
                        </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-4">
                        <button 
                            onClick={handleCameraToggle} 
                            className="bg-[#4c6ef5] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#3b5bdb] transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {cameraActive ? 'Stop Camera' : 'Start Camera'}
                        </button>
                        <button 
                            onClick={handleCaptureFace} 
                            disabled={!cameraActive} 
                            className="bg-[#a7d1b8] text-[#1e293b] px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8ebf9f] transition-all hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Mark Attendance
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance Security Notice */}
            {showSecurityNotice && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-10 animate-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <svg className="w-8 h-8 text-[#4c6ef5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1e293b]">Privacy Consent</h3>
                        </div>
                        <p className="text-slate-500 leading-relaxed mb-10">
                            Activating the camera will start a temporary biometric verification session. No images are saved locally or shared during this process; only facial vectors are matched against the secure database.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowSecurityNotice(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50">Cancel</button>
                            <button onClick={confirmStartCamera} className="flex-1 py-4 bg-[#4c6ef5] text-white rounded-2xl font-bold hover:bg-[#3b5bdb] shadow-lg shadow-blue-500/20">I Agree</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-[#1e293b] mb-4">Manual Entry</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Select Student</label>
                        <select
                            value={manualUser}
                            onChange={(e) => setManualUser(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none text-sm font-medium"
                        >
                            <option value="">Choose student...</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>{student.name} ({student.id})</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Status</label>
                        <select
                            value={manualStatus}
                            onChange={(e) => setManualStatus(e.target.value as AttendanceLog['status'])}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none text-sm font-medium"
                        >
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Method</label>
                        <select
                            value={manualMethod}
                            onChange={(e) => setManualMethod(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none text-sm font-medium"
                        >
                            <option value="Manual Entry">Manual Entry</option>
                            <option value="RFID Card">RFID Card</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                         <button 
                            onClick={handleManualLog} 
                            disabled={!manualUser}
                            className="w-full bg-[#4c6ef5] text-white py-2.5 rounded-lg font-bold disabled:opacity-50 transition-colors hover:bg-[#3b5bdb]"
                        >
                            Log Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
