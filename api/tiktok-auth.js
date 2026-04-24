// TikTok Shop API Integration
// Documentation: https://partner.tiktokshop.com/documents/176936

const TIKTOK_API_BASE = 'https://open.tiktokapis.com';
const TIKTOK_PARTNER_API_BASE = 'https://partner.tiktokshop.com';

const config = {
  clientId: process.env.TIKTOK_CLIENT_ID || '',
  clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
  callbackUrl: process.env.TIKTOK_CALLBACK_URL || 'https://tiktok-shop-ng.vercel.app/auth/callback',
  merchantId: process.env.TIKTOK_MERCHANT_ID || '',
  shopId: process.env.TIKTOK_SHOP_ID || '',
  accessToken: process.env.TIKTOK_ACCESS_TOKEN || '',
  refreshToken: process.env.TIKTOK_REFRESH_TOKEN || '',
};

function generateState() {
  return Math.random().toString(36).substring(2, 15);
}

function getTikTokAuthUrl() {
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

async function exchangeCodeForToken(code) {
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

function isTikTokConfigured() {
  return !!(config.clientId && config.clientSecret);
}

module.exports = {
  config,
  getTikTokAuthUrl,
  exchangeCodeForToken,
  isTikTokConfigured,
  TIKTOK_API_BASE,
  TIKTOK_PARTNER_API_BASE,
};