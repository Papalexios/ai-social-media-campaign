import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { CampaignOutput } from './components/CampaignOutput';
import { WelcomeGuide } from './components/WelcomeGuide';
import { ImageModal } from './components/ImageModal';
import { SettingsModal } from './components/SettingsModal';
import { ExampleCampaigns } from './components/ExampleCampaigns';
import { HowItWorks } from './components/HowItWorks';
import { CaseStudies } from './components/CaseStudies';
import { FAQs } from './components/FAQs';
import { Resources } from './components/Resources';
import { generateCampaign, generateImageForPrompt } from './services/aiService';
import { CampaignResult, Post, Settings, AIProvider, Platform } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { DEFAULT_SETTINGS } from './constants';

const App: React.FC = () => {
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['X', 'LinkedIn']);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [campaignResult, setCampaignResult] = useState<CampaignResult | null>(null);
    const [imageModalState, setImageModalState] = useState<{ isOpen: boolean; imageUrl: string; prompt: string }>({
        isOpen: false,
        imageUrl: '',
        prompt: ''
    });

    useEffect(() => {
        // First visit logic
        const visited = localStorage.getItem('hasVisitedAICampaignStrategist');
        if (!visited) {
            setIsFirstVisit(true);
            setShowWelcome(true);
            localStorage.setItem('hasVisitedAICampaignStrategist', 'true');
        }

        // Load settings
        const savedSettings = localStorage.getItem('aiCampaignSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
        
        // Load session campaign
        const savedSession = sessionStorage.getItem('aiCampaignSession');
        if(savedSession) {
            setCampaignResult(JSON.parse(savedSession));
        }
    }, []);

    const handleSaveSettings = (newSettings: Settings) => {
        setSettings(newSettings);
        localStorage.setItem('aiCampaignSettings', JSON.stringify(newSettings));
        setShowSettings(false);
    };

    const handlePlatformChange = (platform: Platform) => {
        setSelectedPlatforms(prev => 
            prev.includes(platform) 
                ? prev.filter(p => p !== platform) 
                : [...prev, platform]
        );
    };

    const handleGenerate = async (inputText: string) => {
        const currentApiKey = settings.apiKeys[settings.provider];
        if (!currentApiKey) {
            setError(`API Key for ${settings.provider} is not set. Please configure it in Settings.`);
            setShowSettings(true);
            return;
        }
        if (!inputText.trim()) {
            setError('Please enter a topic or at least one URL.');
            return;
        }
        if (selectedPlatforms.length === 0) {
            setError('Please select at least one target platform.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setCampaignResult(null);
        sessionStorage.removeItem('aiCampaignSession');
        
        const initialResultState: CampaignResult = {
            strategicDebrief: null,
            posts: [],
            sources: [],
        };
        setCampaignResult(initialResultState);

        try {
            await generateCampaign(inputText, settings, selectedPlatforms, (update, message) => {
                setLoadingMessage(message);
                setCampaignResult(prevResult => {
                    const newResult = {
                        ...prevResult!,
                        strategicDebrief: update.strategicDebrief !== undefined ? update.strategicDebrief : prevResult!.strategicDebrief,
                        posts: update.posts ? [...prevResult!.posts, ...update.posts] : prevResult!.posts,
                        sources: update.sources ? [...prevResult!.sources, ...update.sources] : prevResult!.sources,
                    };
                    sessionStorage.setItem('aiCampaignSession', JSON.stringify(newResult));
                    return newResult;
                });
            });
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Campaign generation failed: ${errorMessage}`);
            setCampaignResult(null);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleGenerateImage = useCallback(async (postToUpdate: Post) => {
        setCampaignResult(prev => {
            if (!prev) return null;
            return {
                ...prev,
                posts: prev.posts.map(p => p.id === postToUpdate.id ? { ...p, isGeneratingImage: true } : p)
            };
        });

        try {
            const imageUrl = await generateImageForPrompt(postToUpdate.imagePrompt, settings);
            setImageModalState({ isOpen: true, imageUrl, prompt: postToUpdate.imagePrompt });
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to generate image: ${errorMessage}`);
        } finally {
            setCampaignResult(prev => {
                if (!prev) return null;
                const updatedResult = {
                    ...prev,
                    posts: prev.posts.map(p => p.id === postToUpdate.id ? { ...p, isGeneratingImage: false } : p)
                };
                sessionStorage.setItem('aiCampaignSession', JSON.stringify(updatedResult));
                return updatedResult;
            });
        }
    }, [settings]);

    return (
        <div className="min-h-screen bg-base-100 text-content-100 font-sans">
            {showWelcome && isFirstVisit && <WelcomeGuide onClose={() => setShowWelcome(false)} />}
            {showSettings && <SettingsModal currentSettings={settings} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />}
            <ImageModal 
                isOpen={imageModalState.isOpen} 
                imageUrl={imageModalState.imageUrl} 
                prompt={imageModalState.prompt} 
                onClose={() => setImageModalState({ isOpen: false, imageUrl: '', prompt: '' })} 
            />
            <div className="container mx-auto px-4 py-8">
                <Header onSettingsClick={() => setShowSettings(true)} />
                <main className="mt-8">
                    <InputArea 
                        onGenerate={handleGenerate} 
                        isLoading={isLoading} 
                        settings={settings}
                        selectedPlatforms={selectedPlatforms}
                        onPlatformChange={handlePlatformChange}
                    />

                    {error && (
                        <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg animate-fade-in">
                            <div className="flex justify-between items-center">
                                <p className="font-bold">Error</p>
                                <button onClick={() => setError(null)} className="font-bold text-lg">&times;</button>
                            </div>
                            <p>{error}</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="mt-8 flex flex-col items-center justify-center text-center animate-fade-in">
                            <SparklesIcon className="w-16 h-16 text-brand-secondary animate-pulse" />
                            <h2 className="mt-4 text-2xl font-bold text-content-100 tracking-wide">Generating Your Campaign...</h2>
                            <p className="mt-2 text-lg text-content-200">{loadingMessage}</p>
                        </div>
                    )}
                    
                    {campaignResult && !isLoading && (
                       <CampaignOutput result={campaignResult} onGenerateImage={handleGenerateImage} settings={settings} />
                    )}

                    {!campaignResult && !isLoading && (
                        <>
                          <ExampleCampaigns />
                          <CaseStudies />
                          <HowItWorks />
                          <Resources />
                          <FAQs />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;