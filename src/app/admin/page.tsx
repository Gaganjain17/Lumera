'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Users, ShoppingCart, TrendingUp, Settings, LogOut, User } from 'lucide-react';
import AdminProductManager from '@/components/admin/product-manager';
import CategoryManager from '@/components/admin/category-manager';
import AdminStats from '@/components/admin/admin-stats';
import ProtectedAdminRoute from '@/components/admin/protected-admin-route';
import ChangePassword from '@/components/admin/change-password';
import AdminUserManagement from '@/components/admin/admin-user-management';
import BankDetailsManager from '@/components/admin/bank-details-manager';
import OrdersManager from '@/components/admin/orders-manager';
import InquiriesManager from '@/components/admin/inquiries-manager';
import UsersManager from '@/components/admin/users-manager';
import { useAdminAuth } from '@/context/admin-auth-context';
import { forceRefresh } from '@/lib/cache-utils';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAdminAuth();

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lumera Admin Panel</h1>
                <p className="text-gray-600">Manage your jewelry store</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user?.username}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {user?.role}
                  </span>
                </div>
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Store Settings</DialogTitle>
                      <DialogDescription>Configure store preferences and settings</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                        <ChangePassword />
                      </div>
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Store Configuration</h3>
                        <p className="text-gray-500">Store configuration options coming soon...</p>
                      </div>
                      <div className="border-t pt-6">
                        <AdminUserManagement />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" onClick={forceRefresh}>
                  <Plus className="h-4 w-4 mr-2" />
                  Refresh Cache
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <AdminStats />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="jewels" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Jewels
            </TabsTrigger>
            <TabsTrigger value="gemstones" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Gemstones
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="bank-details" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Bank Details
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <AdminProductManager />
          </TabsContent>

          <TabsContent value="jewels" className="mt-6">
            <CategoryManager type={'jewel'} />
          </TabsContent>
          <TabsContent value="gemstones" className="mt-6">
            <CategoryManager type={'gemstone'} />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>Manage customer accounts and data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Customer management functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View sales and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="bank-details" className="mt-6">
            <BankDetailsManager />
          </TabsContent>
          <TabsContent value="inquiries" className="mt-6">
            <InquiriesManager />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedAdminRoute>
  );
}
