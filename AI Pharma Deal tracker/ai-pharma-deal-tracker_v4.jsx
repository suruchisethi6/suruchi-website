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
  "Enterprise transformation", "Data partnership", "AI research agent",
];

// economics: { upfront, milestones, totalPotential, royalties, disclosed, displayValue }
const SEED_DEALS = [
  {
    id: 1, pharma: "Roche / Genentech", startup: "Recursion",
    startupDesc: "Clinical-stage TechBio company operating the Recursion OS — an AI-native platform combining automated biology, large-scale data generation, chemistry, and machine learning. Recursion has partnerships with Roche/Genentech, Sanofi, Bayer and others, and reported that it had reached over $500M in upfront and milestone payments across all partnerships and collaborations after a $30M Roche/Genentech milestone in Q3 2025.",
    dealType: "Collaboration",
    economics: { upfront: 150, milestones: 12000, totalPotential: 12150, royalties: true, disclosed: true, displayValue: "$150M upfront, up to $12B+" },
    date: "December 2021 (active 2026)",
    stages: ["discovery"],
    evidence: "production",
    archetype: "Co-develop molecules",
    summary: "Multi-year AI drug discovery collaboration across neuroscience and oncology, allowing Roche and Genentech to initiate up to 40 programs using the Recursion OS. Recursion received a $150M upfront payment and is eligible for more than $300M per successful program in development, commercialization and net sales milestones, implying more than $12B in potential milestones plus tiered royalties.",
    detail: "This is one of the largest and most strategically important AI drug discovery collaborations announced to date. Roche and Genentech are using Recursion's platform to generate maps of human cellular biology and identify novel targets over a decade-plus horizon. The latest $30M milestone was triggered by Recursion's delivery of a whole-genome microglia map, bringing Roche/Genentech-specific cash paid to roughly $213M according to secondary coverage, while Recursion's total partner upfront and milestone payments exceeded $500M across all collaborations. The strategic lesson: pharma is increasingly outsourcing biological data generation, not just computation, to AI-native platforms.",
    source: "Recursion Q4 2025 earnings; original deal Dec 2021",
    sourceUrl: "https://ir.recursion.com/news-releases/news-release-details/recursion-reports-fourth-quarter-and-full-year-2025-financial",
  },
  {
    id: 2, pharma: "Sanofi", startup: "Earendil Labs",
    startupDesc: "AI-powered biotech company focused on developing next-generation biologics for autoimmune diseases, cancer, and other areas of unmet medical need.",
    dealType: "Collaboration",
    economics: { upfront: null, milestones: 2560, totalPotential: 2560, royalties: false, disclosed: true, displayValue: "Up to $2.56B" },
    date: "January 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Source pipeline",
    summary: "Second major Sanofi–Earendil agreement: a strategic collaboration worth up to $2.56B to develop AI-enabled bispecific antibody candidates for autoimmune and inflammatory diseases.",
    detail: "The significance is not only the headline value; it is Sanofi repeatedly returning to an external AI-native biologics platform as a source of new therapeutic candidates. The first agreement centered on specific bispecific antibody assets, while the second expands the relationship into a broader discovery collaboration across autoimmune and inflammatory disease programs. The strategic signal is that Sanofi appears to be treating Earendil not as a one-off licensing counterparty, but as a repeat biologics-discovery partner.",
    source: "Earendil Labs / PR Newswire announcement and Axios Pro coverage, January 2026",
    sourceUrl: "https://www.fiercebiotech.com/biotech/sanofis-latest-autoimmune-bispecific-pact-ai-biotech-could-reach-25b",
  },
  {
    id: 3, pharma: "Eli Lilly", startup: "Isomorphic Labs",
    startupDesc: "Google DeepMind spinout building an AI-first drug design engine, IsoDDE. Rather than selling software as a standalone tool, Isomorphic partners with pharma companies to co-design drug candidates using its AI platform and drug discovery capabilities. Partnered with Lilly, Novartis, and Johnson & Johnson, and raised a $2.1B Series B in May 2026.",
    dealType: "Partnership",
    economics: { upfront: 45, milestones: 1700, totalPotential: 1745, royalties: false, disclosed: true, displayValue: "$45M up / $1.7B milestones" },
    date: "January 2024",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Multi-target drug discovery collaboration using Isomorphic Labs' AI-first drug design engine to discover small-molecule therapeutics against multiple Lilly-selected targets. One of several major pharma partnerships validating the AI-native co-development model, alongside collaborations with Novartis and Johnson & Johnson.",
    detail: "Isomorphic represents a structural shift from AI-as-tooling to AI-native drug creation. The company is not simply licensing a model; it is collaborating with pharma R&D teams to design molecules against selected targets. The strategic question is whether pharma will increasingly source drug candidates from AI-native discovery companies rather than building every capability internally. With Lilly, Novartis, and Johnson & Johnson all partnered, Isomorphic is one of the clearest signals that big pharma sees AI-native co-development as a credible route to new molecules. The $2.1B Series B is separate from the Lilly partnership economics, but it reinforces investor conviction in this model.",
    source: "Isomorphic Labs Lilly collaboration announcement, January 7, 2024; Series B announcement, May 12, 2026",
    sourceUrl: "https://www.isomorphiclabs.com/partnerships",
  },
  {
    id: 4, pharma: "J&J / AbbVie / Novo Nordisk / Bayer", startup: "Cradle",
    startupDesc: "Cradle builds enterprise-grade AI software for protein engineering, helping scientists design protein sequences optimized for properties such as stability, efficacy, and manufacturability.",
    dealType: "Platform licensing",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "50+ programmes" },
    date: "2025–2026",
    stages: ["discovery", "manufacturing"],
    evidence: "production",
    archetype: "License platform",
    summary: "Cradle's protein-engineering platform is used across 50+ R&D programs and by six of the top 25 global pharma companies, including J&J, AbbVie, Novo Nordisk, and Bayer. Bayer's collaboration applies Cradle's platform to AI-enabled antibody discovery and optimization.",
    detail: "Cradle highlights an underappreciated value pool in AI drug discovery: engineering molecules for developability and manufacturability, not just novelty. Its platform helps scientists design protein sequences optimized for properties such as stability, efficacy, and manufacturability. That matters because better-designed proteins can improve expression, formulation, and downstream development efficiency. The strategic signal is that AI can create value not only by finding new biology, but by making therapeutic molecules easier to build, optimize, and manufacture.",
    source: "Including J&J, AbbVie, Novo Nordisk, and Bayer",
  },
  {
    id: 5, pharma: "GSK", startup: "NOETIK",
    startupDesc: "NOETIK builds AI foundation models trained on spatial biology and multimodal oncology data. Its OCTO-VC virtual-cell models are designed to simulate tumor biology and help researchers understand disease mechanisms, treatment response, and patient heterogeneity in cancer.",
    dealType: "Licensing",
    economics: { upfront: 50, milestones: null, totalPotential: 50, royalties: false, disclosed: true, displayValue: "$50M upfront + fees" },
    date: "January 2026",
    stages: ["discovery", "clinical"],
    evidence: "pilot",
    archetype: "License platform",
    summary: "GSK licensed NOETIK's OCTO-VC spatial-biology foundation models for non-small cell lung cancer and colorectal cancer under a five-year collaboration and licensing agreement, using the models to support oncology research, biomarker discovery, and therapeutic development.",
    detail: "NOETIK represents a shift from licensing software tools to licensing biological foundation models as research infrastructure. GSK's agreement gives it access to disease-specific virtual-cell models and spatial datasets in lung and colorectal cancer, creating a template for how pharma may consume AI models in oncology R&D. The strategic significance is not just model access; it is the combination of spatial biology data, tumor-immune context, and foundation-model infrastructure that could improve biomarker discovery and patient stratification. This remains an R&D-stage deployment until clinical utility is validated prospectively.",
    source: "Business Wire / NOETIK announcement, January 8, 2026",
    sourceUrl: "https://www.genengnews.com/topics/artificial-intelligence/pharma-bets-big-on-ai-platforms-with-flurry-of-new-year-deals/",
  },
  {
    id: 6, pharma: "Eli Lilly", startup: "Tamarind Bio",
    startupDesc: "Tamarind Bio builds infrastructure and workflow software for computational biology, giving scientists access to state-of-the-art molecular AI tools for protein engineering, structure prediction, antibody design, and small-molecule discovery.",
    dealType: "Infrastructure",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "250+ molecular AI tools" },
    date: "2026",
    stages: ["infrastructure"],
    evidence: "production",
    archetype: "Access compute",
    summary: "Tamarind Bio was selected as a technology partner for Lilly TuneLab 2.0, providing the scalable infrastructure and scientific workflows needed to run biomolecular AI models for participating companies in secure, private environments.",
    detail: "The future bottleneck in pharma AI may not be model availability alone; it may be deployment, governance, secure data access, and workflow integration. Tamarind Bio plays this infrastructure role by providing the compute and model-serving layer that lets scientists run molecular AI tools at scale. Lilly's TuneLab 2.0 is strategically important because it gives external biotech companies access to models trained on decades of Lilly research and proprietary data while preserving private, secure environments for participating companies. This is one of the more underweighted categories in pharma AI: the infrastructure that makes models usable inside real scientific workflows.",
    source: "Used by 8 of top 20 pharma companies",
  },
  {
    id: 7, pharma: "CSL + others", startup: "Perceptic",
    startupDesc: "Building an AI operating system that connects data, decisions and workflows across the drug development lifecycle — from asset scouting through clinical data analysis.",
    dealType: "Enterprise AI",
    economics: { upfront: null, milestones: null, totalPotential: 12, royalties: false, disclosed: true, displayValue: "$12M seed (commercial undisclosed)" },
    date: "May 2026",
    stages: ["enterprise"],
    evidence: "production",
    archetype: "Enterprise transformation",
    summary: "Emerged from stealth with $12M in seed funding and reported paid production deployments across top pharmaceutical companies, biotechs, and CROs. Initial use cases include asset scouting, scientific evaluation, and clinical data analysis.",
    detail: "Perceptic reflects a shift from standalone AI tools toward AI operating systems that orchestrate decisions across the pharmaceutical enterprise. Rather than focusing on a single workflow, the platform connects asset scouting, scientific evaluation, and clinical analysis into a shared decision layer. The strategic question is whether the value in pharma AI ultimately accrues to individual models or to the operating systems that integrate them into organizational decision-making.",
    source: "Fortune exclusive, May 26, 2026; CSL named publicly",
    sourceUrl: "https://fortune.com/2026/05/26/exclusive-perceptic-a-startup-automating-drug-discovery-end-to-end-for-big-pharma-emerges-from-stealth-with-12-million-in-seed-funding/",
  },
  {
    id: 8, pharma: "AstraZeneca", startup: "Modella AI",
    startupDesc: "Boston-based biomedical AI company building multimodal foundation models and AI agents for oncology, integrating pathology, clinical, and biomarker data to support AI-driven research and development.",
    dealType: "Acquisition",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "Undisclosed" },
    date: "January 2026",
    stages: ["discovery", "clinical"],
    evidence: "production",
    archetype: "Acquire capability",
    summary: "AstraZeneca acquired Modella AI to bring multimodal foundation models and AI agents into its oncology R&D, clinical development, and biomarker discovery workflows.",
    detail: "This deal signals a shift from partnership to ownership. AstraZeneca had already worked with Modella through a research agreement beginning in July 2025, then moved to acquire the company in January 2026. The strategic question is whether AI capabilities that become central to oncology development are better owned in-house rather than accessed through external partnerships.",
    source: "Announced at JPM26, January 13, 2026",
    sourceUrl: "https://finance.yahoo.com/news/modella-ai-announces-acquisition-astrazeneca-170200809.html",
  },
  {
    id: 9, pharma: "Eli Lilly", startup: "NVIDIA",
    startupDesc: "NVIDIA provides the accelerated computing infrastructure behind LillyPod, including DGX SuperPOD systems and Blackwell Ultra GPUs for high-volume AI training, fine-tuning, and inference across pharmaceutical discovery and operations.",
    dealType: "Infrastructure",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "1,016 Blackwell Ultra GPUs" },
    date: "October 2025",
    stages: ["infrastructure", "discovery", "manufacturing"],
    evidence: "production",
    archetype: "Access compute",
    summary: "Lilly partnered with NVIDIA to build LillyPod, an NVIDIA DGX SuperPOD-based AI factory powered by 1,016 Blackwell Ultra GPUs, designed to accelerate molecule discovery, genomics, personalized medicine, manufacturing, medical imaging, and enterprise AI applications.",
    detail: "Lilly is treating AI infrastructure as a strategic capability rather than a generic IT resource. LillyPod is designed to support the full AI lifecycle — data ingestion, training, fine-tuning, and high-volume inference — across discovery and operations. Compared with Roche's later 3,500+ GPU footprint, LillyPod shows that pharma AI is becoming a compute race, but GPU count alone will not determine advantage; the key question is whether compute translates into better targets, faster optimization, and higher clinical success.",
    source: "Eli Lilly press release, October 2025; NVIDIA LillyPod blog",
    sourceUrl: "https://www.biopharmadive.com/news/lilly-nvidia-ai-drug-discovery-lab/812022/",
  },
  {
    id: 10, pharma: "Roche", startup: "NVIDIA",
    startupDesc: "NVIDIA provides Roche with accelerated computing and AI infrastructure, including GPU systems and software used across molecular AI, diagnostics, digital pathology, and manufacturing workflows.",
    dealType: "Infrastructure",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "3,500+ GPUs (hybrid-cloud)" },
    date: "March 2026",
    stages: ["infrastructure", "discovery"],
    evidence: "production",
    archetype: "Access compute",
    summary: "Roche added 2,176 NVIDIA Blackwell GPUs on-premises across the US and Europe, bringing its combined hybrid-cloud AI infrastructure to more than 3,500 GPUs — the largest announced GPU footprint in pharma. The infrastructure supports drug discovery, diagnostics, digital pathology, and manufacturing.",
    detail: "Roche's AI infrastructure investment builds on its NVIDIA collaboration that began in 2023 and now represents one of the most ambitious compute deployments in pharma. The infrastructure spans diagnostics, therapeutics, digital pathology, and manufacturing. Combined with Roche's Recursion partnership and internal AI capabilities under Aviv Regev's leadership, Roche is assembling a broad AI drug-development stack across data generation, modeling, and compute. The strategic question is whether GPU scale translates into measurable R&D output.",
    source: "Roche press release, March 16, 2026",
    sourceUrl: "https://www.roche.com/media/releases/med-cor-2026-03-16",
  },
  {
    id: 11, pharma: "Eli Lilly", startup: "Insilico Medicine",
    startupDesc: "Insilico Medicine is an AI drug discovery company whose Pharma.AI platform spans target identification, molecule generation, and clinical development support. It is one of the more advanced AI-native drug developers, with internally generated preclinical and clinical-stage programs.",
    dealType: "Collaboration",
    economics: { upfront: 115, milestones: 2635, totalPotential: 2750, royalties: true, disclosed: true, displayValue: "$115M upfront, up to $2.75B + royalties" },
    date: "March 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Source pipeline",
    summary: "Exclusive worldwide license to a portfolio of AI-designed preclinical oral therapeutics, alongside collaborative R&D on new Lilly-selected targets. The agreement marks the third Lilly–Insilico relationship in three years, escalating from software licensing to collaboration and now a broader asset-and-platform partnership.",
    detail: "The headline value is large, but the more important story is escalation. Lilly first licensed Insilico's AI software in 2023, then entered a research collaboration in 2025, and now has a broader license and co-development agreement worth up to $2.75B. This pattern — tooling, then collaboration, then access to AI-designed assets — may become a template for how pharma relationships with AI-native drug developers mature. The strategic question is whether AI-native drug creation can become a viable alternative source of clinical-quality candidates, rather than simply a productivity layer for traditional R&D.",
    source: "Fierce Biotech coverage of Lilly–Insilico expanded partnership, March 2026",
    sourceUrl: "https://www.cnbc.com/2026/03/29/eli-lilly-reaches-deal-to-bring-ai-developed-drugs-to-global-market.html",
  },
  {
    id: 12, pharma: "Merck / MSD", startup: "Google Cloud",
    startupDesc: "Google Cloud provides the Gemini Enterprise agent platform and cloud infrastructure used to help Merck digitize data, connect enterprise workflows, and apply agentic AI across pharmaceutical operations.",
    dealType: "Enterprise AI",
    economics: { upfront: null, milestones: null, totalPotential: 1000, royalties: false, disclosed: true, displayValue: "Up to $1B" },
    date: "April 2026",
    stages: ["enterprise", "manufacturing"],
    evidence: "pilot",
    archetype: "Enterprise transformation",
    summary: "Multi-year enterprise AI partnership using Google Cloud's Gemini Enterprise to build an AI-enabled digital backbone across Merck's R&D, manufacturing, commercial, and corporate functions, with the goal of boosting productivity for Merck's 75,000 employees worldwide.",
    detail: "The scale is the point: this is not a narrow departmental experiment. Merck is treating agentic AI as part of its enterprise digital backbone, spanning R&D, manufacturing, commercial, and corporate functions. The governance implications are significant: as AI agents move closer to regulated pharmaceutical workflows, companies will need clear controls around data access, validation, human oversight, and accountability. Whether the reported $1B ceiling translates into true enterprise transformation or a broader cloud-and-AI modernization program is the key question to watch.",
    source: "Announced at Google Cloud Next, April 22, 2026",
    sourceUrl: "https://www.merck.com/news/merck-and-google-cloud-partner-to-accelerate-agentic-ai-enterprise-transformation/",
  },
  {
    id: 13, pharma: "Novo Nordisk", startup: "OpenAI",
    startupDesc: "OpenAI provides frontier AI models and enterprise tools that Novo Nordisk plans to apply across drug discovery, operations, and workforce productivity. The partnership is structured with strict data governance, data protection, and human oversight.",
    dealType: "Partnership",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "Undisclosed" },
    date: "April 2026",
    stages: ["enterprise", "discovery", "manufacturing"],
    evidence: "pilot",
    archetype: "Enterprise transformation",
    summary: "Strategic partnership to integrate OpenAI's advanced AI capabilities across Novo Nordisk's global operations, from drug discovery to commercial operations, with applications in manufacturing, supply chain, business development, legal, and regulatory workflows. Full integration is targeted by the end of 2026.",
    detail: "The interesting dimension is not the OpenAI partnership in isolation, but Novo Nordisk's broader multi-vendor AI strategy. Novo already has AI initiatives with Microsoft/Azure and NVIDIA, while this partnership adds OpenAI's generative and agentic capabilities across discovery, manufacturing, supply chain, and enterprise functions. The strategic signal is that large pharma companies are unlikely to rely on a single AI stack. Instead, they are combining cloud infrastructure, domain-specific analytics, and frontier model platforms to move faster while hedging against vendor lock-in. Because the partnership is still in rollout, the key question is whether Novo can convert broad enterprise access into measurable improvements in R&D productivity, manufacturing efficiency, and decision speed.",
    source: "Builds on existing Microsoft Azure relationship; full integration by end of 2026",
    sourceUrl: "https://www.biospace.com/press-releases/novo-nordisk-and-openai-partner-to-transform-how-medicines-are-discovered-and-delivered",
  },
  {
    id: 14, pharma: "Daiichi Sankyo", startup: "Imagene AI",
    startupDesc: "Imagene AI is a precision oncology AI company whose OI Suite uses the CanvOI foundation model and a proprietary real-world multimodal data lake of more than 3.5 million tissue samples, alongside omics and clinical outcomes data, to support biomarker discovery, response prediction, patient stratification, and evidence-based trial design.",
    dealType: "Collaboration",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "Undisclosed" },
    date: "April 2026",
    stages: ["clinical"],
    evidence: "research",
    archetype: "Data partnership",
    summary: "Collaboration to advance multimodal biomarker discovery and response prediction in oncology, using Imagene's OI Suite across H&E and IHC pathology images, molecular profiles, and longitudinal clinical outcomes to support select ADC development programs.",
    detail: "Imagene's platform brings multimodal AI into oncology clinical development by linking pathology images, molecular profiles, and longitudinal outcomes data. For Daiichi Sankyo, the strategic fit is especially relevant because ADC development increasingly depends on better biomarker discovery, target-expression assessment, patient stratification, and companion diagnostic strategy. This collaboration is best understood as a clinical-intelligence and data-partnership play: promising for translational research and trial design, but still research-stage until response models are validated in prospective clinical settings.",
    source: "Multimodal AI for precision oncology",
  },
  {
    id: 15, pharma: "AstraZeneca", startup: "OWKIN",
    startupDesc: "French AI biotech developing an agentic AI Scientist platform designed to support hypothesis generation, experiment design, and scientific data analysis within pharmaceutical research workflows.",
    dealType: "Licensing",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "3-year deal" },
    date: "May 2026",
    stages: ["discovery"],
    evidence: "pilot",
    archetype: "AI research agent",
    summary: "3-year licensing agreement giving AstraZeneca access to Owkin's AI Scientist platform for hypothesis generation, experiment planning, and research decision support.",
    detail: "AstraZeneca's agreement with Owkin reflects growing interest in agentic AI systems that move beyond information retrieval and begin participating in the scientific workflow itself. The platform is designed to support hypothesis generation, experiment planning, and data analysis within research teams. The strategic question is whether AI Scientist platforms can materially accelerate scientific discovery and improve research productivity, rather than simply automate existing knowledge work. Because these systems remain early, real-world scientific outcomes will matter more than model capabilities alone.",
    source: "Owkin / AstraZeneca announcement, May 2026",
    sourceUrl: "https://www.owkin.com/newsfeed/owkin-to-build-ai-agents-as-part-of-a-multi-year-k-pro-license-agreement-with-astrazeneca",
  },
  {
    id: 16, pharma: "Bristol Myers Squibb", startup: "Anthropic",
    startupDesc: "Anthropic develops the Claude family of frontier AI models. At BMS, Claude is being deployed as an enterprise intelligence platform connected to internal systems, workflows, and institutional knowledge, with agentic capabilities supporting research, operational, and manufacturing use cases.",
    dealType: "Enterprise AI",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "Undisclosed" },
    date: "May 2026",
    stages: ["enterprise", "discovery", "clinical", "manufacturing"],
    evidence: "production",
    archetype: "Enterprise transformation",
    summary: "Claude deployed as a shared intelligence platform across 30,000+ BMS employees, spanning discovery, clinical development, regulatory, manufacturing, commercial, and corporate operations, with agentic capabilities embedded into workflows.",
    detail: "This goes beyond chatbot deployment. BMS is deploying Claude Code within engineering and data science teams, embedding AI agents into R&D and operational workflows, and connecting Claude to institutional knowledge distributed across decades of internal systems. The manufacturing dimension is particularly significant: applying AI to root-cause investigations, CAPA processes, and manufacturing knowledge management brings AI into GxP-regulated environments, creating a fundamentally different risk and value profile than enterprise productivity tools. Few AI deployments in pharma have been announced at comparable scale. By positioning Claude as a shared intelligence layer across more than 30,000 employees, BMS is treating AI as enterprise infrastructure rather than a departmental tool.",
    source: "BMS press release, May 20, 2026",
    sourceUrl: "https://news.bms.com/news/details/2026/Bristol-Myers-Squibb-Announces-Strategic-Agreement-with-Anthropic-to-Position-Claude-Enterprise-as-the-Shared-Intelligence-Platform-Across-Its-Global-Operations/default.aspx",
  },
  {
    id: 17, pharma: "Incyte", startup: "Edison Scientific",
    startupDesc: "Edison Scientific is building an AI platform for scientific R&D. Its Kosmos platform is positioned as a collaborative AI scientist that works with R&D teams to support research decisions and workflows, using proprietary data and iterative researcher feedback.",
    dealType: "Collaboration",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "Undisclosed" },
    date: "May 2026",
    stages: ["discovery"],
    evidence: "pilot",
    archetype: "AI research agent",
    summary: "Strategic collaboration to employ Edison Scientific's AI scientist platform, Kosmos, across Incyte's discovery and development work — another signal that agentic AI systems are entering pharma R&D.",
    detail: "Incyte's collaboration with Edison Scientific is part of the emerging 'AI scientist' category in pharma R&D. Rather than acting only as a search or analytics tool, Kosmos is designed to support iterative scientific work across literature review, data analysis, hypothesis generation, and research decision-making. The strategic question is whether agentic AI systems can produce validated scientific insights faster and more consistently than existing R&D workflows. For now, this should be treated as an early-stage R&D deployment: promising, but not yet evidence that autonomous AI scientists can reliably improve downstream drug-development outcomes.",
    source: "Incyte and Edison Scientific announcement, Business Wire, May 19, 2026",
  },
  {
    id: 18, pharma: "Sanofi", startup: "CytoReason",
    startupDesc: "CytoReason builds AI-powered computational disease models that help biopharma R&D teams analyze molecular and clinical data, generate mechanistic insights into disease biology and drug effects, and support decisions across drug development. Its models are built on an evidence graph trained on hundreds of thousands of data points across genes, pathways, cells, clinical features, and patient subpopulations.",
    dealType: "Partnership",
    economics: { upfront: null, milestones: null, totalPotential: 16, royalties: false, disclosed: true, displayValue: "Up to $16M" },
    date: "January 2026",
    stages: ["discovery", "clinical"],
    evidence: "production",
    archetype: "License platform",
    summary: "Sanofi expanded its CytoReason collaboration for the third time through a multi-year agreement valued at up to $16M, deepening its use of AI-powered computational disease models for drug discovery and R&D decision support.",
    detail: "The repeated expansion is the signal. Sanofi is not just announcing a one-off AI pilot; it is continuing to broaden a relationship that began in 2021 and has expanded across multiple phases. That suggests CytoReason's computational disease models are useful enough inside Sanofi's R&D workflows to justify renewed commitment. The strategic lesson is that in pharma AI, renewals and expansions may be a stronger validation signal than headline-grabbing first-time partnerships.",
    source: "CytoReason / PR Newswire, Jan. 9, 2026 — third expansion of Sanofi collaboration",
  },
  {
    id: 19, pharma: "Pfizer", startup: "Chai Discovery",
    startupDesc: "AI drug discovery company building generative models that predict and reprogram molecular interactions, enabling scientists to design new biomolecules from scratch. Developer of Chai-3, an AI platform focused on antibody design, therapeutic binding, multispecifics, and difficult-to-drug targets.",
    dealType: "Licensing",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "Undisclosed" },
    date: "June 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "License platform",
    summary: "Licensing agreement giving Pfizer access to Chai-3 and a custom AI model trained on Pfizer's proprietary data and workflows to accelerate biologics discovery.",
    detail: "Pfizer is not simply licensing an AI model. The agreement combines access to Chai-3 with a custom version tailored to Pfizer's proprietary data and internal workflows. This reflects an emerging pattern in pharma AI: foundation models provide the base capability, while competitive advantage increasingly comes from fine-tuning those models on unique internal datasets. The value is not just access to the platform, but the integration of decades of proprietary discovery knowledge into the model itself.",
    source: "Early access to Chai-3 plus a custom model tailored to Pfizer's proprietary data and workflows",
  },
  {
    id: 20, pharma: "Pfizer", startup: "Boltz Bio",
    startupDesc: "Boltz is a public benefit corporation building biomolecular AI foundation models and generative design workflows for preclinical discovery. Its collaboration with Pfizer combines open-source model development with proprietary pharma data and custom workflows.",
    dealType: "Collaboration",
    economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "Multi-year" },
    date: "January 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Multi-year collaboration in which Boltz will refine its biomolecular foundation models using Pfizer's historical data to create exclusive models for structure prediction, small-molecule affinity, and biologics design.",
    detail: "Boltz shows the open-source foundation model plus proprietary fine-tuning pattern entering molecular biology. The base models may be broadly available, but the differentiated layer comes from Pfizer's historical data and target-specific workflows. The strategic lesson is similar to enterprise AI: competitive advantage comes less from generic model access and more from proprietary data, integration, and deployment into real discovery programs.",
    source: "Boltz raised $28M seed from a16z, Amplify, Zetta",
  },
  {
    id: 21, pharma: "Merck / MSD", startup: "Protillion Biosciences",
    startupDesc: "Lab-in-the-loop AI drug design company. Its Prot-MaP platform experimentally measures millions of protein variants in parallel, generating large-scale datasets that improve the training and validation of protein-design AI models and enable quantitative analysis of complex protein functions.",
    dealType: "Collaboration",
    economics: { upfront: null, milestones: null, totalPotential: 510, royalties: false, disclosed: true, displayValue: "Up to $510M" },
    date: "June 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Multi-target discovery collaboration and license agreement worth up to $510M, combining Protillion's Prot-MaP platform with Merck's drug discovery expertise to design optimised biologics.",
    detail: "Protillion represents a growing category of 'lab-in-the-loop' AI companies that focus on generating proprietary experimental data rather than solely building models. Prot-MaP enables quantitative measurement of millions of protein variants in parallel, creating large-scale datasets that can improve protein-design AI systems and accelerate biologics discovery. The strategic lesson is that high-quality experimental data may become as important as algorithms themselves. This partnership also adds to Merck's expanding portfolio of AI collaborations across drug discovery, platform technologies, and enterprise transformation, suggesting a deliberate AI strategy rather than isolated experimentation.",
    source: "Protillion Biosciences and Merck announcement, June 16, 2026",
    sourceUrl: "https://www.businesswire.com/news/home/20260616813644/en/Protillion-Biosciences-and-Merck-Announce-Multi-Target-Discovery-Collaboration-and-License-Agreement",
  },
  {
    id: 22, pharma: "Boehringer Ingelheim", startup: "Variant Bio",
    startupDesc: "Variant Bio is a genomics-driven AI drug discovery company. Its Inference platform integrates proprietary genomic, deep phenotyping, and multi-omic data from globally diverse populations to discover and validate novel drug targets.",
    dealType: "Collaboration",
    economics: { upfront: null, milestones: null, totalPotential: 120, royalties: false, disclosed: true, displayValue: "$120M+" },
    date: "January 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Multi-year target discovery and license agreement worth more than $120M, applying Variant Bio's AI-powered Inference platform to discover and validate novel targets for cardiorenal and kidney disease.",
    detail: "The partnership sits at the intersection of AI-driven target discovery and genetically informed drug development. Variant Bio's Inference platform integrates proprietary genomic, deep phenotyping, and multi-omic data from globally diverse populations to identify and validate new targets. The strategic signal is that pharma companies are increasingly looking for AI partners with differentiated biological datasets, not just prediction models.",
    source: "Variant Bio press release, January 6, 2026",
    sourceUrl: "https://www.fiercebiotech.com/biotech/boehringer-continues-kidney-disease-dealmaking-run-120m-variant-bio-pact",
  },
  {
    id: 23, pharma: "Incyte", startup: "Genesis Therapeutics",
    startupDesc: "Genesis Molecular AI builds generative and predictive foundation models for molecular design. Its GEMS platform integrates AI and physics to generate and optimize drug molecules, including models for protein-ligand structure and property prediction.",
    dealType: "Collaboration",
    economics: { upfront: 120, milestones: 880, totalPotential: 1000, royalties: false, disclosed: true, displayValue: "$120M upfront; $1B+ potential" },
    date: "May 2026",
    stages: ["discovery"],
    evidence: "research",
    archetype: "Co-develop molecules",
    summary: "Expanded molecular AI collaboration and license agreement adding at least five new Incyte-selected targets, with Incyte retaining exclusive rights to collaboration-derived products and securely sharing proprietary experimental data to train Genesis's GEMS platform.",
    detail: "This expansion moves the relationship beyond platform access into a deeper data-and-model collaboration. Incyte is contributing proprietary experimental data to train Genesis's next-generation GEMS platform, while Genesis applies its molecular AI models across a broader set of Incyte-selected targets. The strategic signal is that pharma companies are increasingly using their internal experimental datasets as a differentiating asset in AI partnerships — not just licensing generic models, but helping create partner-specific model capabilities. The deal also illustrates how Incyte is building an AI portfolio across both molecular design and agentic R&D workflows.",
    source: "Incyte and Genesis Molecular AI announcement, Business Wire, May 20, 2026",
    sourceUrl: "https://www.genesis.ml/news/incyte-and-genesis-molecular-ai-expand-collaboration",
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

const DEALS_KEY = "ai-pharma-deals-v5";
const PENDING_KEY = "ai-pharma-pending-v5";
const ADMIN_KEY = "ai-pharma-admin-v5";

/* ── Economics helpers ── */
function getUpfront(deal) {
  return deal.economics?.upfront ?? null;
}
function getTotalPotential(deal) {
  return deal.economics?.totalPotential ?? null;
}
function isDisclosed(deal) {
  return deal.economics?.disclosed ?? false;
}
function fmtM(val) {
  if (val == null) return null;
  if (val >= 1000) return `$${+(val / 1000).toFixed(1)}B`;
  return `$${Math.round(val)}M`;
}

function parseValueForSort(deal) {
  // Sort on upfront (committed), fall back to totalPotential, then 0
  const up = getUpfront(deal);
  if (up != null) return up;
  const tp = getTotalPotential(deal);
  if (tp != null) return tp;
  return 0;
}

/* ── Date parsing ── */
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

/* ── Pharma name normalizer ── */
function normalizePharmaNames(pharmaStr) {
  return pharmaStr.split(/[\/+]/).map(s => s.trim().replace(/ \+ others/, "").replace(/ others/, "")).filter(Boolean);
}

/* ── Data hook ── */
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

/* ── Form ── */
const EMPTY_FORM = {
  pharma: "", startup: "", startupDesc: "", dealType: "Collaboration",
  economics: { upfront: null, milestones: null, totalPotential: null, royalties: false, disclosed: false, displayValue: "" },
  date: "", stages: [], summary: "", detail: "", source: "", sourceUrl: "", submitterName: "",
  evidence: "research", archetype: "",
};

function DealFormFields({ form, set, toggleStage, isSubmission }) {
  const inputStyle = {
    width: "100%", padding: "10px 12px", fontSize: 13, border: "1.5px solid #e2e8f0",
    borderRadius: 8, outline: "none", color: "#0f172a", background: "#fff", fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4, display: "block" };

  const setEcon = (k, v) => set("economics", { ...form.economics, [k]: v });

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
          <label style={labelStyle}>Date</label>
          <input style={inputStyle} value={form.date} onChange={e => set("date", e.target.value)} placeholder="e.g. June 2026" />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={{ ...labelStyle, marginBottom: 8 }}>Deal economics</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ ...labelStyle, fontSize: 11, color: "#64748b" }}>Upfront ($M)</label>
            <input style={inputStyle} type="number" value={form.economics?.upfront ?? ""} onChange={e => setEcon("upfront", e.target.value ? Number(e.target.value) : null)} placeholder="e.g. 115" />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: 11, color: "#64748b" }}>Milestones ($M)</label>
            <input style={inputStyle} type="number" value={form.economics?.milestones ?? ""} onChange={e => setEcon("milestones", e.target.value ? Number(e.target.value) : null)} placeholder="e.g. 2635" />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: 11, color: "#64748b" }}>Total potential ($M)</label>
            <input style={inputStyle} type="number" value={form.economics?.totalPotential ?? ""} onChange={e => setEcon("totalPotential", e.target.value ? Number(e.target.value) : null)} placeholder="e.g. 2750" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, alignItems: "center" }}>
          <label style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
            <input type="checkbox" checked={form.economics?.royalties ?? false} onChange={e => setEcon("royalties", e.target.checked)} /> Royalties
          </label>
          <label style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
            <input type="checkbox" checked={form.economics?.disclosed ?? false} onChange={e => setEcon("disclosed", e.target.checked)} /> Value disclosed
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={{ ...labelStyle, fontSize: 11, color: "#64748b" }}>Display value (fallback label)</label>
          <input style={inputStyle} value={form.economics?.displayValue ?? ""} onChange={e => setEcon("displayValue", e.target.value)} placeholder="e.g. $115M upfront, up to $2.75B + royalties" />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Source URL</label>
        <input style={inputStyle} value={form.sourceUrl || ""} onChange={e => set("sourceUrl", e.target.value)} placeholder="https://..." />
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

