/** @type {import('next').NextConfig} */

// Everything the browser is allowed to reach. Kept beside the code that needs
// it so a new integration fails visibly here rather than silently at runtime:
//   - OpenStreetMap serves the base map tiles (WeatherMap)
//   - postcodes.io turns a postcode into coordinates (SetupWizard)
//   - Vercel Analytics; on Vercel it is same-origin, but the script host is
//     listed so a non-Vercel deployment still works
// OpenWeatherMap is absent on purpose: its tiles are proxied through
// /api/weather-tiles so the key never reaches the browser, making them 'self'.
const connectSrc = ["'self'", "https://api.postcodes.io", "https://va.vercel-scripts.com"];
const imgSrc = ["'self'", "data:", "blob:", "https://*.tile.openstreetmap.org"];
const scriptSrc = ["'self'", "'unsafe-inline'", "https://va.vercel-scripts.com"];

// `next dev` compiles with webpack's eval source maps, so every chunk arrives
// wrapped in eval() and the policy below blocks the lot: the app never
// hydrates and the shell sits on its loading state forever. Production bundles
// contain no eval, so this is relaxed for development only and the deployed
// policy is unchanged. Keep it that way — an 'unsafe-eval' that leaks into
// production would give an injected string a way to execute.
if (process.env.NODE_ENV === "development") {
  scriptSrc.push("'unsafe-eval'");
}

// 'unsafe-inline' is required for scripts: the App Router ships inline
// bootstrap and hydration scripts, and removing it needs per-request nonces
// from middleware. So this policy is not a meaningful XSS backstop — it earns
// its place through frame-ancestors, object-src, base-uri and form-action,
// which close off clickjacking, plugin embedding, <base> hijacking and form
// exfiltration outright. Styles need it too: next/font injects a <style> block
// and Leaflet writes inline style attributes onto its map panes.
const contentSecurityPolicy = [
  `default-src 'self'`,
  `script-src ${scriptSrc.join(" ")}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src ${imgSrc.join(" ")}`,
  `font-src 'self' data:`,
  `connect-src ${connectSrc.join(" ")}`,
  `frame-ancestors 'none'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // frame-ancestors already covers this for current browsers; kept for older
  // ones that understand only X-Frame-Options.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The app asks for none of these. Geolocation is the notable one: location
  // comes from a typed postcode, never from the browser's location API.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
