export function getAuthError(code: string): string {
  const messages: Record<string, string> = {
    invalid_credentials: 'Incorrect email or password. Please try again.',
    email_not_confirmed: 'Please confirm your email address before logging in. Check your inbox.',
    user_already_exists: 'An account with this email already exists. Try logging in.',
    weak_password: 'Password must be at least 8 characters.',
    over_request_rate_limit: 'Too many attempts. Please wait a few minutes and try again.',
    permission_denied: "You don't have permission to do this. Please log in again.",
  }
  return messages[code] || 'Something went wrong. Please try again.'
}

export function getOrderError(message: string): string {
  if (message.includes('permission denied')) {
    return 'Session expired. Please log in again to place your order.'
  }
  if (message.includes('violates')) {
    return 'Some order details are invalid. Please go back and check your information.'
  }
  return 'Failed to place order. Please try again or contact support.'
}
