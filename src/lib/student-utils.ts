export function generateRegNumber(
  schoolName: string, 
  schoolCode: string, 
  studentCount: number
) {
  // 1. Get simple abbreviation (e.g., "HillCity Academy" -> "HA")
  // We take the first letter of each word to get "HA"
  const abbreviation = schoolName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase(); 
  
  // 2. Get current year (e.g., 2026 -> "26")
  const year = new Date().getFullYear().toString().slice(-2);
  
  // 3. Increment index and pad with leading zeros (e.g., 0 -> "001")
  const index = (studentCount + 1).toString().padStart(3, '0');
  
  // Return the simple format: HA/26/001
  return `${abbreviation}/${year}/${index}`;
}