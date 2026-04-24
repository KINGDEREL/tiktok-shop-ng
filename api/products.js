// TikTok Shop Products API
// Endpoints for product CRUD and sync with TikTok

const { config, TIKTOK_API_BASE } = require('./tiktok-auth.js');

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

// GET /api/products - List products
async function getProducts(req, res) {
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
async function createProduct(req, res) {
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

module.exports = async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};