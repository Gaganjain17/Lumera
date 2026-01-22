'use client'

import Link from 'next/link'
import { Search, Heart, ShoppingBag, Menu, ChevronDown, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAdminAuth } from '@/context/admin-auth-context'
import { useUserAuth } from '@/context/user-auth-context'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import AuthModal from '@/components/auth/auth-modal'

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-primary transition-colors">
      {children}
    </Link>
  )
}

function JewelsDropdown() {
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' })
        if (res.ok) setDynamicCategories(await res.json())
      } catch {}
    })()
  }, [])

  const jewels = dynamicCategories.filter((c: any) => c.type === 'jewel')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:text-primary transition-colors p-0 h-auto hover:bg-transparent -mr-2">
          Jewels
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {jewels.map((cat: any) => (
          <DropdownMenuItem key={cat.slug} asChild>
            <Link href={`/jewels/${cat.slug}`}>{cat.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function GemstonesDropdown() {
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' })
        if (res.ok) setDynamicCategories(await res.json())
      } catch {}
    })()
  }, [])

  const gemstones = dynamicCategories.filter((c: any) => c.type === 'gemstone')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:text-primary transition-colors p-0 h-auto hover:bg-transparent -mr-2">
          Gemstones
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {gemstones.map((cat: any) => (
          <DropdownMenuItem key={cat.slug} asChild>
            <Link href={`/gemstones/${cat.slug}`}>{cat.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Header() {
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth()
  const { user, profile, signOut, isLoading } = useUserAuth()
  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([])
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const navItems = [
    { name: 'Trending', href: '/category/trending' },
  ]

  // Check if user is authenticated (both user and profile loaded)
  const isUserAuthenticated = !isLoading && !!user && !!profile

  useEffect(() => {
    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories', { cache: 'no-store' }),
          fetch('/api/products', { cache: 'no-store' }),
        ])
        if (catRes.ok) setDynamicCategories(await catRes.json())
        if (prodRes.ok) setDynamicProducts(await prodRes.json())
      } catch {}
    })()
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isSearchOpen])

  const filteredProducts = dynamicProducts.filter((p: any) =>
    searchQuery.trim().length > 0 && (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hint.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, 6)

  const filteredCategories = dynamicCategories.filter(c =>
    searchQuery.trim().length > 0 && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex flex-col items-start leading-none" aria-label="Luméra — Fine Gems & Jewels Home">
          <span className="font-headline text-3xl font-bold text-primary tracking-wider">Luméra</span>
          <span className="text-[0.6rem] text-muted-foreground tracking-[0.2em]">FINE GEMS &amp; JEWELS</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavItem href="/">Home</NavItem>
          {navItems.map(item => (
            <NavItem key={item.name} href={item.href}>
              {item.name}
            </NavItem>
          ))}
          <JewelsDropdown />
          <GemstonesDropdown />
        </nav>

        <div className="flex items-center gap-2">
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="inline-flex hover:text-primary transition-colors" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-3 w-[18rem] md:w-[24rem] shadow-xl">
              <div className="space-y-4">
                <div>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products or categories..."
                    className="w-full border rounded px-3 py-2 bg-background"
                  />
                </div>
                {searchQuery && (
                  <div className="space-y-3 max-h-80 overflow-auto">
                    {filteredCategories.length > 0 && (
                      <div>
                        <div className="text-xs uppercase text-muted-foreground mb-2">Categories</div>
                        <div className="grid gap-2">
                          {filteredCategories.map(cat => (
                            <Link key={cat.slug} href={cat.type === 'jewel' ? `/jewels/${cat.slug}` : `/gemstones/${cat.slug}`} onClick={() => setIsSearchOpen(false)} className="block p-2 rounded hover:bg-muted">
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {filteredProducts.length > 0 && (
                      <div>
                        <div className="text-xs uppercase text-muted-foreground mb-2">Products</div>
                        <div className="grid gap-2">
                          {filteredProducts.map(p => (
                            <Link key={p.id} href={`/products/${p.id}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-2 rounded hover:bg-muted">
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                              <div>
                                <div className="font-medium">{p.name}</div>
                                {p.subHeading && <div className="text-xs text-muted-foreground">{p.subHeading}</div>}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {filteredCategories.length === 0 && filteredProducts.length === 0 && (
                      <div className="text-sm text-muted-foreground">No results found</div>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

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

          {/* User Authentication Section */}
          {isLoading ? (
            <Button variant="ghost" size="icon" disabled className="hidden md:inline-flex">
              <User className="h-5 w-5 animate-pulse" />
            </Button>
          ) : isUserAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:inline-flex hover:text-primary transition-colors">
                  <User className="h-5 w-5 mr-2" />
                  {profile?.profile_data?.full_name || 'User'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.profile_data?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profile?.is_admin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:inline-flex hover:text-primary transition-colors"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login / Register
            </Button>
          )}
          
          <Link href={isAdminAuthenticated ? '/admin' : '/admin/login'}>
            <Button variant="outline" size="sm" className="hidden md:inline-flex hover:text-primary transition-colors">
              {isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}
            </Button>
          </Link>

          {/* Mobile Menu */}
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
                        Jewels
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pl-4 space-y-2 mt-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {dynamicCategories.filter((c: any) => c.type === 'jewel').map((cat: any) => (
                          <Link key={cat.slug} href={`/jewels/${cat.slug}`} className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">{cat.name}</Link>
                        ))}
                      </div>
                    </details>
                    <details className="group">
                      <summary className="text-lg font-medium text-foreground cursor-pointer list-none flex items-center justify-between hover:text-primary transition-colors">
                        Gemstones
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pl-4 space-y-2 mt-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {dynamicCategories.filter((c: any) => c.type === 'gemstone').map((cat: any) => (
                          <Link key={cat.slug} href={`/gemstones/${cat.slug}`} className="block text-base text-muted-foreground hover:text-primary transition-colors py-1">{cat.name}</Link>
                        ))}
                      </div>
                    </details>
                  </div>
                  <Link href="/wishlist" className="text-lg font-medium hover:text-primary transition-colors">Wishlist</Link>
                  <Link href="/cart" className="text-lg font-medium hover:text-primary transition-colors">Shopping Cart</Link>
                  
                  {/* Mobile User Auth */}
                  {isUserAuthenticated ? (
                    <div className="space-y-2 border-t pt-4">
                      <div className="text-lg font-medium">{profile?.profile_data?.full_name || 'User'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      {profile?.is_admin && (
                        <Link href="/admin" className="block text-base text-muted-foreground hover:text-primary transition-colors">
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={signOut}
                        className="text-base text-muted-foreground hover:text-primary transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Login / Register
                    </button>
                  )}
                  
                  <Link href={isAdminAuthenticated ? '/admin' : '/admin/login'} className="text-lg font-medium hover:text-primary transition-colors">
                    {isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  )
}
