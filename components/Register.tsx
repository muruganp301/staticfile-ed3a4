
import React, { useState, useMemo } from 'react';
import { sampleData } from '../constants';
import { CameraIcon, UserCheckIcon } from './icons';

const Register: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState('');
    const [step, setStep] = useState(1);
    const [cameraActive, setCameraActive] = useState(false);
    const [captures, setCaptures] = useState(0);
    const [isTraining, setIsTraining] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const usersToRegister = useMemo(() => sampleData.users.filter(u => !u.faceRegistered), []);

    const handleStartCamera = () => {
        if (!selectedUser) {
            alert('Please select a user first.');
            return;
        }
        setCameraActive(!cameraActive);
        if(cameraActive) handleReset();
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
        setStep(3);
        setIsTraining(true);
        setTimeout(() => {
            setIsTraining(false);
            setIsComplete(true);
        }, 2000);
    };

    const handleReset = () => {
        setStep(1);
        setCaptures(0);
        setIsTraining(false);
        setIsComplete(false);
        setCameraActive(false);
    };

    const getStepInstruction = () => {
        if (isComplete) return `Face registration for ${selectedUser} is complete!`;
        if (isTraining) return 'Training the model...';
        switch (step) {
            case 1: return 'Position your face in the center of the frame.';
            case 2: return `Capturing image ${captures + 1} of 5. Please turn your head slightly.`;
            case 3: return 'All images captured. Proceed to train the model.';
            default: return '';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-dark mb-4">Register New Face</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <select 
                    value={selectedUser} 
                    onChange={e => setSelectedUser(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                    <option value="">Select a user...</option>
                    {usersToRegister.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.id})</option>
                    ))}
                </select>
                 <input type="text" value={selectedUser} readOnly placeholder="User ID" className="w-full bg-slate-100 border border-gray-300 rounded-md px-4 py-2"/>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg flex flex-col items-center">
                <div className="w-full max-w-lg bg-black rounded-lg mb-4 relative h-72 flex items-center justify-center">
                    {cameraActive ? (
                        <div className="border-2 border-dashed border-success rounded-lg w-1/2 h-2/3"></div>
                    ) : (
                        <CameraIcon className="w-16 h-16 text-gray-500" />
                    )}
                </div>

                <div className="text-center my-4">
                    <p className="font-semibold">{getStepInstruction()}</p>
                    {step === 2 && (
                         <div className="flex justify-center gap-2 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className={`w-4 h-4 rounded-full ${i < captures ? 'bg-success' : 'bg-gray-300'}`}></div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={handleStartCamera} disabled={!selectedUser || isComplete} className="bg-primary text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50">
                        {cameraActive ? 'Stop Camera' : 'Start Camera'}
                    </button>
                    <button onClick={handleCapture} disabled={!cameraActive || step === 3 || isComplete} className="bg-success text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50">
                        Capture Face
                    </button>
                    <button onClick={handleTrain} disabled={step !== 3 || isTraining || isComplete} className="bg-warning text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50">
                         {isTraining ? 'Training...' : 'Train Model'}
                    </button>
                     <button onClick={handleReset} className="bg-danger text-white px-4 py-2 rounded-md font-semibold">Reset</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
