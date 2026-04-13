export type Product = {
  id?: string;
  title: string;
  description: string;
  range?: string;
  image: string;
  category: string;
  createdAt?: string;
};

export const productCategories: string[] = [
  "Footwear",
  "Apparel",
  "Equipment",
  "Recovery",
];

export const defaultProducts: Product[] = [
  {
    id: "prod-1",
    title: "Sprint Pro Trainers",
    description:
      "Lightweight stability trainers built for speed sessions and daily miles.",
    range: "$79 - $149",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    category: "Footwear",
  },
  {
    id: "prod-2",
    title: "AirFlex Match Kit",
    description:
      "Sweat-wicking jersey and shorts set with ergonomic athletic cut.",
    range: "$35 - $98",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    category: "Apparel",
  },
  {
    id: "prod-3",
    title: "Agility Builder Set",
    description:
      "Cones, ladder, and mini hurdles for explosiveness and footwork drills.",
    range: "$24 - $135",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    category: "Equipment",
  },
  {
    id: "prod-4",
    title: "Recovery Core Pack",
    description:
      "Massage roller, mobility strap, and support tape for post-session care.",
    range: "$18 - $89",
    image:
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=1200&q=80",
    category: "Recovery",
  },
  {
    id: "prod-5",
    title: "Velocity Turf Boots",
    description:
      "High-grip outsole and responsive cushioning for rapid directional changes.",
    range: "$99 - $179",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    category: "Footwear",
  },
  {
    id: "prod-6",
    title: "Therma Layer Hoodie",
    description:
      "Breathable insulation layer for warm-ups and cooler evening training.",
    range: "$45 - $120",
    image:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1200&q=80",
    category: "Apparel",
  },
];
