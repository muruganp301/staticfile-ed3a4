
import React, { useState, useEffect, useRef } from 'react';
import { sampleData } from '../constants';
import { AttendanceLog, User } from '../types';
import { Section } from '../App';
// FIX: Import missing icons ClockIcon, UserCheckIcon, and UserPlusIcon.
import { CameraIcon, ClockIcon, UserCheckIcon, UserPlusIcon } from './icons';

const Button: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    color: 'primary' | 'success' | 'warning' | 'danger';
    children: React.ReactNode;
    className?: string;
}> = ({ onClick, disabled, color, children, className }) => {
    const colorClasses = {
        primary: 'bg-primary text-white hover:bg-primary/90',
        success: 'bg-success text-white hover:bg-success/90',
        warning: 'bg-warning text-white hover:bg-warning/90',
        danger: 'bg-danger text-white hover:bg-danger/90',
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-5 py-2.5 rounded-md font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${colorClasses[color]} ${className}`}
        >
            {children}
        </button>
    );
};

interface AttendanceProps {
    setActiveSection: (section: Section) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ setActiveSection }) => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
    const [log, setLog] = useState<AttendanceLog[]>(sampleData.attendanceLog);
    const [cameraActive, setCameraActive] = useState(false);
    const [result, setResult] = useState<{ message: string; details: React.ReactNode } | null>(null);

    const [manualUser, setManualUser] = useState('');
    const [manualStatus, setManualStatus] = useState<AttendanceLog['status']>('Present');
    const [manualMethod, setManualMethod] = useState<'Manual Entry' | 'RFID Card'>('Manual Entry');


    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleStartCamera = () => {
        if (cameraActive) {
            if (videoRef.current && videoRef.current.srcObject) {
                 const stream = videoRef.current.srcObject as MediaStream;
                 stream.getTracks().forEach(track => track.stop());
                 videoRef.current.srcObject = null;
            }
            setCameraActive(false);
        } else {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setCameraActive(true);
                    setResult(null);
                })
                .catch(err => {
                    console.error("Error accessing camera:", err);
                    alert("Could not access the camera. Please check permissions.");
                });
        }
    };

    const handleCaptureFace = () => {
        if (!cameraActive) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true });
        const randomUser = sampleData.users[Math.floor(Math.random() * sampleData.users.length)];
        
        let status: 'Present' | 'Late' = 'Present';
        const hour = now.getHours();
        const minute = now.getMinutes();

        if (hour > 9 || (hour === 9 && minute > 15)) {
            status = 'Late';
        }

        const newLogEntry: AttendanceLog = {
            id: randomUser.id,
            name: randomUser.name,
            time: timeString,
            status,
            method: 'Face Recognition',
        };

        setLog([newLogEntry, ...log]);
        setResult({
            message: 'Attendance Marked Successfully!',
            details: (
                <div className="text-gray-custom">
                    <div><strong>User:</strong> {randomUser.name} ({randomUser.id})</div>
                    <div><strong>Time:</strong> {timeString}</div>
                    <div><strong>Status:</strong> <span className={status === 'Late' ? 'text-yellow-500' : 'text-green-500'}>{status}</span></div>
                    <div><strong>Method:</strong> Face Recognition</div>
                </div>
            )
        });
    };

    const handleManualLog = () => {
        if (!manualUser) {
            alert('Please select a user to log attendance for.');
            return;
        }

        const selectedUserDetails = sampleData.users.find(u => u.id === manualUser);
        if (!selectedUserDetails) {
            alert('Selected user not found.');
            return;
        }

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true });

        const newLogEntry: AttendanceLog = {
            id: selectedUserDetails.id,
            name: selectedUserDetails.name,
            time: timeString,
            status: manualStatus,
            method: manualMethod,
        };

        setLog([newLogEntry, ...log]);
        
        // Reset form
        setManualUser('');
        setManualStatus('Present');
        setManualMethod('Manual Entry');
    };

    const getStatusClass = (status: AttendanceLog['status']) => {
        switch (status) {
            case 'Present': return 'text-green-600';
            case 'Late': return 'text-yellow-600';
            case 'Absent': return 'text-red-600';
            default: return '';
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-dark">Live Attendance</h2>
                    <div className="text-sm text-gray-custom flex items-center gap-2">
                        <ClockIcon /> {currentTime}
                    </div>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg flex flex-col items-center">
                    <div className="w-full max-w-2xl bg-black rounded-lg mb-4 relative">
                        <video ref={videoRef} className="w-full h-auto rounded-lg" autoPlay playsInline muted></video>
                        {cameraActive && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-success rounded-lg w-1/2 h-2/3"></div>}
                    </div>

                    {result && (
                        <div className="text-center mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-lg font-semibold text-green-700 mb-2">{result.message}</div>
                            {result.details}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={handleStartCamera} color="primary">
                            <CameraIcon className="w-5 h-5" /> {cameraActive ? 'Stop Camera' : 'Start Camera'}
                        </Button>
                        <Button onClick={handleCaptureFace} disabled={!cameraActive} color="success">
                            <UserCheckIcon /> Mark Attendance
                        </Button>
                        <Button onClick={() => setActiveSection('register')} color="warning">
                           <UserPlusIcon /> Register New Face
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-dark mb-4">Manual Attendance Log</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="manual-user" className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                        <select
                            id="manual-user"
                            value={manualUser}
                            onChange={(e) => setManualUser(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">-- Choose User --</option>
                            {sampleData.users.map(user => (
                                <option key={user.id} value={user.id}>{user.name} ({user.id})</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="manual-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            id="manual-status"
                            value={manualStatus}
                            onChange={(e) => setManualStatus(e.target.value as AttendanceLog['status'])}
                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>
                     <div className="md:col-span-1">
                        <label htmlFor="manual-method" className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                        <select
                            id="manual-method"
                            value={manualMethod}
                            onChange={(e) => setManualMethod(e.target.value as 'Manual Entry' | 'RFID Card')}
                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Manual Entry">Manual Entry</option>
                            <option value="RFID Card">RFID Card</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                         <Button onClick={handleManualLog} color="primary" className="w-full">
                            Log Attendance
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-dark mb-4">Today's Attendance Log</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Time In</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {log.map((entry, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{entry.id}</td>
                                    <td className="px-6 py-4">{entry.name}</td>
                                    <td className="px-6 py-4">{entry.time}</td>
                                    <td className={`px-6 py-4 font-semibold ${getStatusClass(entry.status)}`}>{entry.status}</td>
                                    <td className="px-6 py-4">{entry.method}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;