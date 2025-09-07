'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAdminAuth } from '@/context/admin-auth-context';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { categories, subscribeCategories, loadCategoriesFromStorage } from '@/lib/products';


function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-primary transition-colors">
      {children}
    </Link>
  )
}

function GemstoneDropdown() {
  const [dynamicCategories, setDynamicCategories] = useState(categories);

  useEffect(() => {
    // Load categories immediately and update state
    loadCategoriesFromStorage();
    setDynamicCategories([...categories]);
    
    // Subscribe to future changes
    const unsubscribe = subscribeCategories((next) => setDynamicCategories([...next]));
    return () => unsubscribe();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:text-primary transition-colors p-0 h-auto hover:bg-transparent -mr-2">
          Categories
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {dynamicCategories.map(cat => (
           <DropdownMenuItem key={cat.slug} asChild>
             <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
           </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CollectionsDropdown() {
  const collections = [
    { name: 'New Arrivals', slug: 'new-arrivals' },
    { name: 'Wedding Collection', slug: 'wedding-collection' },
    { name: 'Bridal Jewelry', slug: 'bridal-jewelry' },
    { name: 'Party Wear', slug: 'party-wear' },
    { name: 'Daily Wear', slug: 'daily-wear' },
    { name: 'Traditional Sets', slug: 'traditional-sets' },
    { name: 'Modern Designs', slug: 'modern-designs' },
    { name: 'Antique Collection', slug: 'antique-collection' },
    { name: 'Luxury Pieces', slug: 'luxury-pieces' },
    { name: 'Festival Special', slug: 'festival-special' },
    { name: 'Corporate Gifts', slug: 'corporate-gifts' },
    { name: 'Temple Jewelry', slug: 'temple-jewelry' },
    { name: 'Kundan Sets', slug: 'kundan-sets' },
    { name: 'Polki Collection', slug: 'polki-collection' },
    { name: 'Meenakari Work', slug: 'meenakari-work' },
    { name: 'Jadau Jewelry', slug: 'jadau-jewelry' },
    { name: 'South Indian Style', slug: 'south-indian-style' },
    { name: 'North Indian Style', slug: 'north-indian-style' },
    { name: 'Indo-Western', slug: 'indo-western' },
    { name: 'Minimalist Collection', slug: 'minimalist-collection' },
    { name: 'Teen Collection', slug: 'teen-collection' },
    { name: 'Senior Collection', slug: 'senior-collection' },
    { name: 'Unisex Jewelry', slug: 'unisex-jewelry' },
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:text-primary transition-colors p-0 h-auto hover:bg-transparent -mr-2">
          Collections
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {collections.map(collection => (
           <DropdownMenuItem key={collection.slug} asChild>
             <Link href={`/category/${collection.slug}`}>{collection.name}</Link>
           </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Header() {
  const { isAuthenticated } = useAdminAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [dynamicCategories, setDynamicCategories] = useState(categories);
  const navItems = [
    { name: 'Trending', href: '/category/trending' },
  ];

  useEffect(() => {
    // Load categories immediately and update state
    loadCategoriesFromStorage();
    setDynamicCategories([...categories]);
    
    // Subscribe to future changes
    const unsubscribe = subscribeCategories((next) => setDynamicCategories([...next]));
    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Lumera Home">
          <div className="relative h-10 w-[140px] md:h-12 md:w-[180px]">
          <div className="relative h-10 w-[140px] md:h-12 md:w-[180px]">
  <Image
    src="/logo/Lumera_logo.PNG"
    alt="Luméra — Fine Gems & Jewels"
    fill
    className="object-contain"
    priority
  />
</div>

          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavItem href="/">Home</NavItem>
          {navItems.map(item => (
            <NavItem key={item.name} href={item.href}>
              {item.name}
            </NavItem>
          ))}
          <GemstoneDropdown />
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex relative hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
              <span className="sr-only">Shopping Bag</span>
            </Button>
          </Link>
          <Link href={isAuthenticated ? "/admin" : "/admin/login"}>
            <Button variant="outline" size="sm" className="hidden md:inline-flex hover:text-primary transition-colors">
              {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
            </Button>
          </Link>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="sr-only"><SheetTitle>Mobile navigation</SheetTitle></div>
                <nav className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
                  {navItems.map(item => (
                    <Link key={item.name} href={item.href} className="text-lg font-medium hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  ))}
                  <div className="space-y-3">
                    <details className="group">
                      <summary className="text-lg font-medium text-foreground cursor-pointer list-none flex items-center justify-between hover:text-primary transition-colors">
                        Categories
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pl-4 space-y-2 mt-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {dynamicCategories.map(cat => (
                          <Link key={cat.slug} href={`/category/${cat.slug}`} className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">{cat.name}</Link>
                        ))}
                      </div>
                    </details>
                  </div>
                  <Link href="/wishlist" className="text-lg font-medium hover:text-primary transition-colors">Wishlist</Link>
                  <Link href="/cart" className="text-lg font-medium hover:text-primary transition-colors">Shopping Cart</Link>
                  <Link href={isAuthenticated ? "/admin" : "/admin/login"} className="text-lg font-medium hover:text-primary transition-colors">
                    {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
