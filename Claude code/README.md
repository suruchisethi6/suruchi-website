# How to use this workspace

This is the simplest possible Claude Code setup — just a context file and one
skill. No email, no calendar, no connections. Everything here works with
Claude's built-in web search.

## What's in here

```
my-analysis-workspace/
├── CLAUDE.md                        ← Your context. Read automatically every time.
├── README.md                        ← This file.
└── skills/
    └── company-teardown/
        └── SKILL.md                 ← Your first reusable analysis.
```

## How to use it

1. Put this whole folder somewhere on your computer (e.g. Documents).
2. Open Claude Code and point it at this folder.
3. Claude automatically reads CLAUDE.md — so it already knows who you are,
   your rules, and how you like things done. You never paste your context again.
4. Try it: type "do a teardown of Cradle". Claude will find the company-teardown
   skill, follow its structure, search the web, and produce a consistent analysis.

## How it grows (the compounding habit)

- **When you correct Claude on something, add that correction to CLAUDE.md.**
  Example: if it uses a hype word you hate, add the word to your banned list.
  You'll never have to correct it again.
- **When you perfect a new recurring analysis, make it a new skill.**
  Copy the company-teardown folder, rename it, and rewrite the instructions.
  E.g. a `deal-analysis` skill, or a `draft-linkedin-post` skill.
- **When Claude writes something great, save it as an example** and point the
  relevant skill at it.

## What you do NOT need to start

- No MCP connections
- No email or calendar access
- No CRM
- No coding

Just this folder and web search. Add connections later, only if manual
searching becomes your bottleneck — and only public data sources
(ClinicalTrials.gov, PubMed, FDA), never anything personal.

## Important

Keep this workspace to your own portfolio and public-market analysis only.
Never put Eradigm client data or deliverables here. If you ever want to use
AI tools for client work, check Eradigm's data policy first.
