'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Inquiry } from '@/lib/inquiries';

async function fetchInquiries(): Promise<Inquiry[]> {
  const res = await fetch('/api/inquiries', { cache: 'no-store' });
  if (!res.ok) return [];
  const rows = await res.json();
  // map DB fields to client interface
  return (rows || []).map((r: any) => ({
    id: r.id,
    createdAt: new Date(r.created_at).getTime(),
    name: r.name,
    email: r.email || undefined,
    mobile: r.mobile,
    message: r.message,
    productId: r.product_id || undefined,
    productName: r.product_name || undefined,
    status: r.status,
  }));
}

async function apiToggleStatus(id: string, nextStatus: 'new' | 'resolved'): Promise<void> {
  await fetch('/api/inquiries', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status: nextStatus }),
  });
}

async function apiDeleteInquiry(id: string): Promise<void> {
  const url = new URL('/api/inquiries', window.location.origin);
  url.searchParams.set('id', id);
  await fetch(url.toString(), { method: 'DELETE' });
}

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const refresh = async () => setInquiries(await fetchInquiries());
  useEffect(() => { refresh(); }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expert Inquiries</CardTitle>
        <CardDescription>Manage customer questions submitted via Talk with Expert</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">No inquiries yet</TableCell>
              </TableRow>
            ) : inquiries.map(i => (
              <TableRow key={i.id}>
                <TableCell>{new Date(i.createdAt).toLocaleString()}</TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell>
                  <div className="text-sm">{i.mobile}</div>
                  {i.email && <div className="text-xs text-muted-foreground">{i.email}</div>}
                </TableCell>
                <TableCell className="max-w-md truncate">{i.message}</TableCell>
                <TableCell>{i.productName ? `${i.productName} (#${i.productId})` : '—'}</TableCell>
                <TableCell>
                  <Badge variant={i.status === 'new' ? 'default' : 'secondary'}>{i.status}</Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={async () => { await apiToggleStatus(i.id, i.status === 'new' ? 'resolved' : 'new'); await refresh(); }}>Toggle</Button>
                  <Button size="sm" variant="destructive" onClick={async () => { await apiDeleteInquiry(i.id); await refresh(); }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


