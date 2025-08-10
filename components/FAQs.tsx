import React from 'react';

export const FAQs: React.FC = () => {
  return (
    <section className="mt-12 space-y-6 animate-fade-in" aria-label="Frequently Asked Questions">
      <h2 className="text-3xl font-extrabold text-content-100 text-center">FAQs</h2>
      <div className="max-w-4xl mx-auto">
        <details className="bg-base-200 border border-base-300 rounded-lg p-4 mb-3">
          <summary className="cursor-pointer font-semibold text-content-100">How does the Research‑Driven mode improve accuracy?</summary>
          <p className="mt-2 text-content-200">When using Gemini, the app performs real‑time Google Search and grounds outputs in fresh context, returning source links. This improves credibility and recency for your campaign strategy.</p>
        </details>
        <details className="bg-base-200 border border-base-300 rounded-lg p-4 mb-3">
          <summary className="cursor-pointer font-semibold text-content-100">Can I use OpenRouter efficiently without exhausting my API keys?</summary>
          <p className="mt-2 text-content-200">Yes. The app includes concurrency limiting, micro‑batching, adaptive backoff, and per‑URL caching (session + cross‑session) to minimize calls and avoid rate‑limit spikes.</p>
        </details>
        <details className="bg-base-200 border border-base-300 rounded-lg p-4 mb-3">
          <summary className="cursor-pointer font-semibold text-content-100">Can I export the campaign content?</summary>
          <p className="mt-2 text-content-200">You can export as JSON or CSV. The CSV includes platform, A/B copy, angles, viral score, image prompts, and source URLs.</p>
        </details>
        <details className="bg-base-200 border border-base-300 rounded-lg p-4 mb-3">
          <summary className="cursor-pointer font-semibold text-content-100">How do I control speed vs. quality and cost?</summary>
          <p className="mt-2 text-content-200">Use the Performance settings to adjust concurrency, micro‑batch size, max URLs per run, and truncation lengths. Choose Economy, Balanced, or Premium as a starting point.</p>
        </details>
        <details className="bg-base-200 border border-base-300 rounded-lg p-4 mb-3">
          <summary className="cursor-pointer font-semibold text-content-100">Which models do you support?</summary>
          <p className="mt-2 text-content-200">Gemini, OpenAI, and OpenRouter. With OpenRouter, you can enforce a model allowlist to avoid accidental expensive models.</p>
        </details>
      </div>
    </section>
  );
};

