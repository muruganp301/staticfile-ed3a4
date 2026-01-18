
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Student } from '../types';
import { CameraIcon } from './icons';

interface RegisterProps {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    preselectedId?: string | null;
    clearPreselected?: () => void;
}

const Register: React.FC<RegisterProps> = ({ students, setStudents, preselectedId, clearPreselected }) => {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [step, setStep] = useState(1);
    const [cameraActive, setCameraActive] = useState(false);
    const [captures, setCaptures] = useState(0);
    const [isTraining, setIsTraining] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showPrivacyConfirm, setShowPrivacyConfirm] = useState(false);
    const [showReRegisterConfirm, setShowReRegisterConfirm] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (preselectedId) {
            setSelectedStudent(preselectedId);
            clearPreselected?.();
        }
    }, [preselectedId, clearPreselected]);

    useEffect(() => {
        return () => stopCamera();
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

    const startCamera = async () => {
        try {
            setCameraActive(true);
            // Allow DOM update to show the video element
            setTimeout(async () => {
                try {
                    let stream: MediaStream;
                    try {
                        // Attempt with specific ideal constraints
                        stream = await navigator.mediaDevices.getUserMedia({ 
                            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
                        });
                    } catch (primaryErr) {
                        console.warn("Primary camera constraints failed in Register, attempting fallback:", primaryErr);
                        // Fallback to basic video if ideal fails
                        stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    }

                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        await videoRef.current.play();
                    }
                } catch (err: any) {
                    console.error("Camera access error in Register:", err);
                    setCameraActive(false);
                    
                    let errorMessage = "Unable to access camera. ";
                    
                    // Specific error handling for more professional UX
                    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                        errorMessage += "The camera is currently being used by another application (like Zoom or Teams). Please close other apps using the camera and try again.";
                    } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                        errorMessage += "Camera permissions were denied. Please enable camera access in your browser settings to continue registration.";
                    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                        errorMessage += "No camera device was detected on your system. Please check your hardware connection.";
                    } else {
                        errorMessage += "Please check your permissions and ensure your device hardware is connected properly.";
                    }
                    
                    alert(errorMessage);
                }
            }, 150);
        } catch (err) {
            console.error("Camera initialization error:", err);
        }
    };

    const currentStudentDetails = useMemo(() => 
        students.find(s => s.id === selectedStudent), 
    [students, selectedStudent]);

    const handleStartCameraToggle = () => {
        if (!selectedStudent) {
            alert('Please select a student first.');
            return;
        }
        
        if (cameraActive) {
            stopCamera();
            handleReset();
        } else {
            if (currentStudentDetails?.faceRegistered) {
                setShowReRegisterConfirm(true);
            } else {
                setShowPrivacyConfirm(true);
            }
        }
    };

    const confirmReRegister = () => {
        setShowReRegisterConfirm(false);
        setShowPrivacyConfirm(true);
    };

    const confirmStartCamera = () => {
        setShowPrivacyConfirm(false);
        startCamera();
    };

    const handleCapture = () => {
        if (step === 1) setStep(2);
        if (step === 2 && captures < 5) {
            setCaptures(c => c + 1);
        }
        if (captures === 4) {
            setStep(3);
        }
    };
    
    const handleTrain = () => {
        setIsTraining(true);
        setTimeout(() => {
            setIsTraining(false);
            setIsComplete(true);
            setStudents(prev => prev.map(s => s.id === selectedStudent ? { ...s, faceRegistered: true } : s));
            stopCamera();
        }, 2000);
    };

    const handleReset = () => {
        setStep(1);
        setCaptures(0);
        setIsTraining(false);
        setIsComplete(false);
        stopCamera();
        setShowResetConfirm(false);
    };

    const getStepInstruction = () => {
        if (isComplete) return `Biometric enrollment successful!`;
        if (isTraining) return 'Analyzing facial vectors...';
        switch (step) {
            case 1: return 'Position face in frame.';
            case 2: return `Angle ${captures + 1} of 5. Turn head slowly.`;
            case 3: return 'Face scan complete. Finalize registration.';
            default: return '';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm relative border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Register Face</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Select Student</label>
                    <select 
                        value={selectedStudent} 
                        onChange={e => {
                            setSelectedStudent(e.target.value);
                            handleReset();
                        }}
                        className="w-full bg-[#3a3a3a] text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4c6ef5] outline-none transition-all"
                    >
                        <option value="">Choose student...</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.name} ({student.id}) {student.faceRegistered ? '✓' : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Student ID</label>
                    <div className="flex items-center gap-2">
                        <input type="text" value={selectedStudent} readOnly placeholder="No selection" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-400 font-medium"/>
                        {currentStudentDetails?.faceRegistered && (
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                REGISTERED
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-[#f8fafc] p-8 rounded-3xl flex flex-col items-center">
                <div className="w-full max-w-lg bg-black rounded-2xl mb-8 relative h-80 flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className={`w-full h-full object-cover rounded-xl ${cameraActive ? 'block' : 'hidden'}`}
                    />
                    
                    {cameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-64 border-2 border-dashed border-success rounded-[40px] opacity-40"></div>
                            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                                SCANNING LIVE
                            </div>
                        </div>
                    )}

                    {!cameraActive && (
                        <div className="flex flex-col items-center gap-3">
                            <svg className="w-16 h-16 opacity-30 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="text-center text-slate-400">
                                <p className="font-bold text-lg leading-tight">Camera</p>
                                <p className="font-bold text-lg leading-tight">Inactive</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mb-8">
                    <p className="text-lg font-bold text-slate-800 h-8">{getStepInstruction()}</p>
                    {step === 2 && (
                         <div className="flex justify-center gap-3 mt-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className={`w-5 h-5 rounded-full transition-all duration-300 ${i < captures ? 'bg-[#38a169] scale-125' : 'bg-slate-300'}`}></div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full">
                    {!cameraActive ? (
                        <button 
                            onClick={handleStartCameraToggle} 
                            disabled={!selectedStudent || isComplete} 
                            className={`${currentStudentDetails?.faceRegistered ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-[#4c6ef5] hover:bg-[#3b5bdb] shadow-blue-500/20'} text-white px-8 py-4 rounded-2xl font-bold text-lg disabled:opacity-50 transition-all hover:-translate-y-1 shadow-xl flex items-center gap-2`}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {currentStudentDetails?.faceRegistered ? 'Re-register Face' : 'Initiate Face Registration'}
                        </button>
                    ) : (
                        <>
                            <button onClick={handleCapture} disabled={step === 3 || isComplete} className="bg-[#38a169] text-white px-8 py-4 rounded-2xl font-bold disabled:opacity-50 transition-all hover:bg-[#2f855a] hover:-translate-y-1 shadow-lg shadow-green-500/20">
                                Capture Angle {captures}/5
                            </button>
                            <button onClick={handleTrain} disabled={step !== 3 || isTraining || isComplete} className="bg-[#d69e2e] text-white px-8 py-4 rounded-2xl font-bold disabled:opacity-50 transition-all hover:bg-[#b7791f] hover:-translate-y-1 shadow-lg shadow-yellow-500/20">
                                {isTraining ? 'Syncing...' : 'Confirm Registration'}
                            </button>
                            <button onClick={() => setShowResetConfirm(true)} className="bg-white text-slate-400 border border-slate-200 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-slate-50">
                                Abort
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Re-registration Confirmation Modal */}
            {showReRegisterConfirm && (
                <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-10 animate-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-amber-50 rounded-2xl">
                                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1e293b]">Re-register Face?</h3>
                        </div>
                        <p className="text-slate-500 leading-relaxed mb-10">
                            Student <strong>{currentStudentDetails?.name}</strong> already has a face profile. Re-registering will overwrite their existing biometric data.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowReRegisterConfirm(false)} 
                                className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmReRegister} 
                                className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-shadow shadow-lg shadow-amber-500/20"
                            >
                                Overwrite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Privacy & Data Usage Confirmation Dialog */}
            {showPrivacyConfirm && (
                <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-10 animate-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <svg className="w-8 h-8 text-[#4c6ef5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1e293b]">Biometric Security Notice</h3>
                        </div>
                        <div className="space-y-4 text-slate-500 leading-relaxed mb-10">
                            <p>To register your face, the system needs temporary access to your camera to create a biometric template.</p>
                            <p className="bg-slate-50 p-4 rounded-2xl border-l-4 border-primary text-sm">
                                <strong>Data Privacy:</strong> Biometric data is encrypted and stored locally on the secure server. It is strictly used for identity verification during attendance and is never shared with third parties.
                            </p>
                            <p>By proceeding, you consent to the collection and processing of your facial biometric data for enrollment.</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowPrivacyConfirm(false)} 
                                className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmStartCamera} 
                                className="flex-1 py-4 bg-[#4c6ef5] text-white rounded-2xl font-bold hover:bg-[#3b5bdb] transition-shadow shadow-lg shadow-blue-500/20"
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-[32px] shadow-2xl max-sm w-full p-8 animate-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-50 rounded-2xl text-red-500">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1e293b]">Abort?</h3>
                        </div>
                        <p className="text-slate-500 mb-8 leading-relaxed">This will clear all captured scan data and you will need to restart the process.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50">Back</button>
                            <button onClick={handleReset} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-500/20">Yes, Abort</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
