/**
 * Utility functions for handling asset URLs
 */

export function getAssetUrl(path: string | undefined | null): string {
  if (!path) return '';
  
  // If it's already an absolute URL (http:// or https:// or data:), return as is
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL || '';
  
  // Ensure we don't double slash if baseUrl ends with / and path starts with /
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
}
