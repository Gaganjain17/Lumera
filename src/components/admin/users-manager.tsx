'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUsers, User } from '@/lib/user-auth';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">No users found</TableCell>
                </TableRow>
              ) : users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email || '—'}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Cart Items</CardTitle>
            <CardDescription>Items currently in cart</CardDescription>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items in cart</p>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-medium">
                  Total: ${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Wishlist Items</CardTitle>
            <CardDescription>Items currently in wishlist</CardDescription>
          </CardHeader>
          <CardContent>
            {wishlistItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items in wishlist</p>
            ) : (
              <div className="space-y-2">
                {wishlistItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




