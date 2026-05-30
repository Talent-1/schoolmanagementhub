import { prisma } from './prisma';

/**
 * Update school logo URL in database
 * @param schoolId - School ID
 * @param logoUrl - Public URL of the logo
 */
export async function updateSchoolLogo(schoolId: string, logoUrl: string) {
  const updatedSchool = await prisma.school.update({
    where: { id: schoolId },
    data: { logoUrl },
  });

  return updatedSchool;
}

/**
 * Upload file and update school logo in one operation
 * @param schoolId - School ID
 * @param file - File to upload
 * @returns Updated school object
 */
export async function uploadAndSetSchoolLogo(schoolId: string, file: File) {
  // Call the upload API
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'logos');

  const uploadResponse = await fetch('/api/uploads', {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error('Upload failed');
  }

  const { publicUrl } = await uploadResponse.json();

  // Update school with new logo URL
  return updateSchoolLogo(schoolId, publicUrl);
}
