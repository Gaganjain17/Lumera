// This is a new file to store product data
export const USD_TO_INR_RATE = 83.50;

export type CategoryType = 'jewel' | 'gemstone';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  type: CategoryType;
}

export interface Product {
  id: number;
  name: string;
  price: number; // in USD
  image: string;
  hint: string;
  description: string;
  categoryId: number; // Reference to category
  subCategory?: string;
  subHeading?: string; // e.g., "Pure Diamond and Gold"
}

export const categories: Category[] = [
  { 
    id: 1, 
    name: "Emerald", 
    slug: "emerald", 
    description: "Precious green gemstones known for their vibrant color and astrological significance",
    image: "https://placehold.co/400x300/10b981/ffffff?text=Emerald",
    productCount: 0,
    type: 'gemstone'
  },
  { 
    id: 2, 
    name: "Ruby", 
    slug: "ruby", 
    description: "Deep red gemstones symbolizing passion, energy, and success",
    image: "https://placehold.co/400x300/dc2626/ffffff?text=Ruby",
    productCount: 0,
    type: 'gemstone'
  },
  { 
    id: 3, 
    name: "Yellow Sapphire", 
    slug: "yellow-sapphire", 
    description: "Bright yellow gemstones associated with wisdom and prosperity",
    image: "https://placehold.co/400x300/eab308/ffffff?text=Yellow+Sapphire",
    productCount: 0,
    type: 'gemstone'
  },
  { 
    id: 4, 
    name: "Rings", 
    slug: "rings", 
    description: "Elegant rings featuring precious stones and metals",
    image: "https://placehold.co/400x300/7c3aed/ffffff?text=Rings",
    productCount: 0,
    type: 'jewel'
  },
  { 
    id: 5, 
    name: "Necklaces", 
    slug: "necklaces", 
    description: "Stunning necklaces and pendants for every occasion",
    image: "https://placehold.co/400x300/ec4899/ffffff?text=Necklaces",
    productCount: 0,
    type: 'jewel'
  },
  { 
    id: 6, 
    name: "Earrings", 
    slug: "earrings", 
    description: "Beautiful earrings from studs to statement pieces",
    image: "https://placehold.co/400x300/f59e0b/ffffff?text=Earrings",
    productCount: 0,
    type: 'jewel'
  },
  { 
    id: 7, 
    name: "Bracelets", 
    slug: "bracelets", 
    description: "Elegant bracelets and bangles for wrist adornment",
    image: "https://placehold.co/400x300/06b6d4/ffffff?text=Bracelets",
    productCount: 0,
    type: 'jewel'
  },
  { 
    id: 8, 
    name: "Blue Sapphire", 
    slug: "blue-sapphire", 
    description: "A powerful stone known for its quick-acting results and royal blue color",
    image: "https://placehold.co/400x300/2563eb/ffffff?text=Blue+Sapphire",
    productCount: 0,
    type: 'gemstone'
  }
];

// Simple in-memory pub/sub to reflect category changes across admin screens
export type CategoriesListener = (next: Category[]) => void;
const categoriesListeners: CategoriesListener[] = [];

// Persistence (client-side only)
const CATEGORIES_STORAGE_KEY = 'lumera_categories_v1';
const PRODUCTS_STORAGE_KEY = 'lumera_products_v1';
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function loadCategoriesFromStorage(): void {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) return;
    const savedRaw: any[] = JSON.parse(raw);
    if (Array.isArray(savedRaw) && savedRaw.length > 0) {
      const migrated: Category[] = savedRaw.map((c: any, index: number) => {
        // Infer type if missing
        let inferred: CategoryType | undefined = c.type;
        if (!inferred) {
          const slug: string = (c.slug || '').toString();
          const jewelSlugs = ['rings', 'necklaces', 'earrings', 'bracelets'];
          const gemstoneSlugs = ['emerald', 'ruby', 'yellow-sapphire', 'blue-sapphire'];
          if (jewelSlugs.includes(slug)) inferred = 'jewel';
          else if (gemstoneSlugs.includes(slug)) inferred = 'gemstone';
          else inferred = 'jewel';
        }
        return {
          id: typeof c.id === 'number' ? c.id : index + 1,
          name: c.name || '',
          slug: c.slug || '',
          description: c.description || '',
          image: c.image || '',
          productCount: typeof c.productCount === 'number' ? c.productCount : 0,
          type: inferred,
        } as Category;
      });
      categories.length = 0;
      categories.push(...migrated);
      categoriesListeners.forEach((listener) => listener(categories));
    }
  } catch {
    // ignore corrupted storage
  }
}

