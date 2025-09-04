// This is a new file to store product data
export const USD_TO_INR_RATE = 83.50;

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
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
    name: "Emeralds", 
    slug: "emeralds", 
    description: "Precious green gemstones known for their vibrant color and astrological significance",
    image: "https://picsum.photos/400/300?r=emerald",
    productCount: 0
  },
  { 
    id: 2, 
    name: "Ruby", 
    slug: "ruby", 
    description: "Deep red gemstones symbolizing passion, energy, and success",
    image: "https://picsum.photos/400/300?r=ruby",
    productCount: 0
  },
  { 
    id: 3, 
    name: "Yellow Sapphire", 
    slug: "yellow-sapphire", 
    description: "Bright yellow gemstones associated with wisdom and prosperity",
    image: "https://picsum.photos/400/300?r=yellow-sapphire",
    productCount: 0
  },
  { 
    id: 4, 
    name: "Rings", 
    slug: "rings", 
    description: "Elegant rings featuring precious stones and metals",
    image: "https://picsum.photos/400/300?r=rings",
    productCount: 0
  },
  { 
    id: 5, 
    name: "Necklaces", 
    slug: "necklaces", 
    description: "Stunning necklaces and pendants for every occasion",
    image: "https://picsum.photos/400/300?r=necklaces",
    productCount: 0
  },
  { 
    id: 6, 
    name: "Earrings", 
    slug: "earrings", 
    description: "Beautiful earrings from studs to statement pieces",
    image: "https://picsum.photos/400/300?r=earrings",
    productCount: 0
  },
  { 
    id: 7, 
    name: "Bracelets", 
    slug: "bracelets", 
    description: "Elegant bracelets and bangles for wrist adornment",
    image: "https://picsum.photos/400/300?r=bracelets",
    productCount: 0
  },
  { 
    id: 8, 
    name: "Gemstones", 
    slug: "gemstones", 
    description: "Loose precious and semi-precious gemstones",
    image: "https://picsum.photos/400/300?r=gemstones",
    productCount: 0
  }
];

export const products: Product[] = [
  { id: 1, name: "Solitaire Diamond Ring", price: 2500, image: "https://picsum.photos/800/800?r=1", hint: "diamond ring", description: "A classic and timeless solitaire diamond ring, featuring a brilliant-cut diamond set in a 14k white gold band. The epitome of elegance and simplicity.", categoryId: 4, subHeading: "Pure Diamond and Gold" },
  { id: 2, name: "Sapphire Pendant Necklace", price: 1800, image: "https://picsum.photos/800/800?r=2", hint: "sapphire necklace", description: "A stunning oval-cut sapphire surrounded by a halo of sparkling diamonds, hanging from a delicate white gold chain. A perfect 'something blue'.", categoryId: 5, subHeading: "Natural Sapphire and Diamonds" },
  { id: 3, name: "Emerald Stud Earrings", price: 1250, image: "https://picsum.photos/800/800?r=3", hint: "emerald earrings", description: "Vibrant, square-cut emeralds set in yellow gold. These stud earrings add a pop of color and sophistication to any outfit.", categoryId: 6, subHeading: "Natural Emerald and Gold" },
  { id: 4, name: "Gold Bangle Bracelet", price: 950, image: "https://picsum.photos/800/800?r=4", hint: "gold bracelet", description: "A chic and modern 18k gold bangle, perfect for stacking or wearing alone. Its polished finish provides a beautiful shine.", categoryId: 7, subHeading: "18K Pure Gold" },
  { id: 5, name: "Pearl Drop Necklace", price: 1500, image: "https://picsum.photos/800/800?r=5", hint: "pearl necklace", description: "An elegant freshwater pearl suspended from a diamond-accented bail on a sterling silver chain. A timeless classic for any occasion.", categoryId: 5, subHeading: "Freshwater Pearl and Silver" },
  { id: 6, name: "Ruby Eternity Band", price: 3100, image: "https://picsum.photos/800/800?r=6", hint: "ruby ring", description: "A breathtaking eternity band featuring deep red rubies channel-set in platinum. Symbolizes endless love and passion.", categoryId: 4, subHeading: "Natural Ruby and Platinum" },
  { id: 7, name: "Diamond Tennis Bracelet", price: 4200, image: "https://picsum.photos/800/800?r=7", hint: "diamond bracelet", description: "A luxurious tennis bracelet with a continuous line of brilliant-cut diamonds. An unforgettable statement of glamour.", categoryId: 7, subHeading: "Brilliant Cut Diamonds" },
  { id: 8, name: "Opal and Gold Earrings", price: 1100, image: "https://picsum.photos/800/800?r=8", hint: "opal earrings", description: "Mesmerizing teardrop opals dangle from 14k gold hooks, catching the light with every movement to reveal a rainbow of colors.", categoryId: 6, subHeading: "Natural Opal and Gold" },
  { id: 9, name: "Emerald (Panna)", price: 2200, image: "https://picsum.photos/800/800?r=9", hint: "emerald gemstone", description: "A high-quality, certified natural Emerald gemstone, known for its deep green color and astrological benefits.", categoryId: 1, subCategory: 'emerald', subHeading: "Certified Natural Emerald" },
  { id: 10, name: "Ruby (Manik)", price: 3500, image: "https://picsum.photos/800/800?r=10", hint: "ruby gemstone", description: "A vibrant, natural Ruby gemstone with excellent clarity and color. Believed to bring success and power to the wearer.", categoryId: 2, subCategory: 'ruby', subHeading: "Natural Ruby Gemstone" },
  { id: 11, name: "Yellow Sapphire (Pukhraj)", price: 2800, image: "https://picsum.photos/800/800?r=11", hint: "yellow sapphire", description: "An authentic Yellow Sapphire, cherished for its astrological significance and beautiful hue. Brings wisdom and prosperity.", categoryId: 3, subCategory: 'yellow-sapphire', subHeading: "Authentic Yellow Sapphire" },
  { id: 12, name: "Blue Sapphire (Neelam)", price: 4500, image: "https://picsum.photos/800/800?r=12", hint: "blue sapphire", description: "A stunning, natural Blue Sapphire gemstone. A powerful stone known for its quick-acting results and royal blue color.", categoryId: 8, subCategory: 'blue-sapphire', subHeading: "Natural Blue Sapphire" },
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

export function getProductsByCategory(categoryId: number): Product[] {
  return products.filter(product => product.categoryId === categoryId);
}

export function getProductsByCategorySlug(slug: string): Product[] {
  const category = getCategoryBySlug(slug);
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
