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
  media?: Array<{ type: 'image' | 'video'; url: string }>;
  hint: string;
  description: string;
  categoryId: number; // Reference to category
  subCategory?: string;
  subHeading?: string; // e.g., "Pure Diamond and Gold"
}

// Use empty arrays at runtime; real data comes from Supabase via API routes
export const categories: Category[] = [];

// Simple in-memory pub/sub to reflect category changes across admin screens
export type CategoriesListener = (next: Category[]) => void;
const categoriesListeners: CategoriesListener[] = [];

// Persistence (client-side only)
const CATEGORIES_STORAGE_KEY = 'lumera_categories_v1';
const PRODUCTS_STORAGE_KEY = 'lumera_products_v1';
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function loadCategoriesFromStorage(): void { /* no-op: DB is source of truth */ }

export function loadProductsFromStorage(): void { /* no-op: DB is source of truth */ }

export function setProducts(next: Product[]): void {
  products.length = 0;
  products.push(...next);
  // no-op persistence; DB is source of truth
}

export function getCategories(): Category[] {
  return categories;
}

export function setCategories(next: Category[]): void {
  categories.length = 0;
  categories.push(...next);
  categoriesListeners.forEach((listener) => listener(categories));
  // no-op persistence; DB is source of truth
}

export function subscribeCategories(listener: CategoriesListener): () => void {
  categoriesListeners.push(listener);
  return () => {
    const index = categoriesListeners.indexOf(listener);
    if (index !== -1) categoriesListeners.splice(index, 1);
  };
}

export const products: Product[] = [];

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
