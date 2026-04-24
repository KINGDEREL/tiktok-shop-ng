// TikTok Shop Fulfillment API
// Endpoints for warehouse, logistics, and fulfillment management

const { config, TIKTOK_API_BASE } = require('./tiktok-auth.js');

const FULFILLMENT_METHODS = {
  TIKTOK: 'ship_by_tiktok',
  SELLER: 'ship_by_seller',
};

async function tiktokApiRequest(endpoint, options = {}) {
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

// GET /api/fulfillment/warehouses - List warehouses
async function getWarehouses(req, res) {
  try {
    const response = await tiktokApiRequest('/v2/warehouse/list/', {
      method: 'GET',
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get warehouses error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// GET /api/fulfillment/settings - Get fulfillment settings
async function getFulfillmentSettings(req, res) {
  try {
    const response = await tiktokApiRequest('/v2/fulfillment/settings/', {
      method: 'GET',
    });

    return res.status(200).json({
      fulfillmentMethod: response.data?.fulfillment_type || FULFILLMENT_METHODS.SELLER,
      defaultWarehouse: response.data?.default_warehouse_id,
      defaultLogistics: response.data?.default_logistics_provider_id,
    });
  } catch (error) {
    console.error('Get fulfillment settings error:', error);
    return res.status(200).json({
      fulfillmentMethod: FULFILLMENT_METHODS.SELLER,
      defaultWarehouse: null,
      defaultLogistics: null,
    });
  }
}

module.exports = async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getWarehouses(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};