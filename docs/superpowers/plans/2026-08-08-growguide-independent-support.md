# GrowGuide Independent Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the former parent-brand identity and add a safe Ko-fi support link that helps cover GrowGuide's weather and AI costs.

**Architecture:** Keep the change inside the existing shell. Update `Footer` with independent GrowGuide copy and one external Ko-fi action, protect the rendered contract with `ShellContent.test.tsx`, remove old repository references from prose, and retain the generated square logo as a reusable public asset.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Vitest, React Testing Library.

## Global Constraints

- Use the exact support URL `https://ko-fi.com/growguideuk` without the trailing fragment marker.
- Use the visible label **Support GrowGuide** and supporting copy **Help cover weather and AI costs.**
- Opening the support link must not call `/api/advice`, `/api/weather`, or any MCP service.
- Open Ko-fi in a new tab with `rel="noopener noreferrer"`.
- Preserve the GrowGuide name, earthy palette, gardening credits, weather attribution, photography credit, and generic social-link removal.
- Leave no former parent-brand name, URL, or ownership statement anywhere in tracked repository content.

---

### Task 1: Independent footer and Ko-fi support action

**Files:**
- Modify: `components/ShellContent.test.tsx`
- Modify: `components/Footer.tsx`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-08-08-progressive-setup-polish-design.md`
- Modify: `docs/superpowers/plans/2026-08-08-progressive-setup-polish.md`
- Add: `public/images/growguide-kofi-logo.png`

**Interfaces:**
- Consumes: existing `Footer` and `Header` components.
- Produces: one external anchor with accessible name `Support GrowGuide` and destination `https://ko-fi.com/growguideuk`.

- [ ] **Step 1: Write the failing shell test**

Replace the former footer-link expectation in `components/ShellContent.test.tsx` with these assertions:

```tsx
const supportLink = within(footer).getByRole("link", {
  name: /Support GrowGuide/i,
});

expect(within(footer).getByText("Help cover weather and AI costs.")).toBeVisible();
expect(supportLink).toHaveAttribute("href", "https://ko-fi.com/growguideuk");
expect(supportLink).toHaveAttribute("target", "_blank");
expect(supportLink).toHaveAttribute("rel", "noopener noreferrer");

const renderedShell = [
  document.body.textContent,
  ...within(footer)
    .getAllByRole("link")
    .map((anchor) => anchor.getAttribute("href")),
]
  .join(" ")
  .toLowerCase();

expect(renderedShell).not.toContain("crystal" + "pocket");
```

Keep the existing assertions for GrowGuide, weather, photography, and absent generic social networks.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- components/ShellContent.test.tsx --maxWorkers=1 --minWorkers=1
```

Expected: FAIL because the current footer lacks `Support GrowGuide` and still contains the former external ownership link.

- [ ] **Step 3: Implement the minimal footer change**

Replace the ownership sentence in `components/Footer.tsx` with independent copyright text. Add this support block without changing the existing credits:

```tsx
<div className="flex flex-col items-start gap-2 sm:items-end">
  <p>Help cover weather and AI costs.</p>
  <a
    href="https://ko-fi.com/growguideuk"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex min-h-11 items-center rounded-btn border border-sage/70 px-3 py-2 font-semibold text-cream transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
  >
    Support GrowGuide
  </a>
</div>
```

Keep the support action secondary to setup, advice, and task controls.

- [ ] **Step 4: Remove repository prose references**

In `README.md`, remove the former live-domain line and change the final credit to:

```markdown
Built by John Worley using AI-assisted development ([Claude Code](https://claude.com/claude-code)).
```

In the earlier progressive-setup design and plan, rewrite the two footer requirements as independent GrowGuide provenance. Preserve their original meaning about generic social-link removal, weather attribution, and photography credit.

- [ ] **Step 5: Preserve the Ko-fi logo asset**

Keep `public/images/growguide-kofi-logo.png` as the 1254×1254 RGB PNG generated for the Ko-fi profile. Do not add it to the rendered site in this task.

- [ ] **Step 6: Verify GREEN and repository cleanup**

Run:

```bash
npm test -- components/ShellContent.test.tsx --maxWorkers=1 --minWorkers=1
rg -ni 'crystal''pocket' . -g '!node_modules' -g '!.next' -g '!.git'
```

Expected: the focused test passes, and `rg` exits 1 with no matches.

- [ ] **Step 7: Run the complete verification gate**

Run in sequence:

```bash
npm test -- --maxWorkers=1 --minWorkers=1
npx tsc --noEmit
npm run build
```

Expected: all 66 tests, including the updated shell contract, pass; TypeScript reports no errors; and the optimized Next.js build succeeds.

- [ ] **Step 8: Commit**

```bash
git add components/ShellContent.test.tsx components/Footer.tsx README.md docs/superpowers/specs/2026-08-08-progressive-setup-polish-design.md docs/superpowers/plans/2026-08-08-progressive-setup-polish.md public/images/growguide-kofi-logo.png
git commit -m "feat: add independent GrowGuide support link"
```

- [ ] **Step 9: Push and confirm preview**

```bash
git push origin codex/progressive-setup-polish
gh pr checks 2 --watch --interval 5
```

Expected: pull request #2 updates, and the Vercel preview reports `pass`.
