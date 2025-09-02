// This is a new file for the checkout page
'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BackButton from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <BackButton className="mb-8" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">Checkout</h1>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-headline font-semibold mb-6">Shipping Information</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Jewelry Lane" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Metropolis" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="12345" />
                  </div>
                </div>
              </form>
              
              <h2 className="text-2xl font-headline font-semibold mt-10 mb-6">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                <Label htmlFor="credit-card" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  Credit Card
                </Label>
                <Label htmlFor="debit-card" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="debit-card" id="debit-card" />
                  Debit Card
                </Label>
                <Label htmlFor="upi" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="upi" id="upi" />
                  UPI
                </Label>
              </RadioGroup>
               <p className="text-sm text-muted-foreground mt-4">* Cash on Delivery is not available.</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 lg:p-8 h-fit">
              <h2 className="text-2xl font-headline font-semibold mb-6">Order Summary</h2>
              {/* Order summary will be populated from cart context */}
              <Button size="lg" className="w-full mt-8">Pay Now</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
