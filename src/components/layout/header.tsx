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


function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-primary transition-colors">
      {children}
    </Link>
  )
}

function GemstoneDropdown() {
  const gemstones = [
    { name: 'Emerald (Panna)', slug: 'emerald' },
    { name: 'Ruby (Manik)', slug: 'ruby' },
    { name: 'Yellow Sapphire (Pukhraj)', slug: 'yellow-sapphire' },
    { name: 'Blue Sapphire (Neelam)', slug: 'blue-sapphire' },
    { name: 'Coral (Moonga)', slug: 'coral' },
    { name: 'Garnet', slug: 'garnet' },
    { name: 'Pink Sapphire', slug: 'pink-sapphire' },
    { name: 'Diamond', slug: 'diamond' },
    { name: 'Pearl', slug: 'pearl' },
    { name: 'Padparadscha', slug: 'padparadscha-sapphire' },
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

export default function Header() {
  const navItems = [
    { name: 'Rings', href: '/category/rings' },
    { name: 'Necklaces', href: '/category/necklaces' },
    { name: 'Bracelets', href: '/category/bracelets' },
    { name: 'Earrings', href: '/category/earrings' },
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
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Shopping Bag</span>
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
                  <GemstoneDropdown />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
