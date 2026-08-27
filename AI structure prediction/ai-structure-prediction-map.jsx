import { useState } from "react";

const COLORS = {
  teal: "#0d9488",
  tealLight: "#14b8a6",
  tealDark: "#0f766e",
  darkHeader: "#0c1e2e",
  darkBg: "#0e2337",
  cream: "#f8fafc",
  white: "#ffffff",
  muted: "#94a3b8",
  mutedLight: "#cbd5e1",
  border: "#1e3a52",
  open: "#10b981",
  hybrid: "#f59e0b",
  closed: "#ef4444",
  accent: "#06b6d4",
};

const companies = [
  {
    id: "isomorphic",
    name: "Isomorphic Labs",
    shortName: "Isomorphic",
    tagline: "Alphabet's bet: own the drug, not just the model",
    founded: "2021, London",
    founders: "Sir Demis Hassabis (Nobel Prize, AlphaFold), Max Jaderberg",
    funding: "$2.7B total ($600M Series A, $2.1B Series B May 2026)",
    fundingNum: 2700,
    valuation: "Not disclosed (Alphabet-backed)",
    investors: "Thrive Capital, Alphabet, GV, MGX, Temasek, CapitalG, UK Sovereign AI Fund",
    product: "IsoDDE (Isomorphic Drug Design Engine), a proprietary AI drug design platform described as an AlphaFold 4-level advance",
    model: "Fully Proprietary",
    modelType: "closed",
    businessModel: "Drug co-development partnerships. They do not sell software. Instead, they co-design drugs with pharma, sharing risk and reward through milestone payments and royalties.",
    revenue: "~$83M in confirmed upfront payments ($45M Lilly, $37.5M Novartis). Up to $3B+ in contingent milestone payments (performance-dependent). J&J terms undisclosed.",
    posX: 0.85,
    posY: 0.8,
    deals: [
      { partner: "Eli Lilly", terms: "$45M upfront, up to $1.7B milestones + royalties. Small molecule therapeutics, multiple undisclosed targets", date: "Jan 2024", type: "Co-development (Small Molecules)" },
      { partner: "Novartis", terms: "$37.5M upfront, up to $1.2B milestones + royalties. Three undisclosed targets. Expanded Feb 2025", date: "Jan 2024", type: "Co-development (Small Molecules)" },
      { partner: "Johnson & Johnson", terms: "Cross-modality (small molecules + biologics), multi-target collaboration", date: "Jan 2026", type: "Co-development (Multi-Modality)" },
    ],
    pipeline: "17 active programs across oncology, immunology, and cardiovascular disease. Targeting first IND filing by end of 2026.",
    strategy: "The most closed model in the space. IsoDDE is not licensable software; it is an integrated drug design engine that only works through partnerships. Isomorphic co-designs drugs alongside pharma, sharing economics. This creates a deep moat but limits ecosystem adoption. The bet is that superior outcomes from a fully integrated approach will attract the biggest pharma budgets. Key risk: Isomorphic raised $2.7B without yet putting an AI-designed molecule into human testing. The first clinical milestone was originally targeted for 2025 and has slipped. If IND filings do not materialise in 2026, the narrative will come under pressure.",
    analogyToLLMs: "Comparable to OpenAI in structure prediction: massively funded, fully proprietary, partnering with enterprise customers rather than building an open ecosystem.",
  },
  {
    id: "boltz",
    name: "Boltz",
    shortName: "Boltz",
    tagline: "Open-source foundation models for biology, monetised through enterprise",
    founded: "Research at MIT from 2024. Launched as a Public Benefit Corporation in January 2026.",
    founders: "Gabriele Corso, Jeremy Wohlwend, Saro Passaro (MIT Jameel Clinic)",
    funding: "$28M seed (Jan 2026)",
    fundingNum: 28,
    valuation: "Not disclosed",
    investors: "a16z, Amplify Partners, Zetta Ventures, Clement Delangue (HuggingFace CEO), Factorial Capital, Obvious Ventures",
    product: "Boltz-1 (structure prediction), Boltz-2 (binding affinity), BoltzGen (protein design), BoltzMol-1, BoltzProt-1, Boltz Lab (hosted platform), Boltz API",
    model: "Fully Open-Source (MIT licence)",
    modelType: "open",
    businessModel: "Open-source models are free for everyone. Revenue comes from Boltz Lab (hosted compute and platform), custom fine-tuned models trained on pharma proprietary data, enterprise API access, and program-level collaborations.",
    revenue: "Not disclosed. Pharma partnerships + platform subscriptions",
    posX: 0.15,
    posY: 0.25,
    deals: [
      { partner: "Pfizer", terms: "Multi-year. Custom models on Pfizer data. Exclusive fine-tuned models for structure, affinity, biologics", date: "Jan 2026", type: "Platform + Custom Models" },
      { partner: "Takeda", terms: "Org-wide deployment of BoltzMol-1 and BoltzProt-1. Platform + API + program-level fine-tuning", date: "Jun 2026", type: "Platform Deployment" },
      { partner: "Recursion", terms: "Co-developed Boltz-2. Recursion provided BioHive-2 supercomputer (~500K A100 hrs). Recursion uses Boltz internally for screening and lead optimisation", date: "Jun 2025", type: "Co-Development" },
    ],
    pipeline: "Not a therapeutics company. No proprietary drug pipeline. Compounds designed using Boltz belong to pharma partners.",
    strategy: "Following the Hugging Face / Meta Llama playbook in biology. Give away the models, build the widest ecosystem (100,000+ scientists), then monetise through hosted compute, fine-tuning, and enterprise deployments. They are explicitly not building drugs, they are building the tools everyone else uses to build drugs. Broadest distribution network of any player: API integrations with Claude Code, Codex, Gemini CLI, Benchling, Tamarind, Amazon Bio Discovery, and 5+ other platforms. Key risk: converting free users into paying enterprise customers at scale, and raising significantly more capital to sustain frontier model development (current funding is roughly 100x less than Isomorphic).",
    analogyToLLMs: "Comparable to Meta Llama / Hugging Face in structure prediction: open-source models with the widest adoption, monetised through enterprise services and compute.",
  },
  {
    id: "chai",
    name: "Chai Discovery",
    shortName: "Chai",
    tagline: "The hybrid play: open enough to attract, closed enough to monetise",
    founded: "2024, San Francisco",
    founders: "Joshua Meier (ex-Meta FAIR, Absci, OpenAI), Jack Dent (ex-Stripe)",
    funding: "$230M+ total ($25M Seed, $70M Series A, $130M Series B Dec 2025). Reportedly in talks for $400M at $3.4B valuation.",
    fundingNum: 230,
    valuation: "$1.3B (Dec 2025). Reportedly raising at $3.4B",
    investors: "OpenAI, Oak HC/FT, General Catalyst, Thrive Capital, Menlo Ventures, Dimension, Emerson Collective",
    product: "Chai-1 (multimodal structure prediction, free), Chai-2 (zero-shot antibody design, ~20% hit rates), Chai-3 (latest model, doubled prior success rates, licensed to pharma)",
    model: "Hybrid (Chai-1 free for research, Chai-2/3 commercial licence)",
    modelType: "hybrid",
    businessModel: "Freemium model. Chai-1 is free for research and serves as a customer acquisition tool. Commercial licensing of Chai-2 and Chai-3, plus custom models trained on pharma data. Platform-as-a-service for enterprise.",
    revenue: "Not fully disclosed. Lilly deal reportedly involves annual access fees in the mid-eight figures (~$50M+/yr). Pfizer terms undisclosed. In talks with 15+ additional pharma companies.",
    posX: 0.55,
    posY: 0.35,
    deals: [
      { partner: "Eli Lilly", terms: "Custom AI model on Lilly proprietary data for biologics discovery (antibodies). Multiple targets. Annual access fees reportedly in mid-eight figures.", date: "Jan 2026", type: "Platform + Custom Models (Biologics)" },
      { partner: "Pfizer", terms: "License agreement for Chai-3 + custom platform instance on Pfizer data. Biologics discovery focus.", date: "Jun 2026", type: "Licensing + Custom Models (Biologics)" },
    ],
    pipeline: "Not a drug company; sells tools. In talks with 15+ additional pharma companies.",
    strategy: "Middle ground between fully open and fully closed. The free tier (Chai-1) gets scientists to try the platform and de-risks adoption for pharma procurement teams. Premium models (Chai-2, Chai-3) are commercially licensed with custom fine-tuning on each partner's proprietary data. This is the classic SaaS freemium playbook adapted for computational biology. Best positioned financially among the challengers, with enough capital to compete for top-tier partnerships while maintaining model development velocity. Key risk: defending against both Boltz (free and open, broader platform) and Isomorphic (far better resourced) while proving that AI-designed antibodies can translate to clinical-grade molecules.",
    analogyToLLMs: "Comparable to Anthropic in structure prediction: well-funded, technically strong, commercially accessible but not fully open.",
  },
  {
    id: "openfold",
    name: "OpenFold3",
    shortName: "OpenFold3",
    tagline: "Community-driven open science",
    founded: "OpenFold Consortium, Columbia University (AlQuraishi Lab)",
    founders: "Mohammed AlQuraishi (Columbia), Woody Sherman (Psivant)",
    funding: "Consortium-funded (non-profit)",
    fundingNum: 0,
    valuation: "N/A (non-profit consortium)",
    investors: "Open Molecular Software Foundation, consortium members",
    product: "OpenFold3, an open-source AlphaFold 3 reproduction. Apache 2.0 licence (fully permissive commercial use).",
    model: "Fully Open-Source (Apache 2.0)",
    modelType: "open",
    businessModel: "No commercial model. this is open science infrastructure. Free for academic and commercial use.",
    revenue: "N/A",
    posX: 0.08,
    posY: 0.1,
    deals: [],
    pipeline: "N/A, foundational research tool",
    strategy: "Democratise access to AlphaFold 3-level capabilities. Serve as infrastructure that others build on top of. Available via Hugging Face and Tamarind Bio.",
    whatMustGoRight: "Must keep pace with frontier models (Boltz-2, Chai-3, IsoDDE). Community contributions must sustain development. Risk of being eclipsed by better-funded commercial alternatives.",
    analogyToLLMs: "Like open-weights academic LLMs (e.g., BLOOM, OLMo), important for the ecosystem, but commercial adoption limited by lack of enterprise support.",
  },
  {
    id: "rosettafold",
    name: "RoseTTAFold",
    shortName: "RoseTTAFold",
    tagline: "Academic workhorse from a Nobel Prize-winning lab",
    founded: "Baker Lab, University of Washington",
    founders: "David Baker (Nobel Prize 2024), Minkyung Baek",
    funding: "Academic grants (HHMI, UW)",
    fundingNum: 0,
    valuation: "N/A (academic)",
    investors: "N/A",
    product: "RoseTTAFold All-Atom. predicts protein + small molecule + DNA/RNA structures. RFdiffusion All-Atom for protein design.",
    model: "Fully Open-Source (academic)",
    modelType: "open",
    businessModel: "No commercial model; free academic tool. Baker Lab also founded IPD (Institute for Protein Design). Very fast (~10 min on a gaming PC).",
    revenue: "N/A",
    posX: 0.12,
    posY: 0.08,
    deals: [],
    pipeline: "N/A, academic research tool used widely",
    strategy: "Advance open science in structural biology and protein design. RFdiffusion is a leading protein design tool. Not competing commercially.",
    whatMustGoRight: "Must keep pushing design capabilities to stay relevant against commercial entrants. Lab sustainability dependent on academic funding.",
    analogyToLLMs: "Like university-hosted open models (e.g., EleutherAI), technically important, widely cited, but not commercially competitive.",
  },
  {
    id: "esm",
    name: "ESM / Biohub",
    shortName: "ESM/Biohub",
    tagline: "Protein language models, now under Zuckerberg's philanthropic umbrella",
    founded: "EvolutionaryScale (2023, ex-Meta FAIR). Acquired by Chan Zuckerberg Biohub Nov 2025.",
    founders: "Alexander Rives, Tom Sercu, Sal Candido (all ex-Meta FAIR)",
    funding: "$142M seed (Jun 2024). Now part of Biohub (CZI-funded).",
    fundingNum: 142,
    valuation: "N/A (acquired by non-profit Biohub)",
    investors: "Nat Friedman, Daniel Gross, Lux Capital, Amazon, NVIDIA NVentures (pre-acquisition)",
    product: "ESM3 (98B parameter protein language model), ESMFold2, ESM Cambrian. Forge API platform. Different approach. designs proteins from sequence, not 3D structure prediction.",
    model: "Hybrid (ESM3-open under non-commercial licence, full models via API/partners)",
    modelType: "hybrid",
    businessModel: "Post-acquisition: open science mission under Biohub. Pre-acquisition: API access + cloud partnerships (AWS, NVIDIA BioNeMo). ESM4 world model launched May 2026.",
    revenue: "N/A (non-profit since Biohub acquisition)",
    posX: 0.35,
    posY: 0.15,
    deals: [],
    pipeline: "Research focused on protein design, not drug discovery directly",
    strategy: "Now positioned as philanthropic open-science infrastructure under Zuckerberg/Chan. ESM models are complementary to structure prediction; they design proteins from sequence rather than predicting 3D structures. Different competitive niche.",
    whatMustGoRight: "Must show ESM4 world model delivers practical drug discovery value. Biohub's non-profit model must sustain cutting-edge research. Risk of talent loss to commercial competitors.",
    analogyToLLMs: "Like Meta FAIR releasing Llama: open models from a tech giant, now repositioned under a philanthropic mission.",
  },
  {
    id: "protenix",
    name: "Protenix (ByteDance)",
    shortName: "Protenix",
    tagline: "China's open-source answer to AlphaFold 3",
    founded: "ByteDance Research (AML AI4Science team)",
    founders: "ByteDance AI4Science team",
    funding: "ByteDance internal R&D budget",
    fundingNum: 0,
    valuation: "N/A (ByteDance division)",
    investors: "ByteDance",
    product: "Protenix-v1 (Feb 2026), Protenix-v2 (Apr 2026), Protenix-Mini, PXDesign (binder design), Protenix-Dock. Apache 2.0.",
    model: "Fully Open-Source (Apache 2.0)",
    modelType: "open",
    businessModel: "No standalone business model; open-source Rmodel. open-source R&DD from ByteDance. Free for academic and commercial use.",
    revenue: "N/A",
    posX: 0.1,
    posY: 0.12,
    deals: [],
    pipeline: "N/A, open research tool",
    strategy: "ByteDance demonstrating AI capabilities in bio. First fully open-source model claimed to surpass AlphaFold 3 on benchmarks. Apache 2.0 means anyone can commercialise. PXDesign reports 20-73% experimental hit rates for binder design.",
    whatMustGoRight: "Must continue ByteDance investment. Geopolitical risk. Western pharma may be hesitant to build on Chinese tech. Must keep pace with rapid model improvements from Boltz, Chai.",
    analogyToLLMs: "Like DeepSeek: impressive open models from a Chinese tech giant, raising questions about geopolitical dynamics in AI.",
  },
];

