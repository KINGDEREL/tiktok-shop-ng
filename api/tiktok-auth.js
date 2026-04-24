// TikTok Shop API Integration
// Documentation: https://partner.tiktokshop.com/documents/176936

const TIKTOK_API_BASE = 'https://open.tiktokapis.com';
const TIKTOK_PARTNER_API_BASE = 'https://partner.tiktokshop.com';

const getEnvVar = (key) => {
  return process.env[key] || '';
};

export const config = {
  clientId: getEnvVar('TIKTOK_CLIENT_ID'),
  clientSecret: getEnvVar('TIKTOK_CLIENT_SECRET'),
  callbackUrl: getEnvVar('TIKTOK_CALLBACK_URL') || 'https://tiktok-shop-ng.vercel.app/auth/callback',
  merchantId: getEnvVar('TIKTOK_MERCHANT_ID'),
  shopId: getEnvVar('TIKTOK_SHOP_ID'),
  accessToken: getEnvVar('TIKTOK_ACCESS_TOKEN'),
  refreshToken: getEnvVar('TIKTOK_REFRESH_TOKEN'),
};

// Generate TikTok OAuth URL
export function getTikTokAuthUrl() {
  const scopes = [
    'shop.authorize',
    'product.read',
    'product.write',
    'order.read',
    'order.write',
    'fulfillment.read',
    'fulfillment.write',
  ].join(',');

  const params = new URLSearchParams({
    client_key: config.clientId,
    redirect_uri: config.callbackUrl,
    scope: scopes,
    state: generateState(),
    response_type: 'code',
  });

  return `${TIKTOK_PARTNER_API_BASE}/oauth/authorize?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code) {
  const response = await fetch(`${TIKTOK_PARTNER_API_BASE}/oauth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_key: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

// Refresh access token
export async function refreshAccessToken() {
  const response = await fetch(`${TIKTOK_PARTNER_API_BASE}/oauth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_key: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return response.json();
}

// Make authenticated API request
export async function tiktokApiRequest(endpoint, options = {}) {
  const response = await fetch(`${TIKTOK_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
      'x-tiktok-shop-id': config.shopId,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TikTok API error: ${error}`);
  }

  return response.json();
}

function generateState() {
  return Math.random().toString(36).substring(2, 15);
}

// Check if TikTok integration is properly configured
export function isTikTokConfigured() {
  return !!(config.clientId && config.clientSecret);
}