/* ── Economics display for deal cards ── */
function EconomicsDisplay({ economics }) {
  if (!economics) return null;
  const { upfront, milestones, totalPotential, royalties, disclosed, displayValue } = economics;

  if (!disclosed) {
    return (
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>{displayValue || "Undisclosed"}</div>
      </div>
    );
  }

  const upfrontStr = fmtM(upfront);
  const totalStr = fmtM(totalPotential);

  return (
    <div style={{ textAlign: "right", minWidth: 90 }}>
      {upfrontStr ? (
        <>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{upfrontStr}</div>
          <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>committed</div>
          {totalStr && totalStr !== upfrontStr && (
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{totalStr} potential</div>
          )}
        </>
      ) : totalStr ? (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{totalStr}</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>potential</div>
        </>
      ) : (
        <div style={{ fontSize: 12, color: "#64748b" }}>{displayValue}</div>
      )}
      {royalties && <div style={{ fontSize: 10, color: "#7c3aed", fontWeight: 600, marginTop: 1 }}>+ royalties</div>}
    </div>
  );
}

/* ── Clickable company name ── */
function CompanyLink({ name, onClick, style: extraStyle }) {
  return (
    <span
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        cursor: "pointer", borderBottom: "1px dashed #0891b2",
        transition: "color 0.15s",
        ...extraStyle,
      }}
      onMouseEnter={e => e.target.style.color = "#0891b2"}
      onMouseLeave={e => e.target.style.color = extraStyle?.color || "#0f172a"}
    >{name}</span>
  );
}

