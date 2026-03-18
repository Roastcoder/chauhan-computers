export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  ram?: string;
  storage?: string;
  specs: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const categories = [
  { name: "Laptops", slug: "laptops", image: "/src/assets/laptop.png" },
  { name: "Desktops", slug: "desktops", image: "/src/assets/desktop.png" },
  { name: "Gaming", slug: "gaming", image: "/src/assets/gaming.png" },
  { name: "Accessories", slug: "accessories", image: "/src/assets/accessories.png" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "ProBook Ultra 16",
    category: "laptops",
    price: 1899,
    originalPrice: 2199,
    image: "",
    brand: "Chauhaan",
    ram: "32GB",
    storage: "1TB SSD",
    specs: ["Intel Core i9-13900H", "32GB DDR5", "1TB NVMe SSD", "NVIDIA RTX 4070"],
    description: "The ProBook Ultra 16 delivers uncompromising performance in a sleek, lightweight chassis. Built for professionals who demand the best.",
    rating: 4.8,
    reviews: 124,
    badge: "New",
  },
  {
    id: "2",
    name: "Studio Tower Pro",
    category: "desktops",
    price: 2499,
    image: "",
    brand: "Chauhaan",
    ram: "64GB",
    storage: "2TB SSD",
    specs: ["AMD Ryzen 9 7950X", "64GB DDR5", "2TB NVMe SSD", "NVIDIA RTX 4080"],
    description: "Built for creative professionals. The Studio Tower Pro handles 8K editing, 3D rendering, and complex simulations with ease.",
    rating: 4.9,
    reviews: 87,
    badge: "New",
  },
  {
    id: "3",
    name: "Phantom Gaming X",
    category: "gaming",
    price: 3299,
    image: "",
    brand: "Chauhaan",
    ram: "32GB",
    storage: "2TB SSD",
    specs: ["Intel Core i9-14900K", "32GB DDR5", "2TB NVMe SSD", "NVIDIA RTX 4090"],
    description: "Dominate every game. The Phantom Gaming X features a custom liquid cooling loop and the fastest components available.",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "4",
    name: "AirSlim 14",
    category: "laptops",
    price: 999,
    originalPrice: 1199,
    image: "",
    brand: "Chauhaan",
    ram: "16GB",
    storage: "512GB SSD",
    specs: ["AMD Ryzen 7 7840U", "16GB LPDDR5", "512GB NVMe SSD", "Integrated Radeon 780M"],
    description: "Ultra-thin, ultra-light, ultra-powerful. The AirSlim 14 is your perfect everyday companion.",
    rating: 4.6,
    reviews: 312,
  },
  {
    id: "5",
    name: "Precision Wireless Mouse",
    category: "accessories",
    price: 79,
    image: "",
    brand: "Chauhaan",
    specs: ["25,000 DPI Sensor", "70-hour Battery", "USB-C Charging", "5 Programmable Buttons"],
    description: "Engineered for pixel-perfect precision with an ergonomic design that feels natural for hours.",
    rating: 4.7,
    reviews: 456,
  },
  {
    id: "6",
    name: "MechKey Pro 75",
    category: "accessories",
    price: 149,
    image: "",
    brand: "Chauhaan",
    specs: ["Gasket Mount", "Hot-swappable", "PBT Keycaps", "Wireless/Wired"],
    description: "A premium 75% mechanical keyboard with a satisfying typing experience and customizable RGB.",
    rating: 4.8,
    reviews: 189,
    badge: "New",
  },
  {
    id: "7",
    name: "Compact Workstation",
    category: "desktops",
    price: 1599,
    image: "",
    brand: "Chauhaan",
    ram: "32GB",
    storage: "1TB SSD",
    specs: ["Intel Core i7-14700", "32GB DDR5", "1TB NVMe SSD", "Intel Arc A770"],
    description: "Big performance in a small form factor. The Compact Workstation fits anywhere without compromise.",
    rating: 4.5,
    reviews: 67,
  },
  {
    id: "8",
    name: "HyperBook Gaming 17",
    category: "gaming",
    price: 2199,
    originalPrice: 2499,
    image: "",
    brand: "Chauhaan",
    ram: "32GB",
    storage: "1TB SSD",
    specs: ["AMD Ryzen 9 7945HX", "32GB DDR5", "1TB NVMe SSD", "NVIDIA RTX 4080 Mobile"],
    description: "A gaming laptop that doesn't hold back. 240Hz display, thunderous speakers, and desktop-class performance.",
    rating: 4.7,
    reviews: 158,
  },
];

export const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Software Architect",
    text: "The Studio Tower Pro transformed my development workflow. Builds that took 20 minutes now finish in under 3. Chauhaan's attention to detail is unmatched.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Digital Artist",
    text: "I've tried every brand. Chauhaan is the only one that delivers true professional-grade hardware with a premium experience from unboxing to daily use.",
    rating: 5,
  },
  {
    name: "Karan Singh",
    role: "Esports Coach",
    text: "Our entire team runs Phantom Gaming X rigs. Zero frame drops, zero issues. The reliability is what keeps us coming back.",
    rating: 5,
  },
];