const ecosystemPartnerships = {
  boltz: {
    title: "Boltz Ecosystem. The Widest Distribution Network",
    intro: "Boltz has built the broadest ecosystem of any structure prediction company, deliberately following the developer-platform playbook. Their API launched June 2026 with first-party integrations for AI coding agents and day-zero availability across nearly every major bio platform.",
    categories: [
      {
        name: "AI Agent Integrations",
        partners: [
          { name: "Claude Code (Anthropic)", detail: "First-party Boltz API integration. Scientists can run structure predictions and hit-discovery campaigns from Claude Code using natural language.", type: "AI Agent" },
          { name: "OpenAI Codex", detail: "Supported integration for the Boltz API. Enables agentic drug discovery workflows within Codex.", type: "AI Agent" },
          { name: "Gemini CLI (Google)", detail: "Supported integration for Boltz API, enabling access via Google's coding agent.", type: "AI Agent" },
        ],
      },
      {
        name: "Compute & Infrastructure Partners",
        partners: [
          { name: "NVIDIA", detail: "Ongoing collaboration. NVIDIA's cuEquivariance kernels power Boltz inference. Boltz-2 available as NVIDIA NIM microservice. BioHive-2 supercomputer used for Boltz-2 training.", type: "Compute" },
          { name: "Recursion Pharmaceuticals", detail: "Co-developed Boltz-2 (Jun 2025). Recursion provided BioHive-2 supercomputer (NVIDIA DGX SuperPOD, ~400K-500K A100 hours) for training and validation.", type: "Co-Development" },
          { name: "Amazon Bio Discovery", detail: "Launch partner for Boltz API. Native Boltz model access within Amazon's bio discovery platform.", type: "Platform" },
        ],
      },
      {
        name: "Scientific Platforms & Workflow Tools",
        partners: [
          { name: "Benchling", detail: "Launch partner. Boltz API natively integrated into Benchling, the dominant R&D data platform used by most pharma/biotech.", type: "Platform" },
          { name: "Tamarind Bio", detail: "Day-zero partner. Hosts all Boltz models (Boltz-1, Boltz-2, BoltzMol-1, BoltzProt-1) as no-code web tools. Also selected to power Eli Lilly's TuneLab 2.0 platform.", type: "Platform" },
          { name: "Rowan", detail: "Launch partner for Boltz API. Molecular simulation platform integration.", type: "Platform" },
          { name: "Phylo", detail: "Launch partner for Boltz API distribution.", type: "Platform" },
          { name: "Kiin Bio", detail: "Launch partner for Boltz API distribution.", type: "Platform" },
          { name: "Pauling.ai", detail: "Launch partner for Boltz API distribution.", type: "Platform" },
          { name: "Mirror Physics", detail: "Launch partner for Boltz API distribution.", type: "Platform" },
          { name: "Cultivarium", detail: "Launch partner for Boltz API distribution.", type: "Platform" },
        ],
      },
    ],
    strategicInsight: "Boltz's ecosystem strategy is the clearest signal of their Hugging Face playbook. By integrating with Claude Code, Codex, and Gemini CLI, they're positioning biomolecular prediction as something scientists can invoke from any AI agent, not just from a specialised bio platform. The Benchling integration is particularly significant: Benchling is where most pharma scientists already manage their experimental data. Having Boltz inside Benchling means it becomes a default tool, not a separate workflow.",
  },
  chai: {
    title: "Chai Discovery Ecosystem. Investor-Backed Distribution",
    intro: "Chai's ecosystem is narrower but strategically positioned. Chai-1 is freely available (driving adoption), while commercial models are deployed as embedded platform instances within pharma partners.",
    categories: [
      {
        name: "Investor & Strategic Relationships",
        partners: [
          { name: "OpenAI", detail: "Seed investor. Chai was founded while working out of OpenAI's SF offices. Josh Meier discussed the concept with Sam Altman before founding.", type: "Investor" },
          { name: "Thrive Capital", detail: "Investor across multiple rounds. Also invested in Isomorphic Labs. hedging across the market", type: "Investor" },
        ],
      },
      {
        name: "Platform Availability",
        partners: [
          { name: "Tamarind Bio", detail: "Chai-1 available as a tool on the Tamarind platform alongside Boltz and other models.", type: "Platform" },
          { name: "Direct API", detail: "Chai offers direct platform access and API. Commercial models (Chai-2, Chai-3) deployed as custom instances within pharma partners.", type: "Direct" },
        ],
      },
    ],
    strategicInsight: "Chai's distribution is pharma-direct rather than ecosystem-wide. Their model is to embed custom platform instances inside each pharma partner (Lilly, Pfizer), trained on that partner's proprietary data. This creates deep lock-in with fewer partners rather than broad availability. The OpenAI backing provides credibility and potential future AI infrastructure integration.",
  },
  isomorphic: {
    title: "Isomorphic Labs Ecosystem. The Walled Garden",
    intro: "Isomorphic has no external ecosystem by design. IsoDDE is not software you can license, access via API, or integrate into your workflow. It only exists inside Isomorphic's partnerships.",
    categories: [
      {
        name: "Parent & Compute",
        partners: [
          { name: "Alphabet / Google DeepMind", detail: "Parent company. Provides compute infrastructure, AI talent, and the AlphaFold lineage. Isomorphic operates autonomously within Alphabet.", type: "Parent" },
          { name: "Google Cloud / TPUs", detail: "Access to Google's compute infrastructure including TPU pods for training and inference.", type: "Compute" },
        ],
      },
    ],
    strategicInsight: "The absence of an ecosystem IS the strategy. Isomorphic explicitly stated 'IsoDDE is not a software platform that pharma companies can license or install.' By keeping everything internal, they control quality, capture more value per partnership, and prevent competitors from building on their technology. The trade-off: zero network effects, zero ecosystem adoption, zero community contributions.",
  },
};

