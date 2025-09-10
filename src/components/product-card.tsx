'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Product, getCategoryById } from '@/lib/products';
import { useWishlist } from '@/context/wishlist-context';
import { USD_TO_INR_RATE } from '@/lib/products';
import { addCacheBusting } from '@/lib/image-utils';

export default function ProductCard(product: Product) {
  const { id, name, price, image, hint, categoryId, subHeading } = product;
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  return (
    <Link href={`/products/${id}`}>
      <Card className="overflow-hidden group border-transparent bg-transparent shadow-none hover:shadow-2xl hover:border-primary/20 transition-all duration-300 h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={addCacheBusting(image)}
              alt={name}
              data-ai-hint={hint}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
            />
            <Button 
              variant="secondary" 
              size="icon" 
              className={`absolute top-3 right-3 h-8 w-8 bg-background/50 hover:bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-foreground'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isWishlisted) {
                  removeFromWishlist(id);
                } else {
                  addToWishlist(product);
                }
              }}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <div className="p-4 text-center flex flex-col flex-grow">
            <h3 className="font-semibold truncate text-lg flex-grow">{name}</h3>
            {subHeading && (
              <p className="text-sm text-muted-foreground mt-1 truncate">{subHeading}</p>
            )}
            <div className="mt-2 space-y-1">
              <p className="text-primary font-medium">₹{(price * USD_TO_INR_RATE).toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground">${price.toLocaleString()}</p>
            </div>
            <div className="mt-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
