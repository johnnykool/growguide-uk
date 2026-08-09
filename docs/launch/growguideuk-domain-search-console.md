# GrowGuide production domain and Search Console rollout

Use this sequence only after the GrowGuide implementation is ready for production. It connects the purchased domain to the production deployment; it must never point the domain at a preview branch.

1. Confirm the implementation branch is approved and merged to the production branch.
2. In Vercel, open **Project Settings → Domains** and add `growguideuk.co.uk` and `www.growguideuk.co.uk`.
3. Copy the exact apex A and `www` CNAME values Vercel shows for this project.
4. In Hostinger hPanel, open **Domains → growguideuk.co.uk → DNS / Nameservers**. Remove only conflicting apex A/AAAA and `www` A/CNAME records. Preserve MX and unrelated TXT records.
5. Add the Vercel records displayed for this project, then wait for Vercel to show **Valid Configuration** and an active TLS certificate.
6. Configure a permanent Vercel redirect from `www.growguideuk.co.uk` to `https://growguideuk.co.uk`.
7. In Google Search Console, create a Domain property for `growguideuk.co.uk`.
8. Add Google's displayed TXT verification value in Hostinger, leaving the record name at the apex value Hostinger requests.
9. Verify the property, then submit `https://growguideuk.co.uk/sitemap.xml`.
10. On production, check the canonical URL, robots file, sitemap, privacy page, and Ko-fi link.

DNS propagation can take time. Do not guess any A, CNAME, TXT, or redirect value: use only the project-specific value Vercel or Google displays.
