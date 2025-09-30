'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { BankDetails } from '@/lib/bank';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function BankDetailsManager() {
  const { toast } = useToast();
  const [details, setDetails] = useState<BankDetails>({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: '',
    upiId: '',
    qrImageUrl: '',
    gstDetails: '',
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/bank-details', { cache: 'no-store' });
      if (!res.ok) return;
      const row = await res.json();
      if (row) {
        // API GET returns camelCase
        setDetails({
          accountHolder: row.accountHolder || '',
          bankName: row.bankName || '',
          accountNumber: row.accountNumber || '',
          ifscCode: row.ifscCode || '',
          accountType: row.accountType || '',
          upiId: row.upiId || '',
          qrImageUrl: row.qrImageUrl || '',
          gstDetails: (row.gstDetails ?? row.gstNumber) || '',
        });
      }
    })();
  }, []);

  const handleSave = () => {
    (async () => {
      const res = await fetch('/api/bank-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      if (res.ok) {
        // Re-fetch to ensure we reflect what's in the database after restart
        const check = await fetch('/api/bank-details', { cache: 'no-store' });
        if (check.ok) {
          const row = await check.json();
          if (row) {
            setDetails({
              accountHolder: row.accountHolder || '',
              bankName: row.bankName || '',
              accountNumber: row.accountNumber || '',
              ifscCode: row.ifscCode || '',
              accountType: row.accountType || '',
              upiId: row.upiId || '',
              qrImageUrl: row.qrImageUrl || '',
              gstDetails: (row.gstDetails ?? row.gstNumber) || '',
            });
          }
        }
        toast({ title: 'Saved', description: 'Bank details updated successfully.' });
      } else {
        let description = 'Failed to save bank details.';
        try {
          const data = await res.json();
          if (data?.error) description += ` ${data.error}`;
        } catch {
          const text = await res.text();
          if (text) description += ` ${text}`;
        }
        toast({ title: 'Error', description, variant: 'destructive' });
      }
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Details Management</CardTitle>
        <CardDescription>Update payment details shown on product pages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Account Holder Name</Label>
            <Input value={details.accountHolder} onChange={(e) => setDetails({ ...details, accountHolder: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Input value={details.bankName} onChange={(e) => setDetails({ ...details, bankName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input value={details.accountNumber} onChange={(e) => setDetails({ ...details, accountNumber: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>IFSC Code</Label>
            <Input value={details.ifscCode} onChange={(e) => setDetails({ ...details, ifscCode: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <Input value={details.accountType} onChange={(e) => setDetails({ ...details, accountType: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>UPI ID</Label>
            <Input value={details.upiId} onChange={(e) => setDetails({ ...details, upiId: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>GST Details</Label>
            <Textarea rows={4} value={details.gstDetails} onChange={(e) => setDetails({ ...details, gstDetails: e.target.value })} placeholder="Enter GST details (legal name, GSTIN, addresses, notes)" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>QR Code Image URL</Label>
            <div className="flex gap-2">
              <Input value={details.qrImageUrl} onChange={(e) => setDetails({ ...details, qrImageUrl: e.target.value })} placeholder="/assets/images/bank_qr.png" />
              <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>Preview</Button>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Preview</DialogTitle>
          </DialogHeader>
          <img src={details.qrImageUrl} alt="QR Preview" className="w-full h-auto rounded" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}


