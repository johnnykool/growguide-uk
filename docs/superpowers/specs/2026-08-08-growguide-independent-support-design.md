# GrowGuide Independent Branding and Support Design

**Date:** 2026-08-08

## Goal

Present GrowGuide UK as an independent product and give gardeners a simple way to help cover live weather and AI costs.

## Scope

- Remove every former parent-brand name, URL, and ownership statement from the rendered product, README, automated tests, and project documentation.
- Preserve the GrowGuide UK name, gardening credits, weather attribution, photography credit, palette, typography, and compact footer layout.
- Add one external support link after the owner creates a Ko-fi page and supplies its public URL.
- Keep the change independent of advice generation. Opening the support link must never call the advice API or any MCP service.

## Support Experience

The footer will contain a secondary **Support GrowGuide** link beside concise copy: **Help cover weather and AI costs.** The link will open the supplied Ko-fi creator page in a new tab and use `rel="noopener noreferrer"`.

The support action remains visually quieter than setup, advice, and task controls. It will use the established cream, sage, moss, and dark-earth styles with a visible keyboard focus ring and an adequate touch target.

The implementation will use the exact creator URL supplied after Ko-fi setup. It will not guess a Ko-fi handle or link to Ko-fi's generic home page.

## Content Changes

- Footer ownership copy becomes independent GrowGuide copyright text.
- The README removes the former live-domain line and ownership statement.
- Earlier design and implementation documents remove former parent-brand references so a repository-wide case-insensitive search for that brand returns no matches.
- Existing RHS, Unsplash, Pexels, OpenWeatherMap, postcodes.io, OpenStreetMap, and Claude Code credits remain unchanged.

## Testing

Update the shell test before production code. The new test must fail because the current footer still links to the former parent brand and lacks the support action. After implementation, it must prove that:

- the shell contains no former parent-brand text or URL;
- the footer shows **Support GrowGuide** and the cost-covering explanation;
- the support link uses the supplied Ko-fi URL and safe external-link attributes;
- generic social-network links remain absent; and
- existing GrowGuide, weather, and photography attribution remains visible.

Run a repository-wide former parent-brand scan, the focused shell test, the full test suite, TypeScript, and the optimized production build before pushing the update.

## Release

Commit the change to `codex/progressive-setup-polish`, push it to the existing pull request, and confirm that Vercel produces a ready preview. Keep the worktree for feedback.
