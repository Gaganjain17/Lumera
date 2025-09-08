'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllInquiries, updateInquiryStatus, deleteInquiry, Inquiry } from '@/lib/inquiries';

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const refresh = () => setInquiries(getAllInquiries());
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
                  <Button size="sm" variant="outline" onClick={() => { updateInquiryStatus(i.id, i.status === 'new' ? 'resolved' : 'new'); refresh(); }}>Toggle</Button>
                  <Button size="sm" variant="destructive" onClick={() => { deleteInquiry(i.id); refresh(); }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


