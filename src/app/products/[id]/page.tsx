
'use client';

import { useState, useMemo, useEffect, use } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Heart, Star } from 'lucide-react';
import BackButton from '@/components/back-button';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { products, customizationCosts, USD_TO_INR_RATE } from '@/lib/products';

function getProduct(id: string) {
  return products.find(p => p.id === parseInt(id));
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = getProduct(resolvedParams.id);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const isWishlisted = isInWishlist(product?.id || 0);
  
  // State for customizations
  const [selectedSize, setSelectedSize] = useState('15'); // Default size 15 (mid-range)
  const [purchaseType, setPurchaseType] = useState('loose');
  const [jewelryType, setJewelryType] = useState('');
  const [metalType, setMetalType] = useState('');
  
  const finalPriceUSD = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    
    // Ring size cost
    if (product.category === 'Rings' || (purchaseType === 'mounted' && (jewelryType === 'Ring' || jewelryType === 'Engagement Ring'))) {
        const baseSize = 5;
        const sizeIncrement = parseInt(selectedSize) - baseSize;
        if (sizeIncrement > 0) {
            price *= Math.pow(1.02, sizeIncrement); // 2% increase per size
        }
    }
    
    if (purchaseType === 'mounted') {
      if (jewelryType && customizationCosts.jewelryType[jewelryType as keyof typeof customizationCosts.jewelryType]) {
        price += customizationCosts.jewelryType[jewelryType as keyof typeof customizationCosts.jewelryType];
      }
      if (metalType && customizationCosts.metalType[metalType as keyof typeof customizationCosts.metalType]) {
        price += customizationCosts.metalType[metalType as keyof typeof customizationCosts.metalType];
      }
    }
    return price;
  }, [product, purchaseType, jewelryType, metalType, selectedSize]);

  const finalPriceINR = useMemo(() => {
    return finalPriceUSD * USD_TO_INR_RATE;
  }, [finalPriceUSD]);


  if (!product) {
    return (
      <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Product Not Found</h1>
            <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the product you're looking for.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    let customizationDetails = '';
    if (product.category === 'Rings') {
       customizationDetails = `Size: ${selectedSize}`;
    } else if (product.category === 'Gemstones') {
      if (purchaseType === 'loose') {
        customizationDetails = 'Loose Stone';
      } else {
        customizationDetails = `Mounted in ${jewelryType} (${metalType})`;
        if (jewelryType === 'Ring' || jewelryType === 'Engagement Ring') {
            customizationDetails += `, Size: ${selectedSize}`;
        }
      }
    }

    const itemToAdd = {
      ...product,
      price: finalPriceUSD,
      customization: customizationDetails,
      // Create a unique id for cart items based on customizations
      cartId: `${product.id}-${selectedSize}-${purchaseType}-${jewelryType}-${metalType}`
    };
    addToCart(itemToAdd);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your shopping cart.`,
    });
  };
  
  const basePriceINR = product.price * USD_TO_INR_RATE;

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <BackButton className="mb-8" />
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
              <Image 
                src={product.image}
                alt={product.name}
                data-ai-hint={product.hint}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-primary">{product.category}</span>
                <h1 className="text-3xl md:text-4xl font-headline font-bold mt-1">{product.name}</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">{product.rating} ({product.reviews} reviews)</span>
              </div>
              
              <p className="text-lg text-foreground/80 leading-relaxed">{product.description}</p>
              
              {/* Customization Options */}
              {product.category === 'Rings' && (
                <div className="space-y-4 pt-4">
                   <Label className='text-base'>Ring Size</Label>
                   <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 26 }, (_, i) => i + 5).map(size => (
                          <SelectItem key={size} value={size.toString()}>Size {size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
              )}

              {product.category === 'Gemstones' && (
                <div className="space-y-6 pt-4">
                  <Separator />
                  <h3 className="text-xl font-headline font-semibold">Customize Your Gemstone</h3>
                  
                  {/* Purchase Type */}
                  <div className="space-y-3">
                    <Label className="text-base">Purchase Type</Label>
                    <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="flex gap-4">
                      <Label htmlFor="loose-stone" className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary flex-1 justify-center">
                        <RadioGroupItem value="loose" id="loose-stone" />
                        Loose Stone
                      </Label>
                      <Label htmlFor="mounted" className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary flex-1 justify-center">
                        <RadioGroupItem value="mounted" id="mounted" />
                        Mount in Jewelry
                      </Label>
                    </RadioGroup>
                  </div>

                  {/* Jewelry Type (Conditional) */}
                  {purchaseType === 'mounted' && (
                    <div className="space-y-3 animate-fade-in">
                      <Label htmlFor='jewelry-type' className="text-base">Jewelry Type</Label>
                      <Select value={jewelryType} onValueChange={setJewelryType}>
                        <SelectTrigger id='jewelry-type'>
                          <SelectValue placeholder="Select jewelry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ring">Ring</SelectItem>
                          <SelectItem value="Pendant">Pendant</SelectItem>
                          <SelectItem value="Engagement Ring">Engagement Ring</SelectItem>
                          <SelectItem value="Other">Other available designs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Ring Size (Conditional) */}
                  {purchaseType === 'mounted' && (jewelryType === 'Ring' || jewelryType === 'Engagement Ring') && (
                     <div className="space-y-3 animate-fade-in">
                      <Label htmlFor='ring-size' className="text-base">Ring Size</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger id='ring-size' className="w-[180px]">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 26 }, (_, i) => i + 5).map(size => (
                            <SelectItem key={size} value={size.toString()}>Size {size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Metal Type (Conditional) */}
                  {purchaseType === 'mounted' && jewelryType && (
                     <div className="space-y-3 animate-fade-in">
                      <Label htmlFor='metal-type' className="text-base">Metal Type</Label>
                      <Select value={metalType} onValueChange={setMetalType}>
                        <SelectTrigger id='metal-type'>
                          <SelectValue placeholder="Select metal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14K Gold – Yellow">14K Gold – Yellow</SelectItem>
                          <SelectItem value="14K Gold – White">14K Gold – White</SelectItem>
                          <SelectItem value="18K Gold – Yellow">18K Gold – Yellow</SelectItem>
                          <SelectItem value="18K Gold – White">18K Gold – White</SelectItem>
                          <SelectItem value="22K Gold – Yellow">22K Gold – Yellow</SelectItem>
                          <SelectItem value="22K Gold – White">22K Gold – White</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Panch Dhatu">Panch Dhatu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Separator />
                </div>
              )}
              
              <div>
                <p className="text-4xl font-bold text-primary">₹{finalPriceINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                 <p className="text-lg text-muted-foreground">
                   (approx. ${finalPriceUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })})
                 </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>Add to Cart</Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-12 w-12 ${isWishlisted ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}`}
                  onClick={() => {
                    if (isWishlisted) {
                      removeFromWishlist(product.id);
                      toast({
                        title: 'Removed from Wishlist',
                        description: 'Item has been removed from your wishlist.',
                      });
                    } else {
                      addToWishlist(product);
                      toast({
                        title: 'Added to Wishlist',
                        description: 'Item has been added to your wishlist.',
                      });
                    }
                  }}
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
