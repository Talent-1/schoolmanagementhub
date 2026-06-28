'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

interface LogoUploadProps {
  schoolId: string;
  currentLogoUrl?: string;
  onUploadSuccess?: (logoUrl: string) => void;
}

export function LogoUpload({
  schoolId,
  currentLogoUrl,
  onUploadSuccess,
}: LogoUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'logos');

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { publicUrl } = await response.json();

      // Update school in database
      const updateResponse = await fetch(`/api/schools/${schoolId}/logo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: publicUrl }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update school logo');
      }

      toast.success('Logo uploaded successfully');
      onUploadSuccess?.(publicUrl);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast.error(message);
      // Reset preview on error
      setPreview(currentLogoUrl || null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {preview && (
          <div className="relative w-24 h-24 rounded-lg border border-slate-200 overflow-hidden">
            <Image
              src={preview}
              alt="Logo preview"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 flex items-center">
          <label className="relative cursor-pointer">
            <div className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
              {isLoading ? 'Uploading...' : 'Choose Logo'}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Supported formats: PNG, JPG, WebP (max 10MB)
      </p>
    </div>
  );
}
