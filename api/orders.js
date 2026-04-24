// TikTok Shop Orders API
// Endpoints for order management with TikTok

const { config, TIKTOK_API_BASE } = require('./tiktok-auth.js');

const ORDER_STATUS_MAP = {
  'pending': 'UNPAID',
  'confirmed': 'CONFIRMED',
  'processing': 'PROCESSING',
  'shipped': 'SHIPPED',
  'delivered': 'DELIVERED',
  'cancelled': 'CANCELLED',
  'refund': 'REFUND',
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

// GET /api/orders - List orders
async function getOrders(req, res) {
  try {
    const { page = 1, page_size = 20, status, start_date, end_date } = req.query;

    let query = `/v2/order/list/?page=${page}&page_size=${page_size}`;
    if (status) query += `&status=${ORDER_STATUS_MAP[status] || status}`;
    if (start_date) query += `&start_date=${start_date}`;
    if (end_date) query += `&end_date=${end_date}`;

    const response = await tiktokApiRequest(query, { method: 'GET' });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// GET /api/orders/:id - Get order details
async function getOrder(req, res) {
  try {
    const { id } = req.query;

    const response = await tiktokApiRequest(`/v2/order/detail/${id}/`, {
      method: 'GET',
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getOrders(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};