const pharmaDeals = [
  { pharma: "Pfizer", partners: ["Boltz", "Chai Discovery"], insight: "Using complementary tools for different needs. Boltz provides broad platform infrastructure (structure prediction, small-molecule affinity, generative design) across the research org. Chai provides specialised biologics design (antibodies via Chai-3). This is modality-specific procurement, not simple hedging.", color: "#0EA5E9" },
  { pharma: "Eli Lilly", partners: ["Isomorphic Labs", "Chai Discovery"], insight: "Modality-split strategy: Isomorphic for small molecule co-development (Jan 2024, $45M upfront), Chai for biologics/antibody design (Jan 2026, reportedly mid-eight-figure annual fees). Lilly also has separate large AI deals with Insilico Medicine ($2.75B) and NVIDIA, making it the most aggressive AI adopter in pharma.", color: "#8B5CF6" },
  { pharma: "Novartis", partners: ["Isomorphic Labs"], insight: "Exclusive with Isomorphic since Jan 2024 ($37.5M upfront). Partnership expanded Feb 2025, which typically signals early checkpoints were met. Three undisclosed small-molecule targets.", color: "#F59E0B" },
  { pharma: "Johnson & Johnson", partners: ["Isomorphic Labs"], insight: "Joined Isomorphic Jan 2026. Cross-modality collaboration spanning small molecules AND biologics, the broadest scope of any Isomorphic partnership.", color: "#EF4444" },
  { pharma: "Takeda", partners: ["Boltz"], insight: "Chose the open-source platform approach (Jun 2026). Org-wide deployment of BoltzMol-1 & BoltzProt-1, not single-program. Takeda retains full compound ownership. Signals confidence in the tools model over co-development.", color: "#10B981" },
];

