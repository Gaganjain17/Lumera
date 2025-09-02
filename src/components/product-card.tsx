import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/products';

export default function ProductCard(product: Product) {
  const { id, name, price, image, hint } = product;

  return (
    <Link href={`/products/${id}`}>
      <Card className="overflow-hidden group border-transparent bg-transparent shadow-none hover:shadow-2xl hover:border-primary/20 transition-all duration-300 h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={name}
              data-ai-hint={hint}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <Button variant="secondary" size="icon" className="absolute top-3 right-3 h-8 w-8 bg-background/50 hover:bg-background/80 text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 text-center flex flex-col flex-grow">
            <h3 className="font-semibold truncate text-lg flex-grow">{name}</h3>
            <p className="mt-1 text-primary font-medium">${price.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
