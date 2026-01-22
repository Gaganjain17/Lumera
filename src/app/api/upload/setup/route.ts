import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || 'media';

/**
 * Helper endpoint to create the media bucket if it doesn't exist
 * This is a one-time setup endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    // Check if bucket exists by trying to list it
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      return NextResponse.json({ 
        error: `Failed to list buckets: ${listError.message}` 
      }, { status: 500 });
    }

    // Check if media bucket already exists
    const bucketExists = buckets?.some(bucket => bucket.name === MEDIA_BUCKET);
    
    if (bucketExists) {
      return NextResponse.json({ 
        message: `Bucket "${MEDIA_BUCKET}" already exists`,
        exists: true
      }, { status: 200 });
    }

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(MEDIA_BUCKET, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/*', 'video/*']
    });

    if (error) {
      console.error('Create bucket error:', error);
      return NextResponse.json({ 
        error: `Failed to create bucket: ${error.message}` 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Bucket "${MEDIA_BUCKET}" created successfully`,
      bucket: data
    }, { status: 200 });

  } catch (error) {
    console.error('Setup exception:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

