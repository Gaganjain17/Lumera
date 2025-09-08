'use client';

import { useState, use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product-card';
import BackButton from '@/components/back-button';
import { 
  getCategoryBySlugWithinType, 
  getProductsByTypeAndCategorySlug, 
  loadProductsFromStorage,
  loadCategoriesFromStorage
} from '@/lib/products';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function GemstonesCategoryPage({ params }: CategoryPageProps) {
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const resolvedParams = use(params);

  useEffect(() => {
    loadProductsFromStorage();
    loadCategoriesFromStorage();
  }, []);

  const category = getCategoryBySlugWithinType('gemstone', resolvedParams.slug);
  const products = getProductsByTypeAndCategorySlug('gemstone', resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const filteredProducts = sortedProducts.filter(product => {
    if (priceRange === 'all') return true;
    if (priceRange === 'under-1000') return product.price < 1000;
    if (priceRange === '1000-2500') return product.price >= 1000 && product.price <= 2500;
    if (priceRange === '2500-5000') return product.price > 2500 && product.price <= 5000;
    if (priceRange === 'over-5000') return product.price > 5000;
    return true;
  });

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <Header />
      <main className="flex-1">
        <section className="relative py-16 md:py-24">
          <div className="container">
            <BackButton />
            <div className="mt-8 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="outline" className="mb-4">
                  {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
                  {category.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Premium Quality</Badge>
                  <Badge variant="secondary">Certified</Badge>
                  <Badge variant="secondary">Authentic</Badge>
                </div>
              </div>
              <div className="relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold">Products in {category.name}</h2>
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-1000">Under $1,000</SelectItem>
                    <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                    <SelectItem value="over-5000">Over $5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or browse other categories.
                </p>
                <Link href="/">
                  <Button variant="outline">Browse All Categories</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}



