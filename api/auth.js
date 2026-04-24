// TikTok OAuth Callback Handler
import { getTikTokAuthUrl, exchangeCodeForToken, isTikTokConfigured } from './tiktok-auth.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { code, state, error } = req.query;

  // Handle OAuth errors
  if (error) {
    return res.redirect(`/login?error=${encodeURIComponent(error)}`);
  }

  // If no code, initiate OAuth flow
  if (!code) {
    if (!isTikTokConfigured()) {
      return res.redirect('/login?error=tiktok_not_configured');
    }
    const authUrl = getTikTokAuthUrl();
    return res.redirect(authUrl);
  }

  // Exchange code for token
  try {
    const tokens = await exchangeCodeForToken(code);

    // In production, store tokens securely (e.g., database, encrypted cookie)
    // For now, encode in redirect URL (NOT secure for production)
    const tokenData = Buffer.from(JSON.stringify(tokens)).toString('base64');

    return res.redirect(`/dashboard?auth_success=true&tokens=${tokenData}`);
  } catch (err) {
    console.error('TikTok auth error:', err);
    return res.redirect(`/login?error=auth_failed`);
  }
}