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
import { products, Product, categories, Category, USD_TO_INR_RATE, getCategoryById, subscribeCategories, loadCategoriesFromStorage, loadProductsFromStorage, setProducts } from '@/lib/products';
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
    hint: '',
    description: '',
    categoryId: '',
    subCategory: '',
    subHeading: ''
  });

  const subCategories = ['emerald', 'ruby', 'yellow-sapphire', 'blue-sapphire'];

  // Keep categories in sync with Category Manager via subscription
  useEffect(() => {
    loadCategoriesFromStorage();
    loadProductsFromStorage();
    // initialize local state from storage-loaded arrays
    setProductList([...products]);
    const unsubscribe = subscribeCategories((next) => setCategoryList([...next]));
    return () => unsubscribe();
  }, []);

  const filteredProducts = productList.filter(product => {
    const category = getCategoryById(product.categoryId);
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
      hint: '',
      description: '',
      categoryId: '',
      subCategory: '',
      subHeading: '',
      

    });
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.priceInr || !formData.image || !formData.description || !formData.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    // Use INR price and convert to USD for storage
    const priceInUSD = parseFloat(formData.priceInr) / USD_TO_INR_RATE;

    const newProduct: Product = {
      id: Math.max(...productList.map(p => p.id)) + 1,
      name: formData.name,
      price: priceInUSD,
      image: formData.image,
      hint: formData.hint || formData.name.toLowerCase().replace(/\s+/g, ' '),
      description: formData.description,
      categoryId: parseInt(formData.categoryId),
      subCategory: formData.subCategory || undefined,
      subHeading: formData.subHeading || undefined
    };

    const next = [...productList, newProduct];
    setProductList(next);
    setProducts(next);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Success',
      description: 'Product added successfully!',
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct || !formData.name || !formData.priceInr || !formData.image || !formData.description || !formData.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
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
      hint: formData.hint || formData.name.toLowerCase().replace(/\s+/g, ' '),
      description: formData.description,
      categoryId: parseInt(formData.categoryId),
      subCategory: formData.subCategory || undefined,
      subHeading: formData.subHeading || undefined
    };

    const next = productList.map(p => p.id === editingProduct.id ? updatedProduct : p);
    setProductList(next);
    setProducts(next);
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
    
    const next = productList.filter(p => p.id !== deletingProduct.id);
    setProductList(next);
    setProducts(next);
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
      hint: product.hint,
      description: product.description,
      categoryId: product.categoryId.toString(),
      subCategory: product.subCategory || '',
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
              subCategories={subCategories}
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
                    <Badge variant="outline">{getCategoryById(product.categoryId)?.name || 'Unknown'}</Badge>
                    {product.subCategory && (
                      <Badge variant="secondary" className="ml-2">{product.subCategory}</Badge>
                    )}
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
            subCategories={subCategories}
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
  categories, 
  subCategories 
}: { 
  formData: any; 
  setFormData: (data: any) => void; 
  categories: Category[];
  subCategories: string[];
}) {
  return (
    <div className="grid gap-4 py-4">
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
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
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

      {formData.categoryId && getCategoryById(parseInt(formData.categoryId))?.type === 'gemstone' && (
        <div className="space-y-2">
          <Label htmlFor="subCategory">Sub Category</Label>
          <Select value={formData.subCategory} onValueChange={(value) => setFormData({ ...formData, subCategory: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub category" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((subCategory) => (
                <SelectItem key={subCategory} value={subCategory}>{subCategory}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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

