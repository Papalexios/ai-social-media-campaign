import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface HeaderProps {
    onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => (
    <header className="text-center relative">
        <div className="flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10 text-brand-secondary" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-content-100 to-content-300">
                AI Campaign Strategist
            </h1>
        </div>
        <p className="mt-3 text-lg text-content-200">
            Your dual-mode AI partner for crafting data-driven marketing campaigns.
        </p>
        <button 
            onClick={onSettingsClick} 
            className="absolute top-0 right-0 p-2 text-content-300 hover:text-brand-primary transition-colors duration-200 rounded-full hover:bg-base-200"
            aria-label="Open settings"
        >
            <SettingsIcon className="w-6 h-6" />
        </button>
    </header>
);