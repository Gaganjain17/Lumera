'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BackButton from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { Upload, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/storage';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();

  // Fetch bank details
  useState(() => {
    fetch('/api/bank-details')
      .then(res => res.json())
      .then(data => setBankDetails(data))
      .catch(console.error);
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentReceipt(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!paymentReceipt) {
      toast({
        title: 'Payment Receipt Required',
        description: 'Please upload your payment receipt before placing the order.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: 'Cart is Empty',
        description: 'Please add items to your cart before placing an order.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(event.currentTarget);
      
      // Upload receipt to Supabase Storage
      console.log('Uploading payment receipt...');
      const { url: receiptUrl, error: uploadError } = await uploadFile(
        paymentReceipt,
        'receipts',
        'payment-receipts'
      );

      if (uploadError || !receiptUrl) {
        console.error('Receipt upload failed:', uploadError);
        toast({
          title: 'Upload Failed',
          description: 'Failed to upload payment receipt. Please try again.',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }

      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const mobile = formData.get('mobile') as string;

      const orderData = {
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerMobile: mobile,
        customerAddress: formData.get('address') as string,
        city: formData.get('city') as string,
        zipCode: formData.get('zipCode') as string,
        totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
        orderItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          customization: item.customization,
        })),
        paymentReceipt: receiptUrl,
      };

      console.log('Submitting order...');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Order Placed Successfully! 🎉',
          description: result.isNewUser 
            ? 'Your account has been created! Check your email for login details.' 
            : 'Your order has been received. We will contact you shortly.',
        });

        // Clear cart
        clearCart();

        // Redirect to success/home page
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast({
          title: 'Order Failed',
          description: result.error || 'Failed to place order. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (!bankDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-br from-background via-background to-primary/5 text-foreground font-body">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <BackButton className="mb-8" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-center mb-4 text-primary">Checkout</h1>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Complete your order by filling in all the details below and uploading your payment receipt
          </p>
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {/* Customer Information Card */}
              <div className="bg-card rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-headline font-semibold mb-6 text-primary flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="first-name" 
                        name="firstName" 
                        placeholder="John" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="last-name" 
                        name="lastName" 
                        placeholder="Doe" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 We'll create an account for you with this email
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">
                      Mobile Number <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="mobile" 
                      name="mobile" 
                      type="tel"
                      placeholder="+91 9876543210" 
                      required 
                      pattern="[0-9+\s-]+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Complete Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      placeholder="House No., Street, Landmark" 
                      required 
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="city" 
                        name="city" 
                        placeholder="Mumbai" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">
                        PIN Code <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="zipCode" 
                        name="zipCode" 
                        placeholder="400001" 
                        required 
                        pattern="[0-9]{6}"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Receipt Upload */}
              <div className="bg-card rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-headline font-semibold mb-6 text-primary flex items-center gap-2">
                  <Upload className="h-6 w-6" />
                  Payment Receipt Upload
                </h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-primary" />
                    <div className="mt-4">
                      <Label htmlFor="receipt-upload" className="cursor-pointer">
                        <span className="mt-2 block text-base font-semibold">
                          Upload Payment Receipt <span className="text-destructive">*</span>
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          PNG, JPG, JPEG up to 10MB
                        </span>
                      </Label>
                      <Input 
                        id="receipt-upload" 
                        name="receipt" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        required 
                      />
                    </div>
                    {paymentReceipt && (
                      <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{paymentReceipt.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> Please complete the payment to the bank account shown and upload the payment receipt here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Bank Details Card */}
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CreditCard className="h-6 w-6" />
                    Bank Details for Payment
                  </CardTitle>
                  <CardDescription className="text-base">
                    💳 Please transfer the payment to the following account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-primary mb-1">Account Holder</p>
                        <p className="font-medium">{bankDetails.accountHolder}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-primary mb-1">Bank Name</p>
                        <p className="font-medium">{bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-primary mb-1">Account Number</p>
                        <p className="font-mono font-bold">{bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-primary mb-1">IFSC Code</p>
                        <p className="font-mono font-bold">{bankDetails.ifscCode}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold text-primary mb-1">Account Type</p>
                        <p className="font-medium">{bankDetails.accountType}</p>
                      </div>
                      {bankDetails.upiId && (
                        <div className="col-span-2">
                          <p className="font-semibold text-primary mb-1">UPI ID</p>
                          <p className="font-mono font-bold">{bankDetails.upiId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {bankDetails.qrImageUrl && (
                    <div className="bg-white p-4 rounded-lg border-2 border-primary/20">
                      <p className="text-sm font-semibold text-primary mb-3 text-center">Scan QR Code to Pay</p>
                      <img 
                        src={bankDetails.qrImageUrl} 
                        alt="Payment QR Code" 
                        className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.cartId} className="flex justify-between text-sm bg-white/50 p-3 rounded-lg">
                        <span className="font-medium">{item.name} × {item.quantity}</span>
                        <span className="font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t-2 border-primary/20 pt-4 mt-4">
                      <div className="flex justify-between font-bold text-xl bg-primary/10 p-4 rounded-lg">
                        <span>Total Amount</span>
                        <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full mt-6 bg-primary hover:bg-primary/90 font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all" 
                    disabled={isSubmitting || cartItems.length === 0 || !paymentReceipt}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      'Place Order & Create Account'
                    )}
                  </Button>
                  {(!paymentReceipt || cartItems.length === 0) && (
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      {!paymentReceipt && '⚠️ Please upload payment receipt'}
                      {cartItems.length === 0 && '⚠️ Your cart is empty'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
