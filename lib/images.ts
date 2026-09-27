// Photo credits: Unsplash (Zoe Richardson, Gabriel Jimenez, Eugene Golovesov,
// Pina Messina, Rodrigo dos Reis, Anton Darius) and Pexels (Carlos Moura,
// energepic.com, Planka, Wadimoo, Betül Taşdemir). Both licenses permit free
// use without attribution.
//
// The 23 entries added below are also sourced from Unsplash, under the same
// licence; the individual photographer credits did not survive the source
// files being renamed to their crop id before they reached this repo.

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
  "runner-bean": "/images/veg/runner-bean.jpg",
  "french-bean": "/images/veg/french-bean.jpg",
  "broad-bean": "/images/veg/broad-bean.jpg",
  // cucumber has no photo yet: no correctly-labelled source image was supplied.
  aubergine: "/images/veg/aubergine.jpg",
  beetroot: "/images/veg/beetroot.jpg",
  parsnip: "/images/veg/parsnip.jpg",
  turnip: "/images/veg/turnip.jpg",
  radish: "/images/veg/radish.jpg",
  onion: "/images/veg/onion.jpg",
  garlic: "/images/veg/garlic.jpg",
  leek: "/images/veg/leek.jpg",
  "spring-onion": "/images/veg/spring-onion.jpg",
  cauliflower: "/images/veg/cauliflower.jpg",
  cabbage: "/images/veg/cabbage.jpg",
  "brussels-sprout": "/images/veg/brussels-sprout.jpg",
  kale: "/images/veg/kale.jpg",
  spinach: "/images/veg/spinach.jpg",
  "butternut-squash": "/images/veg/butternut-squash.jpg",
  pumpkin: "/images/veg/pumpkin.jpg",
  basil: "/images/veg/basil.jpg",
  parsley: "/images/veg/parsley.jpg",
  chives: "/images/veg/chives.jpg",
  rosemary: "/images/veg/rosemary.jpg",
};

export function vegPhoto(id: string): string | undefined {
  return VEG_PHOTOS[id];
}
