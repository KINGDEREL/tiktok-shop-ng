// TikTok Shop Orders API
// Endpoints for order management with TikTok

import { tiktokApiRequest, config } from './tiktok-auth.js';

export const config = {
  api: {
    bodyParser: true,
  },
};

// Order status mapping
const ORDER_STATUS_MAP = {
  'pending': 'UNPAID',
  'confirmed': 'CONFIRMED',
  'processing': 'PROCESSING',
  'shipped': 'SHIPPED',
  'delivered': 'DELIVERED',
  'cancelled': 'CANCELLED',
  'refund': 'REFUND',
};

// GET /api/orders - List orders
export async function getOrders(req, res) {
  try {
    const {
      page = 1,
      page_size = 20,
      status,
      start_date,
      end_date,
    } = req.query;

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
export async function getOrder(req, res) {
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

// POST /api/orders/:id/confirm - Confirm order
export async function confirmOrder(req, res) {
  try {
    const { id } = req.query;

    const response = await tiktokApiRequest(`/v2/order/confirm/${id}/`, {
      method: 'POST',
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Confirm order error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// POST /api/orders/:id/cancel - Cancel order
export async function cancelOrder(req, res) {
  try {
    const { id } = req.query;
    const { reason } = req.body;

    const response = await tiktokApiRequest(`/v2/order/cancel/${id}/`, {
      method: 'POST',
      body: JSON.stringify({ cancellation_reason: reason }),
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Cancel order error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// GET /api/orders/:id/tracking - Get tracking info
export async function getOrderTracking(req, res) {
  try {
    const { id } = req.query;

    const response = await tiktokApiRequest(`/v2/order/tracking/${id}/`, {
      method: 'GET',
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get tracking error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getOrders(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}