import cassava from "@/assets/prod-cassava.jpg";
import tomato from "@/assets/prod-tomato.jpg";
import maize from "@/assets/prod-maize.jpg";
import plantain from "@/assets/prod-plantain.jpg";
import yam from "@/assets/prod-yam.jpg";
import pepper from "@/assets/prod-pepper.jpg";
import cocoa from "@/assets/prod-cocoa.jpg";
import okra from "@/assets/prod-okra.jpg";

export type Farmer = {
  name: string;
  region: string;
  farmSize: string;
  verified: boolean;
  rating: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  farmer: Farmer;
  stock: number;
  unit: string;
  region: string;
  harvestDate: string;
  organic: boolean;
  rating: number;
  reviews: number;
  featured: boolean;
  tags: string[];
};

export type Region = {
  id: number;
  name: string;
  basePrice: number;
  pricePerKg: number;
  estimatedDays: string;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
};

export const CATEGORIES: Category[] = [
  { id: 1, name: "Root Vegetables", icon: "🥔" },
  { id: 2, name: "Grains", icon: "🌾" },
  { id: 3, name: "Vegetables", icon: "🥬" },
  { id: 4, name: "Fruits", icon: "🍌" },
  { id: 5, name: "Legumes", icon: "🌱" },
  { id: 6, name: "Spices", icon: "🌶️" },
  { id: 7, name: "Cash Crops", icon: "🍫" },
];

