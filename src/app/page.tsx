import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product-card';
import RecommendationWizard from '@/components/recommendation-wizard';
import { products, USD_TO_INR_RATE } from '@/lib/products';

function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full animate-fade-in">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Elegant jewelry piece on a dark background"
        data-ai-hint="elegant jewelry"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-primary-foreground p-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-primary animate-fade-in-down [animation-delay:0.2s]">
          Exquisite Craftsmanship
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-foreground animate-fade-in-up [animation-delay:0.5s]">
          Discover timeless elegance and unparalleled quality in every piece.
        </p>
        <Button size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 animate-fade-in [animation-delay:0.8s]">
          Explore Collection
        </Button>
      </div>
    </section>
  );
}

function ProductSection() {

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Collection</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Curated pieces of art, for moments that matter. Each jewel is a testament to our commitment to quality and elegance.</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-end">
          <Select defaultValue="featured">
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
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="rings">Rings</SelectItem>
              <SelectItem value="necklaces">Necklaces</SelectItem>
              <SelectItem value="bracelets">Bracelets</SelectItem>
              <SelectItem value="earrings">Earrings</SelectItem>
              <SelectItem value="gemstones">Gemstones</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AIRecommendationSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Find Your Perfect Match</h2>
            <p className="text-foreground/80 mt-4 text-lg">
              Let our AI stylist curate a personalized selection of jewelry just for you. Tell us a bit about your style, and discover pieces you'll love.
            </p>
            <Image
              src="https://picsum.photos/600/400?r=9"
              alt="AI illustration of jewelry design"
              data-ai-hint="abstract jewelry"
              width={600}
              height={400}
              className="rounded-lg mt-8 shadow-lg"
            />
          </div>
          <div>
            <RecommendationWizard />
          </div>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductSection />
        <AIRecommendationSection />
      </main>
      <Footer />
    </div>
  );
}
