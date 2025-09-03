'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import BackButton from "@/components/back-button";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { USD_TO_INR_RATE } from "@/lib/products";

function WishlistItem({ item, onRemove, onAddToCart }: {
  item: any;
  onRemove: (id: number) => void;
  onAddToCart: (item: any) => void;
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
            <p className="text-sm text-muted-foreground">{item.category}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm">{item.rating}</span>
              <span className="text-sm text-muted-foreground">({item.reviews} reviews)</span>
            </div>
          </div>
          <p className="font-semibold text-lg">₹{priceINR.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button 
            size="sm"
            onClick={() => onAddToCart(item)}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const hasItems = wishlistItems.length > 0;

  const handleAddToCart = (item: any) => {
    // Create a cart item with a unique cartId
    const cartItem = {
      ...item,
      cartId: `${item.id}-${Date.now()}`,
      customization: undefined
    };
    addToCart(cartItem);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <BackButton className="mb-8" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">My Wishlist</h1>
          
          {hasItems ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {wishlistItems.map((item) => (
                <div key={item.id}>
                  <WishlistItem 
                    item={item} 
                    onRemove={removeFromWishlist}
                    onAddToCart={handleAddToCart}
                  />
                  <Separator className="mt-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-6">Your wishlist is empty.</p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


