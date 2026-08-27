import { useState, useMemo, useEffect, useCallback } from "react";

const CATEGORIES = [
  { id: "discovery", label: "Biology &\nMolecule Creation", color: "#7c3aed", short: "Discovery" },
  { id: "clinical", label: "Clinical\nIntelligence", color: "#ec4899", short: "Clinical Intel" },
  { id: "manufacturing", label: "Development\n& Operations", color: "#f97316", short: "Dev & Ops" },
  { id: "enterprise", label: "Enterprise\nAI", color: "#0891b2", short: "Enterprise AI" },
  { id: "infrastructure", label: "AI\nInfrastructure", color: "#6366f1", short: "Infrastructure" },
];

const DEAL_TYPES = [
  "Acquisition", "Licensing", "Partnership", "Platform licensing",
  "Infrastructure", "Enterprise AI", "Collaboration",
];

const EVIDENCE_LEVELS = [
  { id: "production", label: "Production", color: "#059669", icon: "●" },
  { id: "pilot", label: "Pilot", color: "#ca8a04", icon: "◐" },
  { id: "research", label: "Research", color: "#3b82f6", icon: "○" },
  { id: "funding", label: "Funding only", color: "#94a3b8", icon: "◌" },
];

const ARCHETYPES = [
  "Acquire capability", "License platform", "Access compute",
  "Source pipeline", "Build AI workforce", "Co-develop molecules",
  "Enterprise transformation", "Data partnership",
];

