const SOCIALS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    path: "M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.4V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8Z",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    path: "M12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm0 5.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM16.4 8.4a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM12 5.4c-1.8 0-2 0-2.7.1-.7 0-1.2.1-1.6.3-.4.2-.8.4-1.2.8-.4.4-.6.8-.8 1.2-.2.4-.3.9-.3 1.6C5.4 10 5.4 10.2 5.4 12s0 2 .1 2.7c0 .7.1 1.2.3 1.6.2.4.4.8.8 1.2.4.4.8.6 1.2.8.4.2.9.3 1.6.3.7 0 .9.1 2.7.1s2 0 2.7-.1c.7 0 1.2-.1 1.6-.3.4-.2.8-.4 1.2-.8.4-.4.6-.8.8-1.2.2-.4.3-.9.3-1.6 0-.7.1-.9.1-2.7s0-2-.1-2.7c0-.7-.1-1.2-.3-1.6a3.3 3.3 0 0 0-.8-1.2 3.3 3.3 0 0 0-1.2-.8c-.4-.2-.9-.3-1.6-.3-.7-.1-.9-.1-2.7-.1Zm0 1.2c1.7 0 1.9 0 2.6.1.6 0 1 .1 1.2.2.3.1.5.3.7.5.2.2.4.4.5.7.1.2.2.6.2 1.2 0 .7.1.9.1 2.6s0 1.9-.1 2.6c0 .6-.1 1-.2 1.2-.1.3-.3.5-.5.7a1.9 1.9 0 0 1-.7.5c-.2.1-.6.2-1.2.2-.7 0-.9.1-2.6.1s-1.9 0-2.6-.1c-.6 0-1-.1-1.2-.2a1.9 1.9 0 0 1-.7-.5 1.9 1.9 0 0 1-.5-.7c-.1-.2-.2-.6-.2-1.2 0-.7-.1-.9-.1-2.6s0-1.9.1-2.6c0-.6.1-1 .2-1.2.1-.3.3-.5.5-.7.2-.2.4-.4.7-.5.2-.1.6-.2 1.2-.2.7-.1.9-.1 2.6-.1Z",
  },
  {
    name: "X",
    href: "https://x.com",
    path: "M17.2 5h2.4l-5.2 6 6.2 8.2h-4.9l-3.8-5-4.4 5H5.1l5.6-6.4L4.8 5h5l3.5 4.6L17.2 5Zm-.8 12.8h1.3L9.1 6.4H7.7l8.7 11.4Z",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    path: "M20.6 8.2a2.3 2.3 0 0 0-1.6-1.6C17.6 6.2 12 6.2 12 6.2s-5.6 0-7 .4a2.3 2.3 0 0 0-1.6 1.6C3 9.6 3 12.5 3 12.5s0 2.9.4 4.3c.2.8.8 1.4 1.6 1.6 1.4.4 7 .4 7 .4s5.6 0 7-.4a2.3 2.3 0 0 0 1.6-1.6c.4-1.4.4-4.3.4-4.3s0-2.9-.4-4.3ZM10.2 15.2V9.8l4.7 2.7-4.7 2.7Z",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    path: "M6.9 8.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM5.5 10h2.8v9H5.5v-9Zm4.9 0h2.7v1.2h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.3V19h-2.8v-4.4c0-1.1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3V19h-2.9v-9Z",
  },
];

export default function Footer() {
  return (
    <footer className="mt-12 bg-dark-earth text-cream">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-2xl mb-2">
              GrowGuide <span className="text-sage">UK</span>
            </p>
            <p className="text-sm leading-relaxed text-cream/70">
              Weather-aware growing advice for UK gardeners, tailored to your
              plot and powered by AI. Sow well, grow well.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage">
              Follow along
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-cream/25"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-cream"
                    aria-hidden
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-cream/15 pt-5 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} GrowGuide UK · Part of{" "}
            <a
              href="https://crystalpocket.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-cream"
            >
              crystalpocket.com
            </a>
          </p>
          <p>
            Growing data based on RHS guidance · Photos from Unsplash &amp;
            Pexels · Weather by OpenWeatherMap
          </p>
        </div>
      </div>
    </footer>
  );
}
