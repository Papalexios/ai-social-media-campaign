import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { Settings, Platform } from '../types';

interface InputAreaProps {
    onGenerate: (inputText: string) => void;
    isLoading: boolean;
    settings: Settings;
    selectedPlatforms: Platform[];
    onPlatformChange: (platform: Platform) => void;
}

const PLATFORM_OPTIONS: Platform[] = ['X', 'LinkedIn', 'Facebook', 'Instagram', 'Pinterest'];

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading, settings, selectedPlatforms, onPlatformChange }) => {
    const [inputText, setInputText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading) {
            onGenerate(inputText);
        }
    };
    
    const isApiKeySet = !!settings.apiKeys[settings.provider];
    const isPlatformSelected = selectedPlatforms.length > 0;

    const getButtonTitle = () => {
        if (!isApiKeySet) return `Please set your ${settings.provider} API key in Settings.`;
        if (!isPlatformSelected) return 'Please select at least one platform.';
        return '';
    };

    return (
        <section className="bg-base-200 border border-base-300 p-6 rounded-xl shadow-lg animate-fade-in">
            <form onSubmit={handleSubmit}>
                <label htmlFor="input-text" className="block text-lg font-medium text-content-100 mb-2">
                    Enter Topic or URLs
                </label>
                <textarea
                    id="input-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g., The future of AI in sustainable farming OR https://example.com/blog/ai-trends https://example.com/sitemap.xml"
                    className="w-full h-32 p-3 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 resize-y text-content-100"
                    disabled={isLoading}
                />
                <p className="text-sm text-content-300 mt-2">
                    Provide a topic for research-driven generation, or a list of URLs for deep analysis of your content.
                </p>

                <div className="mt-4">
                     <label className="block text-lg font-medium text-content-100 mb-2">
                        Target Platforms
                    </label>
                     <div className="flex flex-wrap gap-2">
                        {PLATFORM_OPTIONS.map(platform => (
                            <button
                                type="button"
                                key={platform}
                                onClick={() => onPlatformChange(platform)}
                                disabled={isLoading}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 border-2 ${selectedPlatforms.includes(platform) ? 'bg-brand-secondary border-brand-secondary text-white' : 'bg-base-300 border-base-300 text-content-200 hover:border-brand-secondary/50'}`}
                                title={platform === 'X' ? 'Aim for 220-240 chars + 1-2 hashtags' : platform === 'LinkedIn' ? 'Hook + line breaks; 800-1200 chars' : platform === 'Instagram' ? 'Short caption + line breaks; add alt text for image' : platform === 'Facebook' ? '1-2 short paragraphs; clear CTA' : platform === 'Pinterest' ? 'Keyword-rich pin title + 2-3 concise lines' : ''}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !inputText.trim() || !isApiKeySet || !isPlatformSelected}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary disabled:bg-base-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                    title={getButtonTitle()}
                >
                    {isLoading ? (
                        <>
                            <SpinnerIcon className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            Generate Campaign
                        </>
                    )}
                </button>
            </form>
        </section>
    );
};