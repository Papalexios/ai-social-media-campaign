
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from 'openai';
import {
    CampaignResult, Post, StrategicDebrief, Source, Settings, Platform,
    PsychologicalTrigger, ViralPattern, EmotionalAmplifier, ContentAnalysis,
    CampaignMetrics, PerformanceInsights, OptimizationSuggestion
} from '../types';
import {
    GEMINI_TEXT_MODEL, GEMINI_PREMIUM_MODEL, GEMINI_IMAGE_MODEL,
    OPENAI_TEXT_MODEL, OPENAI_PREMIUM_MODEL, OPENAI_IMAGE_MODEL,
    OPENROUTER_PREMIUM_MODEL, PREMIUM_MODELS,
    URL_BATCH_SIZE, DEBRIEF_CONTENT_TRUNCATE_LENGTH,
    ESSENCE_CONTENT_TRUNCATE_LENGTH, POST_GEN_CONTENT_TRUNCATE_LENGTH,
    ESSENCE_MICRO_BATCH_SIZE, PSYCHOLOGICAL_TRIGGERS, VIRAL_PATTERNS,
    AI_CONCURRENCY, AI_MIN_DELAY_MS, AI_MAX_RETRIES, AI_INITIAL_BACKOFF_MS,
    PREMIUM_CONCURRENCY_MULTIPLIER, ADAPTIVE_BATCH_SIZE_MIN, ADAPTIVE_BATCH_SIZE_MAX,
    CACHE_TTL_HOURS, PREDICTIVE_CACHE_SIZE,
    OPENROUTER_API_BASE, APP_INFO_HEADERS, MAX_URLS_PER_RUN
} from "../constants";

// --- UTILITY FUNCTIONS ---

const safeJsonParse = <T>(text: string | null | undefined, context: string): T => {
    if (!text || text.trim() === '') {
        throw new Error(`AI response was empty when expecting JSON for ${context}. This may be due to content filters or a model refusal.`);
    }
    try {
        const jsonMatch = text.match(/```(json)?\s*([\s\S]*?)\s*```/);
        const textToParse = jsonMatch && jsonMatch[2] ? jsonMatch[2] : text;
        return JSON.parse(textToParse);
    } catch (error) {
        console.error(`Failed to parse JSON for ${context}. Raw response was:`, text);
        if (error instanceof Error) {
            throw new Error(`AI returned a malformed response for ${context}. Parser error: ${error.message}`);
        }
        throw new Error(`AI returned a malformed response for ${context}.`);
    }
};

const isUrl = (text: string): boolean => {
    try {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(text);
    } catch (_) {
        return false;
    }
};

const parseUrls = (text: string): string[] => {
    return text.split(/[\s,]+/).map(line => line.trim()).filter(line => line.length > 0 && isUrl(line));
};

const mockScrapeUrls = async (urls: string[]): Promise<Map<string, string>> => {
    console.log(`Simulating scraping for ${urls.length} URLs...`);
    await new Promise(resolve => setTimeout(resolve, 500 + urls.length * 50));
    const contentMap = new Map<string, string>();
    urls.forEach(url => {
        const urlPath = new URL(url.startsWith('http') ? url : `http://${url}`).pathname.replace(/\//g, ' ').trim();
        contentMap.set(url, `Simulated content for ${urlPath}. This text represents the extracted article body from the page at ${url}. It contains keywords about technology, AI, and marketing strategies, providing rich material for analysis.`);
    });
// --- PREMIUM CONCURRENCY MANAGEMENT ---

interface TaskPriority {
    priority: 'low' | 'medium' | 'high' | 'critical';
    taskType: TaskType;
    estimatedDuration: number;
}

interface QueuedTask<T> {
    fn: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: any) => void;
    priority: TaskPriority;
    timestamp: number;
}

const pLimit = (concurrency: number, enablePriorityQueue = false) => {
    let activeCount = 0;
    const queue: Array<QueuedTask<any>> = [];
    const performanceMetrics = {
        totalTasks: 0,
        completedTasks: 0,
        averageResponseTime: 0,
        errorRate: 0
    };

    const next = () => {
        activeCount--;
        if (queue.length > 0) {
            // Priority-based queue sorting for premium features
            if (enablePriorityQueue) {
                queue.sort((a, b) => {
                    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                    const priorityDiff = priorityOrder[b.priority.priority] - priorityOrder[a.priority.priority];
                    if (priorityDiff !== 0) return priorityDiff;
                    // Secondary sort by timestamp (FIFO for same priority)
                    return a.timestamp - b.timestamp;
                });
            }

            const task = queue.shift();
            if (task) {
                executeTask(task);
            }
        }
    };

    const executeTask = async <T>(task: QueuedTask<T>) => {
        activeCount++;
        const startTime = Date.now();

        try {
            const result = await task.fn();
            const duration = Date.now() - startTime;

            // Update performance metrics
            performanceMetrics.completedTasks++;
            performanceMetrics.averageResponseTime =
                (performanceMetrics.averageResponseTime * (performanceMetrics.completedTasks - 1) + duration) /
                performanceMetrics.completedTasks;

            // Adaptive delay based on performance
            ADAPTIVE_DELAY_FACTOR = Math.max(1, ADAPTIVE_DELAY_FACTOR * 0.9);
            task.resolve(result);
        } catch (error) {
            performanceMetrics.errorRate =
                (performanceMetrics.errorRate * performanceMetrics.completedTasks + 1) /
                (performanceMetrics.completedTasks + 1);
            task.reject(error);
        } finally {
            setTimeout(next, AI_MIN_DELAY_MS * ADAPTIVE_DELAY_FACTOR);
        }
    };

    return {
        async execute<T>(fn: () => Promise<T>, priority: TaskPriority = { priority: 'medium', taskType: 'rapid', estimatedDuration: 1000 }): Promise<T> {
            performanceMetrics.totalTasks++;

            return new Promise<T>((resolve, reject) => {
                const task: QueuedTask<T> = {
                    fn,
                    resolve,
                    reject,
                    priority,
                    timestamp: Date.now()
                };

                if (activeCount < concurrency) {
                    executeTask(task);
                } else {
                    queue.push(task);
                }
            });
        },
        getMetrics: () => ({ ...performanceMetrics }),
        getQueueSize: () => queue.length,
        getActiveCount: () => activeCount
    };
};

// Retry with exponential backoff
const retry = async <T>(operation: () => Promise<T>, maxRetries = AI_MAX_RETRIES, initialDelay = AI_INITIAL_BACKOFF_MS): Promise<T> => {
    let attempt = 0;
    let delay = initialDelay;
    while (true) {
        try {
            return await operation();
        } catch (err: any) {
            attempt++;
            const msg = typeof err?.message === 'string' ? err.message.toLowerCase() : '';
            const transient = msg.includes('rate') || msg.includes('limit') || msg.includes('timeout') || msg.includes('overloaded') || msg.includes('temporarily') || msg.includes('503') || msg.includes('429');
            const shouldRetry = attempt <= maxRetries && transient;
            if (!shouldRetry) throw err;
            // increase spacing on pressure
            ADAPTIVE_DELAY_FACTOR = Math.min(ADAPTIVE_DELAY_FACTOR_MAX, ADAPTIVE_DELAY_FACTOR * 1.5);
            await new Promise(res => setTimeout(res, delay * ADAPTIVE_DELAY_FACTOR));
            delay *= 2; // exponential backoff
        }
    }
};
// --- PREMIUM MULTI-TIER CACHING SYSTEM ---

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    accessCount: number;
    lastAccessed: number;
    ttl: number;
}

