import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/storage';

/**
 * POST /api/uploads
 * Upload a file to Supabase Storage
 * 
 * Request body: FormData with fields:
 *   - file: File
 *   - folder: string (optional, defaults to 'uploads')
 * 
 * Response: { path, publicUrl }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const result = await uploadFile(file, folder);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
