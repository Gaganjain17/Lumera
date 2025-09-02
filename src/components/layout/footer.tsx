import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/40">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex flex-col items-start leading-none">
              <span className="font-headline text-2xl font-bold text-primary tracking-wider">LUMERA</span>
              <span className="text-[0.6rem] text-muted-foreground tracking-[0.2em]">FINE GEMS &amp; JEWELS</span>
            </Link>
            <p className="text-sm text-muted-foreground">Crafting memories, one jewel at a time.</p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></Link>
            </div>
          </div>
          
          <div className='lg:col-span-2'>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 font-headline text-primary">Shop</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Rings</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Necklaces</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 font-headline text-primary">Company</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
             <h4 className="font-semibold mb-4 font-headline text-primary">Newsletter</h4>
             <p className="text-sm text-muted-foreground">Subscribe for exclusive offers and stories.</p>
             <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Email" className="bg-background" />
                <Button type="submit" variant="outline" className='border-primary text-primary hover:bg-primary hover:text-primary-foreground'>Subscribe</Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&amp;copy; {new Date().getFullYear()} LUMERA Fine Gems &amp; Jewels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
