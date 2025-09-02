// This is a new file for category pages
'use client'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product-card';
import { products } from '@/lib/products';
import BackButton from '@/components/back-button';

function formatCategoryName(slug: string) {
    if (!slug) return "Products";
    if (slug.includes('-')) {
      return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const categoryName = formatCategoryName(slug);
  
  const filteredProducts = products.filter(p => {
    if (p.category.toLowerCase() === slug) {
      return true;
    }
    if (p.subCategory && p.subCategory.toLowerCase() === slug) {
        return true;
    }
    return false;
  });

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <BackButton className="mb-8" />
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-headline font-bold">{categoryName}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              {`Explore our exquisite collection of ${categoryName.toLowerCase()}.`}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
