// This is a new file for the shopping cart page
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Minus, Plus, Trash2 } from "lucide-react";
import BackButton from "@/components/back-button";

function CartItem() {
  return (
    <div className="flex items-start gap-6">
      <div className="relative h-32 w-32 rounded-lg overflow-hidden">
        <Image src="https://picsum.photos/200/200?r=1" alt="Product Image" fill className="object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Solitaire Diamond Ring</h3>
            <p className="text-sm text-muted-foreground">Size: 7, 14k White Gold</p>
          </div>
          <p className="font-semibold text-lg">₹2,08,750</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center">1</span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const hasItems = true; // Placeholder

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <BackButton className="mb-8" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">Shopping Cart</h1>
          
          {hasItems ? (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <CartItem />
                <Separator />
                <CartItem />
              </div>

              <div className="bg-muted/30 rounded-lg p-6 lg:p-8 h-fit">
                <h2 className="text-2xl font-headline font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹4,17,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹2,087</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹4,19,587</span>
                  </div>
                </div>
                <Button size="lg" className="w-full mt-8">Proceed to Checkout</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-6">Your cart is empty.</p>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
