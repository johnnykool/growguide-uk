// Small shared registry for navigation and analytics; keep full growing copy on the server.
export const VARIETY_CROPS = [
  { slug: "tomatoes", name: "Tomatoes", singular: "tomato", aliases: ["tomato", "tomatoes"], prompt: "Compare tomato varieties for outdoor growing, sweetness and containers." },
  { slug: "courgettes", name: "Courgettes", singular: "courgette", aliases: ["courgette", "courgettes"], prompt: "Compare courgette varieties for reliable crops, yellow fruit and growing under cover." },
  { slug: "spring-onions", name: "Spring onions", singular: "spring onion", aliases: ["spring onion", "spring onions", "spring-onion", "spring-onions"], prompt: "Compare spring onion varieties for salads, long stems and overwintering." },
  { slug: "cucumbers", name: "Cucumbers", singular: "cucumber", aliases: ["cucumber", "cucumbers"], prompt: "Compare cucumber varieties for outdoor growing, greenhouses and small spaces." },
] as const;

export type VarietyCrop = typeof VARIETY_CROPS[number]["slug"];
