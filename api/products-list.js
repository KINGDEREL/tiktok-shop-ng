// TikTok Shop Products List API
// Fetches products from TikTok Shop to display on the website

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

// Mock products for demo mode (when no TikTok credentials)
const MOCK_TIKTOK_PRODUCTS = [
  {
    id: 'tt001',
    title: 'Premium Wireless Earbuds',
    price: 25000,
    originalPrice: 35000,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    category: 'Electronics',
    stock: 50,
    sales: 234,
    seller: 'TechZone NG',
    rating: 4.5,
    reviews: 89,
  },
  {
    id: 'tt002',
    title: 'Classic Denim Jacket',
    price: 15000,
    originalPrice: 22000,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400',
    category: 'Fashion',
    stock: 30,
    sales: 156,
    seller: 'Fashion Hub',
    rating: 4.2,
    reviews: 45,
  },
  {
    id: 'tt003',
    title: 'Organic Skincare Set',
    price: 8500,
    originalPrice: 12000,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    category: 'Beauty',
    stock: 100,
    sales: 567,
    seller: 'Glow Nigeria',
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 'tt004',
    title: 'Smart Fitness Watch',
    price: 18000,
    originalPrice: 25000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf15?w=400',
    category: 'Electronics',
    stock: 45,
    sales: 312,
    seller: 'Gadgets NG',
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 'tt005',
    title: 'Handmade Ankara Bag',
    price: 12000,
    originalPrice: 18000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'Fashion',
    stock: 20,
    sales: 89,
    seller: 'Ankara Style',
    rating: 4.9,
    reviews: 67,
  },
  {
    id: 'tt006',
    title: 'Natural Hair Growth Oil',
    price: 5500,
    originalPrice: 8000,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
    category: 'Beauty',
    stock: 80,
    sales: 412,
    seller: 'Hair Magic',
    rating: 4.7,
    reviews: 198,
  },
  {
    id: 'tt007',
    title: 'Bluetooth Speaker',
    price: 15000,
    originalPrice: 20000,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    category: 'Electronics',
    stock: 60,
    sales: 267,
    seller: 'Audio Plus',
    rating: 4.4,
    reviews: 123,
  },
  {
    id: 'tt008',
    title: 'Vintage Sunglasses',
    price: 8000,
    originalPrice: 12000,
    image: 'https://images.unsplash.com/photo-1572635196237-14b0f28185f9?w=400',
    category: 'Fashion',
    stock: 35,
    sales: 145,
    seller: 'Style Hub',
    rating: 4.3,
    reviews: 78,
  },
];

// GET /api/products-list - Get all products for public display
async function getProductsList(req, res) {
  const { page = 1, limit = 20, category, search, seller } = req.query;

  // Check if TikTok is configured with real credentials
  const hasRealTikTok = config.clientId && config.clientSecret && config.accessToken;

  try {
    let products;

    if (hasRealTikTok) {
      // Fetch from real TikTok API
      const response = await tiktokApiRequest(
        `/v2/product/list/?page=${page}&page_size=${limit}`,
        { method: 'GET' }
      );
      products = transformTikTokProducts(response.data?.products || []);
    } else {
      // Use mock products for demo
      products = MOCK_TIKTOK_PRODUCTS;
    }

    // Apply filters
    let filtered = [...products];

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.seller.toLowerCase().includes(searchLower)
      );
    }

    if (seller) {
      filtered = filtered.filter(p => p.seller.toLowerCase().includes(seller.toLowerCase()));
    }

    return res.status(200).json({
      success: true,
      products: filtered,
      total: filtered.length,
      page: parseInt(page),
      hasMore: false,
      mode: hasRealTikTok ? 'live' : 'demo',
    });
  } catch (error) {
    console.error('Get products error:', error);
    // Fall back to mock products on error
    return res.status(200).json({
      success: true,
      products: MOCK_TIKTOK_PRODUCTS,
      total: MOCK_TIKTOK_PRODUCTS.length,
      page: 1,
      hasMore: false,
      mode: 'demo',
    });
  }
}

// Transform TikTok API response to our format
function transformTikTokProducts(tiktokProducts) {
  return tiktokProducts.map(p => ({
    id: p.product_id || p.id,
    title: p.product_name || p.title,
    price: (p.sale_price?.amount || 0) / 100,
    originalPrice: (p.retail_price?.amount || 0) / 100,
    image: p.images?.[0]?.url || p.image_url || '',
    category: p.category_id || 'General',
    stock: p.stock_info?.[0]?.available_quantity || 0,
    sales: p.sales || 0,
    seller: p.seller_name || p.brand_id || 'TikTok Shop',
    rating: p.rating || 4.0,
    reviews: p.reviews_count || 0,
  }));
}

module.exports = async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getProductsList(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};