export function loadProductsFromStorage(): void {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return;
    const saved: Product[] = JSON.parse(raw);
    if (Array.isArray(saved) && saved.length > 0) {
      products.length = 0;
      products.push(...saved);
    }
  } catch {
    // ignore corrupted storage
  }
}

export function setProducts(next: Product[]): void {
  products.length = 0;
  products.push(...next);
  if (isBrowser()) {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // storage quota or other issues ignored
    }
  }
}

export function getCategories(): Category[] {
  return categories;
}

export function setCategories(next: Category[]): void {
  categories.length = 0;
  categories.push(...next);
  categoriesListeners.forEach((listener) => listener(categories));
  if (isBrowser()) {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // storage quota or other issues ignored
    }
  }
}

export function subscribeCategories(listener: CategoriesListener): () => void {
  categoriesListeners.push(listener);
  return () => {
    const index = categoriesListeners.indexOf(listener);
    if (index !== -1) categoriesListeners.splice(index, 1);
  };
}

export const products: Product[] = [
  { id: 1, name: "Solitaire Diamond Ring", price: 2500, image: "https://placehold.co/800x800/7c3aed/ffffff?text=Diamond+Ring", hint: "diamond ring", description: "A classic and timeless solitaire diamond ring, featuring a brilliant-cut diamond set in a 14k white gold band. The epitome of elegance and simplicity.", categoryId: 4, subHeading: "Pure Diamond and Gold" },
  { id: 2, name: "Sapphire Pendant Necklace", price: 1800, image: "https://placehold.co/800x800/2563eb/ffffff?text=Sapphire+Necklace", hint: "sapphire necklace", description: "A stunning oval-cut sapphire surrounded by a halo of sparkling diamonds, hanging from a delicate white gold chain. A perfect 'something blue'.", categoryId: 5, subHeading: "Natural Sapphire and Diamonds" },
  { id: 3, name: "Emerald Stud Earrings", price: 1250, image: "https://placehold.co/800x800/10b981/ffffff?text=Emerald+Earrings", hint: "emerald earrings", description: "Vibrant, square-cut emeralds set in yellow gold. These stud earrings add a pop of color and sophistication to any outfit.", categoryId: 6, subHeading: "Natural Emerald and Gold" },
  { id: 4, name: "Gold Bangle Bracelet", price: 950, image: "https://placehold.co/800x800/eab308/ffffff?text=Gold+Bracelet", hint: "gold bracelet", description: "A chic and modern 18k gold bangle, perfect for stacking or wearing alone. Its polished finish provides a beautiful shine.", categoryId: 7, subHeading: "18K Pure Gold" },
  { id: 5, name: "Pearl Drop Necklace", price: 1500, image: "https://placehold.co/800x800/6b7280/ffffff?text=Pearl+Necklace", hint: "pearl necklace", description: "An elegant freshwater pearl suspended from a diamond-accented bail on a sterling silver chain. A timeless classic for any occasion.", categoryId: 5, subHeading: "Freshwater Pearl and Silver" },
  { id: 6, name: "Ruby Eternity Band", price: 3100, image: "https://placehold.co/800x800/dc2626/ffffff?text=Ruby+Ring", hint: "ruby ring", description: "A breathtaking eternity band featuring deep red rubies channel-set in platinum. Symbolizes endless love and passion.", categoryId: 4, subHeading: "Natural Ruby and Platinum" },
  { id: 7, name: "Diamond Tennis Bracelet", price: 4200, image: "https://placehold.co/800x800/06b6d4/ffffff?text=Diamond+Bracelet", hint: "diamond bracelet", description: "A luxurious tennis bracelet with a continuous line of brilliant-cut diamonds. An unforgettable statement of glamour.", categoryId: 7, subHeading: "Brilliant Cut Diamonds" },
  { id: 8, name: "Opal and Gold Earrings", price: 1100, image: "https://placehold.co/800x800/f59e0b/ffffff?text=Opal+Earrings", hint: "opal earrings", description: "Mesmerizing teardrop opals dangle from 14k gold hooks, catching the light with every movement to reveal a rainbow of colors.", categoryId: 6, subHeading: "Natural Opal and Gold" },
  { id: 9, name: "Emerald (Panna)", price: 2200, image: "https://placehold.co/800x800/10b981/ffffff?text=Emerald+Gemstone", hint: "emerald gemstone", description: "A high-quality, certified natural Emerald gemstone, known for its deep green color and astrological benefits.", categoryId: 1, subCategory: 'emerald', subHeading: "Certified Natural Emerald" },
  { id: 10, name: "Ruby (Manik)", price: 3500, image: "https://placehold.co/800x800/dc2626/ffffff?text=Ruby+Gemstone", hint: "ruby gemstone", description: "A vibrant, natural Ruby gemstone with excellent clarity and color. Believed to bring success and power to the wearer.", categoryId: 2, subCategory: 'ruby', subHeading: "Natural Ruby Gemstone" },
  { id: 11, name: "Yellow Sapphire (Pukhraj)", price: 2800, image: "https://placehold.co/800x800/eab308/ffffff?text=Yellow+Sapphire", hint: "yellow sapphire", description: "An authentic Yellow Sapphire, cherished for its astrological significance and beautiful hue. Brings wisdom and prosperity.", categoryId: 3, subCategory: 'yellow-sapphire', subHeading: "Authentic Yellow Sapphire" },
  { id: 12, name: "Blue Sapphire (Neelam)", price: 4500, image: "https://placehold.co/800x800/2563eb/ffffff?text=Blue+Sapphire", hint: "blue sapphire", description: "A stunning, natural Blue Sapphire gemstone. A powerful stone known for its quick-acting results and royal blue color.", categoryId: 8, subCategory: 'blue-sapphire', subHeading: "Natural Blue Sapphire" },
];

