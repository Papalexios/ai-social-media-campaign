import React, { useState } from 'react';
import { buildPostsCsv } from '../utils/export';
import { CampaignResult, Post, Settings } from '../types';
import { StrategicDebrief } from './StrategicDebrief';
import { PostCard } from './PostCard';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface CampaignOutputProps {
    result: CampaignResult;
    onGenerateImage: (post: Post) => void;
    settings: Settings;
}

export const CampaignOutput: React.FC<CampaignOutputProps> = ({ result, onGenerateImage, settings }) => {
    const [isCopied, setIsCopied] = useState(false);

    const formatCampaignForCopy = (campaign: CampaignResult): string => {
        let fullText = "AI-GENERATED CAMPAIGN STRATEGY\n================================\n\n";
        if (campaign.strategicDebrief) {
            fullText += "**STRATEGIC DEBRIEFING**\n------------------------\n";
            fullText += `Campaign Synopsis: ${campaign.strategicDebrief.campaignSynopsis}\n`;
            fullText += `Primary Audience: ${campaign.strategicDebrief.primaryAudience}\n`;
            fullText += `Key Themes:\n${campaign.strategicDebrief.keyThemes.map(t => `- ${t}`).join('\n')}\n`;
            fullText += `Competitive Angle: ${campaign.strategicDebrief.competitiveAngle}\n\n`;
        }
        if (campaign.posts.length > 0) {
            fullText += "**GENERATED POSTS**\n-------------------\n\n";
            campaign.posts.forEach((post, index) => {
                fullText += `--- POST ${index + 1}: ${post.platform} ---\n`;
                if(post.sourceUrl && post.sourceUrl !== 'N/A') {
                    fullText += `Source URL: ${post.sourceUrl}\n`;
                }
                if (post.angleA || post.angleB) {
                    fullText += `Psychological Angles: ${post.angleA ? `A: ${post.angleA}` : ''}${post.angleA && post.angleB ? ' | ' : ''}${post.angleB ? `B: ${post.angleB}` : ''}\n`;
                }
                fullText += `Image Prompt: "${post.imagePrompt}"\n\n`;
                fullText += `**Version A${post.angleA ? ` — ${post.angleA}` : ''}:**\n${post.versionA}\n\n`;
                fullText += `**Version B${post.angleB ? ` — ${post.angleB}` : ''}:**\n${post.versionB}\n\n`;
                if (post.whyThisWorks) {
                    fullText += `Why this works: ${post.whyThisWorks}\n`;
                }
                fullText += "---------------------------------\n\n";
            });
        }
        if (campaign.sources.length > 0) {
            fullText += "**SOURCES (from Gemini Search)**\n---------------------------------\n";
            fullText += campaign.sources.map(s => `- ${s.title || 'Untitled'}: ${s.uri}`).join('\n') + '\n';
        }
        return fullText;
    };

    const exportJson = () => {
        const data = JSON.stringify(result, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'campaign.json';
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    };

    const exportCsv = () => {
        const csv = buildPostsCsv(result.posts);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'campaign_posts.csv';
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    };

    const handleCopyCampaign = () => {
        const campaignText = formatCampaignForCopy(result);
        navigator.clipboard.writeText(campaignText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    return (
        <div className="mt-8 space-y-8 animate-fade-in">
            {result.strategicDebrief && <StrategicDebrief debrief={result.strategicDebrief} />}

            {result.posts.length > 0 && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b-2 border-base-300 pb-2">
                        <h2 className="text-3xl font-bold text-content-100">
                            Generated Posts
                        </h2>
                        <div className="flex items-center gap-2">
                          <button
                              onClick={handleCopyCampaign}
                              className="flex items-center gap-2 px-4 py-2 border border-brand-primary text-sm font-medium rounded-md text-content-100 bg-brand-primary/20 hover:bg-brand-primary/40 focus:outline-none disabled:opacity-50 transition-all duration-200"
                          >
                              <ClipboardIcon className="w-4 h-4" />
                              {isCopied ? 'Campaign Copied!' : 'Copy Campaign'}
                          </button>
                          <button
                              onClick={exportJson}
                              className="px-3 py-2 text-sm font-medium rounded-md border border-base-300 text-content-100 bg-base-300 hover:bg-base-100"
                              title="Download result JSON"
                          >JSON</button>
                          <button
                              onClick={exportCsv}
                              className="px-3 py-2 text-sm font-medium rounded-md border border-base-300 text-content-100 bg-base-300 hover:bg-base-100"
                              title="Download posts CSV"
                          >CSV</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.posts.map(post => (
                            <PostCard key={post.id} post={post} onGenerateImage={onGenerateImage} settings={settings} />
                        ))}
                    </div>
                </div>
            )}

            {result.sources.length > 0 && (
                <div className="bg-base-200 border border-base-300 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-content-100 mb-2">Sources (from Gemini Search)</h3>
                    <ul className="space-y-2 list-disc list-inside">
                        {result.sources.map((source, index) => (
                            <li key={index}>
                                <a
                                    href={source.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-primary hover:underline"
                                >
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};