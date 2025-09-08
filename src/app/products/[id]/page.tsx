
'use client';

import { useState, useMemo, useEffect, use } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { addInquiry } from '@/lib/inquiries';
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle, DialogFooter as UIDialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { products, customizationCosts, USD_TO_INR_RATE, getCategoryById } from '@/lib/products';
import { getBankDetails } from '@/lib/bank';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function getProduct(id: string) {
  return products.find(p => p.id === parseInt(id));
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = getProduct(resolvedParams.id);
  const { addToCart } = useCart();
  const [expertOpen, setExpertOpen] = useState(false);
  const [expertForm, setExpertForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const handleSubmitInquiry = () => {
    if (!expertForm.name || !expertForm.mobile || !expertForm.message) return;
    addInquiry({
      name: expertForm.name,
      email: expertForm.email || undefined,
      mobile: expertForm.mobile,
      message: expertForm.message,
      productId: product.id,
      productName: product.name,
    });
    setExpertOpen(false);
    setExpertForm({ name: '', email: '', mobile: '', message: '' });
    toast({ title: 'Query Sent', description: 'Our expert will contact you shortly.' });
  };
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
    const category = getCategoryById(product.categoryId);
    if (category?.name === 'Rings' || (purchaseType === 'mounted' && (jewelryType === 'Ring' || jewelryType === 'Engagement Ring'))) {
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
    const category = getCategoryById(product.categoryId);
    if (category?.name === 'Rings') {
       customizationDetails = `Size: ${selectedSize}`;
    } else if (category?.name === 'Gemstones') {
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
  const bank = getBankDetails();
  const [qrOpen, setQrOpen] = useState(false);

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
                <span className="text-sm font-medium text-primary">{getCategoryById(product.categoryId)?.name}</span>
                <h1 className="text-3xl md:text-4xl font-headline font-bold mt-1">{product.name}</h1>
              </div>

              <div className="h-1" />
              
              {product.subHeading && (
                <div className="mt-2">
                  <p className="text-lg font-medium text-primary">{product.subHeading}</p>
                </div>
              )}
              
              <p className="text-lg text-foreground/80 leading-relaxed">{product.description}</p>
              
              {/* Customization Options */}
              {getCategoryById(product.categoryId)?.name === 'Rings' && (
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

              {getCategoryById(product.categoryId)?.name === 'Gemstones' && (
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button size="lg" className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
                <Link href={`/checkout?buyNow=${product.id}`}>
                  <Button size="lg" className="w-full">Buy Now</Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full" onClick={() => setExpertOpen(true)}>Talk with Expert</Button>
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

              <UIDialog open={expertOpen} onOpenChange={setExpertOpen}>
                <UIDialogContent className="max-w-lg">
                  <UIDialogHeader>
                    <UIDialogTitle>Talk with Expert</UIDialogTitle>
                  </UIDialogHeader>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input placeholder="Name*" value={expertForm.name} onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })} />
                      <Input placeholder="Email" type="email" value={expertForm.email} onChange={(e) => setExpertForm({ ...expertForm, email: e.target.value })} />
                    </div>
                    <Input placeholder="Mobile*" value={expertForm.mobile} onChange={(e) => setExpertForm({ ...expertForm, mobile: e.target.value })} />
                    <Textarea placeholder="Message*" rows={4} value={expertForm.message} onChange={(e) => setExpertForm({ ...expertForm, message: e.target.value })} />
                    <div className="flex items-center justify-between">
                      <a href={`https://wa.me/919987312555?text=${encodeURIComponent('Hello, I have a query about: ' + product.name)}`} target="_blank" className="text-primary hover:underline">Chat on WhatsApp</a>
                      <div className="space-x-2">
                        <Button variant="outline" onClick={() => setExpertOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmitInquiry}>Send</Button>
                      </div>
                    </div>
                  </div>
                </UIDialogContent>
              </UIDialog>

              {/* Bank Details */}
              <div className="pt-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="bank-details">
                    <AccordionTrigger>Bank Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-background">
                          <CardContent className="p-4 space-y-2 text-sm">
                            <div><span className="font-medium text-foreground">Account Holder:</span> {bank.accountHolder}</div>
                            <div><span className="font-medium text-foreground">Bank Name:</span> {bank.bankName}</div>
                            <div><span className="font-medium text-foreground">Account Number:</span> {bank.accountNumber}</div>
                            <div><span className="font-medium text-foreground">IFSC Code:</span> {bank.ifscCode}</div>
                            <div><span className="font-medium text-foreground">Account Type:</span> {bank.accountType}</div>
                            <div><span className="font-medium text-foreground">UPI ID:</span> {bank.upiId}</div>
                          </CardContent>
                        </Card>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <button onClick={() => setQrOpen(true)} className="focus:outline-none">
                            <img src={bank.qrImageUrl} alt="Bank QR" className="w-56 h-56 object-contain rounded border" />
                          </button>
                          <div className="text-xs text-muted-foreground">Scan to Pay with any UPI App</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                  <DialogContent className="max-w-md">
                    <img src={bank.qrImageUrl} alt="Bank QR Large" className="w-full h-auto" />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
