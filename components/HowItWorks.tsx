import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="mt-12 space-y-6 animate-fade-in" aria-label="How It Works">
      <h2 className="text-3xl font-extrabold text-content-100 text-center">How It Works</h2>
      <div className="max-w-4xl mx-auto text-content-200 space-y-4">
        <h3 className="text-2xl font-bold text-content-100">Two Powerful Modes</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Research‑Driven:</strong> Enter a topic. With Gemini, we perform real‑time Google Search grounding for fresh context and source links. Then Synapse synthesizes a complete campaign.</li>
          <li><strong>Deep Analysis:</strong> Provide URLs. We extract each page's essence and generate platform‑native posts tailored to each link's audience and takeaway.</li>
        </ul>

        <h3 className="text-2xl font-bold text-content-100">What You Get</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Strategic Debrief:</strong> Synopsis, audience, key themes, and competitive angle.</li>
          <li><strong>Posts per Platform:</strong> A/B versions with explicit psychological angles (<em>angleA</em>, <em>angleB</em>) and a short strategy note (<em>Why this works</em>).</li>
          <li><strong>Viral Score:</strong> A quick signal of potential impact for each platform.</li>
          <li><strong>Image Prompts:</strong> Director‑grade descriptors tailored for Imagen 3 or DALL‑E 3.</li>
        </ul>

        <h3 className="text-2xl font-bold text-content-100">Built‑in Best Practices</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Platform Playbooks:</strong> Hooks, formatting, and CTAs optimized for LinkedIn, X, Facebook, Instagram, and Pinterest.</li>
          <li><strong>Rate‑Smart AI Calls:</strong> Concurrency limiting, exponential backoff, and micro‑batching for OpenRouter.</li>
          <li><strong>Cost Control:</strong> Truncation and model routing for fast essence extraction and premium final synthesis.</li>
        </ul>
      </div>
    </section>
  );
};

