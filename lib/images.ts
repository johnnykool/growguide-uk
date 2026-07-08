// Photo credits: Unsplash (Zoe Richardson, Gabriel Jimenez, Eugene Golovesov,
// Pina Messina, Rodrigo dos Reis, Anton Darius) and Pexels (Carlos Moura,
// energepic.com, Planka, Wadimoo, Betül Taşdemir). Both licenses permit free
// use without attribution.

export const HERO_HARVEST = "/images/hero-harvest.jpg";
export const HERO_SOIL = "/images/hero-soil.jpg";

// Vegetable id → photo. Not every vegetable has one; fall back to its emoji.
export const VEG_PHOTOS: Record<string, string> = {
  tomato: "/images/veg/tomato.jpg",
  pepper: "/images/veg/pepper.jpg",
  pea: "/images/veg/pea.jpg",
  courgette: "/images/veg/courgette.jpg",
  broccoli: "/images/veg/broccoli.jpg",
  lettuce: "/images/veg/lettuce.jpg",
  carrot: "/images/veg/carrot.jpg",
  potato: "/images/veg/potato.jpg",
  "runner-bean": "/images/veg/beans.jpg",
  "french-bean": "/images/veg/beans.jpg",
  "broad-bean": "/images/veg/beans.jpg",
};

export function vegPhoto(id: string): string | undefined {
  return VEG_PHOTOS[id];
}
