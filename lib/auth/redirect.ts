/** Default landing page after sign-in (Shopify-style account home). */
export const DEFAULT_POST_LOGIN_PATH = '/dashboard'

/** Only allow same-origin relative paths (blocks open redirects). */
export function getSafeRedirectPath(path: string | null | undefined): string {
  if (!path) return DEFAULT_POST_LOGIN_PATH
  if (!path.startsWith('/') || path.startsWith('//')) return DEFAULT_POST_LOGIN_PATH
  return path
}
