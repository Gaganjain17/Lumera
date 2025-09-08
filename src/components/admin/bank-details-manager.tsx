'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BankDetails, getBankDetails, setBankDetails } from '@/lib/bank';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function BankDetailsManager() {
  const { toast } = useToast();
  const [details, setDetails] = useState<BankDetails>(getBankDetails());
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setDetails(getBankDetails());
  }, []);

  const handleSave = () => {
    setBankDetails(details);
    toast({ title: 'Saved', description: 'Bank details updated successfully.' });
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


