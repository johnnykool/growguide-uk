# GrowGuide production domain and Search Console rollout

Use this sequence only after the GrowGuide implementation is ready for production. It connects the purchased domain to the production deployment; it must never point the domain at a preview branch.

1. Confirm the implementation branch is approved and merged to the production branch.
2. In the Anthropic Console, create or select a GrowGuide-specific Workspace and use an API key created in that Workspace.
3. In that Workspace's **Limits** tab, set a Workspace spend limit below the organisation limit and add an email notification. Choose the amounts authorised for GrowGuide; do not invent them during rollout.
4. Review GrowGuide's Workspace usage and cost before launch. Keep prepaid-credit and auto-reload exposure within the chosen budget.
5. In the GrowGuide Vercel project, open **Analytics** and confirm or enable Web Analytics. Review the current included event allowance and usage, and do not accept unapproved paid overage.
6. If Web Analytics was newly enabled, redeploy the production branch so Vercel adds the analytics routes.
7. In Vercel, open **Project Settings → Domains** and add `growguideuk.co.uk` and `www.growguideuk.co.uk`.
8. Copy the exact apex A and `www` CNAME values Vercel shows for this project.
9. In Hostinger hPanel, open **Domains → growguideuk.co.uk → DNS / Nameservers**. Remove only conflicting apex A/AAAA and `www` A/CNAME records. Preserve MX and unrelated TXT records.
10. Add the Vercel records displayed for this project, then wait for Vercel to show **Valid Configuration** and an active TLS certificate.
11. Configure a permanent Vercel redirect from `www.growguideuk.co.uk` to `https://growguideuk.co.uk`.
12. In Google Search Console, create a Domain property for `growguideuk.co.uk`.
13. Add Google's displayed TXT verification value in Hostinger, leaving the record name at the apex value Hostinger requests.
14. Verify the property, then submit `https://growguideuk.co.uk/sitemap.xml`.
15. Load `https://growguideuk.co.uk/` without query or fragment data, verify one production pageview reaches Vercel Web Analytics, and confirm the application emits no custom events.
16. On production, check the canonical URL, robots file, sitemap, privacy page, and Ko-fi link.

The application's five-requests-per-ten-minutes advice limiter is process-local: it resets across instances and cold starts. Treat it only as defence-in-depth. The Anthropic Workspace spend limit is GrowGuide's deployment-wide hard cost boundary.

Official references: [Vercel Web Analytics quickstart](https://vercel.com/docs/analytics/quickstart) and [Anthropic Workspace management](https://support.claude.com/en/articles/9796807-creating-and-managing-workspaces-in-the-claude-console).

DNS propagation can take time. Do not guess any A, CNAME, TXT, or redirect value: use only the project-specific value Vercel or Google displays.
