'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { products, Product, categories, Category, USD_TO_INR_RATE } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductManager() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Form state for new/edit product
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    priceInr: '',
    image: '',
    media: [] as Array<{ type: 'image' | 'video'; url: string }>,
    hint: '',
    description: '',
    categoryId: '',
    subHeading: ''
  });


  // Keep categories in sync with Category Manager via subscription
  useEffect(() => {
    (async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch('/api/categories', { cache: 'no-store' }),
          fetch('/api/products', { cache: 'no-store' }),
        ]);
        if (catsRes.ok) setCategoryList(await catsRes.json());
        if (prodsRes.ok) {
          const rows = await prodsRes.json();
          const mapped: Product[] = (rows || []).map((r: any) => ({
            id: r.id,
            name: r.name,
            price: Number(r.price),
            image: r.image || '',
            media: Array.isArray(r.media) ? r.media : (r.image ? [{ type: 'image', url: r.image }] : []),
            hint: r.hint || '',
            description: r.description || '',
            categoryId: r.category_id,
            subCategory: r.sub_category || undefined,
            subHeading: r.sub_heading || undefined,
          }));
          setProductList(mapped);
        }
      } catch {}
    })();
  }, []);

  const filteredProducts = productList.filter(product => {
    const category = categoryList.find(c => c.id === product.categoryId);
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category && category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      priceInr: '',
      image: '',
      media: [],
      hint: '',
      description: '',
      categoryId: '',
      subHeading: ''
    });
  };

  const handleAddProduct = () => {
    const hasAnyMedia = (Array.isArray(formData.media) && formData.media.length > 0) || !!formData.image;
    if (!formData.name || !formData.priceInr || !hasAnyMedia || !formData.description || !formData.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (name, price, description, category, at least one image/video).',
        variant: 'destructive'
      });
      return;
    }

    // Use INR price and convert to USD for storage
    const priceInUSD = parseFloat(formData.priceInr) / USD_TO_INR_RATE;

    const nextId = productList.length > 0 ? Math.max(...productList.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: nextId,
      name: formData.name,
      price: priceInUSD,
      image: formData.image,
      media: formData.media,
      hint: formData.hint || formData.name.toLowerCase().replace(/\s+/g, ' '),
      description: formData.description,
      categoryId: parseInt(formData.categoryId),
      subHeading: formData.subHeading || undefined
    };

    (async () => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        const created = await res.json();
        const createdMapped: Product = {
          id: created.id,
          name: created.name,
          price: Number(created.price),
          image: created.image || '',
          media: Array.isArray(created.media) ? created.media : [],
          hint: created.hint || '',
          description: created.description || '',
          categoryId: created.category_id,
          subCategory: created.sub_category || undefined,
          subHeading: created.sub_heading || undefined,
        };
        setProductList([...productList, createdMapped]);
        // Notify other admin panels (e.g., categories) to refresh counts
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('lumera:products-updated'));
        }
      } else {
        let err = 'Failed to add product';
        try { const j = await res.json(); err = j?.error || err; } catch {}
        toast({ title: 'Add failed', description: err, variant: 'destructive' });
      }
    })();
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Success',
      description: 'Product added successfully!',
    });
  };

  const handleEditProduct = () => {
    const hasAnyMedia = (Array.isArray(formData.media) && formData.media.length > 0) || !!formData.image;
    if (!editingProduct || !formData.name || !formData.priceInr || !hasAnyMedia || !formData.description || !formData.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (name, price, description, category, at least one image/video).',
        variant: 'destructive'
      });
      return;
    }

    // Use INR price and convert to USD for storage
    const priceInUSD = parseFloat(formData.priceInr) / USD_TO_INR_RATE;

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      price: priceInUSD,
      image: formData.image,
      media: formData.media,
      hint: formData.hint || formData.name.toLowerCase().replace(/\s+/g, ' '),
      description: formData.description,
      categoryId: parseInt(formData.categoryId),
      subHeading: formData.subHeading || undefined
    };

    (async () => {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (res.ok) {
        setProductList(productList.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('lumera:products-updated'));
        }
      } else {
        let err = 'Failed to update product';
        try { const j = await res.json(); err = j?.error || err; } catch {}
        toast({ title: 'Update failed', description: err, variant: 'destructive' });
      }
    })();
    resetForm();
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    
    toast({
      title: 'Success',
      description: 'Product updated successfully!',
    });
  };

  const handleDeleteProduct = () => {
    if (!deletingProduct) return;
    
    (async () => {
      const url = new URL('/api/products', window.location.origin);
      url.searchParams.set('id', String(deletingProduct.id));
      const res = await fetch(url.toString(), { method: 'DELETE' });
      if (res.ok) {
        setProductList(productList.filter(p => p.id !== deletingProduct.id));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('lumera:products-updated'));
        }
      }
    })();
    setIsDeleteDialogOpen(false);
    setDeletingProduct(null);
    
    toast({
      title: 'Success',
      description: 'Product deleted successfully!',
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: '', // Let admin enter separate USD value
      priceInr: (product.price * USD_TO_INR_RATE).toFixed(2),
      image: product.image,
      media: product.media || (product.image ? [{ type: 'image', url: product.image }] : []),
      hint: product.hint,
      description: product.description,
      categoryId: product.categoryId.toString(),
      subHeading: product.subHeading || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your jewelry inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product for your store</DialogDescription>
            </DialogHeader>
            <ProductForm 
              formData={formData} 
              setFormData={setFormData} 
              categories={categoryList}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredProducts.length} products</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>All products in your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price (USD)</TableHead>
                <TableHead>Price (INR)</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.hint}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryList.find(c => c.id === product.categoryId)?.name || 'Unknown'}</Badge>
                  </TableCell>
                  <TableCell>${product.price.toLocaleString()}</TableCell>
                  <TableCell>₹{(product.price * USD_TO_INR_RATE).toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    —
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
            <ProductForm 
              formData={formData} 
              setFormData={setFormData} 
              categories={categoryList}
            />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductForm({ 
  formData, 
  setFormData, 
  categories
}: { 
  formData: any; 
  setFormData: (data: any) => void; 
  categories: Category[];
}) {
  return (
    <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Solitaire Diamond Ring"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="2500.00"
          />
          <p className="text-xs text-muted-foreground">Optional: Enter a separate USD price for display</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceInr">Price (INR) *</Label>
          <Input
            id="priceInr"
            type="number"
            step="0.01"
            value={formData.priceInr}
            onChange={(e) => setFormData({ ...formData, priceInr: e.target.value })}
            placeholder="200000.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL (optional if media added)</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label>Media (Images/Videos)</Label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {formData.media?.map((m: any, idx: number) => (
            <div key={idx} className="relative shrink-0">
              {m.type === 'image' ? (
                <img src={m.url} className="w-24 h-24 object-cover rounded" />
              ) : (
                <video className="w-24 h-24 object-cover rounded" src={m.url} />
              )}
              <button className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2" onClick={() => {
                const next = [...formData.media];
                next.splice(idx, 1);
                setFormData({ ...formData, media: next });
              }}>x</button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Image URL" onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) setFormData({ ...formData, media: [...formData.media, { type: 'image', url: val }] });
              (e.target as HTMLInputElement).value = '';
            }
          }} />
          <Input placeholder="Video URL (mp4)" onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) setFormData({ ...formData, media: [...formData.media, { type: 'video', url: val }] });
              (e.target as HTMLInputElement).value = '';
            }
          }} />
        </div>
        <p className="text-xs text-muted-foreground">Press Enter to add. Supports multiple entries.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hint">Search Hint</Label>
          <Input
            id="hint"
            value={formData.hint}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
            placeholder="e.g., diamond ring"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subHeading">Sub Heading</Label>
        <Input
          id="subHeading"
          value={formData.subHeading}
          onChange={(e) => setFormData({ ...formData, subHeading: e.target.value })}
          placeholder="e.g., Pure Diamond and Gold"
        />
      </div>


      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed product description..."
          rows={3}
        />
      </div>

      {/* Rating removed */}
    </div>
  );
}

