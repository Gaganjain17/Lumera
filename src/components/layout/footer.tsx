import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { LucidePhoneCall, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/40">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex flex-col items-start leading-none">
              <span className="font-headline text-3xl font-bold text-primary tracking-wider">Luméra</span>
              <span className="text-[0.6rem] text-muted-foreground tracking-[0.2em]">FINE GEMS &amp; JEWELS</span>
            </Link>
            <p className="text-sm text-muted-foreground">An Timeless Luxury</p>
            <div className="flex gap-4 pt-2">
              <Link href="https://www.instagram.com/official_lumerafinegems?igsh=MWV6dDZhMWRiMnNkeA%3D%3D&utm_source=qr" target="_blank" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </Link>
              <Link href="tel:+919987312555" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Call Us">
                <LucidePhoneCall size={20} />
              </Link>
              <Link href="https://maps.app.goo.gl/t6GkXLsRjHQDujgW9?g_st=ipc" target="_blank" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Google Maps">
                <MapPin size={20} />
              </Link>
            </div>
          </div>
          
          <div className='lg:col-span-2'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 font-headline text-primary">Contact</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <div className="font-medium text-foreground">Office Address:</div>
                    <p>
                      Office No. 408, 4th Floor, DD PLAZA, Opposite Khammniwala, Nashta Gali,<br />
                      3rd Agiyari Lane, Zaveri Bazar, Mumbai - 400002
                    </p>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Mobile:</div>
                    <div className="flex flex-col gap-1">
                      <Link href="tel:+919987312555" className="hover:text-primary transition-colors">+91 9987312555</Link>
                      <Link href="tel:+917718071474" className="hover:text-primary transition-colors">+91 7718071474</Link>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Instagram:</div>
                    <Link href="https://www.instagram.com/official_lumerafinegems?igsh=MWV6dDZhMWRiMnNkeA%3D%3D&utm_source=qr" target="_blank" className="hover:text-primary transition-colors">@Official_lumerafinegems</Link>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 font-headline text-primary">Visit Us</h4>
                <p className="text-sm text-muted-foreground mb-3">Find our showroom on Google Maps.</p>
                <Link href="https://maps.app.goo.gl/t6GkXLsRjHQDujgW9?g_st=ipc" target="_blank" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <MapPin size={18} /> View on Google Maps
                </Link>
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
