// This is a new file to store product data
export const USD_TO_INR_RATE = 83.50;

export interface Product {
  id: number;
  name: string;
  price: number; // in USD
  image: string;
  hint: string;
  description: string;
  category: string;
  subCategory?: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  { id: 1, name: "Solitaire Diamond Ring", price: 2500, image: "https://picsum.photos/800/800?r=1", hint: "diamond ring", description: "A classic and timeless solitaire diamond ring, featuring a brilliant-cut diamond set in a 14k white gold band. The epitome of elegance and simplicity.", category: "Rings", rating: 4.8, reviews: 120 },
  { id: 2, name: "Sapphire Pendant Necklace", price: 1800, image: "https://picsum.photos/800/800?r=2", hint: "sapphire necklace", description: "A stunning oval-cut sapphire surrounded by a halo of sparkling diamonds, hanging from a delicate white gold chain. A perfect 'something blue'.", category: "Necklaces", rating: 4.9, reviews: 85 },
  { id: 3, name: "Emerald Stud Earrings", price: 1250, image: "https://picsum.photos/800/800?r=3", hint: "emerald earrings", description: "Vibrant, square-cut emeralds set in yellow gold. These stud earrings add a pop of color and sophistication to any outfit.", category: "Earrings", rating: 4.7, reviews: 95 },
  { id: 4, name: "Gold Bangle Bracelet", price: 950, image: "https://picsum.photos/800/800?r=4", hint: "gold bracelet", description: "A chic and modern 18k gold bangle, perfect for stacking or wearing alone. Its polished finish provides a beautiful shine.", category: "Bracelets", rating: 4.6, reviews: 70 },
  { id: 5, name: "Pearl Drop Necklace", price: 1500, image: "https://picsum.photos/800/800?r=5", hint: "pearl necklace", description: "An elegant freshwater pearl suspended from a diamond-accented bail on a sterling silver chain. A timeless classic for any occasion.", category: "Necklaces", rating: 4.8, reviews: 110 },
  { id: 6, name: "Ruby Eternity Band", price: 3100, image: "https://picsum.photos/800/800?r=6", hint: "ruby ring", description: "A breathtaking eternity band featuring deep red rubies channel-set in platinum. Symbolizes endless love and passion.", category: "Rings", rating: 4.9, reviews: 60 },
  { id: 7, name: "Diamond Tennis Bracelet", price: 4200, image: "https://picsum.photos/800/800?r=7", hint: "diamond bracelet", description: "A luxurious tennis bracelet with a continuous line of brilliant-cut diamonds. An unforgettable statement of glamour.", category: "Bracelets", rating: 4.9, reviews: 92 },
  { id: 8, name: "Opal and Gold Earrings", price: 1100, image: "https://picsum.photos/800/800?r=8", hint: "opal earrings", description: "Mesmerizing teardrop opals dangle from 14k gold hooks, catching the light with every movement to reveal a rainbow of colors.", category: "Earrings", rating: 4.7, reviews: 78 },
  { id: 9, name: "Emerald (Panna)", price: 2200, image: "https://picsum.photos/800/800?r=9", hint: "emerald gemstone", description: "A high-quality, certified natural Emerald gemstone, known for its deep green color and astrological benefits.", category: "Gemstones", subCategory: 'emerald', rating: 4.9, reviews: 45 },
  { id: 10, name: "Ruby (Manik)", price: 3500, image: "https://picsum.photos/800/800?r=10", hint: "ruby gemstone", description: "A vibrant, natural Ruby gemstone with excellent clarity and color. Believed to bring success and power to the wearer.", category: "Gemstones", subCategory: 'ruby', rating: 4.8, reviews: 55 },
  { id: 11, name: "Yellow Sapphire (Pukhraj)", price: 2800, image: "https://picsum.photos/800/800?r=11", hint: "yellow sapphire", description: "An authentic Yellow Sapphire, cherished for its astrological significance and beautiful hue. Brings wisdom and prosperity.", category: "Gemstones", subCategory: 'yellow-sapphire', rating: 4.9, reviews: 65 },
  { id: 12, name: "Blue Sapphire (Neelam)", price: 4500, image: "https://picsum.photos/800/800?r=12", hint: "blue sapphire", description: "A stunning, natural Blue Sapphire gemstone. A powerful stone known for its quick-acting results and royal blue color.", category: "Gemstones", subCategory: 'blue-sapphire', rating: 4.9, reviews: 70 },
];

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
