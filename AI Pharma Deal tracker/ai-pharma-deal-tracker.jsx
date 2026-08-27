import { useState, useMemo, useEffect, useCallback } from "react";

const CATEGORIES = [
  { id: "discovery", label: "Drug\nDiscovery", color: "#7c3aed", short: "Drug Discovery" },
  { id: "clinical", label: "Clinical\nDevelopment", color: "#ec4899", short: "Clinical Dev" },
  { id: "manufacturing", label: "Manufacturing\n& Supply Chain", color: "#f97316", short: "Mfg & Supply" },
  { id: "enterprise", label: "Enterprise\nOperations", color: "#0891b2", short: "Enterprise Ops" },
  { id: "infrastructure", label: "Compute &\nInfrastructure", color: "#6366f1", short: "Compute & Infra" },
];

const DEAL_TYPES = [
  "Acquisition", "Licensing", "Partnership", "Platform licensing",
  "Infrastructure partnership", "Infrastructure", "Enterprise OS",
  "Enterprise AI", "Strategic partnership", "Collaboration",
];

const SEED_DEALS = [
  {
    id: 1, pharma: "Sanofi", startup: "Earendil Labs",
    startupDesc: "AI-driven biologics company building a platform that combines predictive protein modelling with high-throughput experimental validation. Has produced 40+ drug programmes. Raised $787M in March 2026 from Dimension Capital, Sanofi, and the Pfizer-Hillhouse Biotech Development Fund.",
    dealType: "Collaboration", value: "Up to $2.56B", date: "January 2026",
    stages: ["discovery"],
    summary: "Second major deal between Sanofi and Earendil — up to $2.56B for AI-driven bispecific antibody discovery across multiple autoimmune and inflammatory disease programmes.",
    detail: "Sanofi paid $160M in upfront and near-term payments for access to Earendil's AI discovery platform across multiple autoimmune and inflammatory programmes. This followed a $1.8B first deal in April 2025. Two deals totalling over $4B signal deep conviction in the platform. Earendil then raised $787M in March 2026 — one of the largest private rounds ever in AI drug discovery — with Sanofi itself investing alongside the Pfizer-Hillhouse fund.",
    source: "Second deal — first was $1.8B in April 2025",
  },
  {
    id: 2, pharma: "Eli Lilly", startup: "Isomorphic Labs",
    startupDesc: "Google DeepMind spinout building an AI-first drug design engine. Does not sell software — co-develops molecules alongside pharma partners using proprietary AI.",
    dealType: "Partnership", value: "$2.1B raised", date: "2025",
    stages: ["discovery"],
    summary: "Multi-target drug discovery collaboration using Isomorphic's AI drug design engine to co-develop novel molecules.",
    detail: "Isomorphic Labs, the DeepMind spinout, raised $2.1 billion and partnered with both Eli Lilly and Novartis. Unlike most AI drug discovery companies, they don't license software. They sit alongside pharma R&D teams and co-develop molecules using their own AI engine — a fundamentally different commercial model that gives them skin in the game.",
    source: "Also partnered with Novartis",
  },
  {
    id: 3, pharma: "J&J / AbbVie / Novo Nordisk / Bayer", startup: "Cradle",
    startupDesc: "Protein engineering platform that lets scientists design better protein sequences — optimising for stability, efficacy and manufacturability using their own lab data. Platform embedded directly into partner workflows.",
    dealType: "Platform licensing", value: "50+ programmes", date: "2025–2026",
    stages: ["discovery"],
    summary: "Protein engineering platform running 50+ programmes across 6+ of the top 25 pharma companies, including Bayer where Cradle is embedded directly into R&D workflows.",
    detail: "Cradle built a platform scientists use directly with their own data. It proposes protein sequences with better stability, efficacy and manufacturability. Now running more than 50 programmes across six of the top 25 pharma companies. Bayer has embedded the platform directly into its workflows with a collaboration that goes beyond software — scientists from both organisations exchange ideas on research direction.",
    source: "Including J&J, AbbVie, Novo Nordisk, and Bayer",
  },
  {
    id: 4, pharma: "GSK", startup: "NOETIK",
    startupDesc: "Builds foundation models trained on spatial biology data to predict cancer treatment outcomes. Focuses on translating tissue-level patterns into clinical predictions.",
    dealType: "Licensing", value: "$50M upfront + fees", date: "January 2025",
    stages: ["discovery", "clinical"],
    summary: "GSK licensed NOETIK's spatial biology foundation models in lung and colorectal cancer for outcome prediction and biomarker discovery.",
    detail: "NOETIK builds foundation models on spatial biology data — the kind of rich, tissue-level information that captures how cells interact in tumours. GSK committed $50 million upfront plus licensing fees to access their models in lung and colorectal cancer. This sits at the intersection of target validation and clinical biomarker strategy, exactly where Phase 2 failure happens most.",
    source: "",
  },
  {
    id: 5, pharma: "Eli Lilly", startup: "Tamarind Bio",
    startupDesc: "Builds inference infrastructure for molecular AI models. Selected by Lilly to power TuneLab 2.0, giving biotech startups access to AI models trained on Lilly's proprietary data.",
    dealType: "Infrastructure partnership", value: "200+ AI models hosted", date: "2025",
    stages: ["infrastructure"],
    summary: "Selected by Lilly to build inference infrastructure for TuneLab 2.0, hosting 200+ molecular AI models used by tens of thousands of scientists across 8 of the top 20 pharma.",
    detail: "Tamarind Bio plays a unique infrastructure role — they don't discover drugs, they build the compute and serving layer that lets thousands of scientists access molecular AI models. Lilly selected them to power TuneLab 2.0, which gives biotech startups access to AI models trained on over $1 billion of Lilly's proprietary data. A bet on AI infrastructure, not AI molecules.",
    source: "Used by 8 of top 20 pharma companies",
  },
  {
    id: 6, pharma: "CSL + others", startup: "Perceptic",
    startupDesc: "Founded by three former Palantir executives. Building a single operating system that connects data, decisions and workflows across the entire drug development lifecycle.",
    dealType: "Enterprise OS", value: "$12M seed (Accel, Air Street)", date: "May 2026",
    stages: ["enterprise"],
    summary: "Emerged from stealth with $12M seed. Building one operating system connecting data, decisions and workflows across the whole drug development lifecycle.",
    detail: "Perceptic emerged from stealth in May 2026 with $12 million from Accel and Air Street Capital. Founded by three former Palantir executives, they're already in paid production with CSL and several other top-tier pharma companies. Their pitch: one operating system that connects data, decisions and workflows across the whole drug development lifecycle. The Palantir playbook applied to pharma.",
    source: "Already in paid production",
  },
  {
    id: 7, pharma: "AstraZeneca", startup: "Modella AI",
    startupDesc: "AI company acquired by AstraZeneca — the first outright acquisition of an AI firm by a major pharma company. Builds multimodal AI foundation models for oncology.",
    dealType: "Acquisition", value: "Undisclosed", date: "January 2026",
    stages: ["discovery", "clinical"],
    summary: "AstraZeneca acquired Modella AI — the first outright acquisition of an AI firm by big pharma — embedding multimodal AI into oncology R&D and biomarker discovery.",
    detail: "This was a landmark moment: AstraZeneca made the first outright acquisition of an AI company by a major pharma player. Modella's multimodal AI foundation models are now embedded directly into AstraZeneca's oncology R&D, clinical development and biomarker discovery workflows. Not a partnership or a pilot — full integration.",
    source: "First AI acquisition by big pharma",
  },
  {
    id: 8, pharma: "Eli Lilly", startup: "NVIDIA",
    startupDesc: "NVIDIA's BioNeMo and Clara platforms provide GPU-accelerated computing infrastructure purpose-built for drug discovery AI workloads.",
    dealType: "Infrastructure", value: "$1B over 5 years", date: "January 2026",
    stages: ["infrastructure"],
    summary: "A $1 billion, 5-year commitment to build pharma's most powerful AI supercomputer — an 'AI Factory' to identify, optimise and validate new molecules.",
    detail: "Lilly and NVIDIA committed $1 billion over five years to build what they call an 'AI Factory' — the pharma industry's most powerful AI supercomputer, purpose-built to identify, optimise and validate new molecules. This is infrastructure as strategy: Lilly is betting that compute power itself becomes a competitive advantage in drug discovery.",
    source: "",
  },
  {
    id: 9, pharma: "Eli Lilly", startup: "Insilico Medicine",
    startupDesc: "End-to-end AI drug discovery platform spanning target identification, molecule generation, and clinical trial prediction. One of the pioneering companies in generative chemistry.",
    dealType: "Licensing", value: "$115M upfront, up to $2.75B", date: "March 2026",
    stages: ["discovery"],
    summary: "Exclusive worldwide license to develop a portfolio of AI-designed oral therapeutics. One of the largest AI drug discovery deals ever signed.",
    detail: "This is one of the largest AI drug discovery deals in history. Lilly paid $115 million upfront for an exclusive worldwide license to develop a portfolio of AI-designed oral therapeutics across multiple therapeutic areas, with total deal value up to $2.75 billion.",
    source: "One of the largest AI drug deals ever",
  },
  {
    id: 10, pharma: "Merck / MSD", startup: "Google Cloud",
    startupDesc: "Google Cloud's life sciences AI suite including Med-PaLM, Vertex AI and enterprise agentic AI tools for pharmaceutical operations.",
    dealType: "Enterprise AI", value: "Up to $1B", date: "April 2026",
    stages: ["enterprise"],
    summary: "Multi-year partnership deploying agentic AI across all 75,000 Merck employees — spanning R&D, manufacturing, commercial and corporate.",
    detail: "Merck and Google Cloud signed a multi-year partnership worth up to $1 billion, deploying an agentic AI platform across all 75,000 Merck employees. This spans R&D, manufacturing, commercial and corporate functions.",
    source: "Across all 75,000 employees",
  },
  {
    id: 11, pharma: "Novo Nordisk", startup: "OpenAI",
    startupDesc: "OpenAI's enterprise platform and GPT models applied to pharmaceutical drug discovery, manufacturing optimisation and supply chain management.",
    dealType: "Strategic partnership", value: "Undisclosed", date: "April 2026",
    stages: ["discovery", "manufacturing"],
    summary: "Strategic partnership applying AI across drug discovery, manufacturing and supply chain, with full enterprise integration targeted by end of 2026.",
    detail: "Novo Nordisk — the most valuable pharma company in Europe — partnered with OpenAI to apply AI across drug discovery, manufacturing and supply chain. Full enterprise integration is targeted by end of 2026.",
    source: "Full integration by end of 2026",
  },
  {
    id: 12, pharma: "Daiichi Sankyo", startup: "Imagene AI",
    startupDesc: "Pioneer in multimodal AI for precision oncology. Its OI Suite integrates histology, omics, clinical outcomes, and a proprietary real-world data lake of 3.5M+ tissue samples to derive insights for biomarker discovery and patient stratification.",
    dealType: "Collaboration", value: "Undisclosed", date: "April 2026",
    stages: ["clinical"],
    summary: "Collaboration to advance multimodal biomarker discovery and response prediction in oncology, using Imagene's AI across histology, omics and clinical outcomes data.",
    detail: "Imagene AI's platform integrates over 3.5 million tissue samples with omics and clinical outcomes data — enabling AI-driven response modelling from H&E whole-slide images and quantitative assessment of target expression. This collaboration sits squarely in the clinical development space, where better biomarker discovery directly improves patient stratification and trial design.",
    source: "Multimodal AI for precision oncology",
  },
  {
    id: 13, pharma: "AstraZeneca", startup: "OWKIN",
    startupDesc: "French AI biotech building an autonomous 'AI Scientist' platform that integrates into pharma research workflows for hypothesis generation, experiment design and data analysis.",
    dealType: "Licensing", value: "3-year deal", date: "May 2026",
    stages: ["discovery"],
    summary: "3-year licensing deal for Owkin's autonomous 'AI Scientist' platform, integrated directly into AstraZeneca's research and decision workflows.",
    detail: "AstraZeneca licensed Owkin's autonomous 'AI Scientist' platform for three years, integrating it directly into their research and decision workflows. Owkin's platform is designed to act as an autonomous research agent — generating hypotheses, designing experiments and analysing results.",
    source: "Autonomous AI Scientist",
  },
  {
    id: 14, pharma: "Bristol Myers Squibb", startup: "Anthropic",
    startupDesc: "Anthropic's Claude AI deployed as an enterprise intelligence platform. Known for its reasoning capabilities and safety-focused approach to AI development.",
    dealType: "Enterprise AI", value: "Undisclosed", date: "May 2026",
    stages: ["enterprise"],
    summary: "Claude deployed as the shared intelligence platform across 30,000+ BMS employees — spanning discovery, clinical, regulatory, manufacturing and commercial.",
    detail: "BMS deployed Claude as its shared intelligence platform across more than 30,000 employees, spanning discovery, clinical development, regulatory, manufacturing and commercial. This is a full enterprise bet, not a pilot.",
    source: "Full enterprise deployment, not a pilot",
  },
  {
    id: 15, pharma: "Incyte", startup: "Edison Scientific",
    startupDesc: "AI company behind Kosmos, an autonomous AI scientist platform designed to operate across the full drug discovery and development lifecycle — from hypothesis generation through clinical strategy.",
    dealType: "Partnership", value: "Undisclosed", date: "May 2026",
    stages: ["discovery"],
    summary: "Incyte is deploying Edison Scientific's AI scientist, Kosmos, across its discovery and development lifecycle — another signal of agentic AI entering pharma R&D.",
    detail: "Following AstraZeneca's deal with Owkin's 'AI Scientist', Incyte's partnership with Edison Scientific represents another pharma company bringing autonomous AI agents into R&D. Kosmos operates across the full discovery and development lifecycle, joining a growing category of AI tools that don't just analyse data but actively participate in the scientific process.",
    source: "Agentic AI scientist platform",
  },
  {
    id: 16, pharma: "Sanofi", startup: "CytoReason",
    startupDesc: "Builds computational disease models that simulate how diseases work at the cellular level — enabling pharma companies to predict drug responses and identify patient populations before running clinical trials.",
    dealType: "Partnership", value: "Third extension", date: "2026",
    stages: ["discovery", "clinical"],
    summary: "Sanofi extended its CytoReason relationship for the third time — deepening its use of AI disease simulation models for drug development and clinical strategy.",
    detail: "CytoReason's platform simulates disease biology computationally, letting pharma companies test hypotheses about drug mechanisms before committing to expensive clinical trials. The fact that Sanofi is extending for a third time — not switching to a competitor — signals that these models are delivering real value. This pattern of repeated extensions is one of the strongest signals in the AI pharma landscape: companies returning to partners they already trust and committing more.",
    source: "Third extension of the relationship",
  },
  {
    id: 17, pharma: "Pfizer", startup: "Chai Discovery",
    startupDesc: "AI startup building advanced molecular structure prediction models. Chai-3 is their latest model for protein-ligand interaction prediction and biologics design.",
    dealType: "Licensing", value: "Undisclosed", date: "June 2026",
    stages: ["discovery"],
    summary: "Licensing agreement giving Pfizer access to Chai-3 plus a custom model trained on Pfizer's proprietary data to accelerate biologics discovery.",
    detail: "Pfizer licensed Chai Discovery's Chai-3 model — their most advanced molecular structure prediction model — plus a custom version trained on Pfizer's proprietary data. This is the emerging pattern: license the foundation model, then fine-tune on your own data.",
    source: "Custom model on Pfizer's proprietary data",
  },
  {
    id: 18, pharma: "Pfizer", startup: "Boltz Bio",
    startupDesc: "Public benefit corporation founded by MIT researchers building open-source biomolecular AI models. Boltz-1 and Boltz-2 achieve AlphaFold 3-level accuracy in predicting 3D structures of biomolecular complexes, used by 100,000+ scientists globally.",
    dealType: "Collaboration", value: "Multi-year", date: "January 2026",
    stages: ["discovery"],
    summary: "Multi-year collaboration where Boltz refines its foundation models on Pfizer's historical data to build exclusive models for structure prediction, small-molecule affinity, and biologics design.",
    detail: "Boltz will integrate Pfizer's historical data into its foundation models to create exclusive models for structure prediction, small-molecule affinity, and biologics design. Boltz scientists work directly with Pfizer's discovery teams on custom workflows for target programmes. This follows the emerging pattern of open-source foundation model + proprietary fine-tuning — the custom model is where competitive advantage sits.",
    source: "Boltz raised $28M seed from a16z, Amplify, Zetta",
  },
  {
    id: 19, pharma: "Merck / MSD", startup: "Protillion Biosciences",
    startupDesc: "Lab-in-the-loop AI drug design company. Its proprietary Prot-MaP platform generates megascale training datasets for protein-design AI, enabling quantitative analysis of millions of protein variants per run.",
    dealType: "Collaboration", value: "Up to $510M", date: "June 2026",
    stages: ["discovery"],
    summary: "Multi-target discovery collaboration and license agreement worth up to $510M, combining Protillion's Prot-MaP platform with Merck's drug discovery expertise to design optimised biologics.",
    detail: "Protillion's Prot-MaP technology generates massive, just-in-time training sets for protein-design AI — characterising millions of variants per run and avoiding common pitfalls of model overfitting. The platform enables identification of optimised biologics with sophisticated therapeutic profiles such as pH-dependent sweeping and multi-target specificity. This adds to Merck's flurry of AI deals in 2026 alongside Google Cloud, Quotient, and Infinimmune.",
    source: "Announced June 16, 2026",
  },
];

