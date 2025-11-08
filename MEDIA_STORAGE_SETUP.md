# Supabase Storage Setup for Product & Category Media

## Step 1: Create Storage Bucket in Supabase

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open Storage Section**
   - Click on **Storage** in the left sidebar
   - Click **New Bucket** button

3. **Create the Bucket**
   - **Name:** `media` (or set `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET` in `.env.local` to use a different name)
   - **Public bucket:** ✅ Check this (so images/videos can be viewed)
   - Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up RLS (Row Level Security) policies:

1. **Click on the `media` bucket**
2. **Go to Policies tab**
3. **Check if policies already exist** - If you see policies listed, you can either:
   - Skip creating new ones if they're already set up correctly
   - Or drop and recreate them using the SQL below

### Option A: Drop Existing Policies and Create New Ones (Recommended)

Run this SQL in Supabase SQL Editor to drop existing policies first, then create new ones:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;

-- Policy 1: Allow Public Uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'media');

-- Policy 2: Allow Public Read Access
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Policy 3: Allow Authenticated Delete (Admin only)
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
```

### Option B: Create Policies Only (If They Don't Exist)

If you're sure the policies don't exist, you can create them directly:

```sql
-- Policy 1: Allow Public Uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'media');

-- Policy 2: Allow Public Read Access
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Policy 3: Allow Authenticated Delete (Admin only)
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
```

**Note:** If you get an error saying a policy already exists, use **Option A** above to drop and recreate them.

## Step 3: Verify Setup

1. **Test Upload:**
   - Go to Admin Panel → Products
   - Try uploading an image or video
   - Check if the upload succeeds

2. **Check Storage:**
   - Go back to Supabase Dashboard → Storage → media
   - You should see uploaded files in `products/` and `categories/` folders

## Folder Structure in Storage

```
media/
├── products/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── 1234567892-ghi789.mp4
└── categories/
    ├── 1234567893-jkl012.jpg
    └── 1234567894-mno345.png
```

## How It Works

1. **Admin uploads file** → File is uploaded to Supabase Storage
2. **Supabase returns public URL** → URL is saved in products/categories table
3. **Files are displayed** → Images/videos are shown from Supabase Storage

## Troubleshooting

### Issue: Upload fails with "Bucket not found"
**Solution:** 
1. Make sure you've created the `media` bucket in Supabase Dashboard
2. Check that the bucket name matches what's in your code (default: `media`)
3. If using a custom bucket name, set `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET` in `.env.local`

### Issue: Policy already exists error
**Solution:** 
1. Use the SQL from **Option A** in Step 2 above to drop existing policies first
2. Or check the Policies tab in Supabase to see what policies already exist
3. If policies exist but uploads still fail, try dropping and recreating them

### Issue: Upload fails with "Access Denied"
**Solution:** Make sure the bucket is set to **public** and policies are correctly set up.

### Issue: Images don't load
**Solution:** Check if the bucket is public and the URL is correct.

### Issue: Storage quota exceeded
**Solution:** Supabase free tier has 1GB storage. Upgrade plan or clean up old files.

## Environment Variables

Make sure you have these in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Custom bucket name (defaults to 'media')
NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET=media
```

## Security Notes

- ✅ Media files are stored in a public bucket (needed for viewing)
- ✅ Only authenticated users (admins) can delete files
- ✅ File names are randomized to prevent conflicts
- ✅ Timestamps are used for unique identification
- ✅ File types are validated (images and videos only)
- ✅ File size is limited to 50MB

## Next Steps

After setup is complete:
1. Test uploading a product image in the admin panel
2. Test uploading a category image in the admin panel
3. Verify the files appear in Supabase Storage dashboard
4. Check that images/videos display correctly on your site

