import { supabase } from './supabase';

const BUCKET_NAME = 'hillcity-assets';

/**
 * Upload a file to Supabase Storage
 * @param file - File to upload
 * @param folder - Optional folder path (e.g., 'logos', 'avatars', 'testimonials')
 * @returns Object with publicUrl and path
 */
export async function uploadFile(file: File, folder: string = 'uploads') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: publicUrlData?.publicUrl || '',
  };
}

/**
 * Get public URL for a file in Supabase Storage
 * @param filePath - Path to file in storage
 * @returns Public URL
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data?.publicUrl || '';
}

/**
 * Delete a file from Supabase Storage
 * @param filePath - Path to file in storage
 */
export async function deleteFile(filePath: string) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}