function DealRow({ deal, isExpanded, onToggle, onDelete, isAdmin, onPharmaClick, onPartnerClick }) {
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
          <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>
            <CompanyLink name={deal.pharma} onClick={() => onPharmaClick(deal.pharma)} style={{ fontWeight: 600, color: "#0f172a" }} />
            {" × "}
            <CompanyLink name={deal.startup} onClick={() => onPartnerClick(deal.startup)} style={{ fontWeight: 600, color: "#0f172a" }} />
          </div>
          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{deal.summary}</div>
        </div>
        <EconomicsDisplay economics={deal.economics} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {deal.stages.map(s => {
              const cat = CATEGORIES.find(c => c.id === s);
              return cat ? <span key={s} style={{ fontSize: 10, padding: "2px 6px", background: `${cat.color}15`, color: cat.color, borderRadius: 3, fontWeight: 600 }}>{cat.short}</span> : null;
            })}
          </div>
          <div style={{ fontSize: 18, color: "#94a3b8", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</div>
        </div>
      </div>
      {isExpanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #e0f2fe" }}>
          {deal.archetype && (
            <div style={{ marginTop: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "#f1f5f9", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{deal.archetype}</span>
            </div>
          )}
          {/* Structured economics detail in expanded view */}
          {deal.economics?.disclosed && (deal.economics.upfront != null || deal.economics.milestones != null) && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", display: "flex", gap: 24, flexWrap: "wrap" }}>
              {deal.economics.upfront != null && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Upfront</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{fmtM(deal.economics.upfront)}</div>
                </div>
              )}
              {deal.economics.milestones != null && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Milestones</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#475569" }}>{fmtM(deal.economics.milestones)}</div>
                </div>
              )}
              {deal.economics.totalPotential != null && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total potential</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#475569" }}>{fmtM(deal.economics.totalPotential)}</div>
                </div>
              )}
              {deal.economics.royalties && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", background: "#7c3aed12", padding: "4px 10px", borderRadius: 4 }}>+ Royalties</span>
                </div>
              )}
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

/* ── Company Profile Components ── */

function ProfileBackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
      fontSize: 13, fontWeight: 600, borderRadius: 8, border: "1.5px solid #e2e8f0",
      background: "#fff", color: "#475569", cursor: "pointer", marginBottom: 20,
    }}>
      ← Back to all deals
    </button>
  );
}

