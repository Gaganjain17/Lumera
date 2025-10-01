import { getSupabaseClient } from './supabaseClient';

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_RECEIPTS_BUCKET || 'receipts';

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (default: 'receipts')
 * @param folder - Optional folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string = DEFAULT_BUCKET,
  folder: string = ''
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload exception:', error);
    return { 
      url: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param filePath - The path to the file in storage
 * @param bucket - The storage bucket name (default: 'receipts')
 */
export async function deleteFile(
  filePath: string,
  bucket: string = DEFAULT_BUCKET
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
