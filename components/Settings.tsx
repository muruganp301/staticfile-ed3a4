
import React, { useState } from 'react';

type SettingsTab = 'general' | 'attendance' | 'camera' | 'notifications';

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

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'attendance':
                return <p className="text-gray-600 p-4">Attendance settings would be here.</p>;
            case 'camera':
                return <p className="text-gray-600 p-4">Camera settings would be here.</p>;
            case 'notifications':
                 return <p className="text-gray-600 p-4">Notification settings would be here.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-dark mb-4">System Settings</h2>
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-2">
                    <TabButton label="General" isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
                    <TabButton label="Attendance" isActive={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                    <TabButton label="Camera" isActive={activeTab === 'camera'} onClick={() => setActiveTab('camera')} />
                    <TabButton label="Notifications" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                </nav>
            </div>
            {renderContent()}
        </div>
    );
};

const FormField: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

const GeneralSettings: React.FC = () => (
    <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <FormField label="System Name">
                <input type="text" defaultValue="AutoAttend Attendance System" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </FormField>
            <FormField label="Timezone">
                 <select defaultValue="UTC-6" className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                </select>
            </FormField>
             <FormField label="Work Start Time">
                <input type="time" defaultValue="09:00" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </FormField>
            <FormField label="Work End Time">
                <input type="time" defaultValue="17:00" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </FormField>
        </div>
        <div className="space-y-4">
             <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span>Automatically mark users as "Left" after work hours</span>
            </label>
             <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span>Enable email notifications</span>
            </label>
        </div>
        <div>
            <button type="button" className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-primary/90">
                Save Settings
            </button>
        </div>
    </form>
);

export default Settings;