interface PredictiveCache<T> {
    get(key: string): T | null;
    set(key: string, value: T, ttl?: number): void;
    has(key: string): boolean;
    clear(): void;
    getStats(): { hits: number; misses: number; size: number };
    predictivePreload(patterns: string[]): Promise<void>;
}

class AdvancedCacheManager<T> implements PredictiveCache<T> {
    private memoryCache = new Map<string, CacheEntry<T>>();
    private stats = { hits: 0, misses: 0, size: 0 };
    private maxSize: number;
    private defaultTTL: number;

    constructor(maxSize = PREDICTIVE_CACHE_SIZE, defaultTTL = CACHE_TTL_HOURS * 60 * 60 * 1000) {
        this.maxSize = maxSize;
        this.defaultTTL = defaultTTL;
    }

    get(key: string): T | null {
        const entry = this.memoryCache.get(key);
        if (!entry) {
            this.stats.misses++;
            return null;
        }

        const now = Date.now();
        if (now > entry.timestamp + entry.ttl) {
            this.memoryCache.delete(key);
            this.stats.misses++;
            return null;
        }

        entry.accessCount++;
        entry.lastAccessed = now;
        this.stats.hits++;
        return entry.data;
    }

    set(key: string, value: T, ttl = this.defaultTTL): void {
        const now = Date.now();

        // Evict expired entries
        this.evictExpired();

        // Evict LRU if at capacity
        if (this.memoryCache.size >= this.maxSize && !this.memoryCache.has(key)) {
            this.evictLRU();
        }

        this.memoryCache.set(key, {
            data: value,
            timestamp: now,
            accessCount: 1,
            lastAccessed: now,
            ttl
        });

        this.stats.size = this.memoryCache.size;
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    clear(): void {
        this.memoryCache.clear();
        this.stats = { hits: 0, misses: 0, size: 0 };
    }

    getStats() {
        return { ...this.stats };
    }

    async predictivePreload(patterns: string[]): Promise<void> {
        // Implement predictive caching based on usage patterns
        // This would analyze patterns and preload likely-to-be-requested content
        console.log('Predictive preloading for patterns:', patterns);
    }

    private evictExpired(): void {
        const now = Date.now();
        for (const [key, entry] of this.memoryCache.entries()) {
            if (now > entry.timestamp + entry.ttl) {
                this.memoryCache.delete(key);
            }
        }
    }

    private evictLRU(): void {
        let oldestKey = '';
        let oldestTime = Date.now();

        for (const [key, entry] of this.memoryCache.entries()) {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.memoryCache.delete(oldestKey);
        }
    }
}

// Enhanced cache instances
const essenceCache = new AdvancedCacheManager<{ coreTakeaway: string; microAudience: string }>();
const contentCache = new AdvancedCacheManager<string>();
const viralScoreCache = new AdvancedCacheManager<number>();

// Legacy compatibility functions
const getEssenceCache = (): Record<string, { coreTakeaway: string; microAudience: string }> => {
    try {
        const raw = sessionStorage.getItem('essenceCache');
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
};

const setEssenceCache = (cache: Record<string, { coreTakeaway: string; microAudience: string }>) => {
    try { sessionStorage.setItem('essenceCache', JSON.stringify(cache)); } catch {}
};
const hashString = (s: string): string => {
    // djb2 hash, hex string
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
    return (h >>> 0).toString(16);
// Adaptive delay factor (rate-aware throttling for bursts)
let ADAPTIVE_DELAY_FACTOR = 1;
const ADAPTIVE_DELAY_FACTOR_MAX = 8;

// Utility: best-effort streaming for OpenAI/OpenRouter
const streamChatJson = async (
    client: OpenAI,
    args: { model: string; messages: Array<{ role: string; content: string }>; },
    onProgress?: (chars: number) => void
): Promise<string> => {
    try {
        // @ts-ignore openai streams in browser return an async iterable
        const stream = await client.chat.completions.create({ ...args, stream: true });
        let buffer = '';
        // for-await streaming chunks
        for await (const chunk of stream as any) {
            const delta = chunk?.choices?.[0]?.delta?.content || '';
            if (delta) {
                buffer += delta;
                onProgress?.(buffer.length);
            }
        }
        return buffer;
    } catch (_) {
        // Fallback to non-streaming
        const result = await client.chat.completions.create({ ...args, response_format: { type: 'json_object' } });
// --- IndexedDB caching (cross-session) ---
const IDB_DB_NAME = 'ai-campaign-cache';
const IDB_STORE = 'essence';
const idbOpen = (): Promise<IDBDatabase | null> => new Promise(res => {
  try {
    const req = indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => res(null);
  } catch { res(null); }
});
const idbGet = async (key: string): Promise<any | null> => {
  const db = await idbOpen(); if (!db) return null;
  return new Promise(resolve => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
};
const idbSet = async (key: string, value: any): Promise<void> => {
  const db = await idbOpen(); if (!db) return;
  return new Promise(resolve => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
};
        return result.choices?.[0]?.message?.content ?? '';
    }
};
};

    return contentMap;
};

// --- DYNAMIC PROMPT & SCHEMA GENERATION ---

// --- PREMIUM VIRAL CONTENT ENGINE ---

const getAdvancedPsychologicalTriggers = (): string => {
    return `**ADVANCED PSYCHOLOGICAL TRIGGERS (Use 2-3 per post for maximum impact):**

**Primary Triggers:**
- **Curiosity Gap:** Create irresistible information gaps ("The one thing nobody tells you about...")
- **Social Proof:** Leverage collective behavior ("Join 50,000+ professionals who...")
- **Scarcity:** Emphasize limited availability ("Only 3 spots left...")
- **Authority:** Establish credibility ("As a 15-year industry veteran...")
- **Novelty:** Highlight breakthrough discoveries ("Scientists just discovered...")

**Emotional Amplifiers:**
- **FOMO:** Fear of missing exclusive opportunities ("While others hesitate...")
- **Loss Aversion:** Focus on what they'll lose ("Don't let your competitors...")
- **Aspiration:** Appeal to desired future states ("Imagine having...")
- **Nostalgia:** Tap into positive memories ("Remember when...")
- **Surprise:** Deliver unexpected revelations ("Plot twist:")

**Engagement Boosters:**
- **Controversy:** Present polarizing viewpoints (respectfully)
- **Pattern Interrupt:** Break expected patterns ("Forget everything you know about...")
- **Storytelling:** Use narrative structure with conflict and resolution
- **Reciprocity:** Offer value first ("Here's my $10,000 framework for free...")
- **Commitment:** Get small commitments first ("Comment 'YES' if you agree...")

**Advanced Techniques:**
- **Bandwagon Effect:** "Everyone's talking about..."
- **Anchoring:** Set reference points ("Most people think X, but actually..."
- **Contrast Principle:** Show dramatic before/after scenarios
- **Exclusivity:** Make content feel special ("For my inner circle only...")
- **Urgency:** Create time pressure ("This changes everything in 2024...")`;
};

const getViralContentPatterns = (): string => {
    return `**VIRAL CONTENT PATTERNS (Choose 1-2 per post):**

**Hook Types:**
- **Question Hook:** Start with intriguing questions
- **Statistic Hook:** Lead with shocking numbers
- **Story Hook:** Begin with compelling narratives
- **Controversy Hook:** Present polarizing statements
- **Prediction Hook:** Make bold future claims
- **Secret Hook:** Promise insider knowledge
- **Mistake Hook:** Admit failures and lessons
- **Transformation Hook:** Show dramatic changes

**Engagement Amplifiers:**
- **Call-to-Action:** Clear, specific action requests
- **Question Prompts:** Encourage comment responses
- **Share Triggers:** Content worth sharing
- **Comment Bait:** Controversial but respectful statements
- **Poll Integration:** Interactive decision points
- **Challenge Creation:** Encourage participation
- **Hashtag Campaigns:** Memorable, brandable tags`;
};

const getElitePlatformPlaybooks = (platforms: Platform[]): string => {
    const playbooks: Record<Platform, string> = {
        'X': `**X (PREMIUM VIRAL PLAYBOOK):**
        - **Hook:** Use curiosity gaps, shocking statistics, or pattern interrupts (first 10 words are critical)
        - **Structure:** Hook → Value → Proof → CTA (max 280 chars, aim for 220-240)
        - **Psychological Triggers:** Combine 2-3 triggers (curiosity + social proof + urgency)
        - **Voice:** Confident, slightly controversial, data-driven, authentic
        - **Viral Elements:** Thread potential, quote-tweet worthy, debate-sparking
        - **Hashtags:** 1-2 trending + 1 niche hashtag, research current trends
        - **Timing:** Peak hours 9-10am, 12-1pm, 5-6pm EST
        - **CTA:** Ask polarizing questions, request specific actions, encourage threads`,

        'LinkedIn': `**LINKEDIN (PREMIUM PROFESSIONAL PLAYBOOK):**
        - **Hook:** Industry pain points, bold predictions, contrarian takes (first line = everything)
        - **Structure:** Hook → Story/Framework → Insight → CTA (800-1200 chars optimal)
        - **Psychological Triggers:** Authority + social proof + aspiration
        - **Voice:** Thought leader, data-backed, vulnerable storytelling, actionable
        - **Viral Elements:** Career advancement, industry insights, leadership lessons
        - **Formatting:** Line breaks every 1-2 sentences, bullet points, strategic bolding
        - **Hashtags:** 3-5 professional (#Leadership #Innovation #CareerGrowth)
        - **Timing:** Tuesday-Thursday 8-10am, 12-2pm EST
        - **CTA:** Share experiences, tag colleagues, connect for more insights`,

        'Facebook': `**FACEBOOK (PREMIUM COMMUNITY PLAYBOOK):**
        - **Hook:** Emotional storytelling, relatable struggles, behind-the-scenes moments
        - **Structure:** Story → Lesson → Community Question (1-3 paragraphs)
        - **Psychological Triggers:** Empathy + storytelling + reciprocity
        - **Voice:** Authentic, vulnerable, conversational, community-focused
        - **Viral Elements:** Personal stories, family moments, life lessons, humor
        - **Formatting:** Paragraph breaks, strategic emojis, conversational tone
        - **Engagement:** Ask for personal stories, create discussion threads
        - **Timing:** 1-3pm, 7-9pm EST (when people browse casually)
        - **CTA:** Share your story, tag friends, react with emotions`,

        'Instagram': `**INSTAGRAM (PREMIUM VISUAL PLAYBOOK):**
        - **Hook:** Visual-first thinking, caption complements image (first line crucial)
        - **Structure:** Hook → Context → Value → CTA (2000 char limit, use it)
        - **Psychological Triggers:** Aspiration + novelty + FOMO
        - **Voice:** Inspirational, aesthetic, lifestyle-focused, aspirational
        - **Viral Elements:** Behind-the-scenes, transformations, tutorials, quotes
        - **Formatting:** Short paragraphs, line breaks, strategic spacing
        - **Hashtags:** 20-30 mix (trending + niche + branded) in first comment
        - **Timing:** 11am-1pm, 7-9pm EST (visual browsing peaks)
        - **CTA:** Save for later, tag friends, share to stories, visit link in bio`,

        'Pinterest': `**PINTEREST (PREMIUM SEO PLAYBOOK):**
        - **Hook:** Keyword-rich titles, solution-focused headlines, listicle formats
        - **Structure:** SEO Title → Value Description → Keywords (500 char limit)
        - **Psychological Triggers:** Curiosity + authority + practicality
        - **Voice:** Helpful, informative, solution-oriented, keyword-optimized
        - **Viral Elements:** How-to guides, lists, tutorials, inspiration boards
        - **SEO Focus:** Primary + secondary keywords, seasonal trends, long-tail phrases
        - **Formatting:** Complete sentences, natural keyword integration
        - **Timing:** 8-11pm EST (evening planning/browsing)
        - **CTA:** Click to read more, save to board, visit website for full guide`
    };
    return platforms.map(p => playbooks[p]).join('\n\n');
};

const getEliteImagePromptInstructions = () => {
    return `For the 'imagePrompt', create a masterpiece. Be a director, not just a writer. Specify:
    - **Style:** (e.g., photorealistic, cinematic, 3D render, digital painting, abstract)
    - **Lighting:** (e.g., dramatic studio lighting, soft natural light, neon cyberpunk glow)
    - **Composition:** (e.g., close-up shot, wide-angle landscape, rule of thirds)
    - **Mood:** (e.g., inspiring and hopeful, mysterious and intriguing, energetic and vibrant)
    - **Details:** Describe the subject, environment, and colors with rich, evocative language. The prompt should be a recipe for a stunning, professional-grade image.`;
};

const getPostSchema = (platforms: Platform[]) => ({
    type: Type.OBJECT,
    properties: {
        platform: { type: Type.STRING, enum: platforms, description: "The target social media platform." },
        versionA: { type: Type.STRING, description: "Copy for Version A, aligned to a specific psychological angle." },
        versionB: { type: Type.STRING, description: "Copy for Version B, testing a different psychological angle from Version A." },
        angleA: { type: Type.STRING, description: "The psychological angle for Version A (e.g., Curiosity Gap, Social Proof, Scarcity)." },
        angleB: { type: Type.STRING, description: "The psychological angle for Version B (e.g., Authority, Novelty, Loss Aversion)." },
        whyThisWorks: { type: Type.STRING, description: "A concise strategic justification explaining why the approach, angles, and image prompt will perform for this platform and audience." },
        viralScore: { type: Type.INTEGER, description: "An estimated virality score from 1-100, based on the content's potential engagement, shareability, and emotional impact for the specific platform." },
        imagePrompt: { type: Type.STRING, description: "An elite, detailed, professional-grade prompt for generating a high-quality companion image, following the detailed image prompt instructions." },
        sourceUrl: { type: Type.STRING, description: "The original source URL this post is based on. Must be one of the URLs provided in the input." }
    },
    required: ["platform", "versionA", "versionB", "angleA", "angleB", "whyThisWorks", "viralScore", "imagePrompt", "sourceUrl"]
});

const debriefSchema = {
    type: Type.OBJECT,
    properties: {
        campaignSynopsis: { type: Type.STRING, description: "A high-level summary of the overall campaign strategy." },
        primaryAudience: { type: Type.STRING, description: "A detailed persona of the primary target audience, including their pain points and motivations." },
        keyThemes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 core emotional and narrative themes." },
        competitiveAngle: { type: Type.STRING, description: "The unique, defensible angle or position that makes this campaign stand out." },
    },
    required: ["campaignSynopsis", "primaryAudience", "keyThemes", "competitiveAngle"]
};

const distillUrlEssenceSchema = {
    type: Type.OBJECT,
    properties: {
        coreTakeaway: { type: Type.STRING, description: "The single most important, actionable point or surprising insight from the article text." },
        microAudience: { type: Type.STRING, description: "The specific, niche persona that would be most interested in this particular piece of content (e.g., 'SaaS startup founders', 'Hobbyist gardeners')." },
    },
    required: ["coreTakeaway", "microAudience"]
};

// --- ADVANCED VIRAL SCORING ALGORITHM ---
const calculateAdvancedViralScore = (content: string, platform: Platform, triggers: PsychologicalTrigger[], pattern?: ViralPattern): number => {
    let score = 50; // Base score

    // Content length optimization
    const length = content.length;
    const optimalLengths = { X: 240, LinkedIn: 1000, Facebook: 500, Instagram: 1500, Pinterest: 400 };
    const optimal = optimalLengths[platform];
    const lengthScore = Math.max(0, 100 - Math.abs(length - optimal) / optimal * 100);
    score += lengthScore * 0.15;

    // Psychological trigger effectiveness
    const triggerScores = {
        curiosity_gap: 15, social_proof: 12, scarcity: 14, authority: 10, novelty: 13,
        fomo: 16, loss_aversion: 11, aspiration: 12, nostalgia: 9, surprise: 14,
        controversy: 18, pattern_interrupt: 15, storytelling: 13, reciprocity: 10,
        bandwagon: 11, anchoring: 9, contrast: 12, exclusivity: 14, urgency: 13,
        humor: 12, empathy: 11, fear: 10, joy: 13, anger: 8, commitment: 9
    };

    triggers.forEach(trigger => {
        score += triggerScores[trigger] || 5;
    });

    // Viral pattern bonus
    if (pattern) {
        const patternScores = {
            question_hook: 8, statistic_hook: 10, story_hook: 12, controversy_hook: 15,
            prediction_hook: 9, secret_hook: 11, mistake_hook: 8, transformation_hook: 13
        };
        score += patternScores[pattern] || 5;
    }

    // Platform-specific optimizations
    const platformMultipliers = { X: 1.2, LinkedIn: 1.1, Facebook: 1.0, Instagram: 1.15, Pinterest: 0.95 };
    score *= platformMultipliers[platform];

    // Emotional resonance (simplified sentiment analysis)
    const emotionalWords = ['amazing', 'incredible', 'shocking', 'revolutionary', 'breakthrough', 'secret', 'exclusive'];
    const emotionalCount = emotionalWords.filter(word => content.toLowerCase().includes(word)).length;
    score += emotionalCount * 3;

    // Call-to-action presence
    const ctaWords = ['comment', 'share', 'tag', 'save', 'click', 'join', 'follow', 'subscribe'];
    const hasCTA = ctaWords.some(word => content.toLowerCase().includes(word));
    if (hasCTA) score += 8;

    // Hashtag optimization (for applicable platforms)
    if (platform !== 'LinkedIn') {
        const hashtagCount = (content.match(/#\w+/g) || []).length;
        const optimalHashtags = platform === 'X' ? 2 : platform === 'Instagram' ? 10 : 3;
        const hashtagScore = Math.max(0, 10 - Math.abs(hashtagCount - optimalHashtags));
        score += hashtagScore;
    }

    return Math.min(100, Math.max(1, Math.round(score)));
};

// --- PREMIUM AI CLIENT FACTORY ---

type TaskComplexity = 'simple' | 'medium' | 'complex' | 'strategic';
type TaskType = 'strategic' | 'creative' | 'rapid' | 'analysis';

const getAiClient = (settings: Settings, taskType?: TaskType) => {
    const apiKey = settings.apiKeys[settings.provider];
    if (!apiKey) throw new Error(`API Key for ${settings.provider} is not configured.`);

    switch (settings.provider) {
        case 'gemini':
            return new GoogleGenAI({ apiKey });
        case 'openai':
            return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        case 'openrouter':
            return new OpenAI({
                apiKey,
                baseURL: OPENROUTER_API_BASE,
                defaultHeaders: APP_INFO_HEADERS,
                dangerouslyAllowBrowser: true
            });
        default:
            throw new Error(`Unsupported AI provider: ${settings.provider}`);
    }
};

// --- SMART MODEL ROUTING ---
const getOptimalModel = (settings: Settings, taskType: TaskType, complexity: TaskComplexity = 'medium'): string => {
    if (!settings.performance?.enableSmartRouting) {
        // Fallback to standard models
        if (settings.provider === 'gemini') return GEMINI_TEXT_MODEL;
        if (settings.provider === 'openai') return OPENAI_TEXT_MODEL;
        if (settings.provider === 'openrouter') return settings.openRouterModel;
        return GEMINI_TEXT_MODEL;
    }

    // Smart routing based on task type and complexity
    switch (taskType) {
        case 'strategic':
            return complexity === 'complex' ? PREMIUM_MODELS.strategic : PREMIUM_MODELS.analysis;
        case 'creative':
            return complexity === 'complex' ? PREMIUM_MODELS.creative : PREMIUM_MODELS.rapid;
        case 'rapid':
            return PREMIUM_MODELS.rapid;
        case 'analysis':
            return complexity === 'complex' ? PREMIUM_MODELS.analysis : PREMIUM_MODELS.rapid;
        default:
            return PREMIUM_MODELS.rapid;
    }
};

// --- ADVANCED PERFORMANCE OPTIMIZATION ---
const getOptimalConcurrency = (settings: Settings, taskType: TaskType): number => {
    const baseConcurrency = settings.performance?.concurrency || AI_CONCURRENCY[settings.provider];
    const multiplier = settings.performance?.mode === 'premium' || settings.performance?.mode === 'ultra_premium'
        ? PREMIUM_CONCURRENCY_MULTIPLIER
        : 1;

    // Adjust based on task type
    const taskMultiplier = taskType === 'rapid' ? 1.2 : taskType === 'strategic' ? 0.8 : 1;

    return Math.max(1, Math.floor(baseConcurrency * multiplier * taskMultiplier));
};

// --- CORE GENERATION LOGIC ---

type UpdateCallback = (update: Partial<CampaignResult>, message: string) => void;

const generateForTopic = async (topic: string, settings: Settings, platforms: Platform[], onUpdate: UpdateCallback) => {
    const provider = settings.provider;
    onUpdate({}, provider === 'gemini' ? "Performing real-time web search for your topic..." : "Querying AI for your topic...");

    const client = getAiClient(settings);

    const platformPlaybooks = getElitePlatformPlaybooks(platforms);
    const imagePromptInstructions = getEliteImagePromptInstructions();

    const systemPrompt = `You are "Synapse" — an elite fusion of a Chief Creative Officer, FAANG data scientist, and viral content strategist. You architect premium, platform-native campaigns that achieve maximum virality through advanced behavioral science and psychological optimization.

    Think through your strategy step-by-step internally (chain-of-thought), but do NOT reveal any reasoning. Output ONLY valid JSON that conforms to the provided schemas.

    **PREMIUM VIRAL PRINCIPLES:**
    1.  **Advanced AIDA Framework:** Each post must progress Attention → Interest → Desire → Action with premium psychological triggers.
    2.  **25+ Psychological Triggers:** ${getAdvancedPsychologicalTriggers()}
    3.  **Viral Content Patterns:** ${getViralContentPatterns()}
    4.  **A/B/C/D Psychology:** Version A and B MUST test different psychological angles for maximum engagement optimization.

    **PREMIUM PLATFORM MASTERY:**
    ${platformPlaybooks}

    **Your Response MUST be a single, valid JSON object with two top-level keys:**
    1.  \`strategicDebrief\`: An object matching the provided debrief schema.
    2.  \`posts\`: An array of post objects.

    **PREMIUM INSTRUCTIONS:**
    - Generate one post for EACH of these platforms: ${platforms.join(', ')}.
    - Follow the premium platform playbooks meticulously for each post.
    - Use 2-3 psychological triggers per post for maximum viral potential.
    - Include: \`angleA\`, \`angleB\`, and \`whyThisWorks\` for every post.
    - Calculate accurate viral scores (1-100) based on content quality, triggers, and platform optimization.
    - ${imagePromptInstructions}
    - Ensure every post object perfectly matches the post schema.
    - Optimize for maximum shareability, engagement, and viral potential.`;

    const userPrompt = `Topic: "${topic}"`;

    const postSchema = getPostSchema(platforms);
    const fullSchema = { type: Type.OBJECT, properties: { strategicDebrief: debriefSchema, posts: { type: Type.ARRAY, items: postSchema } }, required: ["strategicDebrief", "posts"] };

    let responseText: string;
    let sources: Source[] = [];

    if (provider === 'gemini' && client instanceof GoogleGenAI) {
    // Guard OpenRouter model against allowlist if enabled
    if (settings.provider === 'openrouter' && settings.guardrails?.enforceOpenRouterAllowlist) {
        const list = settings.guardrails.openRouterAllowlist || [];
        if (list.length && !list.includes(settings.openRouterModel)) {
            throw new Error(`Selected OpenRouter model not in allowlist. Allowed: ${list.join(', ')}`);
        }
    }
        onUpdate({}, "Phase 1/2: Performing real-time web search and analysis...");
        const searchResult = await retry(async () => client.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: `Provide a detailed, comprehensive overview of the topic: "${topic}". Include key facts, recent developments, and different perspectives.`,
            config: { tools: [{ googleSearch: {} }] },
        }));
        const searchContext = searchResult.text;
        sources = searchResult.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter((web): web is { uri: string, title: string } => !!web?.uri) ?? [];
        onUpdate({ sources }, "Phase 2/2: Synthesizing campaign from search results...");
        const finalResult = await retry(async () => client.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: `${systemPrompt}\n\nUse the following research context to inform your campaign:\n\n**Research Context:**\n${searchContext}\n\n**User's Original Topic:** "${topic}"`,
            config: { responseMimeType: "application/json", responseSchema: fullSchema }
        }));
        responseText = finalResult.text;

    } else if ((provider === 'openai' || provider === 'openrouter') && client instanceof OpenAI) {
        const model = provider === 'openai' ? OPENAI_TEXT_MODEL : settings.openRouterModel;
        let last = 0;
        const streamed = await retry(async () => streamChatJson(
            client,
            { model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }] },
            (chars) => {
                const now = Date.now();
                if (now - last > 600) { last = now; onUpdate({}, 'Synthesizing campaign (streaming)...'); }
            }
        ));
        responseText = streamed;
    } else {
        throw new Error("Invalid provider configuration for topic generation.");
    }

    onUpdate({}, "Finalizing campaign...");
    const responseJson = safeJsonParse<{ strategicDebrief: StrategicDebrief; posts: any[] }>(responseText, 'topic campaign');
    const finalResult: CampaignResult = {
        strategicDebrief: responseJson.strategicDebrief,
        posts: responseJson.posts.map((p: any) => ({ ...p, id: self.crypto.randomUUID(), sourceUrl: 'N/A' })),
        sources
    };
    onUpdate(finalResult, "Campaign Ready!");
};