export const REGIONS: Region[] = [
  { id: 1, name: "Greater Accra", basePrice: 20, pricePerKg: 2, estimatedDays: "1-2 days" },
  { id: 2, name: "Ashanti", basePrice: 30, pricePerKg: 2.5, estimatedDays: "2-3 days" },
  { id: 3, name: "Western", basePrice: 35, pricePerKg: 2.5, estimatedDays: "2-3 days" },
  { id: 4, name: "Central", basePrice: 25, pricePerKg: 2, estimatedDays: "2 days" },
  { id: 5, name: "Eastern", basePrice: 25, pricePerKg: 2, estimatedDays: "2 days" },
  { id: 6, name: "Volta", basePrice: 30, pricePerKg: 2.5, estimatedDays: "2-3 days" },
  { id: 7, name: "Northern", basePrice: 50, pricePerKg: 3, estimatedDays: "3-4 days" },
  { id: 8, name: "Upper East", basePrice: 55, pricePerKg: 3.5, estimatedDays: "3-5 days" },
  { id: 9, name: "Upper West", basePrice: 55, pricePerKg: 3.5, estimatedDays: "3-5 days" },
  { id: 10, name: "Bono", basePrice: 40, pricePerKg: 3, estimatedDays: "3 days" },
  { id: 11, name: "Bono East", basePrice: 42, pricePerKg: 3, estimatedDays: "3 days" },
  { id: 12, name: "Ahafo", basePrice: 40, pricePerKg: 3, estimatedDays: "3 days" },
  { id: 13, name: "Oti", basePrice: 45, pricePerKg: 3, estimatedDays: "3-4 days" },
  { id: 14, name: "Savannah", basePrice: 55, pricePerKg: 3.5, estimatedDays: "3-5 days" },
  { id: 15, name: "North East", basePrice: 55, pricePerKg: 3.5, estimatedDays: "3-5 days" },
  { id: 16, name: "Western North", basePrice: 40, pricePerKg: 3, estimatedDays: "3 days" },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Fresh Cassava",
    description:
      "Freshly harvested cassava from the Volta region — earthy, starchy, perfect for fufu, gari and banku.",
    price: 15,
    category: "Root Vegetables",
    image: cassava,
    unit: "kg",
    stock: 240,
    region: "Volta",
    harvestDate: "2026-06-28",
    organic: true,
    rating: 4.7,
    reviews: 234,
    featured: true,
    tags: ["organic", "fresh", "local"],
    farmer: {
      name: "Kwame Mensah",
      region: "Volta",
      farmSize: "5 acres",
      verified: true,
      rating: 4.8,
    },
  },
  {
    id: 2,
    name: "Vine-Ripened Tomatoes",
    description: "Sun-ripened tomatoes bursting with flavour — the heart of every Ghanaian stew.",
    price: 22,
    category: "Vegetables",
    image: tomato,
    unit: "kg",
    stock: 120,
    region: "Ashanti",
    harvestDate: "2026-07-02",
    organic: true,
    rating: 4.9,
    reviews: 512,
    featured: true,
    tags: ["organic", "bestseller"],
    farmer: {
      name: "Ama Boateng",
      region: "Ashanti",
      farmSize: "3 acres",
      verified: true,
      rating: 4.9,
    },
  },
  {
    id: 3,
    name: "Golden Maize",
    description:
      "Bright, hand-shelled yellow maize dried under the northern sun. Sweet and versatile.",
    price: 12,
    category: "Grains",
    image: maize,
    unit: "kg",
    stock: 600,
    region: "Northern",
    harvestDate: "2026-05-14",
    organic: false,
    rating: 4.6,
    reviews: 189,
    featured: true,
    tags: ["bulk", "staple"],
    farmer: {
      name: "Yakubu Alhassan",
      region: "Northern",
      farmSize: "12 acres",
      verified: true,
      rating: 4.7,
    },
  },
  {
    id: 4,
    name: "Sweet Apem Plantain",
    description: "Sweet ripe plantains from the Eastern region — ideal for kelewele or boiling.",
    price: 18,
    category: "Fruits",
    image: plantain,
    unit: "kg",
    stock: 180,
    region: "Eastern",
    harvestDate: "2026-07-01",
    organic: true,
    rating: 4.8,
    reviews: 320,
    featured: true,
    tags: ["organic", "sweet"],
    farmer: {
      name: "Kojo Owusu",
      region: "Eastern",
      farmSize: "4 acres",
      verified: true,
      rating: 4.6,
    },
  },
  {
    id: 5,
    name: "Puna Yam",
    description: "Premium puna yam tubers — soft, floury and unmistakably delicious.",
    price: 25,
    category: "Root Vegetables",
    image: yam,
    unit: "kg",
    stock: 320,
    region: "Bono",
    harvestDate: "2026-06-10",
    organic: false,
    rating: 4.7,
    reviews: 276,
    featured: false,
    tags: ["staple"],
    farmer: {
      name: "Grace Adjei",
      region: "Bono",
      farmSize: "8 acres",
      verified: true,
      rating: 4.8,
    },
  },
  {
    id: 6,
    name: "Kpakpo Shito Peppers",
    description: "Fiery, aromatic Ghanaian peppers — the soul of shito.",
    price: 35,
    category: "Spices",
    image: pepper,
    unit: "kg",
    stock: 60,
    region: "Central",
    harvestDate: "2026-06-25",
    organic: true,
    rating: 4.9,
    reviews: 402,
    featured: true,
    tags: ["organic", "spicy", "bestseller"],
    farmer: {
      name: "Efua Nyarko",
      region: "Central",
      farmSize: "2 acres",
      verified: true,
      rating: 4.9,
    },
  },
  {
    id: 7,
    name: "Fair-Trade Cocoa Beans",
    description: "Grade-1 fermented cocoa beans from Western Ghana — rich, fruity, world-renowned.",
    price: 45,
    category: "Cash Crops",
    image: cocoa,
    unit: "kg",
    stock: 500,
    region: "Western",
    harvestDate: "2026-04-30",
    organic: true,
    rating: 5.0,
    reviews: 148,
    featured: true,
    tags: ["export", "fair-trade", "organic"],
    farmer: {
      name: "Nana Kofi",
      region: "Western",
      farmSize: "15 acres",
      verified: true,
      rating: 5.0,
    },
  },
  {
    id: 8,
    name: "Fresh Okra",
    description: "Tender young okra — the essential thickener for a proper okro stew.",
    price: 20,
    category: "Vegetables",
    image: okra,
    unit: "kg",
    stock: 90,
    region: "Greater Accra",
    harvestDate: "2026-07-04",
    organic: true,
    rating: 4.5,
    reviews: 91,
    featured: false,
    tags: ["organic", "fresh"],
    farmer: {
      name: "Adjoa Serwaa",
      region: "Greater Accra",
      farmSize: "1 acre",
      verified: false,
      rating: 4.5,
    },
  },
];