const DEAL_TYPE_COLORS = {
  "Acquisition": "#dc2626",
  "Licensing": "#2563eb",
  "Partnership": "#7c3aed",
  "Platform licensing": "#0891b2",
  "Infrastructure partnership": "#ca8a04",
  "Infrastructure": "#ca8a04",
  "Enterprise OS": "#059669",
  "Enterprise AI": "#059669",
  "Strategic partnership": "#7c3aed",
  "Collaboration": "#0d9488",
};

const DEALS_KEY = "ai-pharma-deals-v3";
const PENDING_KEY = "ai-pharma-pending-v3";
const ADMIN_KEY = "ai-pharma-admin-v3";

function useDeals() {
  const [deals, setDeals] = useState(SEED_DEALS);
  const [pending, setPending] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(DEALS_KEY);
        if (r?.value) {
          const stored = JSON.parse(r.value);
          if (Array.isArray(stored) && stored.length > 0) setDeals(stored);
        }
      } catch {}
      try {
        const r = await window.storage.get(PENDING_KEY, true);
        if (r?.value) {
          const stored = JSON.parse(r.value);
          if (Array.isArray(stored)) setPending(stored);
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const persistDeals = useCallback(async (next) => {
    setDeals(next);
    try { await window.storage.set(DEALS_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const persistPending = useCallback(async (next) => {
    setPending(next);
    try { await window.storage.set(PENDING_KEY, JSON.stringify(next), true); } catch {}
  }, []);

  const addDeal = useCallback((deal) => {
    const maxId = deals.reduce((m, d) => Math.max(m, d.id), 0);
    persistDeals([{ ...deal, id: maxId + 1 }, ...deals]);
  }, [deals, persistDeals]);

  const submitSuggestion = useCallback((deal) => {
    const ts = Date.now();
    persistPending([...pending, { ...deal, _submittedAt: ts, _id: ts }]);
  }, [pending, persistPending]);

  const approveSuggestion = useCallback((submissionId) => {
    const item = pending.find(p => p._id === submissionId);
    if (!item) return;
    const { _submittedAt, _id, submitterName, ...dealData } = item;
    const maxId = deals.reduce((m, d) => Math.max(m, d.id), 0);
    const nextDeals = [{ ...dealData, id: maxId + 1 }, ...deals];
    const nextPending = pending.filter(p => p._id !== submissionId);
    persistDeals(nextDeals);
    persistPending(nextPending);
  }, [deals, pending, persistDeals, persistPending]);

  const rejectSuggestion = useCallback((submissionId) => {
    persistPending(pending.filter(p => p._id !== submissionId));
  }, [pending, persistPending]);

  const deleteDeal = useCallback((id) => {
    persistDeals(deals.filter(d => d.id !== id));
  }, [deals, persistDeals]);

  const resetToSeed = useCallback(() => { persistDeals(SEED_DEALS); }, [persistDeals]);

  return { deals, pending, loaded, addDeal, deleteDeal, resetToSeed, submitSuggestion, approveSuggestion, rejectSuggestion };
}

const EMPTY_FORM = {
  pharma: "", startup: "", startupDesc: "", dealType: "Licensing",
  value: "", date: "", stages: [], summary: "", detail: "", source: "", submitterName: "",
};

function DealFormFields({ form, set, toggleStage, isSubmission }) {
  const inputStyle = {
    width: "100%", padding: "10px 12px", fontSize: 13, border: "1.5px solid #e2e8f0",
    borderRadius: 8, outline: "none", color: "#0f172a", background: "#fff", fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4, display: "block" };

  return (
    <>
      {isSubmission && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Your name</label>
          <input style={inputStyle} value={form.submitterName} onChange={e => set("submitterName", e.target.value)} placeholder="So we can credit your contribution" />
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Pharma company *</label>
          <input style={inputStyle} value={form.pharma} onChange={e => set("pharma", e.target.value)} placeholder="e.g. Eli Lilly" />
        </div>
        <div>
          <label style={labelStyle}>AI partner *</label>
          <input style={inputStyle} value={form.startup} onChange={e => set("startup", e.target.value)} placeholder="e.g. Insilico Medicine" />
        </div>
        <div>
          <label style={labelStyle}>Deal type</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.dealType} onChange={e => set("dealType", e.target.value)}>
            {DEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Deal value</label>
          <input style={inputStyle} value={form.value} onChange={e => set("value", e.target.value)} placeholder="e.g. $115M upfront, up to $2.75B" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Date</label>
          <input style={inputStyle} value={form.date} onChange={e => set("date", e.target.value)} placeholder="e.g. June 2026" />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Where AI creates value *</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
          {CATEGORIES.map(s => {
            const sel = form.stages.includes(s.id);
            return (
              <button key={s.id} onClick={() => toggleStage(s.id)} style={{
                padding: "6px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: "pointer",
                border: `1.5px solid ${sel ? s.color : "#e2e8f0"}`,
                background: sel ? `${s.color}18` : "#fff",
                color: sel ? s.color : "#64748b", transition: "all 0.15s",
              }}>{s.short}</button>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Summary *</label>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.summary} onChange={e => set("summary", e.target.value)} placeholder="One-liner on what the deal is about" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div>
          <label style={labelStyle}>About the AI partner</label>
          <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={form.startupDesc} onChange={e => set("startupDesc", e.target.value)} placeholder="Brief description of the AI company" />
        </div>
        <div>
          <label style={labelStyle}>Why this deal matters</label>
          <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={form.detail} onChange={e => set("detail", e.target.value)} placeholder="Analysis and context" />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Source / notes</label>
        <input style={inputStyle} value={form.source} onChange={e => set("source", e.target.value)} placeholder="e.g. Link to press release or announcement" />
      </div>
    </>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "90vh",
        overflow: "auto", padding: 32, boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
      }}>{children}</div>
    </div>
  );
}

function SuggestDealPanel({ onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleStage = (sid) => setForm(prev => ({
    ...prev, stages: prev.stages.includes(sid) ? prev.stages.filter(s => s !== sid) : [...prev.stages, sid],
  }));
  const canSubmit = form.pharma.trim() && form.startup.trim() && form.summary.trim() && form.stages.length > 0;

  if (submitted) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Suggestion submitted</h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 360, margin: "0 auto 20px" }}>
            Your deal will appear on the tracker once it's been reviewed. Thank you for contributing.
          </p>
          <button onClick={onClose} style={{ padding: "10px 24px", fontSize: 13, fontWeight: 700, borderRadius: 8, border: "none", background: "#0891b2", color: "#fff", cursor: "pointer" }}>Done</button>
        </div>
      </Modal>
    );
  }
  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Suggest a deal</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
      </div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.5 }}>
        Know about an AI × pharma deal that's missing? Submit the details below — it will be reviewed before being added to the tracker.
      </p>
      <DealFormFields form={form} set={set} toggleStage={toggleStage} isSubmission={true} />
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
        <button onClick={onClose} style={{ padding: "10px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer" }}>Cancel</button>
        <button onClick={() => { if (canSubmit) { onSubmit(form); setSubmitted(true); } }} disabled={!canSubmit} style={{
          padding: "10px 24px", fontSize: 13, fontWeight: 700, borderRadius: 8, border: "none",
          background: canSubmit ? "#0891b2" : "#cbd5e1", color: "#fff", cursor: canSubmit ? "pointer" : "default",
        }}>Submit for review</button>
      </div>
    </Modal>
  );
}

function AddDealPanel({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleStage = (sid) => setForm(prev => ({
    ...prev, stages: prev.stages.includes(sid) ? prev.stages.filter(s => s !== sid) : [...prev.stages, sid],
  }));
  const canSubmit = form.pharma.trim() && form.startup.trim() && form.summary.trim() && form.stages.length > 0;

  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Add deal (admin)</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
      </div>
      <DealFormFields form={form} set={set} toggleStage={toggleStage} isSubmission={false} />
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
        <button onClick={onClose} style={{ padding: "10px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer" }}>Cancel</button>
        <button onClick={() => { if (canSubmit) { onAdd(form); onClose(); } }} disabled={!canSubmit} style={{
          padding: "10px 24px", fontSize: 13, fontWeight: 700, borderRadius: 8, border: "none",
          background: canSubmit ? "#0891b2" : "#cbd5e1", color: "#fff", cursor: canSubmit ? "pointer" : "default",
        }}>Add deal</button>
      </div>
    </Modal>
  );
}

function ReviewPanel({ pending, onApprove, onReject, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
          Review submissions <span style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginLeft: 8 }}>({pending.length})</span>
        </h2>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
      </div>
      {pending.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: 14 }}>No pending submissions to review.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pending.map(item => {
            const typeColor = DEAL_TYPE_COLORS[item.dealType] || "#6b7280";
            return (
              <div key={item._id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, background: "#fafbfc" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: typeColor, background: `${typeColor}12`, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.dealType}</span>
                  {item.date && <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.date}</span>}
                  {item.submitterName && <span style={{ fontSize: 11, color: "#64748b", marginLeft: "auto" }}>from {item.submitterName}</span>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>{item.pharma} × {item.startup}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 8 }}>{item.summary}</div>
                {item.value && <div style={{ fontSize: 12, color: "#334155", marginBottom: 4 }}>Value: {item.value}</div>}
                {item.detail && <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 8 }}>{item.detail}</div>}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {(item.stages || []).map(s => {
                    const cat = CATEGORIES.find(c => c.id === s);
                    return cat ? <span key={s} style={{ fontSize: 10, padding: "2px 8px", background: `${cat.color}15`, color: cat.color, borderRadius: 4, fontWeight: 600 }}>{cat.short}</span> : null;
                  })}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => onApprove(item._id)} style={{ padding: "7px 16px", fontSize: 12, fontWeight: 700, borderRadius: 6, border: "none", background: "#059669", color: "#fff", cursor: "pointer" }}>Approve</button>
                  <button onClick={() => onReject(item._id)} style={{ padding: "7px 16px", fontSize: 12, fontWeight: 700, borderRadius: 6, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}>Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

function CategoryBar({ activeStage, onStageClick, dealsByStage }) {
  return (
    <div style={{ margin: "0 0 8px", overflowX: "auto", padding: "0 0 8px" }}>
      <div style={{ display: "flex", gap: 6, minWidth: 600 }}>
        {CATEGORIES.map((cat) => {
          const count = dealsByStage[cat.id]?.length || 0;
          const isActive = activeStage === cat.id;
          return (
            <div key={cat.id} onClick={() => onStageClick(cat.id)} style={{
              flex: 1, cursor: "pointer", transition: "all 0.2s",
              background: isActive ? cat.color : `${cat.color}10`,
              border: `2px solid ${isActive ? cat.color : `${cat.color}30`}`,
              borderRadius: 10, padding: "16px 8px 14px", textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#fff" : cat.color, letterSpacing: "0.02em", lineHeight: 1.3, whiteSpace: "pre-line" }}>{cat.label}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: isActive ? "#fff" : cat.color }}>{count}</span>
              <span style={{ fontSize: 10, color: isActive ? "rgba(255,255,255,0.8)" : `${cat.color}99`, fontWeight: 500 }}>{count === 1 ? "deal" : "deals"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DealRow({ deal, isExpanded, onToggle, onDelete, isAdmin }) {
  const typeColor = DEAL_TYPE_COLORS[deal.dealType] || "#6b7280";
  return (
    <div style={{
      border: `1px solid ${isExpanded ? "#0891b2" : "#e5e7eb"}`,
      borderRadius: 10, overflow: "hidden", transition: "all 0.2s",
      background: isExpanded ? "#f0fdfa" : "#fff",
    }}>
      <div onClick={onToggle} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: typeColor, background: `${typeColor}12`, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{deal.dealType}</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{deal.date}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>{deal.pharma} × {deal.startup}</div>
          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{deal.summary}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{deal.value}</div>
          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>
            {deal.stages.map(s => {
              const cat = CATEGORIES.find(c => c.id === s);
              return cat ? <span key={s} style={{ fontSize: 10, padding: "2px 6px", background: `${cat.color}15`, color: cat.color, borderRadius: 3, fontWeight: 600 }}>{cat.short}</span> : null;
            })}
          </div>
        </div>
        <div style={{ fontSize: 18, color: "#94a3b8", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>▾</div>
      </div>
      {isExpanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #e0f2fe" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            {deal.startupDesc && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>About {deal.startup}</div>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>{deal.startupDesc}</p>
              </div>
            )}
            {deal.detail && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Why This Deal Matters</div>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>{deal.detail}</p>
              </div>
            )}
          </div>
          {deal.source && <div style={{ marginTop: 12, fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>{deal.source}</div>}
          <div style={{ marginTop: 14, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#64748b", marginRight: 4 }}>AI value area:</span>
            {deal.stages.map(s => {
              const cat = CATEGORIES.find(c => c.id === s);
              return cat ? <span key={s} style={{ fontSize: 11, padding: "3px 8px", background: cat.color, color: "#fff", borderRadius: 4, fontWeight: 600 }}>{cat.short}</span> : null;
            })}
            {isAdmin && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }} style={{
                marginLeft: "auto", fontSize: 11, padding: "4px 10px", background: "#fef2f2",
                color: "#dc2626", border: "1px solid #fecaca", borderRadius: 5, cursor: "pointer", fontWeight: 600,
              }}>Remove</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { deals, pending, loaded, addDeal, deleteDeal, resetToSeed, submitSuggestion, approveSuggestion, rejectSuggestion } = useDeals();
  const [activeStage, setActiveStage] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(ADMIN_KEY);
        if (r?.value === "true") setIsAdmin(true);
      } catch {}
    })();
  }, []);

  const toggleAdmin = useCallback(async () => {
    if (isAdmin) {
      setIsAdmin(false);
      try { await window.storage.set(ADMIN_KEY, "false"); } catch {}
    } else {
      const code = prompt("Enter admin passphrase:");
      if (code === "suruchi2026") {
        setIsAdmin(true);
        try { await window.storage.set(ADMIN_KEY, "true"); } catch {}
      }
    }
  }, [isAdmin]);

  const dealsByStage = useMemo(() => {
    const map = {};
    CATEGORIES.forEach(s => { map[s.id] = []; });
    deals.forEach(d => { d.stages.forEach(s => { if (map[s]) map[s].push(d); }); });
    return map;
  }, [deals]);

  const filteredDeals = useMemo(() => {
    let result = [...deals];
    if (activeStage) result = result.filter(d => d.stages.includes(activeStage));
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.pharma.toLowerCase().includes(q) || d.startup.toLowerCase().includes(q) ||
        d.dealType.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) ||
        (d.detail || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [deals, activeStage, searchTerm]);

  const uniquePharma = useMemo(() => new Set(deals.flatMap(d => d.pharma.split(/[\/+]/).map(s => s.trim().replace(/ \+ others/, "").replace(/ others/, "")))).size, [deals]);
  const uniquePartners = useMemo(() => new Set(deals.map(d => d.startup)).size, [deals]);

  if (!loaded) {
    return <div style={{ fontFamily: "'Inter', system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#94a3b8", fontSize: 14 }}>Loading deal tracker…</div>;
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: "#f8fafc", minHeight: "100vh", color: "#0f172a" }}>
      {showSuggest && <SuggestDealPanel onSubmit={submitSuggestion} onClose={() => setShowSuggest(false)} />}
      {showAdd && <AddDealPanel onAdd={addDeal} onClose={() => setShowAdd(false)} />}
      {showReview && <ReviewPanel pending={pending} onApprove={approveSuggestion} onReject={rejectSuggestion} onClose={() => setShowReview(false)} />}

      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "36px 24px 28px", color: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#22d3ee", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>AI × Pharma Intelligence</div>
              <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2 }}>Deal & Partnership Tracker</h1>
              <p style={{ margin: "0 0 20px", fontSize: 14, color: "#94a3b8", lineHeight: 1.5, maxWidth: 600 }}>
                Tracking how big pharma is embedding AI — from drug discovery through enterprise operations. A living tracker, open to community contributions.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setShowSuggest(true)} style={{
                padding: "10px 18px", fontSize: 13, fontWeight: 700, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent", color: "#fff", cursor: "pointer", whiteSpace: "nowrap",
              }}>Suggest a deal</button>
              {isAdmin && (
                <>
                  <button onClick={() => setShowAdd(true)} style={{
                    padding: "10px 18px", fontSize: 13, fontWeight: 700, borderRadius: 8, border: "none",
                    background: "#22d3ee", color: "#0f172a", cursor: "pointer", whiteSpace: "nowrap",
                  }}>+ Add deal</button>
                  <button onClick={() => setShowReview(true)} style={{
                    padding: "10px 18px", fontSize: 13, fontWeight: 700, borderRadius: 8, border: "none",
                    background: pending.length > 0 ? "#f59e0b" : "#334155",
                    color: pending.length > 0 ? "#0f172a" : "#94a3b8", cursor: "pointer", whiteSpace: "nowrap",
                  }}>Review{pending.length > 0 ? ` (${pending.length})` : ""}</button>
                </>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { n: deals.length, l: "Deals tracked" },
              { n: `${uniquePharma}+`, l: "Pharma companies" },
              { n: String(uniquePartners), l: "AI partners" },
              { n: "$12B+", l: "Total deal value" },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#22d3ee" }}>{s.n}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 60px" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Where AI Creates Value</h2>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Click to filter by area</span>
          </div>
          <CategoryBar activeStage={activeStage} onStageClick={(id) => setActiveStage(activeStage === id ? null : id)} dealsByStage={dealsByStage} />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "20px 0 16px", flexWrap: "wrap" }}>
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by company, partner, or keyword..."
            style={{ flex: 1, minWidth: 200, padding: "10px 14px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", color: "#0f172a", background: "#fff" }}
            onFocus={e => e.target.style.borderColor = "#0891b2"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
          {(activeStage || searchTerm) && (
            <button onClick={() => { setActiveStage(null); setSearchTerm(""); }} style={{
              fontSize: 12, padding: "8px 14px", background: "#fee2e2", color: "#dc2626",
              border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600,
            }}>Clear filters</button>
          )}
          <span style={{ fontSize: 13, color: "#64748b" }}>Showing {filteredDeals.length} of {deals.length} deals</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredDeals.map(deal => (
            <DealRow key={deal.id} deal={deal} isExpanded={expandedId === deal.id}
              onToggle={() => setExpandedId(expandedId === deal.id ? null : deal.id)}
              onDelete={deleteDeal} isAdmin={isAdmin} />
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>No deals match your current filters.</div>
        )}

        <div style={{
          marginTop: 40, padding: "20px 0", borderTop: "1px solid #e2e8f0", fontSize: 12, color: "#94a3b8",
          lineHeight: 1.6, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
        }}>
          <span>
            Curated by{" "}
            <span onClick={toggleAdmin} style={{ cursor: "pointer", borderBottom: "1px dashed #cbd5e1" }}>Suruchi Sethi, PhD</span>
            {isAdmin && <span style={{ marginLeft: 6, fontSize: 10, color: "#059669", fontWeight: 700, textTransform: "uppercase" }}>Admin</span>}
            {" "}· Data from public announcements and press releases
          </span>
          {isAdmin && (
            <button onClick={() => { if (showReset) { resetToSeed(); setShowReset(false); } else setShowReset(true); }} style={{
              fontSize: 11, padding: "4px 10px", background: showReset ? "#fef2f2" : "transparent",
              color: showReset ? "#dc2626" : "#94a3b8", border: `1px solid ${showReset ? "#fecaca" : "#e2e8f0"}`,
              borderRadius: 5, cursor: "pointer",
            }}>{showReset ? "Confirm reset" : "Reset data"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
