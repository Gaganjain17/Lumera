# Supabase Storage Setup for Payment Receipts

## Step 1: Create Storage Bucket in Supabase

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open Storage Section**
   - Click on **Storage** in the left sidebar
   - Click **New Bucket** button

3. **Create the Bucket**
   - **Name:** `receipts`
   - **Public bucket:** ✅ Check this (so receipts can be viewed)
   - Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up RLS (Row Level Security) policies:

1. **Click on the `receipts` bucket**
2. **Go to Policies tab**
3. **Add the following policies:**

### Policy 1: Allow Public Uploads
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'receipts');
```

### Policy 2: Allow Public Read Access
```sql
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'receipts');
```

### Policy 3: Allow Authenticated Delete (Admin only)
```sql
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'receipts');
```

## Step 3: Verify Setup

1. **Test Upload:**
   - Go to your checkout page
   - Upload a payment receipt
   - Check if the order is created successfully

2. **Check Storage:**
   - Go back to Supabase Dashboard → Storage → receipts
   - You should see the uploaded receipt in `payment-receipts` folder

3. **Test Admin View:**
   - Go to Admin Panel → Orders
   - Click on an order with a receipt
   - You should see the receipt image displayed

## Folder Structure in Storage

```
receipts/
└── payment-receipts/
    ├── 1234567890-abc123.jpg
    ├── 1234567891-def456.png
    └── ...
```

## How It Works

1. **Customer uploads receipt** → File is uploaded to Supabase Storage
2. **Supabase returns public URL** → URL is saved in orders table
3. **Admin views order** → Receipt image is displayed from Supabase Storage

## Troubleshooting

### Issue: Upload fails with "Access Denied"
**Solution:** Make sure the bucket is set to **public** and policies are correctly set up.

### Issue: Images don't load in admin panel
**Solution:** Check if the bucket is public and the URL is correct.

### Issue: Storage quota exceeded
**Solution:** Supabase free tier has 1GB storage. Upgrade plan or clean up old receipts.

## Environment Variables

Make sure you have these in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Security Notes

- ✅ Receipts are stored in a public bucket (needed for viewing)
- ✅ Only authenticated users (admins) can delete receipts
- ✅ File names are randomized to prevent conflicts
- ✅ Timestamps are used for unique identification

## Next Steps

After setup is complete:
1. Test the checkout flow with a real receipt upload
2. Verify the receipt appears in admin panel
3. Check Supabase Storage dashboard to see uploaded files