const generateForUrls = async (urls: string[], settings: Settings, platforms: Platform[], onUpdate: UpdateCallback) => {
    // --- PHASE 1: Scrape & Holistic Debrief ---
    onUpdate({}, `Scraping ${urls.length} URLs... (simulated)`);
    const scrapedContent = await mockScrapeUrls(urls);
    if (scrapedContent.size === 0) throw new Error("Could not extract content from any of the provided URLs.");

    onUpdate({}, `Phase 1/3: Creating master strategy from ${scrapedContent.size} pages...`);
    const truncatedCorpus = Array.from(scrapedContent.values()).map(text => text.substring(0, DEBRIEF_CONTENT_TRUNCATE_LENGTH)).join("\n\n---\n\n");
    const debriefSystemPrompt = `You are "Synapse," a master digital strategist. Analyze the provided text corpus from multiple web pages and generate a high-level strategic debriefing as a single, valid JSON object matching the required schema. Be insightful and concise.`;
    const debriefUserPrompt = `CONTENT:\n${truncatedCorpus}`;
    let debriefText: string;
    const client = getAiClient(settings);

    if (settings.provider === 'gemini' && client instanceof GoogleGenAI) {
        const result = await retry(async () => client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: debriefUserPrompt, config: { systemInstruction: debriefSystemPrompt, responseMimeType: "application/json", responseSchema: debriefSchema } }));
        debriefText = result.text;
    } else if ((settings.provider === 'openai' || settings.provider === 'openrouter') && client instanceof OpenAI) {
        const model = settings.provider === 'openai' ? OPENAI_TEXT_MODEL : settings.openRouterModel;
        const streamed = await retry(async () => streamChatJson(
            client,
            { model, messages: [{ role: 'system', content: debriefSystemPrompt }, { role: 'user', content: debriefUserPrompt }] }
        ));
        debriefText = streamed;
    } else { throw new Error("Invalid provider configuration for debrief."); }

    const strategicDebrief = safeJsonParse<StrategicDebrief>(debriefText, 'strategic debrief');
    onUpdate({ strategicDebrief }, `Master strategy created.`);

    // --- PHASE 2: Per-URL Essence Distillation ---
    onUpdate({}, `Phase 2/3: Distilling essence from each URL...`);
    const essenceDistillationSystemPrompt = `You are a precision analyst. For the given article text, extract its core essence. Your response must be a single, valid JSON object with 'coreTakeaway' and 'microAudience' keys, matching the provided schema.`;

    const perf = settings.performance || {};
    const effConcurrency = Math.max(1, perf.concurrency || AI_CONCURRENCY[settings.provider]);
    const limit = pLimit(effConcurrency);
    const essenceCache = getEssenceCache();

    const entries = Array.from(scrapedContent.entries());

    // Guardrail: limit total URLs per run
    const effMaxUrls = perf.maxUrlsPerRun || MAX_URLS_PER_RUN;
    if (entries.length > effMaxUrls) {
        entries.length = effMaxUrls;
        onUpdate({}, `Limiting to top ${effMaxUrls} URLs for this run to optimize speed and reliability.`);
    }

    // Micro-batching for OpenRouter (optional small batches to reduce overhead)
    const results: Array<{ url: string; essence: { coreTakeaway: string; microAudience: string } }> = [];

    // Helper to process a single URL with cache and retry
    const processOne = async (url: string, rawContent: string) => {
        const effEssenceTrunc = perf.essenceTruncate || ESSENCE_CONTENT_TRUNCATE_LENGTH;
        const content = (rawContent || '').slice(0, effEssenceTrunc);
        const key = `${url}::${hashString(content)}`;
        const idbHit = await idbGet(key);
        if (idbHit && idbHit.coreTakeaway && idbHit.microAudience) {
            essenceCache[url] = idbHit;
            results.push({ url, essence: idbHit });
            return;
        }
        if (essenceCache[url]) {
            results.push({ url, essence: essenceCache[url] });
            return;
        }
        const doCall = async (): Promise<string> => {
            if (settings.provider === 'gemini' && client instanceof GoogleGenAI) {
                const result = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: content, config: { systemInstruction: essenceDistillationSystemPrompt, responseMimeType: "application/json", responseSchema: distillUrlEssenceSchema }});
                return result.text;
            } else if ((settings.provider === 'openai' || settings.provider === 'openrouter') && client instanceof OpenAI) {
                const model = settings.provider === 'openai' ? 'gpt-3.5-turbo' : settings.openRouterModel; // faster model
                const result = await client.chat.completions.create({ model, messages: [{ role: "system", content: essenceDistillationSystemPrompt }, { role: "user", content }], response_format: { type: "json_object" } });
                return result.choices[0].message.content ?? '';
            } else {
                throw new Error("Invalid provider for essence distillation.");
            }
        };
        const essenceText = await retry(doCall);
        const essence = safeJsonParse<{ coreTakeaway: string; microAudience: string }>(essenceText, `essence for ${url}`);
        essenceCache[url] = essence;
        await idbSet(key, essence);
        results.push({ url, essence });
    };

    if (settings.provider === 'openrouter') {
        for (let i = 0; i < entries.length; i += ESSENCE_MICRO_BATCH_SIZE) {
            const slice = entries.slice(i, i + ESSENCE_MICRO_BATCH_SIZE);
            await Promise.all(slice.map(([url, raw]) => limit(() => processOne(url, raw))));
        }
    } else {
        await Promise.all(entries.map(([url, raw]) => limit(() => processOne(url, raw))));
    }

    setEssenceCache(essenceCache);
    const essences = results;
    const essenceMap = new Map(essences.map(e => [e.url, e.essence]));
    onUpdate({}, `Essence distilled for all URLs.`);

    // --- PHASE 3: Hyper-Targeted Post Generation ---
    const leanContext = `**MASTER STRATEGY (CONTEXT):**\nCampaign Synopsis: ${strategicDebrief.campaignSynopsis}\nPrimary Audience: ${strategicDebrief.primaryAudience}`;
    const allUrls = Array.from(scrapedContent.keys());
    const platformPlaybooks = getElitePlatformPlaybooks(platforms);
    const imagePromptInstructions = getEliteImagePromptInstructions();
    const batchPostResponseSchema = { type: Type.OBJECT, properties: { posts: { type: Type.ARRAY, items: getPostSchema(platforms) }}, required: ["posts"] };

    const platformCounts: Record<Platform, number> = { X: 0, LinkedIn: 0, Facebook: 0, Instagram: 0, Pinterest: 0 };
    const caps = settings.guardrails?.platformPostCaps || {};

    for (let i = 0; i < allUrls.length; i += URL_BATCH_SIZE) {
        const batchUrls = allUrls.slice(i, i + URL_BATCH_SIZE);
        const batchNumber = i / URL_BATCH_SIZE + 1;
        const totalBatches = Math.ceil(allUrls.length / URL_BATCH_SIZE);
        onUpdate({}, `Phase 3/3: Generating posts for batch ${batchNumber} of ${totalBatches}...`);

        const contentBlocks = batchUrls.map(url => {
            const essence = essenceMap.get(url);
            const content = scrapedContent.get(url);
            const effPostTrunc = perf.postTruncate || POST_GEN_CONTENT_TRUNCATE_LENGTH;
            const truncated = (content || '').slice(0, effPostTrunc);
            return `--- START CONTENT FROM ${url} ---\n**CORE TAKEAWAY:** ${essence?.coreTakeaway}\n**MICRO-AUDIENCE:** ${essence?.microAudience}\n**FULL TEXT:**\n${truncated}\n--- END CONTENT ---`;
        }).join("\n\n");

        const batchSystemPrompt = `You are "Synapse" — an elite viral marketing strategist and data scientist. Create premium, hyper-targeted social posts optimized for maximum virality and engagement.

        Think through your strategy step-by-step internally (chain-of-thought), but do NOT reveal any reasoning. Output ONLY valid JSON that conforms to the schema.

        **PRIMARY DIRECTIVE:** For EACH content block, the post MUST be laser-focused on its specific 'CORE TAKEAWAY' and tailored for its 'MICRO-AUDIENCE'. Use the Master Strategy and full text for context and tone only.

        **PREMIUM VIRAL PRINCIPLES:**
        1.  **Advanced AIDA & Emotional Triggers:** Apply premium psychological triggers to the CORE TAKEAWAY.
        2.  **A/B Psychology:** Version A and B must test different psychological angles for maximum engagement.
        3.  **Viral Optimization:** Use proven viral patterns and emotional amplifiers.
        4.  **Platform Mastery:** Follow premium platform-specific strategies for optimal performance.

        **PREMIUM PLATFORM STRATEGIES:**
        ${platformPlaybooks}

        **INSTRUCTIONS:**
        - For each content block, generate one post for EACH of these platforms: ${platforms.join(', ')}.
        - Follow the premium platform playbooks meticulously.
        - Use 2-3 psychological triggers per post for maximum viral potential.
        - Include: \`angleA\`, \`angleB\`, and \`whyThisWorks\` for every post.
        - Calculate accurate viral scores (1-100) based on content quality, triggers, and platform optimization.
        - ${imagePromptInstructions}
        - Your entire response MUST be a single JSON object with a 'posts' array. Each post must match the schema and contain the correct 'sourceUrl'.
        - Optimize every post for maximum shareability, engagement, and viral potential.`;

        const batchUserPrompt = `${leanContext}\n\n**TASK CONTENT:**\n${contentBlocks}`;
        let batchResponseText: string;

        if (settings.provider === 'gemini' && client instanceof GoogleGenAI) {
            const result = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: batchUserPrompt, config: { systemInstruction: batchSystemPrompt, responseMimeType: "application/json", responseSchema: batchPostResponseSchema }});
            batchResponseText = result.text;
        } else if ((settings.provider === 'openai' || settings.provider === 'openrouter') && client instanceof OpenAI) {
            const model = settings.provider === 'openai' ? OPENAI_TEXT_MODEL : settings.openRouterModel;
            const streamed = await streamChatJson(
                client,
                { model, messages: [{ role: 'system', content: batchSystemPrompt }, { role: 'user', content: batchUserPrompt }] },
                () => onUpdate({}, `Generating posts for batch ${batchNumber}... (streaming)`)
            );
            batchResponseText = streamed;
        } else { throw new Error("Invalid provider configuration for post generation."); }

        const batchResponseJson = safeJsonParse<{ posts: any[] }>(batchResponseText, `post batch ${batchNumber}`);
        // Apply platform caps
        let rawPosts: Post[] = batchResponseJson.posts.map((p: any) => ({ ...p, id: self.crypto.randomUUID() }));
        if (Object.keys(caps).length > 0) {
            rawPosts = rawPosts.filter(p => {
                const cap = (caps as any)[p.platform] as number | undefined;
                if (!cap || cap <= 0) return true;
                const count = platformCounts[p.platform];
                if (count < cap) { platformCounts[p.platform] = count + 1; return true; }
                return false;
            });
        }
        const posts: Post[] = rawPosts;
        onUpdate({ posts }, `Generated ${posts.length} posts from batch ${batchNumber}.`);
    }
};

