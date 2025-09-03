'use client';

import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAdminAuth } from '@/context/admin-auth-context';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';


function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-primary transition-colors">
      {children}
    </Link>
  )
}

function GemstoneDropdown() {
  const gemstones = [
    { name: 'Ruby (Manik)', slug: 'ruby' },
    { name: 'Emerald (Panna)', slug: 'emerald' },
    { name: 'Yellow Sapphire (Pukhraj)', slug: 'yellow-sapphire' },
    { name: 'Blue Sapphire (Neelam)', slug: 'blue-sapphire' },
    { name: 'Coral (Moonga)', slug: 'coral' },
    { name: 'Garnet (Gomed)', slug: 'garnet' },
    { name: 'Pink Sapphire', slug: 'pink-sapphire' },
    { name: 'Diamond (Heera)', slug: 'diamond' },
    { name: 'Pearl (Moti)', slug: 'pearl' },
    { name: 'Padparadscha', slug: 'padparadscha-sapphire' },
    { name: 'Opal (Doodh Patthar)', slug: 'opal' },
    { name: 'Amethyst (Jamunia)', slug: 'amethyst' },
    { name: 'Citrine (Sitara)', slug: 'citrine' },
    { name: 'Tanzanite', slug: 'tanzanite' },
    { name: 'Alexandrite', slug: 'alexandrite' },
    { name: 'Moonstone (Chandrakant)', slug: 'moonstone' },
    { name: 'Lapis Lazuli', slug: 'lapis-lazuli' },
    { name: 'Turquoise (Firoza)', slug: 'turquoise' },
    { name: 'Peridot', slug: 'peridot' },
    { name: 'Topaz (Pushkaraj)', slug: 'topaz' },
    { name: 'Aquamarine', slug: 'aquamarine' },
    { name: 'Spinel', slug: 'spinel' },
    { name: 'Zircon', slug: 'zircon' },
    { name: 'Tourmaline', slug: 'tourmaline' },
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:text-primary transition-colors p-0 h-auto hover:bg-transparent -mr-2">
          Gemstones
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {gemstones.map(gem => (
           <DropdownMenuItem key={gem.slug} asChild>
             <Link href={`/category/${gem.slug}`}>{gem.name}</Link>
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
  const navItems = [
    { name: 'Rings', href: '/category/rings' },
    { name: 'Necklaces', href: '/category/necklaces' },
    { name: 'Bracelets', href: '/category/bracelets' },
    { name: 'Earrings', href: '/category/earrings' },
    { name: 'Trending', href: '/category/trending' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex flex-col items-start leading-none">
          <span className="font-headline text-3xl font-bold text-primary tracking-wider">LUMERA</span>
          <span className="text-[0.6rem] text-muted-foreground tracking-[0.2em]">FINE GEMS &amp; JEWELS</span>
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
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex relative">
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
            <Button variant="ghost" size="icon" className="relative">
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
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
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
                        Gemstones
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pl-4 space-y-2 mt-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <Link href="/category/ruby" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Ruby (Manik)</Link>
                        <Link href="/category/emerald" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Emerald (Panna)</Link>
                        <Link href="/category/yellow-sapphire" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Yellow Sapphire (Pukhraj)</Link>
                        <Link href="/category/blue-sapphire" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Blue Sapphire (Neelam)</Link>
                        <Link href="/category/coral" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Coral (Moonga)</Link>
                        <Link href="/category/garnet" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Garnet (Gomed)</Link>
                        <Link href="/category/diamond" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Diamond (Heera)</Link>
                        <Link href="/category/pearl" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Pearl (Moti)</Link>
                        <Link href="/category/pink-sapphire" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Pink Sapphire</Link>
                        <Link href="/category/padparadscha-sapphire" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Padparadscha</Link>
                        <Link href="/category/opal" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Opal (Doodh Patthar)</Link>
                        <Link href="/category/amethyst" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Amethyst (Jamunia)</Link>
                        <Link href="/category/citrine" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Citrine (Sitara)</Link>
                        <Link href="/category/tanzanite" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Tanzanite</Link>
                        <Link href="/category/alexandrite" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Alexandrite</Link>
                        <Link href="/category/moonstone" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Moonstone (Chandrakant)</Link>
                        <Link href="/category/lapis-lazuli" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Lapis Lazuli</Link>
                        <Link href="/category/turquoise" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Turquoise (Firoza)</Link>
                        <Link href="/category/peridot" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Peridot</Link>
                        <Link href="/category/topaz" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Topaz (Pushkaraj)</Link>
                        <Link href="/category/aquamarine" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Aquamarine</Link>
                        <Link href="/category/spinel" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Spinel</Link>
                        <Link href="/category/zircon" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Zircon</Link>
                        <Link href="/category/tourmaline" className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">Tourmaline</Link>
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
