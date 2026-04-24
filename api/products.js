// TikTok Shop Products API
// Endpoints for product CRUD and sync with TikTok

import { tiktokApiRequest, config } from './tiktok-auth.js';

export const config = {
  api: {
    bodyParser: true,
  },
};

// GET /api/products - List products
export async function getProducts(req, res) {
  try {
    const { page = 1, page_size = 20, status } = req.query;

    const response = await tiktokApiRequest(
      `/v2/product/list/?page=${page}&page_size=${page_size}${status ? `&status=${status}` : ''}`,
      { method: 'GET' }
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// POST /api/products - Create product
export async function createProduct(req, res) {
  try {
    const product = req.body;

    // Transform product to TikTok format
    const tiktokProduct = transformProductForTikTok(product);

    const response = await tiktokApiRequest('/v2/product/add/', {
      method: 'POST',
      body: JSON.stringify(tiktokProduct),
    });

    return res.status(201).json(response);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// PUT /api/products/:id - Update product
export async function updateProduct(req, res) {
  try {
    const { id } = req.query;
    const product = req.body;

    const response = await tiktokApiRequest(`/v2/product/update/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// DELETE /api/products/:id - Delete product
export async function deleteProduct(req, res) {
  try {
    const { id } = req.query;

    const response = await tiktokApiRequest(`/v2/product/delete/${id}/`, {
      method: 'DELETE',
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// POST /api/products/sync - Sync product to TikTok
export async function syncProduct(req, res) {
  try {
    const { productId, localProductId } = req.body;

    // First, get local product data
    // Then create/update on TikTok
    const tiktokResponse = await tiktokApiRequest('/v2/product/push/', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        target_shop_id: config.shopId,
      }),
    });

    return res.status(200).json({
      success: true,
      tiktokProductId: tiktokResponse.data?.product_id,
      localProductId,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sync product error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Transform local product to TikTok Shop format
function transformProductForTikTok(product) {
  return {
    product_name: product.title,
    description: product.description || product.title,
    category_id: product.categoryId,
    brand_id: product.brandId,
    sale_price: {
      currency: 'NGN',
      amount: Math.round(product.price * 100),
    },
    retail_price: {
      currency: 'NGN',
      amount: Math.round((product.originalPrice || product.price) * 100),
    },
    stock_info: [{
      warehouse_id: config.merchantId,
      available_quantity: product.stock,
    }],
    images: product.images?.map(url => ({ url })) || [],
    variants: product.variants?.map(v => ({
      sku: v.sku,
      price: {
        currency: 'NGN',
        amount: Math.round(v.price * 100),
      },
      stock: v.stock,
      attributes: v.attributes || {},
    })) || [],
  };
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}