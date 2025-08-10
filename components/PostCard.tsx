import React, { useState } from 'react';
import { Post, Settings } from '../types';
import { XIcon } from './icons/XIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { ImageSparkleIcon } from './icons/ImageSparkleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface PostCardProps {
    post: Post;
    onGenerateImage: (post: Post) => void;
    settings: Settings;
}

const platformIcons: Record<Post['platform'], React.FC<React.SVGProps<SVGSVGElement>>> = {
    X: XIcon,
    LinkedIn: LinkedInIcon,
    Facebook: FacebookIcon,
    Instagram: InstagramIcon,
    Pinterest: PinterestIcon
};

export const PostCard: React.FC<PostCardProps> = ({ post, onGenerateImage, settings }) => {
    const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
    const [copied, setCopied] = useState(false);
    const PlatformIcon = platformIcons[post.platform];

    const getViralScoreColor = (score: number) => {
        if (score > 80) return 'text-green-400';
        if (score > 60) return 'text-yellow-400';
        if (score > 40) return 'text-orange-400';
        return 'text-red-400';
    };

    const handleCopy = () => {
        const textToCopy = activeTab === 'A' ? post.versionA : post.versionB;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isImageGenSupported = settings.provider === 'gemini' || settings.provider === 'openai' || (settings.provider === 'openrouter' && settings.openRouterModel.includes('dall-e'));

    return (
        <div className="bg-base-200 border border-base-300 rounded-lg shadow-lg flex flex-col transition-all duration-300 hover:shadow-brand-primary/20 hover:border-brand-primary/50 animate-slide-in-up">
            <div className="p-4 border-b border-base-300 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {PlatformIcon && <PlatformIcon className="w-6 h-6" />}
                    <span className="font-bold text-xl text-content-100">{post.platform} Post</span>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg" title={`Viral Score: ${post.viralScore}/100`}>
                        <span className={getViralScoreColor(post.viralScore)}>{post.viralScore}</span>
                        <span className="text-sm text-content-300">/100</span>
                    </div>
                     <div className="text-xs text-content-300">Viral Score</div>
                </div>
            </div>
                <div className="text-xs text-content-300 mb-2">
                    {post.platform === 'X' && (<span>Tip: Aim 220–240 chars; 1–2 hashtags.</span>)}
                    {post.platform === 'LinkedIn' && (<span>Tip: Hook + line breaks; ~800–1200 chars.</span>)}
                    {post.platform === 'Instagram' && (<span>Tip: Short, line breaks; add alt text for image.</span>)}
                    {post.platform === 'Facebook' && (<span>Tip: 1–2 short paragraphs; clear CTA.</span>)}
                    {post.platform === 'Pinterest' && (<span>Tip: Keyword‑rich title + 2–3 concise lines.</span>)}
                </div>

            <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-center justify-between border-b border-base-300 mb-3">
                    <div className="flex">
                        <button onClick={() => setActiveTab('A')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'A' ? 'border-b-2 border-brand-primary text-content-100' : 'text-content-300 hover:text-content-200'}`}>{post.angleA ? `Version A — ${post.angleA}` : 'Version A'}</button>
                        <button onClick={() => setActiveTab('B')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'B' ? 'border-b-2 border-brand-primary text-content-100' : 'text-content-300 hover:text-content-200'}`}>{post.angleB ? `Version B — ${post.angleB}` : 'Version B'}</button>
                    </div>
                </div>
                <div className="flex-grow">
                    <p className="text-content-200 min-h-[120px] whitespace-pre-wrap">{activeTab === 'A' ? post.versionA : post.versionB}</p>
                </div>
                <div className="mt-3 text-right">
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-content-100 bg-base-300 hover:bg-base-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-colors"
                        title="Copy post text to clipboard"
                    >
                       <ClipboardIcon className="w-4 h-4" />
                       {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                </div>

                {post.whyThisWorks && (
                    <div className="mt-4 p-3 bg-base-300/40 rounded border border-base-300">
                        <h4 className="font-semibold text-content-100 mb-1">Why this works</h4>
                        <p className="text-sm text-content-300 whitespace-pre-wrap">{post.whyThisWorks}</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-base-300/50 border-t border-base-300 space-y-3">
                <h4 className="font-semibold text-content-100">Image Prompt</h4>
                <p className="text-sm text-content-300 italic">"{post.imagePrompt}"</p>
                <button
                    onClick={() => onGenerateImage(post)}
                    disabled={post.isGeneratingImage || !isImageGenSupported}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-brand-secondary text-sm font-medium rounded-md text-content-100 bg-brand-secondary/20 hover:bg-brand-secondary/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    title={!isImageGenSupported ? `Image generation not supported by ${settings.provider} with the current model.` : 'Generate an AI image'}
                >
                    {post.isGeneratingImage ? (
                        <>
                            <SpinnerIcon className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <ImageSparkleIcon className="w-4 h-4" />
                            Generate Image
                        </>
                    )}
                </button>
            </div>
            {post.sourceUrl && post.sourceUrl !== 'N/A' && (
                <div className="p-2 bg-base-100 border-t border-base-300 text-center">
                    <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-content-300 hover:text-brand-primary hover:underline truncate">
                        Source: {post.sourceUrl}
                    </a>
                </div>
            )}
        </div>
    );
};