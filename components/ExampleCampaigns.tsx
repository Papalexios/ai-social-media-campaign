import React from 'react';

export const ExampleCampaigns: React.FC = () => {
  return (
    <section className="mt-12 space-y-10 animate-fade-in" aria-label="Example Campaigns for SEO">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-content-100">Example Campaigns</h2>
        <p className="mt-2 text-content-200 max-w-3xl mx-auto">
          Explore high-quality, keyword-rich AI marketing examples and social media strategy templates. These
          samples demonstrate how an AI campaign strategist crafts platform-native content, optimized for virality and conversions.
        </p>
      </div>

      {/* SaaS Example */}
      <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-content-100">SaaS Product — B2B Workflow Automation</h3>
        <p className="text-sm text-content-300 mt-1">AI marketing example • social media strategy • LinkedIn, X</p>
        <div className="mt-4">
          <h4 className="text-xl font-semibold text-brand-primary">Strategic Debrief</h4>
          <ul className="list-disc list-inside text-content-200 mt-2 space-y-1">
            <li><strong>Synopsis:</strong> Automate repetitive ops to reclaim focus time and reduce costs.</li>
            <li><strong>Audience:</strong> Operations leaders at mid-market SaaS companies.</li>
            <li><strong>Themes:</strong> Time leverage, error reduction, ROI clarity, async culture.</li>
            <li><strong>Competitive Angle:</strong> Clear ROI with fast time-to-value and SOC2-by-default.</li>
          </ul>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-300/40 p-4 rounded-lg">
            <h5 className="font-semibold text-content-100">LinkedIn Sample Post</h5>
            <p className="text-xs text-content-300">Angle: Authority vs. Social Proof</p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version A — Authority: "Ops leaders: your team spends 27% of the week on copy/paste work.\nHere’s how top SaaS teams reclaimed 10 hrs/employee with workflow automation (and how to measure the ROI in 14 days)."
            </p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version B — Social Proof: "We studied 143 SaaS teams.\nAutomation saved an average of $1,482/seat/yr.\nThe playbook (with templates) inside — comment 'ROI' and I’ll DM it."
            </p>
          </div>
          <div className="bg-base-300/40 p-4 rounded-lg">
            <h5 className="font-semibold text-content-100">X (Twitter) Sample Post</h5>
            <p className="text-xs text-content-300">Angle: Curiosity Gap vs. Urgency</p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version A — Curiosity Gap: "The 5 automations that saved us 312 hours last quarter (and the one that shocked finance). 🧵"
            </p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version B — Urgency: "Your quarter ends in 18 days.\nShip these 3 automations now and walk into QBR with a win. 🧵"
            </p>
          </div>
        </div>
      </article>

      {/* Local Business Example */}
      <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-content-100">Local Business — Specialty Coffee Shop</h3>
        <p className="text-sm text-content-300 mt-1">AI social media strategy • Instagram, Facebook</p>
        <div className="mt-4">
          <h4 className="text-xl font-semibold text-brand-primary">Strategic Debrief</h4>
          <ul className="list-disc list-inside text-content-200 mt-2 space-y-1">
            <li><strong>Synopsis:</strong> Elevate foot traffic with origin storytelling and limited drops.</li>
            <li><strong>Audience:</strong> Third‑wave coffee lovers within 5 miles.</li>
            <li><strong>Themes:</strong> Craft, scarcity, community, behind‑the‑scenes.</li>
            <li><strong>Competitive Angle:</strong> Small-batch micro-lots roasted same-day.</li>
          </ul>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-300/40 p-4 rounded-lg">
            <h5 className="font-semibold text-content-100">Instagram Sample Caption</h5>
            <p className="text-xs text-content-300">Angle: Sensory Imagery vs. Scarcity</p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version A — Sensory: "Tasting notes: cacao, black cherry, jasmine.\nPulled on our Linea after a 48‑hr rest — syrupy and bright."
            </p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version B — Scarcity: "Only 37 bags of our new Ethiopia micro‑lot.\nRoasted this morning. When it’s gone, it’s gone."
            </p>
          </div>
          <div className="bg-base-300/40 p-4 rounded-lg">
            <h5 className="font-semibold text-content-100">Facebook Sample Post</h5>
            <p className="text-xs text-content-300">Angle: Community vs. Social Proof</p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version A — Community: "Latte art throwdown this Friday at 7pm!\nFree pours, playlist by @analogclub, and surprise guests."
            </p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version B — Social Proof: "We just crossed 1,000 five‑star reviews.\nTo celebrate, first 25 cappuccinos tomorrow are on us."
            </p>
          </div>
        </div>
      </article>

      {/* Ecommerce Example */}
      <article className="bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-content-100">Ecommerce — Eco‑Friendly Home Goods</h3>
        <p className="text-sm text-content-300 mt-1">AI marketing examples • Pinterest, Instagram</p>
        <div className="mt-4">
          <h4 className="text-xl font-semibold text-brand-primary">Strategic Debrief</h4>
          <ul className="list-disc list-inside text-content-200 mt-2 space-y-1">
            <li><strong>Synopsis:</strong> Make sustainable swaps simple, stylish, and affordable.</li>
            <li><strong>Audience:</strong> Eco‑conscious renters and first‑time homeowners.</li>
            <li><strong>Themes:</strong> Aesthetic minimalism, practicality, long‑term savings.</li>
            <li><strong>Competitive Angle:</strong> Third‑party verified impact and lifetime warranty.</li>
          </ul>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-300/40 p-4 rounded-lg">
            <h5 className="font-semibold text-content-100">Pinterest Sample Pin</h5>
            <p className="text-xs text-content-300">Angle: How‑To Utility vs. Novelty</p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version A — How‑To: "7 easy eco swaps for a calmer kitchen (with exact savings)."
            </p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version B — Novelty: "Your dish sponge is older than you think.\nMeet the 100% compostable upgrade."
            </p>
          </div>
          <div className="bg-base-300/40 p-4 rounded-lg">
            <h5 className="font-semibold text-content-100">Instagram Sample Caption</h5>
            <p className="text-xs text-content-300">Angle: Aesthetic Aspirational vs. Loss Aversion</p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version A — Aesthetic: "A calmer sink, fewer plastics, same shine.\nSwipe for the before/after."
            </p>
            <p className="mt-2 text-content-200 whitespace-pre-wrap">
              Version B — Loss Aversion: "Microplastics don’t take days off.\nThis swap removes 1,200 pieces from landfills per year."
            </p>
          </div>
        </div>
      </article>

      <p className="text-center text-sm text-content-300">
        Searching for AI marketing examples, social media post templates, or campaign strategy inspiration? This tool
        generates complete, research‑backed campaigns and image prompts for LinkedIn, X, Instagram, Facebook, and more.
      </p>
    </section>
  );
};