function MiniDealCard({ deal, onPharmaClick, onPartnerClick }) {
  const typeColor = DEAL_TYPE_COLORS[deal.dealType] || "#6b7280";
  return (
    <div style={{ padding: "14px 16px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: typeColor, background: `${typeColor}12`, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>{deal.dealType}</span>
        {deal.evidence && <EvidenceBadge level={deal.evidence} />}
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{deal.date}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>
        <CompanyLink name={deal.pharma} onClick={() => onPharmaClick(deal.pharma)} style={{ fontWeight: 600, color: "#0f172a" }} />
        {" × "}
        <CompanyLink name={deal.startup} onClick={() => onPartnerClick(deal.startup)} style={{ fontWeight: 600, color: "#0f172a" }} />
      </div>
      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4, marginBottom: 6 }}>{deal.summary}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {deal.stages.map(s => {
            const cat = CATEGORIES.find(c => c.id === s);
            return cat ? <span key={s} style={{ fontSize: 9, padding: "2px 5px", background: `${cat.color}15`, color: cat.color, borderRadius: 3, fontWeight: 600 }}>{cat.short}</span> : null;
          })}
        </div>
        <EconomicsDisplay economics={deal.economics} />
      </div>
    </div>
  );
}

function StatBox({ label, value, sub }) {
  return (
    <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", flex: "1 1 120px", minWidth: 100 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ValueChainHeatmap({ deals }) {
  const counts = {};
  CATEGORIES.forEach(c => { counts[c.id] = 0; });
  deals.forEach(d => d.stages.forEach(s => { if (counts[s] !== undefined) counts[s]++; }));
  const max = Math.max(1, ...Object.values(counts));

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Value chain focus</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => {
          const c = counts[cat.id];
          const intensity = c / max;
          return (
            <div key={cat.id} style={{
              flex: "1 1 0", minWidth: 70, padding: "10px 6px", borderRadius: 6, textAlign: "center",
              background: `${cat.color}${Math.round(10 + intensity * 30).toString(16).padStart(2, "0")}`,
              border: `1.5px solid ${cat.color}${Math.round(20 + intensity * 40).toString(16).padStart(2, "0")}`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: cat.color }}>{c}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: cat.color, opacity: 0.8, lineHeight: 1.1 }}>{cat.short}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ArchetypeBreakdown({ deals }) {
  const counts = {};
  deals.forEach(d => {
    if (d.archetype) counts[d.archetype] = (counts[d.archetype] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;
  const max = sorted[0][1];

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Engagement archetypes</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sorted.map(([arch, count]) => (
          <div key={arch} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, fontSize: 12, color: "#475569", fontWeight: 500 }}>{arch}</div>
            <div style={{ width: 100, height: 6, background: "#e2e8f0", borderRadius: 3 }}>
              <div style={{ width: `${(count / max) * 100}%`, height: 6, background: "#0891b2", borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", width: 20, textAlign: "right" }}>{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidenceDistribution({ deals }) {
  const counts = {};
  EVIDENCE_LEVELS.forEach(e => { counts[e.id] = 0; });
  deals.forEach(d => { if (d.evidence && counts[d.evidence] !== undefined) counts[d.evidence]++; });

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Evidence maturity</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {EVIDENCE_LEVELS.map(ev => (
          <div key={ev.id} style={{
            padding: "8px 12px", borderRadius: 6, background: `${ev.color}10`, border: `1px solid ${ev.color}25`,
            textAlign: "center", flex: "1 1 0", minWidth: 60,
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: ev.color }}>{counts[ev.id]}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: ev.color }}>{ev.icon} {ev.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PharmaProfile({ pharmaName, deals, onBack, onPharmaClick, onPartnerClick }) {
  const pharmaDeals = useMemo(() => {
    return deals.filter(d => d.pharma === pharmaName || normalizePharmaNames(d.pharma).some(n => n === pharmaName || pharmaName.includes(n) || n.includes(pharmaName)));
  }, [pharmaName, deals]);

  const sorted = useMemo(() => [...pharmaDeals].sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date)), [pharmaDeals]);

  const stats = useMemo(() => {
    let totalUpfront = 0, totalPotential = 0;
    pharmaDeals.forEach(d => { totalUpfront += getUpfront(d) || 0; totalPotential += getTotalPotential(d) || 0; });
    const partners = new Set(pharmaDeals.map(d => d.startup));
    return { totalUpfront, totalPotential, dealCount: pharmaDeals.length, partners: partners.size, partnerNames: [...partners] };
  }, [pharmaDeals]);

  return (
    <div>
      <ProfileBackButton onClick={onBack} />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#0891b2", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Pharma Company Profile</div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{pharmaName}</h2>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <StatBox label="Deals tracked" value={stats.dealCount} />
        <StatBox label="Total committed" value={stats.totalUpfront > 0 ? fmtM(stats.totalUpfront) : "—"} />
        <StatBox label="Total potential" value={stats.totalPotential > 0 ? fmtM(stats.totalPotential) : "—"} />
        <StatBox label="AI partners" value={stats.partners} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <ValueChainHeatmap deals={pharmaDeals} />
        <ArchetypeBreakdown deals={pharmaDeals} />
      </div>

      <EvidenceDistribution deals={pharmaDeals} />

      {stats.partnerNames.length > 0 && (
        <div style={{ marginTop: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 8 }}>AI partners</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {stats.partnerNames.map(p => (
              <span key={p} onClick={() => onPartnerClick(p)} style={{
                fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                background: "#f0fdfa", color: "#0891b2", border: "1px solid #cffafe",
              }}>{p}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 10 }}>All deals ({sorted.length})</div>
        {sorted.map(d => <MiniDealCard key={d.id} deal={d} onPharmaClick={onPharmaClick} onPartnerClick={onPartnerClick} />)}
      </div>
    </div>
  );
}

function PartnerProfile({ partnerName, deals, onBack, onPharmaClick, onPartnerClick }) {
  const partnerDeals = useMemo(() => deals.filter(d => d.startup === partnerName), [partnerName, deals]);

  const sorted = useMemo(() => [...partnerDeals].sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date)), [partnerDeals]);

  const stats = useMemo(() => {
    let totalUpfront = 0, totalPotential = 0;
    partnerDeals.forEach(d => { totalUpfront += getUpfront(d) || 0; totalPotential += getTotalPotential(d) || 0; });
    const pharmas = new Set(partnerDeals.flatMap(d => normalizePharmaNames(d.pharma)));
    return { totalUpfront, totalPotential, dealCount: partnerDeals.length, pharmaCount: pharmas.size, pharmaNames: [...pharmas] };
  }, [partnerDeals]);

  return (
    <div>
      <ProfileBackButton onClick={onBack} />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>AI Partner Profile</div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{partnerName}</h2>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <StatBox label="Deals tracked" value={stats.dealCount} />
        <StatBox label="Total committed" value={stats.totalUpfront > 0 ? fmtM(stats.totalUpfront) : "—"} />
        <StatBox label="Total potential" value={stats.totalPotential > 0 ? fmtM(stats.totalPotential) : "—"} />
        <StatBox label="Pharma partners" value={stats.pharmaCount} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <ValueChainHeatmap deals={partnerDeals} />
        <ArchetypeBreakdown deals={partnerDeals} />
      </div>

      {stats.pharmaNames.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Pharma partners</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {stats.pharmaNames.map(p => (
              <span key={p} onClick={() => onPharmaClick(p)} style={{
                fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0",
              }}>{p}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 10 }}>All deals ({sorted.length})</div>
        {sorted.map(d => <MiniDealCard key={d.id} deal={d} onPharmaClick={onPharmaClick} onPartnerClick={onPartnerClick} />)}
      </div>
    </div>
  );
}

/* ── Sort options ── */
const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "value-desc", label: "Highest value (committed)" },
];

/* ── Main App ── */
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

  // View mode: "list" | { type: "pharma", name } | { type: "partner", name }
  const [viewMode, setViewMode] = useState("list");

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
    else if (sortBy === "value-desc") result.sort((a, b) => parseValueForSort(b) - parseValueForSort(a));
    return result;
  }, [deals, activeStage, searchTerm, sortBy]);

  const uniquePharma = useMemo(() => new Set(deals.flatMap(d => normalizePharmaNames(d.pharma))).size, [deals]);
  const uniquePartners = useMemo(() => new Set(deals.map(d => d.startup)).size, [deals]);

  const { totalCommittedLabel, totalPotentialLabel } = useMemo(() => {
    let committed = 0, potential = 0;
    deals.forEach(d => { committed += getUpfront(d) || 0; potential += getTotalPotential(d) || 0; });
    return {
      totalCommittedLabel: committed >= 1000 ? `$${+(committed / 1000).toFixed(1)}B+` : `$${Math.round(committed)}M+`,
      totalPotentialLabel: potential >= 1000 ? `$${+(potential / 1000).toFixed(1)}B+` : `$${Math.round(potential)}M+`,
    };
  }, [deals]);

  const navigateToPharma = useCallback((name) => { setViewMode({ type: "pharma", name }); window.scrollTo(0, 0); }, []);
  const navigateToPartner = useCallback((name) => { setViewMode({ type: "partner", name }); window.scrollTo(0, 0); }, []);
  const navigateToList = useCallback(() => { setViewMode("list"); }, []);

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
              <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, cursor: viewMode !== "list" ? "pointer" : "default" }}
                onClick={() => viewMode !== "list" && navigateToList()}>
                Deal & Partnership Tracker
              </h1>
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
              { n: totalCommittedLabel, l: "Total committed" },
              { n: totalPotentialLabel, l: "Total potential" },
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

        {/* Profile views */}
        {viewMode !== "list" && viewMode.type === "pharma" && (
          <PharmaProfile pharmaName={viewMode.name} deals={deals} onBack={navigateToList} onPharmaClick={navigateToPharma} onPartnerClick={navigateToPartner} />
        )}
        {viewMode !== "list" && viewMode.type === "partner" && (
          <PartnerProfile partnerName={viewMode.name} deals={deals} onBack={navigateToList} onPharmaClick={navigateToPharma} onPartnerClick={navigateToPartner} />
        )}

        {/* Main list view */}
        {viewMode === "list" && (
          <>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Where AI Creates Value</h2>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Click to filter by area</span>
              </div>
              <CategoryBar activeStage={activeStage} onStageClick={(id) => setActiveStage(activeStage === id ? null : id)} dealsByStage={dealsByStage} />
            </div>

            <div style={{ marginTop: 12, padding: "12px 16px", background: "#f0fdfa", borderRadius: 8, border: "1px solid #e0f2fe", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
              <strong style={{ color: "#0891b2" }}>Reading the economics:</strong> "Committed" values are upfront payments or cash paid to date. "Potential" values include milestones — actual payouts historically run at 10–20% of headline biobucks. No AI-designed drug has yet received regulatory approval. Click any company name to see its full profile.
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
                  onDelete={deleteDeal} isAdmin={isAdmin}
                  onPharmaClick={navigateToPharma} onPartnerClick={navigateToPartner} />
              ))}
            </div>

            {filteredDeals.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>No deals match your current filters.</div>
            )}
          </>
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
