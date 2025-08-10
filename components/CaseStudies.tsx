import React from 'react';

export const CaseStudies: React.FC = () => {
  return (
    <section className="mt-12 space-y-10 animate-fade-in" aria-label="Case Studies and Benchmarks">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-content-100">Case Studies & Benchmarks</h2>
        <p className="mt-2 text-content-200 max-w-3xl mx-auto">
          Realistic, keyword-rich AI marketing benchmarks and social media strategy examples to help you understand
          what "good" looks like across industries and platforms.
        </p>
      </div>

      <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-content-100">SaaS: Thought Leadership Campaign</h3>
        <p className="text-sm text-content-300 mt-1">LinkedIn focus • Lead generation • A/B psychological angles</p>
        <ul className="list-disc list-inside text-content-200 mt-3 space-y-1">
          <li>Objective: Increase qualified demo requests by 18% over 30 days.</li>
          <li>Playbook: Authority + Social Proof angles. Long-form posts with a CTA to a lead magnet.</li>
          <li>Benchmark: 1.8–2.3% CTR on lead magnets; 6–10% comment rate for top quartile posts.</li>
        </ul>
      </article>

      <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-content-100">Ecommerce: Product Launch Surge</h3>
        <p className="text-sm text-content-300 mt-1">Instagram + Pinterest • Visual storytelling • Image prompts</p>
        <ul className="list-disc list-inside text-content-200 mt-3 space-y-1">
          <li>Objective: Drive 20% MoM increase in add-to-carts within 14 days of launch.</li>
          <li>Playbook: Aesthetic aspiration + Loss Aversion (limited runs). Carousel + Pin bundles.</li>
          <li>Benchmark: 3–5% save rate; 1.5–2x higher session time from Pin referrals.</li>
        </ul>
      </article>

      <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-content-100">Local Services: Community Engine</h3>
        <p className="text-sm text-content-300 mt-1">Facebook focus • Community content • Event-driven CTAs</p>
        <ul className="list-disc list-inside text-content-200 mt-3 space-y-1">
          <li>Objective: 12% increase in foot traffic and phone inquiries YoY.</li>
          <li>Playbook: Events + Social Proof (reviews). Short-form video + photo albums.</li>
          <li>Benchmark: 5–7% engagement rate on event posts; 10–15% uplift during promotion windows.</li>
        </ul>
      </article>
    </section>
  );
};

