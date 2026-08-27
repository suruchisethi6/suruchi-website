# AI × Pharma Deal Tracker — Project Context

## What this is

A React-based interactive tracker that maps how big pharma is embedding AI across the drug development lifecycle. Designed to be a living, community-contributed resource and a companion to my LinkedIn writing on AI in pharma.

The tracker grew out of a LinkedIn post I wrote tracking AI × pharma deals in H1 2026, which got strong engagement. The idea is to turn that one-off post into a persistent, filterable, expandable tool that establishes thought leadership in life sciences strategy.

## Current state (v5)

The tracker is a single `.jsx` file (React component). It has been through multiple rounds of critical review to improve content accuracy, editorial tone, and strategic framing.

### 27 deals currently tracked:

1. Roche/Genentech × Recursion — $150M upfront, up to $12B+, AI drug discovery across neuroscience and oncology (Dec 2021, active 2026)
2. Sanofi × Earendil Labs — up to $2.56B, AI-driven bispecific antibody discovery (Jan 2026)
3. Eli Lilly × Isomorphic Labs — $45M upfront, $1.7B milestones, co-development partnership (Jan 2024)
4. J&J / AbbVie / Novo Nordisk / Bayer × Cradle — 50+ programmes, protein engineering platform (2025-2026)
5. GSK × NOETIK — $50M upfront, spatial biology foundation models for oncology (Jan 2026)
6. Eli Lilly × Tamarind Bio — TuneLab 2.0 inference infrastructure (2026)
7. CSL + others × Perceptic — $12M seed, enterprise OS from ex-Palantir founders (May 2026)
8. AstraZeneca × Modella AI — first AI acquisition by big pharma (Jan 2026)
9. Eli Lilly × NVIDIA — LillyPod, 1,016 Blackwell Ultra GPUs (Oct 2025)
10. Roche × NVIDIA — 3,500+ GPUs, largest pharma GPU footprint (Mar 2026)
11. Eli Lilly × Insilico Medicine — $115M upfront, up to $2.75B + royalties (Mar 2026)
12. Merck × Google Cloud — up to $1B, agentic AI across 75,000 employees (Apr 2026)
13. Novo Nordisk × OpenAI — discovery, manufacturing, supply chain (Apr 2026)
14. Daiichi Sankyo × Imagene AI — multimodal biomarker discovery in oncology (Apr 2026)
15. AstraZeneca × OWKIN — 3-year K Pro licence, discovery + enterprise (May 2026)
16. Bristol Myers Squibb × Anthropic — Claude across 30,000+ employees (May 2026)
17. Incyte × Edison Scientific — Kosmos AI scientist platform (May 2026)
18. Sanofi × CytoReason — up to $16M, third extension of AI disease simulation (Jan 2026)
19. Pfizer × Chai Discovery — Chai-3 licensing + custom model (Jun 2026)
20. Pfizer × Boltz Bio — multi-year collaboration, foundation models on Pfizer data (Jan 2026)
21. Merck × Protillion Biosciences — up to $510M, Prot-MaP protein design (Jun 2026)
22. Boehringer Ingelheim × Variant Bio — $120M+, genomics-driven target discovery (Jan 2026)
23. Incyte × Genesis Therapeutics — $120M upfront, $1B+ potential, molecular AI (May 2026)
24. Novartis × Isomorphic Labs — $37.5M upfront, up to $1.2B (Jan 2024, expanded Feb 2025)
25. Johnson & Johnson × Isomorphic Labs — cross-modality collaboration (Jan 2026)
26. Eli Lilly × Chai Discovery — biologics discovery + TuneLab expansion (Jan 2026, expanded Jun 2026)
27. Sanofi × OWKIN — 5-year K Pro licence, discovery + enterprise (Jun 2026)

### Category system (5 categories reflecting where AI creates value):

