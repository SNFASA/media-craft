/**
 * Converts Google Drive sharing URL to direct image URL
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Check if it's already a direct URL
  if (url.includes('drive.google.com/uc?id=')) {
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = '';
  
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
  if (viewMatch) {
    fileId = viewMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // If we found a file ID, convert to direct URL
  if (fileId) {
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  }
  
  // Return original URL if no conversion needed
  return url;
}

/**
 * Checks if URL is a Google Drive link
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com');
}