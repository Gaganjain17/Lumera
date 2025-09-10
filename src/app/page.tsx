'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product-card';
import CategoryCard from '@/components/category-card';
import AdminQuickAccess from '@/components/admin-quick-access';
import { categories, products, USD_TO_INR_RATE, subscribeCategories, loadCategoriesFromStorage } from '@/lib/products';
import { addInquiry } from '@/lib/inquiries';
import { useToast } from '@/hooks/use-toast';

function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full animate-fade-in">
      <Image
        src="https://placehold.co/1920x1080/1f2937/ffffff?text=Lumera+Fine+Gems+%26+Jewels"
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

function CategorySection() {
  const [dynamicCategories, setDynamicCategories] = React.useState(categories);

  React.useEffect(() => {
    // Load categories immediately and update state
    loadCategoriesFromStorage();
    setDynamicCategories([...categories]);
    
    // Subscribe to future changes
    const unsubscribe = subscribeCategories((next) => setDynamicCategories([...next]));
    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight text-primary">Our Collection</h2>
          <p className="text-muted-foreground mt-6 max-w-3xl mx-auto text-lg leading-relaxed">Explore our carefully curated categories of exquisite jewelry and gemstones. Each category represents our commitment to quality and elegance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
          {dynamicCategories.map(category => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AIRecommendationSection() {
  const [expertOpen, setExpertOpen] = useState(false);
  const [expertForm, setExpertForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const { toast } = useToast();

  const handleSubmitInquiry = () => {
    if (!expertForm.name || !expertForm.mobile || !expertForm.message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    addInquiry({
      name: expertForm.name,
      email: expertForm.email || undefined,
      mobile: expertForm.mobile,
      message: expertForm.message,
    });
    
    setExpertOpen(false);
    setExpertForm({ name: '', email: '', mobile: '', message: '' });
    toast({ 
      title: 'Query Sent', 
      description: 'Our expert will contact you shortly.' 
    });
  };

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Find Your Perfect Match</h2>
          <p className="text-foreground/80 text-lg mb-8">
            Get personalized advice from our jewelry experts to find the perfect pieces for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button 
              onClick={() => setExpertOpen(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Talk with Our Expert
            </Button>
            <a 
              href="https://wa.me/919987312555?text=Hello, I need help finding the perfect jewelry piece" 
              target="_blank" 
              className="w-full"
            >
              <Button 
                variant="outline" 
                className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600"
                size="lg"
              >
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Expert Chat Dialog */}
      <UIDialog open={expertOpen} onOpenChange={setExpertOpen}>
        <UIDialogContent className="max-w-lg">
          <UIDialogHeader>
            <UIDialogTitle>Talk with Expert</UIDialogTitle>
          </UIDialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input 
                placeholder="Name*" 
                value={expertForm.name} 
                onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })} 
              />
              <Input 
                placeholder="Email" 
                type="email" 
                value={expertForm.email} 
                onChange={(e) => setExpertForm({ ...expertForm, email: e.target.value })} 
              />
            </div>
            <Input 
              placeholder="Mobile*" 
              value={expertForm.mobile} 
              onChange={(e) => setExpertForm({ ...expertForm, mobile: e.target.value })} 
            />
            <Textarea 
              placeholder="Message*" 
              rows={4} 
              value={expertForm.message} 
              onChange={(e) => setExpertForm({ ...expertForm, message: e.target.value })} 
            />
            <div className="space-y-3">
              <a 
                href="https://wa.me/919987312555?text=Hello, I need help finding the perfect jewelry piece" 
                target="_blank" 
                className="block text-center text-primary hover:underline text-sm"
              >
                Chat on WhatsApp
              </a>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setExpertOpen(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSubmitInquiry} className="flex-1">Send</Button>
              </div>
            </div>
          </div>
        </UIDialogContent>
      </UIDialog>
    </section>
  );
}


export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <AIRecommendationSection />
      </main>
      <Footer />
      <AdminQuickAccess />
    </div>
  );
}