- **Drug Discovery & Design** (short: "Discovery") — target ID, molecule design, protein engineering, generative chemistry
- **Clinical Intelligence** (short: "Clinical Intel") — biomarkers, trial design, patient stratification, response prediction
- **Development & Operations** (short: "Dev & Ops") — manufacturing, supply chain, production optimisation
- **Enterprise AI** (short: "Enterprise AI") — cross-functional AI platforms deployed company-wide
- **AI Infrastructure** (short: "Infrastructure") — AI supercomputers, model hosting, inference infrastructure

### Deal data structure:

Each deal includes:
- `economics`: { upfront, milestones, totalPotential, royalties, disclosed, displayValue }
- `evidence`: production / pilot / research / funding (maturity level)
- `archetype`: e.g. "Co-develop molecules", "License platform", "Enterprise transformation", "AI research agent"
- `source` and `sourceUrl`: editorial note + link to official announcement
- `stages`: array of category IDs

### Features:

- **Filterable category bar** — click any category to filter deals
- **Search** — filter by company, partner, deal type, or keywords
- **Expandable deal cards** — collapsed shows summary; expanded shows "About the AI partner" and "Strategic Shift" analysis
- **Company profiles** — click pharma or AI partner names to see all their deals grouped together with aggregated stats
- **Economics breakdown** — committed (upfront) vs potential (milestones) values with sourced disclaimer that fewer than 10% of milestone payments are ever triggered (SRS Acquiom, 2025)
- **Evidence level badges** — production, pilot, research, funding
- **Community submissions** — "Add a deal" button lets visitors submit deals for review
- **Admin approval workflow** — click "Suruchi Sethi, PhD" in footer → enter passphrase `suruchi2026` → unlocks:
  - "+ Add deal" button (direct add, skips review)
  - "Review" button (approve/reject community submissions)
  - "Remove" button on each deal card
  - "Reset data" option
- **Persistent storage** — deals and pending submissions persist across sessions

### Editorial tone:

The critical review refined the tone from promotional/hype toward analyst-quality strategic framing. Each deal has a "Strategic Shift" section (not "Why This Deal Matters") that identifies the broader industry pattern the deal reveals. Em dashes have been removed throughout (Claude writing tell). Source URLs link to official company announcements or press releases wherever possible.

### Stats (dynamically computed):

- Total committed: ~$518M+ (sum of all disclosed upfront payments)
- Total potential: ~$23.1B+ (sum of all disclosed milestone values)
- Footer disclaimer: "Historically, fewer than 10% of life sciences milestone payments are ever triggered" with link to SRS Acquiom source

## My website

Single `index.html` hosted on GitHub Pages at suruchisethi6.github.io. Design uses DM Serif Display + DM Sans fonts, teal accent, dark navy header. Sections: Hero, About, Insights (LinkedIn posts), Projects (placeholder), Experience, Education, Contact.

GitHub repo: suruchisethi6/suruchisethi6.github.io

## Deployment plan

The tracker needs to be deployed as a standalone page at `suruchisethi6.github.io/tracker`. Key steps:

1. **Build the React component** — set up a minimal build (Vite or similar) that compiles the JSX into a standalone HTML page
2. **Swap storage** — the current `window.storage` API only works inside Claude artifacts. For the live site, swap to `localStorage` for personal use, or Supabase/similar if real multi-user community submissions are needed
3. **Create tracker/ folder** in the GitHub repo with the built output
4. **Update the main site** — replace the Projects section placeholder with a link to /tracker
5. **Push to GitHub** — commit and let GitHub Pages deploy

The admin approval workflow currently uses `prompt()` for the passphrase, which works but is basic. For a production version, consider a more secure approach.

## About me

Suruchi Sethi, PhD. Life sciences consultant at Eradigm Consulting in London. Background in biochemistry (PhD Max Planck Institute, University of Duisburg-Essen), competitive intelligence, and strategy across oncology, neurology, immunology, and rare diseases. Previously at EY, EMBL Heidelberg, and IIT Delhi. Writing publicly about AI in drug discovery and pharma competitive dynamics on LinkedIn. Non-coder building with AI tools.
