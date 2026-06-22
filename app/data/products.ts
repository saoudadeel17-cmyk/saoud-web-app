export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  colors: string[];
  detail: string;
}

export type Category = "All" | "Persian Rugs" | "Arabian Mats" | "Iranian Collection" | "Handmade Things";

export const products: Product[] = [
  {
    id: 1,
    name: "Royal Persian Silk Rug",
    category: "Persian Rugs",
    price: 420,
    image: "/products/rug-1.jpg",
    colors: ["Crimson", "Gold", "Navy"],
    detail: "Hand-knotted Persian silk rug inspired by Iranian palace patterns. Ideal for luxury homes, hotels, and international buyers.",
  },
  {
    id: 2,
    name: "Arabian Majlis Floor Mat",
    category: "Arabian Mats",
    price: 180,
    image: "/products/mat-1.jpg",
    colors: ["Maroon", "Sand", "Emerald"],
    detail: "Traditional Arabian sitting mat with UAE and Qatar inspired geometric detailing.",
  },
  {
    id: 3,
    name: "Iranian Tribal Wool Rug",
    category: "Iranian Collection",
    price: 310,
    image: "/products/rug-2.jpg",
    colors: ["Rust", "Black", "Cream"],
    detail: "Pure wool rug with deep tribal motifs, made for collectors and export markets.",
  },
  {
    id: 4,
    name: "Handmade Decorative Craft Set",
    category: "Handmade Things",
    price: 95,
    image: "/products/handmade-1.jpg",
    colors: ["Bronze", "Silver", "Walnut"],
    detail: "Handmade traditional decor for Arabian, Persian, and luxury cultural interiors.",
  },
];

export const categories: Category[] = [
  "All",
  "Persian Rugs",
  "Arabian Mats",
  "Iranian Collection",
  "Handmade Things",
];