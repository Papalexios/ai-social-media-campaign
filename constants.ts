import { Settings, PsychologicalTrigger, ViralPattern } from './types';

// --- Premium AI Models ---
export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_PREMIUM_MODEL = 'gemini-2.5-pro'; // For complex strategic thinking
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

export const OPENAI_TEXT_MODEL = 'gpt-4o';
export const OPENAI_PREMIUM_MODEL = 'gpt-4-turbo'; // For creative content generation
export const OPENAI_IMAGE_MODEL = 'dall-e-3';

export const OPENROUTER_DEFAULT_TEXT_MODEL = 'anthropic/claude-3-haiku-20240307';
export const OPENROUTER_PREMIUM_MODEL = 'anthropic/claude-3-5-sonnet-20241022'; // For viral content optimization

// --- Premium Model Routing ---
export const PREMIUM_MODELS = {
    strategic: OPENROUTER_PREMIUM_MODEL, // Claude 3.5 Sonnet for strategic thinking
    creative: OPENAI_PREMIUM_MODEL, // GPT-4 Turbo for creative content
    rapid: GEMINI_TEXT_MODEL, // Gemini Flash for rapid processing
    analysis: GEMINI_PREMIUM_MODEL, // Gemini Pro for deep analysis
} as const;

// --- API ---
export const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

// --- App Logic ---
export const URL_BATCH_SIZE = 10;
export const DEBRIEF_CONTENT_TRUNCATE_LENGTH = 2500; // chars per URL for debrief synthesis
export const ESSENCE_CONTENT_TRUNCATE_LENGTH = 3000; // chars per URL for essence distillation
export const POST_GEN_CONTENT_TRUNCATE_LENGTH = 5000; // chars per URL for post generation context

// --- Advanced Performance Tunables ---
export const AI_CONCURRENCY: Readonly<Record<'gemini' | 'openai' | 'openrouter', number>> = {
    gemini: 4, // Increased for premium performance
    openai: 6, // Optimized for GPT-4 Turbo
    openrouter: 8 // Enhanced for Claude 3.5 Sonnet
};

// --- Smart Rate Limiting ---
export const AI_MIN_DELAY_MS = 50; // Reduced for premium speed
export const AI_MAX_RETRIES = 5; // Increased reliability
export const AI_INITIAL_BACKOFF_MS = 500; // Optimized backoff
export const ESSENCE_MICRO_BATCH_SIZE = 5; // Enhanced batching

// --- Premium Performance Settings ---
export const PREMIUM_CONCURRENCY_MULTIPLIER = 1.5; // Boost for premium mode
export const ADAPTIVE_BATCH_SIZE_MIN = 3;
export const ADAPTIVE_BATCH_SIZE_MAX = 15;
export const CACHE_TTL_HOURS = 24; // Cache time-to-live
export const PREDICTIVE_CACHE_SIZE = 100; // Number of items to predictively cache

// --- Enhanced Default Settings ---
export const DEFAULT_SETTINGS: Settings = {
    provider: 'openrouter', // Default to premium provider
    apiKeys: {
        gemini: '',
        openai: '',
        openrouter: ''
    },
    openRouterModel: OPENROUTER_PREMIUM_MODEL, // Default to Claude 3.5 Sonnet
    performance: {
        mode: 'premium', // Default to premium mode
        concurrency: undefined,
        microBatchSize: ESSENCE_MICRO_BATCH_SIZE,
        maxUrlsPerRun: MAX_URLS_PER_RUN,
        essenceTruncate: ESSENCE_CONTENT_TRUNCATE_LENGTH,
        postTruncate: POST_GEN_CONTENT_TRUNCATE_LENGTH,
        // --- Premium Features Enabled ---
        enableSmartRouting: true,
        enablePredictiveCache: true,
        enableAdaptiveBatching: true,
        enableParallelPipeline: true,
        qualityPasses: 3, // Triple-pass refinement
        viralOptimization: true
    },
    guardrails: {
        enforceOpenRouterAllowlist: false,
        openRouterAllowlist: [
            OPENROUTER_PREMIUM_MODEL,
            'anthropic/claude-3-opus-20240229',
            'openai/gpt-4-turbo',
            'google/gemini-pro-1.5'
        ],
        platformPostCaps: {}
    }
};

export const APP_INFO_HEADERS = {
    'HTTP-Referer': 'https://aistrategist.dev',
    'X-Title': 'AI Campaign Strategist'
};

// --- Enhanced Guardrails ---
export const MAX_URLS_PER_RUN = 50; // Increased for premium processing

// --- Advanced Psychological Triggers ---
export const PSYCHOLOGICAL_TRIGGERS: Record<PsychologicalTrigger, string> = {
    curiosity_gap: "Create an irresistible information gap that demands to be filled",
    social_proof: "Leverage the power of collective behavior and testimonials",
    scarcity: "Emphasize limited availability or time-sensitive opportunities",
    authority: "Establish credibility through expertise and credentials",
    novelty: "Highlight what's new, unexpected, or groundbreaking",
    loss_aversion: "Focus on what people might lose by not acting",
    reciprocity: "Offer value first to create obligation to reciprocate",
    fomo: "Fear of missing out on exclusive opportunities",
    bandwagon: "Everyone else is doing it, join the movement",
    anchoring: "Set a reference point that influences perception",
    contrast: "Show dramatic before/after or comparison scenarios",
    commitment: "Get people to commit to small actions first",
    storytelling: "Use narrative structure to create emotional connection",
    pattern_interrupt: "Break expected patterns to capture attention",
    controversy: "Present polarizing viewpoints that spark debate",
    exclusivity: "Make content feel special and for select audiences",
    urgency: "Create time pressure for immediate action",
    nostalgia: "Tap into positive memories and past experiences",
    surprise: "Deliver unexpected twists or revelations",
    humor: "Use comedy to make content memorable and shareable",
    empathy: "Connect through shared struggles and understanding",
    aspiration: "Appeal to desired future states and goals",
    fear: "Address legitimate concerns and anxieties",
    joy: "Celebrate positive emotions and achievements",
    anger: "Channel righteous indignation about injustices"
};

// --- Viral Content Patterns ---
export const VIRAL_PATTERNS = {
    hook_types: [
        "question_hook", "statistic_hook", "story_hook", "controversy_hook",
        "prediction_hook", "secret_hook", "mistake_hook", "transformation_hook"
    ],
    engagement_boosters: [
        "call_to_action", "question_prompt", "share_trigger", "comment_bait",
        "poll_integration", "challenge_creation", "hashtag_campaign"
    ],
    emotional_amplifiers: [
        "high_arousal", "positive_valence", "negative_valence", "mixed_emotions",
        "surprise_factor", "relatability_score", "aspiration_trigger"
    ]
} as const;