const SEED_DEALS = [
  {
    id: 1, pharma: "Roche / Genentech", startup: "Recursion",
    startupDesc: "Clinical-stage TechBio company operating the Recursion OS — an AI-native platform integrating automated biology, chemistry, and clinical development. Partnered with Roche, Sanofi, Bayer, and others, with $500M+ in cumulative milestone payments by Q3 2025.",
    dealType: "Collaboration", value: "$150M upfront, up to $12B+", date: "December 2021 (active 2026)",
    stages: ["discovery"],
    evidence: "production",
    archetype: "Co-develop molecules",
    summary: "Multi-year, up to 40-program collaboration across neuroscience and oncology. $500M+ in milestone payments achieved — one of the most advanced AI drug discovery partnerships in industry.",
    detail: "This is arguably the most significant AI drug discovery partnership in progress. Roche and Genentech are working with Recursion across up to 40 programmes in neuroscience and GI oncology over a decade-plus horizon. Recursion delivered its second whole-genome neuro map in Q3 2025, triggering a $30M milestone and bringing cumulative partner payments above $500M. The strategic lesson: pharma is increasingly outsourcing biological data generation, not just computation, to AI-native platforms. Recursion's model — automated wet-lab biology feeding AI systems in a closed loop — represents a fundamentally different capability than licensing a foundation model.",
    source: "Recursion Q4 2025 earnings; original deal Dec 2021",
    sourceUrl: "https://ir.recursion.com/news-releases/news-release-details/recursion-reports-fourth-quarter-and-full-year-2025-financial",
  },
  {
    id: 2, pharma: "Sanofi", startup: "Earendil Labs",
    startupDesc: "AI-driven biologics company building a platform that combines predictive protein modelling with high-throughput experimental validation. Has produced 40+ drug programmes. Raised $787M in March 2026 from Dimension Capital, DST Global, INCE Capital, Luminous Ventures, Miracle Capital, Sanofi, and the Pfizer–Hillhouse Biotech Development Fund.",
    dealType: "Collaboration", value: "Up to $2.56B", date: "January 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Source pipeline",
    summary: "Second major deal between Sanofi and Earendil — up to $2.56B for AI-driven bispecific antibody discovery across multiple autoimmune and inflammatory disease programmes.",
    detail: "The significance is not the headline value — it is Sanofi repeatedly choosing an external AI-native discovery platform as a source of biologics candidates rather than treating AI as an internal productivity tool. The first deal (April 2025, $125M upfront / up to ~$1.85B total) licensed two specific bispecifics. This second deal is broader: platform-level access across multiple programmes. Earendil then raised $787M in March 2026, with Sanofi itself investing. One important dimension absent from most coverage: Earendil is US-incorporated but China-rooted, affiliated with Helixon Therapeutics, and reportedly pursuing a Hong Kong IPO — making this a case study in cross-border AI pharma dynamics under BIOSECURE Act scrutiny.",
    source: "First deal Apr 2025 ($125M up / ~$1.85B total); second deal Jan 2026",
    sourceUrl: "https://www.fiercebiotech.com/biotech/sanofis-latest-autoimmune-bispecific-pact-ai-biotech-could-reach-25b",
  },
  {
    id: 3, pharma: "Eli Lilly", startup: "Isomorphic Labs",
    startupDesc: "Google DeepMind spinout building an AI-first drug design engine (IsoDDE). Co-develops molecules alongside pharma partners — does not sell software. Raised $2.1B Series B in May 2026 (led by Thrive Capital, with Alphabet, MGX, Temasek, UK Sovereign AI Fund). Also partnered with Novartis and J&J.",
    dealType: "Partnership", value: "$45M up / $1.7B milestones", date: "January 2024",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Multi-target drug discovery collaboration using Isomorphic's AI drug design engine. One of three major pharma partnerships (alongside Novartis and J&J) validating the AI-native co-development model.",
    detail: "Isomorphic represents a structural shift from AI-as-tooling to AI-native drug creation companies. They don't license software — they sit alongside pharma R&D teams and co-develop molecules using their own AI engine. The strategic question this deal poses: does pharma eventually buy molecules from AI-native biotech companies rather than build internal AI capabilities? With Lilly ($1.7B milestones), Novartis ($1.2B milestones, expanded Feb 2025), and now J&J all partnered, this is the highest-conviction bet that AI can generate clinical-quality molecules. Separately, Isomorphic raised $2.1B in Series B funding in May 2026 — the largest AI drug discovery private round in history — distinct from partnership economics.",
    source: "Lilly deal Jan 2024; Novartis Jan 2024 / expanded Feb 2025; J&J subsequently; $2.1B Series B May 2026",
    sourceUrl: "https://www.isomorphiclabs.com/partnerships",
  },
  {
    id: 4, pharma: "J&J / AbbVie / Novo Nordisk / Bayer", startup: "Cradle",
    startupDesc: "Protein engineering platform that lets scientists design better protein sequences — optimising for stability, efficacy and manufacturability using their own lab data. Platform embedded directly into partner workflows.",
    dealType: "Platform licensing", value: "50+ programmes", date: "2025–2026",
    stages: ["discovery", "manufacturing"],
    evidence: "production",
    archetype: "License platform",
    summary: "Protein engineering platform running 50+ programmes across 6+ of the top 25 pharma companies. Bayer has embedded the platform directly into R&D workflows.",
    detail: "AI is moving upstream into molecule design, but the winners may be the platforms that optimise molecules for the factory, not just the lab. Cradle's platform proposes protein sequences with better stability, efficacy, and manufacturability — properties that directly affect expression yields, formulation, and cost of goods. Bayer's deep embedding goes beyond software licensing: scientists from both organisations exchange ideas on research direction. The manufacturing angle is strategically important: designing molecules that are easier to produce is where AI creates value invisible to headline deal values.",
    source: "Including J&J, AbbVie, Novo Nordisk, and Bayer",
  },
  {
    id: 5, pharma: "GSK", startup: "NOETIK",
    startupDesc: "Builds foundation models trained on spatial biology data from 3.5M+ primary human tissue samples to predict cancer treatment outcomes. One of the first true foundation model licensing deals in biotech.",
    dealType: "Licensing", value: "$50M upfront + fees", date: "January 2025",
    stages: ["discovery", "clinical"],
    evidence: "production",
    archetype: "License platform",
    summary: "GSK licensed NOETIK's spatial biology foundation models in lung and colorectal cancer for outcome prediction and biomarker discovery — one of the first true foundation model licensing deals in biotech.",
    detail: "NOETIK builds foundation models on spatial biology data — rich, tissue-level information capturing how cells interact in tumours. GSK committed $50M upfront plus licensing fees under a subscription-based framework for access to models in lung and colorectal cancer. AI-driven biomarker discovery could improve patient stratification and clinical trial efficiency — two major contributors to the high failure rate in Phase 2 oncology trials. The deal structure itself is significant: this is one of the first examples of pharma licensing a biological foundation model the way enterprises license software, creating a commercial template for AI-as-infrastructure in biopharma.",
    source: "Five-year licensing partnership",
    sourceUrl: "https://www.genengnews.com/topics/artificial-intelligence/pharma-bets-big-on-ai-platforms-with-flurry-of-new-year-deals/",
  },
  {
    id: 6, pharma: "Eli Lilly", startup: "Tamarind Bio",
    startupDesc: "Builds inference infrastructure for molecular AI models. Selected by Lilly to power TuneLab 2.0, giving biotech startups access to AI models trained on Lilly's proprietary data.",
    dealType: "Infrastructure", value: "200+ AI models hosted", date: "2025",
    stages: ["infrastructure"],
    evidence: "production",
    archetype: "Access compute",
    summary: "Selected by Lilly to build inference infrastructure for TuneLab 2.0, hosting 200+ molecular AI models used by tens of thousands of scientists across 8 of the top 20 pharma.",
    detail: "The future bottleneck in pharma AI may not be model availability — it may be deployment, governance, data access, and workflow integration. Tamarind Bio plays this infrastructure role: they build the compute and serving layer that lets thousands of scientists access molecular AI models at scale. Lilly selected them to power TuneLab 2.0, which gives biotech startups access to models trained on over $1B of Lilly's proprietary data. This is one of the most strategically important categories in pharma AI, and currently underweighted in industry coverage.",
    source: "Used by 8 of top 20 pharma companies",
  },
  {
    id: 7, pharma: "CSL + others", startup: "Perceptic",
    startupDesc: "Founded by three former Palantir AIP engineers (Tilman Flock, Martin Copes, Zaki Trache). Building an end-to-end AI operating system that connects data, decisions and workflows across the drug development lifecycle — from asset scouting through clinical data analysis.",
    dealType: "Enterprise AI", value: "$12M seed (Accel, Air Street, Elder Gull)", date: "May 2026",
    stages: ["enterprise"],
    evidence: "production",
    archetype: "Enterprise transformation",
    summary: "Emerged from stealth with $12M seed. Already in paid production at multiple top-10 pharma companies, biotechs, and CROs. Three core applications: asset scouting, scientific evaluation, and clinical data analysis.",
    detail: "Perceptic targets the connective tissue between pharma's siloed AI tools — compressing asset scouting from weeks to hours, informing indication selection decisions worth hundreds of millions, and building a clinical data foundation that has produced a 50x increase in data extractions. The Palantir pedigree is relevant not as brand but as architectural precedent: the founders built AIP and shaped its Life Sciences practice, meaning they've deployed production AI inside highly regulated enterprise environments before. The key question for pharma strategy teams: does the value layer shift from individual AI models to the operating system that orchestrates them?",
    source: "Fortune exclusive, May 26, 2026; CSL named publicly",
    sourceUrl: "https://fortune.com/2026/05/26/exclusive-perceptic-a-startup-automating-drug-discovery-end-to-end-for-big-pharma-emerges-from-stealth-with-12-million-in-seed-funding/",
  },
  {
    id: 8, pharma: "AstraZeneca", startup: "Modella AI",
    startupDesc: "Boston-based AI company co-founded by Faisal Mahmood (Mass General Brigham). Builds multimodal AI foundation models and AI agents for oncology, integrating pathology, clinical data, and generative AI.",
    dealType: "Acquisition", value: "Undisclosed", date: "January 2026",
    stages: ["discovery", "clinical"],
    evidence: "production",
    archetype: "Acquire capability",
    summary: "AstraZeneca acquired Modella AI — one of the first major examples of big pharma acquiring an AI-native life sciences company rather than licensing the technology.",
    detail: "This deal signals a structural shift: AstraZeneca concluded that partnership was no longer enough and chose to bring AI capabilities in-house. Modella's multimodal foundation models are now embedded directly into AstraZeneca's oncology R&D, clinical development and biomarker discovery workflows. The acquisition built on a multi-year agreement initiated in July 2025 — just months from collaboration to full acquisition. AZ's CFO described it as designed to 'supercharge' quantitative pathology and biomarker discovery. For the broader landscape, it raises the question: as AI becomes core to drug development, does pharma need to own the capability rather than rent it?",
    source: "Announced at JPM26, January 13, 2026",
    sourceUrl: "https://finance.yahoo.com/news/modella-ai-announces-acquisition-astrazeneca-170200809.html",
  },
  {
    id: 9, pharma: "Eli Lilly", startup: "NVIDIA",
    startupDesc: "NVIDIA's BioNeMo and Clara platforms provide GPU-accelerated computing infrastructure purpose-built for drug discovery AI workloads.",
    dealType: "Infrastructure", value: "$1B over 5 years", date: "January 2026",
    stages: ["infrastructure"],
    evidence: "production",
    archetype: "Access compute",
    summary: "A $1B, 5-year commitment to build a co-innovation AI lab in South San Francisco — one of pharma's largest dedicated AI infrastructure investments.",
    detail: "Lilly and NVIDIA committed $1B over five years to build what they call an AI Factory — a co-innovation lab staffed by combined teams from both companies, designed to identify, optimise and validate new molecules. This is infrastructure as strategy: Lilly is betting that compute power itself becomes a competitive advantage in drug discovery. However, Roche subsequently announced an even larger GPU footprint (3,500+ Blackwell GPUs across US and Europe in March 2026), suggesting this is becoming an arms race where the infrastructure investment is table stakes, not a moat.",
    source: "Announced at JPM26, January 2026",
    sourceUrl: "https://www.biopharmadive.com/news/lilly-nvidia-ai-drug-discovery-lab/812022/",
  },
  {
    id: 10, pharma: "Roche", startup: "NVIDIA",
    startupDesc: "NVIDIA's accelerated computing stack deployed on-premises across Roche's global R&D and diagnostics operations.",
    dealType: "Infrastructure", value: "3,500+ GPUs deployed", date: "March 2026",
    stages: ["infrastructure"],
    evidence: "production",
    archetype: "Access compute",
    summary: "Roche launched a large-scale AI factory powered by NVIDIA Blackwell GPUs, bringing its combined on-premise and cloud GPU infrastructure to 3,500+ units — the largest announced GPU footprint in pharma.",
    detail: "Roche's AI infrastructure investment builds on a strategic NVIDIA collaboration that started in 2023 and now represents the largest announced GPU footprint available to any pharmaceutical company. The infrastructure is embedded across Roche's entire value chain — from diagnostics to therapeutics. Combined with their Recursion partnership and internal AI capabilities under Aviv Regev's leadership, Roche is assembling perhaps the most comprehensive AI drug development stack in the industry. The infrastructure race between Lilly and Roche signals that compute capacity is becoming a strategic differentiator, not a commodity.",
    source: "Roche press release, March 16, 2026",
    sourceUrl: "https://www.roche.com/media/releases/med-cor-2026-03-16",
  },
  {
    id: 11, pharma: "Eli Lilly", startup: "Insilico Medicine",
    startupDesc: "End-to-end AI drug discovery platform spanning target identification, molecule generation, and clinical trial prediction. One of the few AI biotechs with an internally generated pipeline, wet lab validation, and clinical-stage programmes — including rentosertib (IPF) with Phase 2a data published in Nature Medicine.",
    dealType: "Licensing", value: "$115M upfront, up to $2.75B", date: "March 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Source pipeline",
    summary: "Exclusive worldwide license to develop a portfolio of AI-designed oral therapeutics. Builds on a 2023 software licensing deal and a November 2025 partnership — the third Lilly–Insilico deal in three years.",
    detail: "The headline value is large, but the real story is escalation. Lilly first licensed Insilico's AI software in 2023. Then signed a ~$100M deal in November 2025. Now an exclusive worldwide license worth up to $2.75B. This three-deal escalation pattern — from tooling, to collaboration, to pipeline acquisition — may be the template for how AI pharma relationships mature. Insilico is important because it is one of the few AI biotechs that has crossed from computation to clinical reality: 28+ AI-generated candidates, ~12 IND-ready, and Phase 2a data for its lead asset. The strategic question: can an AI-native biotech become a new drug company archetype?",
    source: "Announced March 29, 2026; builds on 2023 and Nov 2025 deals",
    sourceUrl: "https://www.cnbc.com/2026/03/29/eli-lilly-reaches-deal-to-bring-ai-developed-drugs-to-global-market.html",
  },
  {
    id: 12, pharma: "Merck / MSD", startup: "Google Cloud",
    startupDesc: "Google Cloud's Gemini Enterprise platform — agentic AI deployed across pharmaceutical operations with Google Cloud engineers embedded alongside Merck teams.",
    dealType: "Enterprise AI", value: "Up to $1B", date: "April 2026",
    stages: ["enterprise", "manufacturing"],
    evidence: "pilot",
    archetype: "Enterprise transformation",
    summary: "Multi-year partnership deploying Gemini Enterprise as an agentic AI platform across all 75,000 Merck employees — spanning R&D, manufacturing, commercial and corporate.",
    detail: "The scale is the point: this is not a departmental pilot. Merck is deploying agentic AI — systems that act, not just advise — across its entire 75,000-person global organisation, with Google Cloud engineers embedded directly inside Merck teams. The governance implications are significant: deploying AI agents that can take actions inside a pharmaceutical company operating under GxP regulations creates novel compliance questions that the industry hasn't fully resolved. Merck retains ownership of its scientific data, but the co-deployment model means Google engineers are working within regulated decision-making environments. Whether the $1B ceiling represents genuine transformation or expensive infrastructure migration is the question to watch.",
    source: "Announced at Google Cloud Next, April 22, 2026",
    sourceUrl: "https://www.merck.com/news/merck-and-google-cloud-partner-to-accelerate-agentic-ai-enterprise-transformation/",
  },
  {
    id: 13, pharma: "Novo Nordisk", startup: "OpenAI",
    startupDesc: "OpenAI's enterprise platform applied to pharmaceutical drug discovery, manufacturing optimisation and supply chain management.",
    dealType: "Partnership", value: "Undisclosed", date: "April 2026",
    stages: ["discovery", "manufacturing"],
    evidence: "pilot",
    archetype: "Enterprise transformation",
    summary: "Strategic partnership applying AI across drug discovery, manufacturing and supply chain, with full enterprise integration targeted by end of 2026.",
    detail: "The interesting dimension here is not the OpenAI partnership in isolation — it is that Novo Nordisk already has a deep, multi-year AI relationship with Microsoft Research built on Azure, plus a separate Azure clinical reasoning agent deployed in 2025. Why does Europe's most valuable pharma company also need OpenAI separately? The answer appears to be dual-sourcing: Novo is using Azure for cloud infrastructure and clinical analytics while layering OpenAI on top for generative capabilities across R&D, manufacturing, and supply chain. This matters for enterprise AI strategy — pharma companies are choosing multi-vendor approaches rather than single-platform bets, hedging against lock-in while racing to deploy.",
    source: "Builds on existing Microsoft Azure relationship; full integration by end of 2026",
    sourceUrl: "https://www.biospace.com/press-releases/novo-nordisk-and-openai-partner-to-transform-how-medicines-are-discovered-and-delivered",
  },
  {
    id: 14, pharma: "Daiichi Sankyo", startup: "Imagene AI",
    startupDesc: "Pioneer in multimodal AI for precision oncology. Its OI Suite integrates histology, omics, clinical outcomes, and a proprietary real-world data lake of 3.5M+ tissue samples to derive insights for biomarker discovery and patient stratification.",
    dealType: "Collaboration", value: "Undisclosed", date: "April 2026",
    stages: ["clinical"],
    evidence: "research",
    archetype: "Data partnership",
    summary: "Collaboration to advance multimodal biomarker discovery and response prediction in oncology, using Imagene's AI across histology, omics and clinical outcomes data.",
    detail: "Imagene AI's platform integrates over 3.5M tissue samples with omics and clinical outcomes data — enabling AI-driven response modelling from H&E whole-slide images and quantitative assessment of target expression. This collaboration sits in the clinical development space where better biomarker discovery directly improves patient stratification and trial design. Daiichi Sankyo's ADC leadership (Enhertu, Datroway) makes this a natural fit: companion diagnostics and predictive biomarkers are becoming competitive requirements, not optional extras, in oncology.",
    source: "Multimodal AI for precision oncology",
  },
  {
    id: 15, pharma: "AstraZeneca", startup: "OWKIN",
    startupDesc: "French AI biotech building an autonomous 'AI Scientist' platform that integrates into pharma research workflows for hypothesis generation, experiment design and data analysis.",
    dealType: "Licensing", value: "3-year deal", date: "May 2026",
    stages: ["discovery"],
    evidence: "pilot",
    archetype: "License platform",
    summary: "3-year licensing deal for Owkin's autonomous 'AI Scientist' platform, integrated directly into AstraZeneca's research and decision workflows.",
    detail: "AstraZeneca licensed Owkin's autonomous 'AI Scientist' platform for three years, integrating it directly into their research workflows. Owkin's platform is designed to act as an autonomous research agent — generating hypotheses, designing experiments and analysing results. The critical question for agentic AI scientist platforms: does the AI produce validated scientific hypotheses faster than scientists working alone? This deal is a research collaboration, not clinical validation — the evidence level matters for assessing how far this category has progressed.",
    source: "Autonomous AI Scientist",
  },
  {
    id: 16, pharma: "Bristol Myers Squibb", startup: "Anthropic",
    startupDesc: "Anthropic's Claude deployed as an enterprise intelligence platform with agentic capabilities — connected to thousands of internal data sources. Known for reasoning capabilities and safety-focused approach.",
    dealType: "Enterprise AI", value: "Undisclosed", date: "May 2026",
    stages: ["enterprise", "discovery", "clinical", "manufacturing"],
    evidence: "production",
    archetype: "Enterprise transformation",
    summary: "Claude deployed as the shared intelligence platform across 30,000+ BMS employees — spanning discovery, clinical, regulatory, manufacturing and commercial, with agentic capabilities embedded into workflows.",
    detail: "This goes beyond chatbot deployment. BMS is deploying Claude Code within engineering and data science teams, embedding AI agents into core R&D and manufacturing workflows, and connecting Claude to the institutional knowledge distributed across decades of internal systems. The manufacturing dimension is particularly significant: applying AI to root-cause investigation, CAPA documentation, and data-driven batch-release decisions means AI is entering GxP-regulated manufacturing decisions — a fundamentally different risk and value profile from enterprise productivity. BMS frames this as building on three years of internal frontier model investment, suggesting the governance infrastructure was built before the agent deployment.",
    source: "BMS press release, May 20, 2026",
    sourceUrl: "https://news.bms.com/news/details/2026/Bristol-Myers-Squibb-Announces-Strategic-Agreement-with-Anthropic-to-Position-Claude-Enterprise-as-the-Shared-Intelligence-Platform-Across-Its-Global-Operations/default.aspx",
  },
  {
    id: 17, pharma: "Incyte", startup: "Edison Scientific",
    startupDesc: "AI company behind Kosmos, an autonomous AI scientist platform designed to operate across the full drug discovery and development lifecycle.",
    dealType: "Partnership", value: "Undisclosed", date: "May 2026",
    stages: ["discovery"],
    evidence: "pilot",
    archetype: "License platform",
    summary: "Incyte is deploying Edison Scientific's AI scientist, Kosmos, across its discovery and development lifecycle — another signal of agentic AI entering pharma R&D.",
    detail: "Following AstraZeneca's deal with Owkin's 'AI Scientist', Incyte's partnership with Edison Scientific represents another pharma company bringing autonomous AI agents into R&D. Kosmos operates across the full discovery and development lifecycle. Whether agentic AI scientists can produce validated scientific hypotheses faster than existing workflows remains unproven — these are still early-stage deployments, and the evidence level should be assessed accordingly.",
    source: "Agentic AI scientist platform",
  },
  {
    id: 18, pharma: "Sanofi", startup: "CytoReason",
    startupDesc: "Builds computational disease models that simulate how diseases work at the cellular level — enabling pharma companies to predict drug responses and identify patient populations before running clinical trials.",
    dealType: "Partnership", value: "Third extension", date: "2026",
    stages: ["discovery", "clinical"],
    evidence: "production",
    archetype: "License platform",
    summary: "Sanofi extended its CytoReason relationship for the third time — deepening its use of AI disease simulation models for drug development and clinical strategy.",
    detail: "The repeated extension pattern is itself the signal. CytoReason's platform simulates disease biology computationally, letting pharma companies test hypotheses about drug mechanisms before committing to expensive clinical trials. The fact that Sanofi is extending for a third time — not switching to a competitor — indicates these models are delivering measurable value inside Sanofi's decision-making process. In a landscape dominated by new partnership announcements, the companies returning to partners they already trust and committing more may be the strongest indicator of what actually works.",
    source: "Third extension of the relationship",
  },
  {
    id: 19, pharma: "Pfizer", startup: "Chai Discovery",
    startupDesc: "AI startup building advanced molecular structure prediction models. Chai-3 is their latest model for protein-ligand interaction prediction and biologics design.",
    dealType: "Licensing", value: "Undisclosed", date: "June 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "License platform",
    summary: "Licensing agreement giving Pfizer access to Chai-3 plus a custom model trained on Pfizer's proprietary data to accelerate biologics discovery.",
    detail: "Pfizer licensed Chai Discovery's Chai-3 model plus a custom version trained on Pfizer's proprietary data. This follows the emerging pattern: license the foundation model, then fine-tune on proprietary data. The custom model is where competitive advantage sits — the same foundation model available to everyone creates no differentiation, but a version trained on decades of internal data potentially does.",
    source: "Custom model on Pfizer's proprietary data",
  },
  {
    id: 20, pharma: "Pfizer", startup: "Boltz Bio",
    startupDesc: "Public benefit corporation founded by MIT researchers building open-source biomolecular AI models. Boltz-1 and Boltz-2 achieve AlphaFold 3-level accuracy for 3D structure prediction, used by 100,000+ scientists globally.",
    dealType: "Collaboration", value: "Multi-year", date: "January 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Multi-year collaboration where Boltz refines its foundation models on Pfizer's historical data to build exclusive models for structure prediction, small-molecule affinity, and biologics design.",
    detail: "Boltz will integrate Pfizer's historical data into its foundation models to create exclusive models for structure prediction, small-molecule affinity, and biologics design. Boltz scientists work directly with Pfizer's discovery teams on custom workflows. This follows the same open-source-foundation-model + proprietary-fine-tuning pattern emerging across the landscape — the same template that's working in enterprise AI, now applied to molecular biology.",
    source: "Boltz raised $28M seed from a16z, Amplify, Zetta",
  },
  {
    id: 21, pharma: "Merck / MSD", startup: "Protillion Biosciences",
    startupDesc: "Lab-in-the-loop AI drug design company. Its proprietary Prot-MaP platform generates megascale training datasets for protein-design AI, enabling quantitative analysis of millions of protein variants per run.",
    dealType: "Collaboration", value: "Up to $510M", date: "June 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Multi-target discovery collaboration and license agreement worth up to $510M, combining Protillion's Prot-MaP platform with Merck's drug discovery expertise to design optimised biologics.",
    detail: "Protillion's Prot-MaP technology generates massive, just-in-time training sets for protein-design AI — characterising millions of variants per run and avoiding common pitfalls of model overfitting. The platform enables identification of optimised biologics with sophisticated therapeutic profiles such as pH-dependent sweeping and multi-target specificity. This adds to Merck's flurry of AI deals in 2026 alongside Google Cloud, Quotient, and Infinimmune — suggesting a deliberate portfolio strategy rather than opportunistic dealmaking.",
    source: "Announced June 16, 2026",
  },
  {
    id: 22, pharma: "Boehringer Ingelheim", startup: "Variant Bio",
    startupDesc: "Genomics-driven AI drug discovery company. Its Inference platform integrates proprietary genomic, deep phenotyping, and multi-omic data from diverse global populations to discover and validate novel drug targets.",
    dealType: "Collaboration", value: "$120M+", date: "January 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Multi-year target discovery and licensing agreement applying Variant Bio's AI-powered Inference platform to discover and validate targets for cardiorenal and kidney disease.",
    detail: "Variant Bio launched what it describes as the world's first agentic genomic drug discovery platform alongside this deal. The Boehringer partnership applies Inference — which integrates genomic, deep phenotyping, and multi-omic data across diverse global populations — to kidney disease target identification. The deal structure (upfront + license + milestones exceeding $120M) sits at the intersection of two important trends: AI-driven target discovery and genetically validated drug targets, which historically show higher clinical success rates.",
    source: "Announced January 6, 2026",
    sourceUrl: "https://www.fiercebiotech.com/biotech/boehringer-continues-kidney-disease-dealmaking-run-120m-variant-bio-pact",
  },
  {
    id: 23, pharma: "Incyte", startup: "Genesis Therapeutics",
    startupDesc: "Builds GEMS foundation models for protein–ligand structure and property prediction, with proprietary experimental data enabling large-scale training for challenging discovery targets.",
    dealType: "Collaboration", value: "Undisclosed", date: "May 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Expanded molecular AI collaboration granting Incyte exclusivity on collaboration-derived products, with proprietary data sharing to expand Genesis's GEMS foundation models.",
    detail: "This expansion deal pairs significant upfront capital with long-tail milestones and royalties, while granting Incyte exclusivity for development and commercialisation of collaboration-derived products. The proprietary experimental data sharing is central — Incyte's data will expand Genesis's GEMS foundation models for protein-ligand prediction. The deal was announced the same day as BMS/Anthropic, illustrating how pharma AI deals now span the full spectrum from molecular design to enterprise productivity simultaneously.",
    source: "Announced May 20, 2026",
  },
];

