# CLAUDE.md

## Project
Personal blog for Kevin Manase. Engineering thoughts, notes-to-self published publicly. Co-authored with Claude.

## Tech
- Next.js 16 (App Router, Turbopack)
- pnpm
- MDX posts in `/content/posts/`
- Tailwind CSS
- Deploy: Vercel
- Domain: kevinmanase.com

## Writing Style

These are notes. Raw thinking published publicly.

### Voice
- Short sentences. Fragments ok.
- State things. Don't hedge.
- Ellipses for trailing thoughts.. casual pauses..
- Lowercase is fine (experimental)
- "right?" and "you know?" sparingly, keeps it human

### Formatting
- Lists over prose
- Tables for comparisons
- GIFs: yes (Giphy/Tenor inline)
- Mermaid diagrams: yes
- Code snippets: liberally, with real file paths
- Emojis: no

### Avoid (AI tells)
- Em dashes. Use periods or ellipses instead.
- "actually", "basically", "just", "really"
- "game-changer", "incredible", "amazing"
- "I think maybe", "it seems like"
- Long compound sentences
- Over-explanation. Show, don't justify.

### Structure
- "The Problem" then "The Solution"
- Punchy endings. One line that lands.

## Content Structure
Building a series on Kevin's AI coding workflow:
1. Overview post (links to all deep dives)
2. Deep dive: Multi-LLM plan critique (Gemini + Codex hook)
3. Deep dive: Test-first enforcement
4. Deep dive: Vibecheck (staying on course)
5. More as needed

Posts should backlink to each other. Overview is the hub.

## Kevin's Dev Workflow (context for content)
```
User story → Acceptance criteria → Plan (test files first)
→ ExitPlanMode triggers hook
→ Gemini 3 Flash critiques
→ Codex reviews Gemini's critique, adds missed points
→ Claude sees combined feedback, revises plan
→ Implement
→ /vibecheck verifies stayed on course
→ Commit
```

Key tools: Claude Code (Opus), OpenCode (Gemini via OpenRouter), Codex CLI

## Commands
```bash
pnpm dev           # local dev
pnpm build         # build
pnpm lint          # lint
pnpm contributions # refresh content/contributions.json from GitHub
```

## File Conventions
- Posts: `/content/posts/{slug}.mdx`
- Components: `/src/components/`
- Lib: `/src/lib/`

## Post Frontmatter
```yaml
---
title: "Post Title"
description: "SEO description"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
published: true
---
```

## Anonymization

When showing examples from real projects, use **Dunder Mifflin Infinity** as the stand-in:

| Real | Blog Example |
|------|--------------|
| Project name | Dunder Mifflin Infinity |
| Repo names | `dmi-backend`, `dmi-frontend` |
| User stories | Sales features, client management, paper orders |
| Models/entities | `Client`, `SalesRep`, `PaperOrder`, `Region` |
| Test files | `test_sales.py`, `SalesRep.test.tsx` |
| Services | `SalesService`, `ClientProvider` |

This keeps examples relatable, funny, and doesn't expose actual client work.

## Notes
- Kevin reviews via conversation, not PR comments
- Tone matters more than polish
- When in doubt, keep it real
