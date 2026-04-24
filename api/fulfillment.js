// TikTok Shop Fulfillment API
// Endpoints for warehouse, logistics, and fulfillment management

import { tiktokApiRequest, config } from './tiktok-auth.js';

export const config = {
  api: {
    bodyParser: true,
  },
};

// Fulfillment methods
const FULFILLMENT_METHODS = {
  TIKTOK: 'ship_by_tiktok',       // TikTok handles fulfillment
  SELLER: 'ship_by_seller',       // Seller handles fulfillment
};

// GET /api/fulfillment/warehouses - List warehouses
export async function getWarehouses(req, res) {
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

// POST /api/fulfillment/warehouses - Create warehouse
export async function createWarehouse(req, res) {
  try {
    const warehouse = req.body;

    const response = await tiktokApiRequest('/v2/warehouse/add/', {
      method: 'POST',
      body: JSON.stringify({
        warehouse_name: warehouse.name,
        warehouse_address: {
          region: warehouse.region || 'NG',
          country: warehouse.country || 'Nigeria',
          state: warehouse.state,
          city: warehouse.city,
          district: warehouse.district,
          address_detail: warehouse.address,
          postal_code: warehouse.postalCode,
        },
        warehouse_contact: {
          contact_name: warehouse.contactName,
          phone: warehouse.phone,
          email: warehouse.email,
        },
        warehouse_type: warehouse.type || 'primary',
      }),
    });

    return res.status(201).json(response);
  } catch (error) {
    console.error('Create warehouse error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// PUT /api/fulfillment/warehouses/:id - Update warehouse
export async function updateWarehouse(req, res) {
  try {
    const { id } = req.query;
    const warehouse = req.body;

    const response = await tiktokApiRequest(`/v2/warehouse/update/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(warehouse),
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Update warehouse error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// GET /api/fulfillment/logistics - List logistics providers
export async function getLogistics(req, res) {
  try {
    const response = await tiktokApiRequest('/v2/logistics/provider/list/', {
      method: 'GET',
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get logistics error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// POST /api/fulfillment/logistics - Set default logistics provider
export async function setLogisticsProvider(req, res) {
  try {
    const { providerId, warehouseId } = req.body;

    const response = await tiktokApiRequest('/v2/logistics/default/set/', {
      method: 'POST',
      body: JSON.stringify({
        logistics_provider_id: providerId,
        warehouse_id: warehouseId || config.merchantId,
      }),
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Set logistics error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// POST /api/fulfillment/ship - Create shipping label
export async function createShipping(req, res) {
  try {
    const { orderId, warehouseId, logisticsProviderId, serviceType } = req.body;

    const response = await tiktokApiRequest('/v2/logistics/ship/', {
      method: 'POST',
      body: JSON.stringify({
        order_id: orderId,
        warehouse_id: warehouseId || config.merchantId,
        logistics_provider_id: logisticsProviderId,
        shipping_service_type: serviceType || 'standard',
      }),
    });

    return res.status(201).json({
      success: true,
      trackingNumber: response.data?.tracking_number,
      labelUrl: response.data?.label_url,
      estimatedDelivery: response.data?.estimated_delivery_time,
    });
  } catch (error) {
    console.error('Create shipping error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// GET /api/fulfillment/settings - Get fulfillment settings
export async function getFulfillmentSettings(req, res) {
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
    // Return default settings if API fails
    return res.status(200).json({
      fulfillmentMethod: FULFILLMENT_METHODS.SELLER,
      defaultWarehouse: null,
      defaultLogistics: null,
    });
  }
}

// PUT /api/fulfillment/settings - Update fulfillment settings
export async function updateFulfillmentSettings(req, res) {
  try {
    const { fulfillmentMethod, defaultWarehouse, defaultLogistics } = req.body;

    const response = await tiktokApiRequest('/v2/fulfillment/settings/update/', {
      method: 'PUT',
      body: JSON.stringify({
        fulfillment_type: fulfillmentMethod,
        default_warehouse_id: defaultWarehouse,
        default_logistics_provider_id: defaultLogistics,
      }),
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Update fulfillment settings error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getWarehouses(req, res);
    case 'POST':
      return createWarehouse(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}