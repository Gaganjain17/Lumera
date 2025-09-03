'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Package, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/admin-auth-context';

export default function AdminQuickAccess() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated } = useAdminAuth();

  // Don't show if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`transition-all duration-300 ${isExpanded ? 'w-80' : 'w-16'}`}>
        <CardHeader className={`pb-2 ${isExpanded ? 'block' : 'hidden'}`}>
          <CardTitle className="text-lg">Admin Quick Access</CardTitle>
          <CardDescription>Manage your store quickly</CardDescription>
        </CardHeader>
        <CardContent className={`${isExpanded ? 'block' : 'hidden'}`}>
          <div className="space-y-3">
            <Link href="/admin">
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
            <Link href="/admin?tab=products">
              <Button className="w-full justify-start" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin?tab=products&action=add">
              <Button className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </CardContent>
        <div className="absolute -top-2 -left-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full shadow-lg"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