// Update product counts for each category
export function updateCategoryProductCounts() {
  categories.forEach(category => {
    category.productCount = products.filter(product => product.categoryId === category.id).length;
  });
}

// Initialize product counts
updateCategoryProductCounts();

// Helper functions
export function getCategoryById(id: number): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

export function getCategoriesByType(type: CategoryType): Category[] {
  return categories.filter(cat => cat.type === type);
}

export function getCategoryBySlugWithinType(type: CategoryType, slug: string): Category | undefined {
  return categories.find(cat => cat.type === type && cat.slug === slug);
}

export function getProductsByCategory(categoryId: number): Product[] {
  return products.filter(product => product.categoryId === categoryId);
}

export function getProductsByCategorySlug(slug: string): Product[] {
  const category = getCategoryBySlug(slug);
  if (!category) return [];
  return getProductsByCategory(category.id);
}

export function getProductsByTypeAndCategorySlug(type: CategoryType, slug: string): Product[] {
  const category = getCategoryBySlugWithinType(type, slug);
  if (!category) return [];
  return getProductsByCategory(category.id);
}

export const customizationCosts = {
  jewelryType: {
    'Ring': 200,
    'Pendant': 150,
    'Engagement Ring': 350,
    'Other': 100,
  },
  metalType: {
    '14K Gold – Yellow': 300,
    '14K Gold – White': 320,
    '18K Gold – Yellow': 450,
    '18K Gold – White': 480,
    '22K Gold – Yellow': 600,
    '22K Gold – White': 630,
    'Silver': 100,
    'Panch Dhatu': 80,
  },
}
