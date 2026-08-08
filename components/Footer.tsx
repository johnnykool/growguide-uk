export default function Footer() {
  return (
    <footer className="mt-12 bg-dark-earth text-cream">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="flex flex-col gap-2 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {" "}
            <span className="font-serif text-sm text-cream">GrowGuide UK</span>
            {" · Part of "}
            <a
              href="https://crystalpocket.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-sage underline-offset-2 transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
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
