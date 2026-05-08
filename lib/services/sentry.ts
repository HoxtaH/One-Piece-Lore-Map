import * as Sentry from '@sentry/nextjs';

/**
 * Utility functions for interacting with Sentry
 * Use these throughout the app to capture custom events and errors
 */

/**
 * Capture a custom info message to Sentry
 * @example captureInfo('User contributed location: Wano')
 */
export function captureInfo(message: string, tags?: Record<string, string>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope((scope) => {
      if (tags) {
        scope.setTags(tags);
      }
      scope.setLevel('info');
      Sentry.captureMessage(message);
    });
  }
}

/**
 * Capture an error with context information
 * @example captureError(error, { section: 'location-page', location: 'wano' })
 */
export function captureError(
  error: Error | unknown,
  context?: Record<string, string | number>,
  tags?: Record<string, string>
) {
  Sentry.captureException(error, {
    contexts: context
      ? {
          custom: context,
        }
      : undefined,
    tags: tags,
  });
}

/**
 * Add a breadcrumb to track user actions
 * @example addBreadcrumb('User clicked location', { location: 'wano' })
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, string | number>,
  category?: string
) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      message,
      data,
      category: category || 'user-action',
      level: 'info',
      timestamp: Date.now() / 1000,
    });
  }
}

/**
 * Set user context for Sentry (useful for tracking which user had the issue)
 * @example setUserContext('user-123', 'john@example.com')
 */
export function setUserContext(userId: string, email?: string) {
  Sentry.setUser({
    id: userId,
    email: email,
  });
}

/**
 * Clear user context
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