export const generateCampaign = async (inputText: string, settings: Settings, platforms: Platform[], onUpdate: UpdateCallback): Promise<void> => {
    const urls = parseUrls(inputText);
    if (urls.length > 0) {
        await generateForUrls(urls, settings, platforms, onUpdate);
    } else {
        await generateForTopic(inputText, settings, platforms, onUpdate);
    }
};

export const generateImageForPrompt = async (prompt: string, settings: Settings): Promise<string> => {
    const client = getAiClient(settings);

    if (settings.provider === 'gemini' && client instanceof GoogleGenAI) {
        const response = await client.models.generateImages({
            model: GEMINI_IMAGE_MODEL,
            prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' },
        });
        if (!response.generatedImages?.[0]?.image.imageBytes) throw new Error("Image generation failed.");
        return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
    } else if ((settings.provider === 'openai' || settings.provider === 'openrouter') && client instanceof OpenAI) {
        const model = settings.provider === 'openai' ? OPENAI_IMAGE_MODEL : 'openai/dall-e-3';
        const response = await client.images.generate({
            model,
            prompt,
            n: 1,
            size: '1792x1024',
            response_format: 'b64_json'
        });
        if (!response.data?.[0]?.b64_json) throw new Error("Image generation failed.");
        return `data:image/png;base64,${response.data[0].b64_json}`;
    } else {
        throw new Error(`Image generation is not supported for the provider: ${settings.provider}`);
    }
};
