import React from 'react';

export const Resources: React.FC = () => {
  return (
    <section className="mt-12 space-y-8 animate-fade-in" aria-label="Resources and Playbooks">
      <h2 className="text-3xl font-extrabold text-content-100 text-center">Resources & Playbooks</h2>
      <div className="max-w-4xl mx-auto text-content-200 space-y-6">
        <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-content-100">Platform Playbooks</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>LinkedIn:</strong> Hook + line breaks, value-dense bullets, soft CTA.</li>
            <li><strong>X:</strong> Single insight per post; 220–240 chars; 1–2 hashtags max.</li>
            <li><strong>Instagram:</strong> Visual-first; alt text; carousel summaries.</li>
            <li><strong>Facebook:</strong> 1–2 short paragraphs; community-leaning CTAs.</li>
            <li><strong>Pinterest:</strong> Keyword-rich titles; how-to utility; clean design.</li>
          </ul>
        </article>

        <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-content-100">Psychology Angles</h3>
          <p className="mt-2">Curiosity Gap, Social Proof, Scarcity, Authority, Novelty, Loss Aversion, Reciprocity.</p>
        </article>

        <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-content-100">Creative Prompts</h3>
          <p className="mt-2">Describe subject, scene, lighting, lens, mood, and composition for Imagen 3 or DALL·E 3 to get premium visuals.</p>
        </article>
      </div>
    </section>
  );
};