function NetworkMap() {
  const C = {
    iso: "#ef4444", isoLight: "#ef444422", isoBorder: "#ef444455",
    chai: "#f59e0b", chaiLight: "#f59e0b22", chaiBorder: "#f59e0b55",
    boltz: "#10b981", boltzLight: "#10b98122", boltzBorder: "#10b98155",
  };
  return (
    <div>
      <svg viewBox="0 0 680 430" style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Zone backgrounds */}
        <rect x="16" y="12" width="210" height="68" rx="12" fill={C.isoLight} />
        <rect x="236" y="12" width="210" height="68" rx="12" fill={C.chaiLight} />
        <rect x="456" y="12" width="210" height="68" rx="12" fill={C.boltzLight} />

        <text x="121" y="30" textAnchor="middle" fill={C.iso} fontSize="11" fontFamily="DM Sans, sans-serif" opacity="0.7">Proprietary</text>
        <text x="341" y="30" textAnchor="middle" fill={C.chai} fontSize="11" fontFamily="DM Sans, sans-serif" opacity="0.7">Hybrid</text>
        <text x="561" y="30" textAnchor="middle" fill={C.boltz} fontSize="11" fontFamily="DM Sans, sans-serif" opacity="0.7">Open-source</text>

        {/* AI platform nodes */}
        <rect x="36" y="40" width="170" height="32" rx="8" fill={C.isoLight} stroke={C.isoBorder} strokeWidth="1.5" />
        <text x="121" y="60" textAnchor="middle" fill={C.iso} fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="600">Isomorphic Labs</text>
        <rect x="256" y="40" width="170" height="32" rx="8" fill={C.chaiLight} stroke={C.chaiBorder} strokeWidth="1.5" />
        <text x="341" y="60" textAnchor="middle" fill={C.chai} fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="600">Chai Discovery</text>
        <rect x="476" y="40" width="170" height="32" rx="8" fill={C.boltzLight} stroke={C.boltzBorder} strokeWidth="1.5" />
        <text x="561" y="60" textAnchor="middle" fill={C.boltz} fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="600">Boltz</text>

        {/* Funding labels */}
        <text x="121" y="92" textAnchor="middle" fill={COLORS.muted} fontSize="11" fontFamily="DM Sans, sans-serif">$2.7B raised</text>
        <text x="341" y="92" textAnchor="middle" fill={COLORS.muted} fontSize="11" fontFamily="DM Sans, sans-serif">$230M+ raised</text>
        <text x="561" y="92" textAnchor="middle" fill={COLORS.muted} fontSize="11" fontFamily="DM Sans, sans-serif">$28M raised</text>

        {/* Connection lines */}
        <path d="M 80 72 C 80 130, 68 150, 68 180" fill="none" stroke={C.iso} strokeWidth="2" opacity="0.35" />
        <path d="M 121 72 C 121 120, 188 150, 188 180" fill="none" stroke={C.iso} strokeWidth="2" opacity="0.35" />
        <path d="M 160 72 C 160 120, 328 150, 328 180" fill="none" stroke={C.iso} strokeWidth="2" opacity="0.35" />
        <path d="M 300 72 C 270 130, 205 150, 205 180" fill="none" stroke={C.chai} strokeWidth="2" opacity="0.35" />
        <path d="M 380 72 C 400 130, 458 150, 468 180" fill="none" stroke={C.chai} strokeWidth="2" opacity="0.35" />
        <path d="M 520 72 C 510 130, 485 150, 480 180" fill="none" stroke={C.boltz} strokeWidth="2" opacity="0.35" />
        <path d="M 600 72 C 610 130, 610 150, 610 180" fill="none" stroke={C.boltz} strokeWidth="2" opacity="0.35" />

        {/* Pharma nodes */}
        {[
          { x: 18, name: "J&J", sub: "Multi-modality", dots: [C.iso] },
          { x: 138, name: "Eli Lilly", sub: "2 AI partners", dots: [C.iso, C.chai] },
          { x: 278, name: "Novartis", sub: "Small molecules", dots: [C.iso] },
          { x: 418, name: "Pfizer", sub: "2 AI partners", dots: [C.boltz, C.chai] },
          { x: 560, name: "Takeda", sub: "Org-wide platform", dots: [C.boltz] },
        ].map((p, i) => (
          <g key={i}>
            <rect x={p.x} y="180" width={100} height="52" rx="10" fill="#0e2337" stroke="#1e3a52" strokeWidth="0.5" />
            <text x={p.x + 50} y="201" textAnchor="middle" fill="#f1f5f9" fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="600">{p.name}</text>
            <text x={p.x + 50} y="219" textAnchor="middle" fill={COLORS.muted} fontSize="10" fontFamily="DM Sans, sans-serif">{p.sub}</text>
            {p.dots.map((c, j) => (
              <circle key={j} cx={p.x + 85 + j * 12} cy={186} r={4} fill={c} opacity="0.7" />
            ))}
          </g>
        ))}

        {/* Deal annotations */}
        <text x="68" y="252" textAnchor="middle" fill={COLORS.muted} fontSize="10" fontFamily="DM Sans, sans-serif">Co-dev, Jan 2026</text>
        <text x="170" y="252" textAnchor="start" fill={C.iso} fontSize="10" fontFamily="DM Sans, sans-serif" opacity="0.7">Small mol $45M up</text>
        <text x="170" y="265" textAnchor="start" fill={C.chai} fontSize="10" fontFamily="DM Sans, sans-serif" opacity="0.7">Biologics ~$50M/yr</text>
        <text x="328" y="252" textAnchor="middle" fill={COLORS.muted} fontSize="10" fontFamily="DM Sans, sans-serif">$37.5M up, expanded</text>
        <text x="448" y="252" textAnchor="start" fill={C.boltz} fontSize="10" fontFamily="DM Sans, sans-serif" opacity="0.7">Platform + custom</text>
        <text x="448" y="265" textAnchor="start" fill={C.chai} fontSize="10" fontFamily="DM Sans, sans-serif" opacity="0.7">Chai-3 licence</text>
        <text x="610" y="252" textAnchor="middle" fill={COLORS.muted} fontSize="10" fontFamily="DM Sans, sans-serif">BoltzMol-1, Jun 2026</text>

        {/* Divider */}
        <line x1="30" y1="290" x2="650" y2="290" stroke="#1e3a52" strokeWidth="0.5" strokeDasharray="4,4" />

        {/* Insight boxes */}
        <text x="340" y="312" textAnchor="middle" fill={COLORS.muted} fontSize="11" fontFamily="DM Sans, sans-serif" opacity="0.6">Emerging pattern: modality-specific procurement</text>

        <rect x="30" y="325" width="296" height="70" rx="8" fill="#0a1929" stroke="#1e3a52" strokeWidth="0.5" />
        <text x="46" y="347" fill="#e2e8f0" fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="600">Lilly's split strategy</text>
        <text x="46" y="364" fill={COLORS.muted} fontSize="11" fontFamily="DM Sans, sans-serif">Isomorphic for small molecules (Jan 2024)</text>
        <text x="46" y="380" fill={COLORS.muted} fontSize="11" fontFamily="DM Sans, sans-serif">Chai for biologics/antibodies (Jan 2026)</text>

        <rect x="354" y="325" width="296" height="70" rx="8" fill="#0a1929" stroke="#1e3a52" strokeWidth="0.5" />
        <text x="370" y="347" fill="#e2e8f0" fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="600">Pfizer's dual approach</text>
        <text x="370" y="364" fill={COLORS.muted} fontSize="11" fontFamily="DM Sans, sans-serif">Boltz as broad research platform (Jan 2026)</text>
        <text x="370" y="380" fill={COLORS.muted} fontSize="11" fontFamily="DM Sans, sans-serif">Chai for antibody design (Jun 2026)</text>
      </svg>
      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "8px", fontSize: "12px", color: COLORS.muted, fontFamily: "DM Sans, sans-serif" }}>
        {[
          { label: "Isomorphic (co-development)", color: C.iso },
          { label: "Chai (licensing / custom models)", color: C.chai },
          { label: "Boltz (platform / tools)", color: C.boltz },
        ].map((l, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "18px", height: "3px", borderRadius: "2px", background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CompanyCard({ company, isOpen, onToggle }) {
  const modelColor = { open: COLORS.open, hybrid: COLORS.hybrid, closed: COLORS.closed };
  const modelLabel = { open: "Open-Source", hybrid: "Hybrid", closed: "Proprietary" };

  return (
    <div style={{
      background: isOpen ? "#0e2337" : "#0a1929",
      border: `1px solid ${isOpen ? COLORS.teal : "#1e3a52"}`,
      borderRadius: "10px",
      marginBottom: "12px",
      overflow: "hidden",
      transition: "all 0.2s ease",
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: "16px 20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: "#f1f5f9" }}>{company.name}</span>
            <span style={{
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: "600",
              background: `${modelColor[company.modelType]}22`,
              color: modelColor[company.modelType],
              border: `1px solid ${modelColor[company.modelType]}44`,
            }}>{modelLabel[company.modelType]}</span>
            {company.deals.length > 0 && (
              <span style={{
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "11px",
                background: "#0d948822",
                color: COLORS.teal,
                border: `1px solid ${COLORS.teal}44`,
              }}>{company.deals.length} pharma deal{company.deals.length > 1 ? "s" : ""}</span>
            )}
          </div>
          <div style={{ color: COLORS.muted, fontSize: "13px", marginTop: "4px", fontFamily: "DM Sans, sans-serif" }}>{company.tagline}</div>
        </div>
        <span style={{ color: COLORS.muted, fontSize: "20px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </div>

      {isOpen && (
        <div style={{ padding: "0 20px 20px", fontFamily: "DM Sans, sans-serif" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "16px" }}>
            <InfoBlock label="Founded" value={company.founded} />
            <InfoBlock label="Founding Team" value={company.founders} />
            <InfoBlock label="Funding" value={company.funding} />
            <InfoBlock label="Key Investors" value={company.investors} />
          </div>

          <div style={{ background: "#0a192966", borderRadius: "8px", padding: "14px", marginBottom: "14px", border: "1px solid #1e3a52" }}>
            <div style={{ fontSize: "12px", color: COLORS.teal, fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Business Model</div>
            <div style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>{company.businessModel}</div>
          </div>

          <div style={{ background: "#0a192966", borderRadius: "8px", padding: "14px", marginBottom: "14px", border: "1px solid #1e3a52" }}>
            <div style={{ fontSize: "12px", color: COLORS.teal, fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Product</div>
            <div style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>{company.product}</div>
          </div>

          {company.deals.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "12px", color: COLORS.teal, fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pharma Partnerships</div>
              {company.deals.map((d, i) => (
                <div key={i} style={{
                  background: "#0a192966",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: "8px",
                  border: "1px solid #1e3a52",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "baseline",
                }}>
                  <span style={{ fontWeight: "600", color: "#f1f5f9", fontSize: "14px" }}>{d.partner}</span>
                  <span style={{ fontSize: "11px", color: COLORS.muted, background: "#1e3a52", padding: "1px 8px", borderRadius: "8px" }}>{d.date}</span>
                  <span style={{ fontSize: "11px", color: COLORS.tealLight, background: "#0d948822", padding: "1px 8px", borderRadius: "8px" }}>{d.type}</span>
                  <div style={{ width: "100%", fontSize: "13px", color: "#94a3b8", lineHeight: "1.4" }}>{d.terms}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: "#0d948811", borderRadius: "8px", padding: "14px", marginBottom: "14px", border: `1px solid ${COLORS.teal}33` }}>
            <div style={{ fontSize: "12px", color: COLORS.teal, fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Strategic Positioning</div>
            <div style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>{company.strategy}</div>
          </div>

          <div style={{ background: "#06b6d411", borderRadius: "8px", padding: "14px", border: "1px solid #06b6d433" }}>
            <div style={{ fontSize: "12px", color: COLORS.accent, fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>LLM Market Analogy</div>
            <div style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>{company.analogyToLLMs}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: "11px", color: COLORS.teal, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{label}</div>
      <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.4" }}>{value}</div>
    </div>
  );
}

function OpenSourceLandscape() {
  const [isOpen, setIsOpen] = useState(false);
  const tools = [
    { name: "AlphaFold 3", org: "Google DeepMind", licence: "Non-commercial", note: "The model that started the race. Code open-sourced Feb 2025 but restricted to non-commercial use, which is exactly why the open alternatives below were built." },
    { name: "OpenFold3", org: "OpenFold Consortium / Columbia University", licence: "Apache 2.0", note: "Community-driven reproduction of AlphaFold 3. Fully permissive commercial licence. Led by Mohammed AlQuraishi (Columbia) and Woody Sherman (Psivant). Available on Hugging Face and Tamarind Bio." },
    { name: "Protenix", org: "ByteDance Research", licence: "Apache 2.0", note: "ByteDance's AlphaFold 3 reproduction. Protenix-v2 (Apr 2026) claims to outperform AlphaFold 3 on antibody-antigen benchmarks. Also includes PXDesign for binder design. Free for commercial use." },
    { name: "RoseTTAFold All-Atom", org: "Baker Lab, University of Washington", licence: "Academic open-source", note: "From David Baker's Nobel Prize-winning lab. Predicts protein + small molecule + DNA/RNA structures. RFdiffusion All-Atom is a leading protein design tool. Very fast (runs on a gaming PC in ~10 minutes)." },
    { name: "ESM3 / ESMFold2", org: "Biohub (formerly EvolutionaryScale)", licence: "Non-commercial (open model), API access", note: "98B parameter protein language model. Different approach: designs proteins from sequence rather than predicting 3D structures. EvolutionaryScale was acquired by Chan Zuckerberg Biohub in Nov 2025. ESM4 world model launched May 2026." },
    { name: "HelixFold3", org: "Baidu Research", licence: "Open-source", note: "Baidu's reproduction of AlphaFold 3. Less widely adopted in Western pharma." },
    { name: "ColabFold", org: "Community / Steinegger Lab", licence: "Open-source", note: "Makes AlphaFold 2 accessible via Google Colab. Widely used in academia for quick structure predictions without local GPU infrastructure." },
  ];

  return (
    <div style={{
      background: isOpen ? "#0e2337" : "#0a1929",
      border: `1px solid ${isOpen ? "#1e3a52" : "#1e3a52"}`,
      borderRadius: "10px",
      marginTop: "24px",
      overflow: "hidden",
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "16px", color: "#94a3b8" }}>Open-Source Landscape</div>
          <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px", fontFamily: "DM Sans, sans-serif" }}>
            The freely available tools that set the baseline. {tools.length} models from academic labs, tech companies, and consortia.
          </div>
        </div>
        <span style={{ color: COLORS.muted, fontSize: "20px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </div>

      {isOpen && (
        <div style={{ padding: "0 20px 20px", fontFamily: "DM Sans, sans-serif" }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", marginBottom: "14px" }}>
            When Google DeepMind open-sourced AlphaFold 3's code in early 2025 with a non-commercial licence, it created a gap: pharma companies could not legally use it for drug discovery. That gap triggered a wave of fully permissive open-source reproductions (Boltz-1, OpenFold3, Protenix, HelixFold3) and commercially licensed alternatives (Chai). These tools set the performance baseline that any commercial platform needs to beat to justify its price.
          </p>
          {tools.map((t, i) => (
            <div key={i} style={{
              background: "#0a192966",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "6px",
              border: "1px solid #1e3a52",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "3px" }}>
                <span style={{ fontWeight: "600", color: "#cbd5e1", fontSize: "13px" }}>{t.name}</span>
                <span style={{ color: "#64748b", fontSize: "11px" }}>{t.org}</span>
                <span style={{
                  padding: "1px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "600",
                  background: t.licence.includes("Apache") || t.licence.includes("MIT") ? "#10b98122" : t.licence.includes("Non") ? "#f59e0b22" : "#06b6d422",
                  color: t.licence.includes("Apache") || t.licence.includes("MIT") ? "#10b981" : t.licence.includes("Non") ? "#f59e0b" : "#06b6d4",
                  border: `1px solid ${t.licence.includes("Apache") || t.licence.includes("MIT") ? "#10b98144" : t.licence.includes("Non") ? "#f59e0b44" : "#06b6d444"}`,
                }}>{t.licence}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>{t.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PharmaView() {
  return (
    <div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", color: "#f1f5f9", marginBottom: "6px" }}>
        Who's Picking Whom
      </div>
      <p style={{ color: COLORS.muted, fontSize: "14px", marginBottom: "20px", lineHeight: "1.5", fontFamily: "DM Sans, sans-serif" }}>
        Five top-20 pharma companies have publicly announced structure prediction partnerships. The emerging pattern is modality-specific procurement, with different AI platforms for small molecules vs. biologics, rather than winner-take-all vendor selection.
      </p>

      {pharmaDeals.map((d, i) => (
        <div key={i} style={{
          background: "#0e2337",
          border: "1px solid #1e3a52",
          borderRadius: "10px",
          padding: "16px 20px",
          marginBottom: "10px",
          borderLeft: `4px solid ${d.color}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "17px", color: "#f1f5f9" }}>{d.pharma}</span>
            <span style={{ color: COLORS.muted, fontSize: "13px" }}>→</span>
            {d.partners.map((p, j) => (
              <span key={j} style={{
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                background: `${d.color}22`,
                color: d.color,
                border: `1px solid ${d.color}44`,
                fontFamily: "DM Sans, sans-serif",
              }}>{p}</span>
            ))}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", fontFamily: "DM Sans, sans-serif" }}>{d.insight}</div>
        </div>
      ))}

      <div style={{
        background: "#f59e0b11",
        border: "1px solid #f59e0b33",
        borderRadius: "10px",
        padding: "18px 20px",
        marginTop: "20px",
      }}>
        <div style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "DM Sans, sans-serif" }}>
          Important Context
        </div>
        <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6", fontFamily: "DM Sans, sans-serif", marginBottom: "8px" }}>
          This map tracks <strong style={{color: "#cbd5e1"}}>publicly disclosed</strong> partnerships in biomolecular structure prediction specifically. It does not capture the broader AI drug discovery landscape, which includes incumbents like Schrödinger ($6B+ market cap, the dominant computational chemistry platform), Insilico Medicine (signed a $2.75B deal with Lilly in March 2026), and large internal AI/ML teams at Roche, AstraZeneca, and others.
        </p>
        <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6", fontFamily: "DM Sans, sans-serif", marginBottom: "8px" }}>
          Many pharma companies also have undisclosed partnerships, internal AI initiatives, or are using freely available tools (AlphaFold Server, open-source Boltz/Protenix models) without formal commercial agreements. The absence of a public partnership does not indicate absence of activity.
        </p>
        <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6", fontFamily: "DM Sans, sans-serif" }}>
          Headline deal values (e.g. "$1.7B") represent <strong style={{color: "#cbd5e1"}}>maximum contingent milestones</strong> dependent on clinical and regulatory success, not committed capital. Actual cash transferred to date is a fraction of headline figures. Upfront payments are the only confirmed economics.
        </p>
      </div>
    </div>
  );
}

function EcosystemView() {
  const [expanded, setExpanded] = useState(null);
  const typeColors = {
    "AI Agent": "#8B5CF6",
    "Compute": "#F59E0B",
    "Co-Development": "#EF4444",
    "Platform": "#0EA5E9",
    "Investor": "#10B981",
    "Direct": "#06b6d4",
    "Parent": "#94a3b8",
  };

  return (
    <div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", color: "#f1f5f9", marginBottom: "6px" }}>
        Ecosystem & AI Integrations
      </div>
      <p style={{ color: COLORS.muted, fontSize: "14px", marginBottom: "20px", lineHeight: "1.5", fontFamily: "DM Sans, sans-serif" }}>
        Beyond pharma deals, these companies are building (or deliberately not building) technology ecosystems. Distribution strategy reveals as much about competitive positioning as partnership economics.
      </p>

      {["boltz", "chai", "isomorphic"].map((key) => {
        const eco = ecosystemPartnerships[key];
        const isOpen = expanded === key;
        return (
          <div key={key} style={{
            background: isOpen ? "#0e2337" : "#0a1929",
            border: `1px solid ${isOpen ? COLORS.teal : "#1e3a52"}`,
            borderRadius: "10px",
            marginBottom: "12px",
            overflow: "hidden",
            transition: "all 0.2s ease",
          }}>
            <div
              onClick={() => setExpanded(isOpen ? null : key)}
              style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "17px", color: "#f1f5f9" }}>{eco.title}</div>
                <div style={{ color: COLORS.muted, fontSize: "13px", marginTop: "3px", fontFamily: "DM Sans, sans-serif" }}>
                  {eco.categories.reduce((sum, c) => sum + c.partners.length, 0)} partnerships across {eco.categories.length} categories
                </div>
              </div>
              <span style={{ color: COLORS.muted, fontSize: "20px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </div>

            {isOpen && (
              <div style={{ padding: "0 20px 20px", fontFamily: "DM Sans, sans-serif" }}>
                <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5", marginBottom: "16px" }}>{eco.intro}</p>

                {eco.categories.map((cat, ci) => (
                  <div key={ci} style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "12px", color: COLORS.teal, fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{cat.name}</div>
                    {cat.partners.map((p, pi) => (
                      <div key={pi} style={{
                        background: "#0a192966",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginBottom: "6px",
                        border: "1px solid #1e3a52",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "600", color: "#f1f5f9", fontSize: "14px" }}>{p.name}</span>
                          <span style={{
                            padding: "1px 8px",
                            borderRadius: "10px",
                            fontSize: "10px",
                            fontWeight: "600",
                            background: `${typeColors[p.type] || "#64748b"}22`,
                            color: typeColors[p.type] || "#64748b",
                            border: `1px solid ${typeColors[p.type] || "#64748b"}44`,
                          }}>{p.type}</span>
                        </div>
                        <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.4" }}>{p.detail}</div>
                      </div>
                    ))}
                  </div>
                ))}

                <div style={{ background: "#0d948811", borderRadius: "8px", padding: "14px", border: `1px solid ${COLORS.teal}33`, marginTop: "8px" }}>
                  <div style={{ fontSize: "12px", color: COLORS.teal, fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>BD Insight</div>
                  <div style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>{eco.strategicInsight}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{
        background: "#06b6d411",
        border: "1px solid #06b6d433",
        borderRadius: "10px",
        padding: "18px 20px",
        marginTop: "20px",
      }}>
        <div style={{ fontSize: "12px", color: COLORS.accent, fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "DM Sans, sans-serif" }}>
          The Agentic Drug Discovery Thesis
        </div>
        <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", fontFamily: "DM Sans, sans-serif", marginBottom: "8px" }}>
          Boltz's integrations with Claude Code, OpenAI Codex, and Gemini CLI represent something new: biomolecular prediction as an agent-callable tool. A scientist can now write in natural language "screen these 50 compounds against EGFR" and an AI agent will call the Boltz API, run the predictions, and return ranked results. all in under 4 minutes for ~$0.10.
        </p>
        <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", fontFamily: "DM Sans, sans-serif" }}>
          This is a fundamentally different distribution model from Isomorphic (where only internal teams can use the engine) or even Chai (where pharma partners get embedded instances). If the agentic workflow becomes how scientists interact with these tools, the company with the best API and widest agent integrations wins the default position. regardless of which model has the highest benchmark accuracy.
        </p>
      </div>
    </div>
  );
}

function StrategicInsights() {
  const sections = [
    {
      title: "The Open vs. Closed Debate",
      content: `This market is splitting along a familiar fault line. Isomorphic believes proprietary models behind deep partnerships create a quality and data moat. Boltz believes open-source wins by building the largest ecosystem and monetising services on top. Chai occupies the middle. commercially accessible but not fully open.

The LLM analogy (Isomorphic ≈ OpenAI, Boltz ≈ Meta Llama, Chai ≈ Anthropic) is useful but limited. Structure prediction has wet-lab validation loops that LLMs do not; a model must produce molecules that actually work in a test tube, not just generate plausible text. This means the "best model wins" thesis is stronger here than in LLMs, because model quality has physically measurable consequences. Conversely, the "ecosystem wins" thesis is weaker, because a free model that produces worse molecules than a proprietary one has less value than a free LLM that produces slightly worse text.

The outcome may not be winner-take-all. The emerging pattern of modality-specific procurement (different platforms for small molecules vs. biologics vs. protein design) suggests multiple vendors can coexist, each dominant in a specific application domain. The question is which domain captures the most value.`,
    },
    {
      title: "The Modality-Specific Procurement Pattern",
      content: `The most strategically important signal from early pharma partnerships is not which vendor pharma companies are choosing; it's that they're choosing different vendors for different drug modalities.

Eli Lilly uses Isomorphic for small molecule co-development (Jan 2024) and Chai for biologics/antibody design (Jan 2026). These are fundamentally different capabilities serving different R&D teams within the same company. Similarly, Pfizer uses Boltz for broad platform infrastructure across its research org and Chai specifically for biologics design with Chai-3.

This has significant strategic implications. It suggests the market may fragment by modality rather than consolidate around a single winner. Companies optimised for antibody design (Chai) may not directly compete with companies optimised for small-molecule co-development (Isomorphic) or broad infrastructure tooling (Boltz). If true, the "total addressable market" for each player is smaller than it appears, but competitive intensity within each niche is lower.

The counter-argument: as models become more general-purpose (Boltz already spans structure prediction, small molecules, and protein design), modality boundaries may dissolve, and platform breadth could become the deciding factor.`,
    },
    {
      title: "Funding Asymmetry & Capital Efficiency",
      content: `The funding gap is extreme. Isomorphic ($2.7B) has roughly 100x the funding of Boltz ($28M) and 12x Chai ($230M). Yet Boltz has arguably comparable pharma traction (Pfizer, Takeda, Recursion) to Isomorphic (Lilly, Novartis, J&J), achieved at a fraction of the cost.

However, capital efficiency cuts both ways. Boltz's low burn means it cannot run expensive preclinical experiments, build large wet-lab validation teams, or sustain the compute needed for frontier model training at Isomorphic's scale. The Recursion partnership (which provided BioHive-2 supercomputer time) was critical precisely because Boltz couldn't afford that compute independently.

Chai is best positioned financially among the challengers. At $230M raised and reportedly raising $400M more at $3.4B valuation, it has enough capital to compete for top-tier partnerships while maintaining model development velocity. If the Forbes-reported Lilly deal terms are accurate (annual access fees in the mid-eight figures), Chai may already be generating meaningful revenue. a significant differentiator given that Isomorphic has only collected ~$83M in confirmed upfront payments across all three partnerships.

The key question for Boltz: can they raise a significant Series A before the window closes? Two major pharma deals in six months (Pfizer, Takeda) and the broadest ecosystem distribution in the field provide strong evidence for a fundraise. but the gap to Isomorphic's resources remains vast.`,
    },
    {
      title: "The AI Infrastructure Layer: Anthropic and OpenAI Enter Life Sciences",
      content: `A new competitive dimension is emerging above the structure prediction companies: the general-purpose AI labs building orchestration and reasoning platforms for drug discovery.

Anthropic launched Claude Science on June 30, 2026, an AI workbench connecting 60+ scientific databases with tools for genomics, protein structure analysis, and chemistry. Anthropic also acquired Coefficient Bio for $400M in April 2026 to build drug discovery capabilities directly into Claude, and is starting an internal programme targeting neglected diseases. Pharma customers already using Claude include Sanofi (60,000 employees daily), AstraZeneca, Novo Nordisk, and Genmab. Critically, Boltz has a first-party Claude Code integration, meaning scientists can call Boltz's structure prediction API from within Claude using natural language.

OpenAI launched GPT-Rosalind in April 2026, its first domain-specific model for life sciences. Early partners include Novo Nordisk (enterprise-wide strategic partnership), Amgen, Moderna, Thermo Fisher, and the Allen Institute. OpenAI was also a seed investor in Chai Discovery, creating a financial link between the reasoning layer and the structure prediction layer. Boltz also integrates with OpenAI's Codex.

These companies are not building structure prediction models. They are building the reasoning and workflow layer that sits on top of them. A scientist using Claude Science can call Boltz to predict a structure, search PubMed for context, design follow-up experiments, and generate a report, all in one session. The implication for companies like Boltz and Chai: the AI lab whose platform becomes the default research environment also controls which structure prediction tools get called most often. Distribution through Claude Code and Codex may matter as much as model accuracy.`,
    },
    {
      title: "Adjacent Niche: Intrinsically Disordered Proteins",
      content: `Roughly one-third of the human proteome consists of intrinsically disordered proteins (IDPs), proteins that do not adopt a stable 3D structure. AlphaFold, Boltz, and Chai all struggle with these targets because their models are trained primarily on well-folded proteins from the Protein Data Bank. This limitation creates a distinct competitive niche.

Two companies are specifically targeting this space. Topos Bio (San Francisco, $10.5M seed, Jan 2026) emerged from stealth with Topos-1, a foundation model for IDP ensembles that outperformed AlphaFold, Boltz, and Chai on disordered protein benchmarks. Founded by Amir Khosrowshahi (former CTO of Intel AI) and Ryan Zarcone, with a Gladstone Institutes collaboration focused on alpha-synuclein in Parkinson's disease. Topos is building its own drug pipeline, not just tools.

Peptone (London, ~$42M Series A, founded 2018) takes a different approach, combining experimental physics (NMR spectroscopy, hydrogen-exchange mass spectrometry) with AI. Backed by Bessemer, F-Prime Capital, and notably Novartis's venture arm. Peptone has been working on IDPs for longer than any competitor and has its own wet lab and proprietary hardware.

For a BD audience, the key insight is that the "undruggable" ~30% of the proteome represents an entirely separate market from the structured protein targets that Isomorphic, Boltz, and Chai are competing over. Whoever cracks IDP drug design opens a category that current tools cannot reach.`,
    },
    {
      title: "Scope & Limitations of This Analysis",
      content: `This analysis focuses specifically on biomolecular structure prediction and molecular design platforms. It does not cover the broader AI drug discovery landscape, which includes established computational chemistry companies (Schrödinger, $6B+ market cap), AI-native drug developers (Recursion, Insilico Medicine), large language model providers entering pharma (Anthropic's BMS deal, OpenAI's Novo Nordisk partnership), and pharma companies' substantial internal AI/ML capabilities.

Deal values cited throughout this analysis represent maximum contingent milestone payments, not committed or transferred capital. The actual economics of these partnerships depend on clinical success rates, which historically average 5-10% from preclinical to approval. A "$1.7B deal" with a 5% probability of full payout has an expected value closer to $85M plus the $45M upfront. a different picture than the headline suggests.

Several major pharma companies (Roche, AstraZeneca, Merck, BMS, among others) have significant internal AI teams and/or undisclosed external partnerships. The absence of a public structure prediction partnership from this dataset should not be interpreted as inactivity in the space.

All data sourced from public announcements, SEC filings, press releases, and credible reporting as of June 2026.`,
    },
  ];

  return (
    <div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", color: "#f1f5f9", marginBottom: "16px" }}>
        Market Dynamics
      </div>
      {sections.map((s, i) => (
        <div key={i} style={{
          background: "#0e2337",
          border: "1px solid #1e3a52",
          borderRadius: "10px",
          padding: "18px 20px",
          marginBottom: "12px",
        }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "17px", color: COLORS.tealLight, marginBottom: "10px" }}>{s.title}</div>
          {s.content.split("\n\n").map((para, j) => (
            <p key={j} style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "10px", fontFamily: "DM Sans, sans-serif" }}>{para}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("grid");
  const [expandedCards, setExpandedCards] = useState(new Set());

  const toggleCard = (id) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tabs = [
    { id: "grid", label: "Positioning Map" },
    { id: "pharma", label: "Pharma Deals" },
    { id: "ecosystem", label: "Ecosystem & AI" },
    { id: "insights", label: "Market Dynamics" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#060f1a",
      color: "#e2e8f0",
      minHeight: "100vh",
      padding: "0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: COLORS.darkHeader,
        padding: "32px 24px 24px",
        borderBottom: `2px solid ${COLORS.teal}`,
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", color: COLORS.teal, fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            Competitive Intelligence
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 4vw, 34px)", color: "#f8fafc", margin: "0 0 8px", lineHeight: "1.2" }}>
            AI Structure Prediction Platforms
          </h1>
          <p style={{ color: COLORS.muted, fontSize: "15px", margin: "0 0 4px", lineHeight: "1.5" }}>
            A BD/strategy view of who's competing to become pharma's default platform for molecular structure prediction and drug design.
          </p>
          <p style={{ color: "#64748b", fontSize: "12px", margin: "0" }}>
            By Suruchi Sethi · suruchisethi6.github.io · Last updated June 2026
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: "#0a1929",
        borderBottom: "1px solid #1e3a52",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", gap: "0", padding: "0 24px", overflowX: "auto" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === t.id ? COLORS.teal : "transparent"}`,
                color: activeTab === t.id ? COLORS.tealLight : COLORS.muted,
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
                fontWeight: activeTab === t.id ? "600" : "400",
                padding: "14px 18px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>

        {activeTab === "grid" && (
          <>
            <NetworkMap />
            <p style={{ color: COLORS.muted, fontSize: "12px", textAlign: "center", margin: "8px 0 24px", fontStyle: "italic" }}>
              AI platforms grouped by business model. Lines show pharma partnerships. Lilly and Pfizer each work with two platforms for different drug modalities.
            </p>

            <div style={{ fontSize: "11px", color: COLORS.teal, fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "14px" }}>
              The Big Three
            </div>
            {companies.filter(c => ["isomorphic", "boltz", "chai"].includes(c.id)).map(c => (
              <CompanyCard
                key={c.id}
                company={c}
                isOpen={expandedCards.has(c.id)}
                onToggle={() => toggleCard(c.id)}
              />
            ))}

            <OpenSourceLandscape />
          </>
        )}

        {activeTab === "pharma" && <PharmaView />}
        {activeTab === "ecosystem" && <EcosystemView />}
        {activeTab === "insights" && <StrategicInsights />}

        {/* Footer */}
        <div style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #1e3a52",
          textAlign: "center",
        }}>
          <p style={{ color: "#475569", fontSize: "12px", lineHeight: "1.5" }}>
            Competitive intelligence analysis by Suruchi Sethi.
            <br />Data sourced from public announcements, SEC filings, and press releases. June 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