const DEAL_TYPE_COLORS = {
  "Acquisition": "#dc2626",
  "Licensing": "#2563eb",
  "Partnership": "#7c3aed",
  "Platform licensing": "#0891b2",
  "Infrastructure": "#ca8a04",
  "Enterprise AI": "#059669",
  "Collaboration": "#0d9488",
};

const DEALS_KEY = "ai-pharma-deals-v4";
const PENDING_KEY = "ai-pharma-pending-v4";
const ADMIN_KEY = "ai-pharma-admin-v4";

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
  pharma: "", startup: "", startupDesc: "", dealType: "Collaboration",
  value: "", date: "", stages: [], summary: "", detail: "", source: "", sourceUrl: "", submitterName: "",
  evidence: "research", archetype: "",
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
        <div>
          <label style={labelStyle}>Date</label>
          <input style={inputStyle} value={form.date} onChange={e => set("date", e.target.value)} placeholder="e.g. June 2026" />
        </div>
        <div>
          <label style={labelStyle}>Source URL</label>
          <input style={inputStyle} value={form.sourceUrl || ""} onChange={e => set("sourceUrl", e.target.value)} placeholder="https://..." />
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div>
          <label style={labelStyle}>Evidence level</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.evidence || "research"} onChange={e => set("evidence", e.target.value)}>
            {EVIDENCE_LEVELS.map(e => <option key={e.id} value={e.id}>{e.icon} {e.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Deal archetype</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.archetype || ""} onChange={e => set("archetype", e.target.value)}>
            <option value="">Select...</option>
            {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
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
          <label style={labelStyle}>What strategic shift does this represent?</label>
          <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={form.detail} onChange={e => set("detail", e.target.value)} placeholder="Strategic analysis and context" />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Source / notes</label>
        <input style={inputStyle} value={form.source} onChange={e => set("source", e.target.value)} placeholder="e.g. Press release reference" />
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
  const canSubmit = form.pharma.trim() && form.startup.trim() && form.summary.trim() && form.stages.length > 0 && form.sourceUrl.trim();

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
        Know about an AI × pharma deal that's missing? Submit the details below — source URL is required. It will be reviewed before being added.
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
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "90vh", overflow: "auto", padding: 32, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Review suggestions ({pending.length})</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8" }}>×</button>
        </div>
        {pending.length === 0 && <p style={{ color: "#94a3b8", fontSize: 14 }}>No pending suggestions.</p>}
        {pending.map(p => (
          <div key={p._id} style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.pharma} × {p.startup}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{p.summary}</div>
            {p.submitterName && <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Submitted by: {p.submitterName}</div>}
            {p.sourceUrl && <div style={{ fontSize: 12, color: "#0891b2", marginBottom: 8, wordBreak: "break-all" }}>{p.sourceUrl}</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onApprove(p._id)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, borderRadius: 6, border: "none", background: "#059669", color: "#fff", cursor: "pointer" }}>Approve</button>
              <button onClick={() => onReject(p._id)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, borderRadius: 6, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryBar({ activeStage, onStageClick, dealsByStage }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {CATEGORIES.map(cat => {
        const count = (dealsByStage[cat.id] || []).length;
        const active = activeStage === cat.id;
        return (
          <button key={cat.id} onClick={() => onStageClick(cat.id)} style={{
            flex: "1 1 0", minWidth: 100, padding: "12px 8px", borderRadius: 8, cursor: "pointer",
            border: `2px solid ${active ? cat.color : "#e2e8f0"}`,
            background: active ? `${cat.color}12` : "#fff",
            transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: active ? cat.color : "#0f172a" }}>{count}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: active ? cat.color : "#64748b", whiteSpace: "pre-line", lineHeight: 1.2, marginTop: 2 }}>{cat.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function EvidenceBadge({ level }) {
  const ev = EVIDENCE_LEVELS.find(e => e.id === level) || EVIDENCE_LEVELS[2];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: `${ev.color}15`, color: ev.color, whiteSpace: "nowrap" }}>
      {ev.icon} {ev.label}
    </span>
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
            {deal.evidence && <EvidenceBadge level={deal.evidence} />}
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
          {deal.archetype && (
            <div style={{ marginTop: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "#f1f5f9", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{deal.archetype}</span>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
            {deal.startupDesc && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>About {deal.startup}</div>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>{deal.startupDesc}</p>
              </div>
            )}
            {deal.detail && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Strategic Shift</div>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>{deal.detail}</p>
              </div>
            )}
          </div>
          {(deal.source || deal.sourceUrl) && (
            <div style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
              {deal.source && <span style={{ fontStyle: "italic" }}>{deal.source}</span>}
              {deal.sourceUrl && (
                <span> · <a href={deal.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0891b2", textDecoration: "none" }}>View source ↗</a></span>
              )}
            </div>
          )}
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

const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "value-desc", label: "Highest value" },
];

function parseDateForSort(dateStr) {
  if (!dateStr) return 0;
  const months = { january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12 };
  const lower = dateStr.toLowerCase();
  let year = 2025;
  const ym = lower.match(/(\d{4})/);
  if (ym) year = parseInt(ym[1]);
  let month = 6;
  for (const [name, num] of Object.entries(months)) {
    if (lower.includes(name)) { month = num; break; }
  }
  return year * 100 + month;
}

function parseValueForSort(valStr) {
  if (!valStr) return 0;
  const m = valStr.match(/\$([0-9,.]+)\s*(B|M|T)/i);
  if (!m) {
    const m2 = valStr.match(/\$([0-9,.]+)/);
    if (m2) return parseFloat(m2[1].replace(/,/g, ""));
    return 0;
  }
  let num = parseFloat(m[1].replace(/,/g, ""));
  const unit = m[2].toUpperCase();
  if (unit === "B") num *= 1000;
  if (unit === "T") num *= 1000000;
  return num;
}

export default function App() {
  const { deals, pending, loaded, addDeal, deleteDeal, resetToSeed, submitSuggestion, approveSuggestion, rejectSuggestion } = useDeals();
  const [activeStage, setActiveStage] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
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
      if (code && code.length > 5) {
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
        (d.detail || "").toLowerCase().includes(q) || (d.archetype || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "newest") result.sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));
    else if (sortBy === "oldest") result.sort((a, b) => parseDateForSort(a.date) - parseDateForSort(b.date));
    else if (sortBy === "value-desc") result.sort((a, b) => parseValueForSort(b.value) - parseValueForSort(a.value));
    return result;
  }, [deals, activeStage, searchTerm, sortBy]);

  const uniquePharma = useMemo(() => new Set(deals.flatMap(d => d.pharma.split(/[\/+]/).map(s => s.trim().replace(/ \+ others/, "").replace(/ others/, "")))).size, [deals]);
  const uniquePartners = useMemo(() => new Set(deals.map(d => d.startup)).size, [deals]);

  const totalValueLabel = useMemo(() => {
    let totalM = 0;
    deals.forEach(d => { totalM += parseValueForSort(d.value); });
    if (totalM >= 1000) return `$${Math.round(totalM / 1000)}B+`;
    return `$${Math.round(totalM)}M+`;
  }, [deals]);

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
                Tracking how big pharma is embedding AI — from molecule creation through enterprise operations. Editorially curated with strategic analysis, open to community contributions.
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
              { n: totalValueLabel, l: "Disclosed deal value" },
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

        <div style={{ marginTop: 12, padding: "12px 16px", background: "#f0fdfa", borderRadius: 8, border: "1px solid #e0f2fe", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
          <strong style={{ color: "#0891b2" }}>Reading the evidence levels:</strong> Deal values shown are maximum potential values including milestones — actual payouts historically run at 10–20% of headline biobucks. No AI-designed drug has yet received regulatory approval. Evidence grades reflect the maturity of each engagement, not a quality judgment.
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "20px 0 16px", flexWrap: "wrap" }}>
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by company, partner, archetype, or keyword..."
            style={{ flex: 1, minWidth: 200, padding: "10px 14px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", color: "#0f172a", background: "#fff" }}
            onFocus={e => e.target.style.borderColor = "#0891b2"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            padding: "10px 14px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 8,
            outline: "none", color: "#0f172a", background: "#fff", cursor: "pointer",
          }}>
            {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
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
            {" "}· Data from public announcements and press releases · Deal values are maximum potential including milestones
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
