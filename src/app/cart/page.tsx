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
import { useCart } from "@/context/cart-context";
import { USD_TO_INR_RATE } from "@/lib/products";

function CartItem({ item, onUpdateQuantity, onRemove }: {
  item: any;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemove: (cartId: string) => void;
}) {
  const priceINR = item.price * USD_TO_INR_RATE;

  return (
    <div className="flex items-start gap-6">
      <div className="relative h-32 w-32 rounded-lg overflow-hidden">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            {item.customization && (
              <p className="text-sm text-muted-foreground">{item.customization}</p>
            )}
          </div>
          <p className="font-semibold text-lg">₹{priceINR.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center">{item.quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.cartId)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const hasItems = cartItems.length > 0;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal * 0.01; // 1% shipping
  const total = subtotal + shipping;

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
                {cartItems.map((item) => (
                  <div key={item.cartId}>
                    <CartItem 
                      item={item} 
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 rounded-lg p-6 lg:p-8 h-fit">
                <h2 className="text-2xl font-headline font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString('en-IN')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
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
