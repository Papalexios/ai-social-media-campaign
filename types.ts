export type AIProvider = 'gemini' | 'openai' | 'openrouter';

export interface ApiKeys {
    gemini: string;
    openai: string;
    openrouter: string;
}

export type PerformanceMode = 'economy' | 'balanced' | 'premium' | 'ultra_premium';

// --- Advanced Psychological Triggers ---
export type PsychologicalTrigger =
    | 'curiosity_gap' | 'social_proof' | 'scarcity' | 'authority' | 'novelty'
    | 'loss_aversion' | 'reciprocity' | 'fomo' | 'bandwagon' | 'anchoring'
    | 'contrast' | 'commitment' | 'storytelling' | 'pattern_interrupt'
    | 'controversy' | 'exclusivity' | 'urgency' | 'nostalgia' | 'surprise'
    | 'humor' | 'empathy' | 'aspiration' | 'fear' | 'joy' | 'anger';

// --- Viral Content Patterns ---
export type ViralPattern =
    | 'question_hook' | 'statistic_hook' | 'story_hook' | 'controversy_hook'
    | 'prediction_hook' | 'secret_hook' | 'mistake_hook' | 'transformation_hook';

export type EmotionalAmplifier =
    | 'high_arousal' | 'positive_valence' | 'negative_valence' | 'mixed_emotions'
    | 'surprise_factor' | 'relatability_score' | 'aspiration_trigger';

export interface PerformanceSettings {
    mode: PerformanceMode; // presets affecting truncation and (optionally) concurrency
    concurrency?: number; // max parallel AI calls
    microBatchSize?: number; // for OpenRouter essence batching
    maxUrlsPerRun?: number; // guardrail to protect keys
    essenceTruncate?: number; // per-URL chars for essence
    postTruncate?: number; // per-URL chars for post generation context
    // --- Premium Performance Features ---
    enableSmartRouting?: boolean; // intelligent model selection
    enablePredictiveCache?: boolean; // predictive content caching
    enableAdaptiveBatching?: boolean; // dynamic batch sizing
    enableParallelPipeline?: boolean; // parallel processing stages
    qualityPasses?: number; // number of refinement passes (1-5)
    viralOptimization?: boolean; // advanced viral content optimization
}

export interface GuardrailsSettings {
    enforceOpenRouterAllowlist?: boolean;
    openRouterAllowlist?: string[]; // allowed model IDs for OpenRouter
    platformPostCaps?: Partial<Record<Platform, number>>; // per-platform cap on posts
}

export interface Settings {
    provider: AIProvider;
    apiKeys: ApiKeys;
    openRouterModel: string;
    performance?: PerformanceSettings;
    guardrails?: GuardrailsSettings;
}

export interface StrategicDebrief {
    campaignSynopsis: string;
    primaryAudience: string;
    keyThemes: string[];
    competitiveAngle:string;
}

export type Platform = 'X' | 'LinkedIn' | 'Facebook' | 'Instagram' | 'Pinterest';

export interface Post {
    id: string;
    platform: Platform;
    versionA: string;
    versionB: string;
    versionC?: string; // Premium: Additional variant
    versionD?: string; // Premium: Fourth variant for ultra testing
    viralScore: number;
    imagePrompt: string;
    sourceUrl: string;
    // Rich metadata for premium output
    angleA?: string; // Psychological angle tested by Version A
    angleB?: string; // Psychological angle tested by Version B
    angleC?: string; // Premium: Third psychological angle
    angleD?: string; // Premium: Fourth psychological angle
    whyThisWorks?: string; // Strategic justification explaining the creative choices
    isGeneratingImage?: boolean;
    // --- Premium Analytics ---
    emotionalResonance?: number; // 1-100 emotional impact score
    shareabilityScore?: number; // 1-100 shareability prediction
    engagementPrediction?: number; // predicted engagement rate
    optimalPostingTime?: string; // best time to post for platform
    trendAlignment?: number; // alignment with current trends (1-100)
    audienceMatch?: number; // match with target audience (1-100)
    contentUniqueness?: number; // uniqueness score (1-100)
    accessibilityScore?: number; // accessibility rating (1-100)
    // --- Advanced Triggers ---
    primaryTrigger?: PsychologicalTrigger; // main psychological trigger used
    secondaryTriggers?: PsychologicalTrigger[]; // additional triggers
    viralPattern?: ViralPattern; // viral content pattern used
    emotionalAmplifiers?: EmotionalAmplifier[]; // emotional enhancement techniques
}

export interface Source {
    uri: string;
    title: string;
}

export interface CampaignResult {
    strategicDebrief: StrategicDebrief | null;
    posts: Post[];
    sources: Source[];
    // --- Premium Analytics ---
    campaignMetrics?: CampaignMetrics;
    performanceInsights?: PerformanceInsights;
    optimizationSuggestions?: OptimizationSuggestion[];
}

// --- Premium Analytics Interfaces ---
export interface CampaignMetrics {
    averageViralScore: number;
    totalEngagementPrediction: number;
    platformDistribution: Record<Platform, number>;
    triggerEffectiveness: Record<PsychologicalTrigger, number>;
    contentQualityScore: number;
    brandConsistencyScore: number;
    accessibilityScore: number;
    trendRelevanceScore: number;
}

export interface PerformanceInsights {
    topPerformingTriggers: PsychologicalTrigger[];
    bestPlatformMatch: Platform;
    optimalPostingTimes: Record<Platform, string>;
    audienceEngagementForecast: number;
    viralPotentialRanking: string[]; // post IDs ranked by viral potential
    contentGaps: string[]; // areas for improvement
    competitiveAdvantages: string[]; // unique strengths identified
}

export interface OptimizationSuggestion {
    type: 'content' | 'timing' | 'platform' | 'trigger' | 'format';
    priority: 'low' | 'medium' | 'high' | 'critical';
    suggestion: string;
    expectedImpact: number; // 1-100 expected improvement
    implementationDifficulty: 'easy' | 'medium' | 'hard';
}

// --- Advanced Content Analysis ---
export interface ContentAnalysis {
    sentimentScore: number; // -1 to 1 (negative to positive)
    emotionalIntensity: number; // 0-100
    readabilityScore: number; // 0-100
    keywordDensity: Record<string, number>;
    hashtagOptimization: string[];
    callToActionStrength: number; // 0-100
    viralElements: string[]; // identified viral components
}