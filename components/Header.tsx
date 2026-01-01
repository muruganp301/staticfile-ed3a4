
import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-primary">{title}</h1>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    AD
                </div>
                <div>
                    <div className="font-semibold text-dark">Admin User</div>
                    <div className="text-sm text-gray-custom">Administrator</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
