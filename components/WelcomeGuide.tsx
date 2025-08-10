import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface WelcomeGuideProps {
    onClose: () => void;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-base-200 border border-base-300 rounded-2xl shadow-2xl max-w-2xl w-full relative transform transition-all duration-300 scale-95 hover:scale-100">
                <button onClick={onClose} className="absolute top-4 right-4 text-content-300 hover:text-content-100">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <div className="p-8">
                    <h2 className="text-3xl font-extrabold text-content-100 mb-4">Welcome to the AI Campaign Strategist!</h2>
                    <p className="text-content-200 mb-2">This tool supports multiple AI providers. Before you start, please configure your preferred AI and API key in the <strong className="text-content-100">Settings menu (gear icon in the top-right)</strong>.</p>
                    <p className="text-content-200 mb-6">This tool adapts its strategy based on your input. Here's how to use its two powerful modes:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-base-300/50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-brand-primary mb-2">Mode 1: Research-Driven Strategist</h3>
                            <p className="text-content-200">
                                Provide a <strong className="text-content-100">topic</strong>. The AI will build a campaign. <em className="text-content-300">(Note: Real-time web search is only available when using Gemini).</em>
                            </p>
                        </div>
                        <div className="bg-base-300/50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-brand-secondary mb-2">Mode 2: Deep-Analysis Specialist</h3>
                            <p className="text-content-200">
                                Provide a list of <strong className="text-content-100">URLs or a sitemap</strong>. The AI will analyze only this content to create a cohesive campaign aligned with your source material.
                            </p>
                        </div>
                    </div>
                     <div className="mt-6 text-center">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};