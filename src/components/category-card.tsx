'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/lib/products';
import { addCacheBusting } from '@/lib/image-utils';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={category.type === 'jewel' ? `/jewels/${category.slug}` : `/gemstones/${category.slug}`} className="block">
      <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={addCacheBusting(category.image)}
              alt={category.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/80" />
            
            {/* Premium overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="transform transition-all duration-500 group-hover:translate-y-[-4px]">
                <h3 className="text-2xl font-bold mb-3 tracking-wide text-primary">{category.name}</h3>
                <p className="text-sm text-gray-200 mb-4 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center justify-end">
                  <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Explore →
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
