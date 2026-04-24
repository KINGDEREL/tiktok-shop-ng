import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import {
  ShoppingCart, Search, User, Menu, X, Star, Plus, Minus, Trash2,
  TrendingUp, Package, DollarSign, Users, ArrowRight, ArrowLeft,
  Upload, Eye, Edit, BarChart3, CreditCard, Truck, Home,
  Shield, Check, AlertCircle, Wifi, WifiOff, LogOut,
  Wallet, FileText, Image, Download, RefreshCw, Building2,
  UserCheck, Phone, Mail, Lock, ChevronRight, Bell, Send,
  Target, MessageCircle, Copy, ExternalLink, Sun, Moon,
  Filter, MoreVertical, ShieldCheck, AlertTriangle, Clock,
  Activity, Database, Server, Zap, FileSpreadsheet, Ban, Play
} from 'lucide-react'

// Supabase configuration (placeholder - replace with actual credentials)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
const supabase = createClient(supabaseUrl, supabaseKey)

// Context
const AppContext = createContext()

// Mock Admin Data (would come from Supabase in production)
const MOCK_ADMINS = [
  { id: 1, email: 'admin@tiktokshop.ng', password: 'admin123', name: 'Super Admin', role: 'super_admin', mfaEnabled: true },
  { id: 2, email: 'moderator@tiktokshop.ng', password: 'mod123', name: 'Jane Moderator', role: 'moderator', mfaEnabled: false },
  { id: 3, email: 'finance@tiktokshop.ng', password: 'finance123', name: 'John Finance', role: 'finance', mfaEnabled: true },
  { id: 4, email: 'support@tiktokshop.ng', password: 'support123', name: 'Sarah Support', role: 'support', mfaEnabled: false },
]

const MOCK_SELLERS = [
  { id: 1, name: 'Ahmed Musa', email: 'ahmed@email.com', phone: '+2348012345678', tier: 'individual', status: 'active', kycStatus: 'verified', registeredAt: '2024-01-10', tiktokShop: 'AhmedStore', bankAccount: 'First Bank - 1234567890', balance: 125000, pendingPayout: 45000 },
  { id: 2, name: 'Chioma Fashion', email: 'chioma@email.com', phone: '+2348023456789', tier: 'business', status: 'pending', kycStatus: 'pending', registeredAt: '2024-01-15', tiktokShop: 'ChiomaStyles', bankAccount: 'GT Bank - 0987654321', balance: 0, pendingPayout: 0 },
  { id: 3, name: 'TechHub Nigeria', email: 'techhub@email.com', phone: '+2348034567890', tier: 'business', status: 'suspended', kycStatus: 'verified', registeredAt: '2024-01-05', tiktokShop: 'TechHubNG', bankAccount: 'Zenith Bank - 5678901234', balance: 89000, pendingPayout: 0 },
  { id: 4, name: 'Emeka Goods', email: 'emeka@email.com', phone: '+2348045678901', tier: 'individual', status: 'active', kycStatus: 'failed', registeredAt: '2024-01-18', tiktokShop: 'EmekaStore', bankAccount: '', balance: 0, pendingPayout: 0 },
  { id: 5, name: 'Beauty by Tola', email: 'tola@email.com', phone: '+2348056789012', tier: 'individual', status: 'active', kycStatus: 'verified', registeredAt: '2024-01-12', tiktokShop: 'TolaGlows', bankAccount: 'Access Bank - 3456789012', balance: 230000, pendingPayout: 67000 },
]

const MOCK_PRODUCTS = [
  { id: 1, title: 'Airo Pro Max Wireless Earbuds', price: 25000, originalPrice: 35000, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', category: 'Electronics', stock: 50, sales: 234, status: 'active', tiktokSynced: true, sellerId: 1, sellerName: 'Ahmed Musa', flagReason: null },
  { id: 2, title: 'Classic Denim Jacket', price: 15000, originalPrice: 22000, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400', category: 'Fashion', stock: 30, sales: 156, status: 'active', tiktokSynced: true, sellerId: 5, sellerName: 'Beauty by Tola', flagReason: null },
  { id: 3, title: 'Premium Skincare Set', price: 8500, originalPrice: 12000, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', category: 'Beauty', stock: 100, sales: 567, status: 'pending', tiktokSynced: false, sellerId: 2, sellerName: 'Chioma Fashion', flagReason: null },
  { id: 4, title: 'FAKE Designer Bag', price: 5000, originalPrice: 50000, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', category: 'Fashion', stock: 25, sales: 89, status: 'flagged', tiktokSynced: false, sellerId: 3, sellerName: 'TechHub Nigeria', flagReason: 'Suspected counterfeit - misleading price' },
  { id: 5, title: 'Organic Hair Serum', price: 5500, originalPrice: 8000, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', category: 'Beauty', stock: 80, sales: 312, status: 'active', tiktokSynced: true, sellerId: 1, sellerName: 'Ahmed Musa', flagReason: null },
]

const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Ahmed Musa', email: 'ahmed@email.com', phone: '+2348012345678', address: '15 Adebola Street, Surulere, Lagos', items: [{ title: 'Airo Pro Max', qty: 1, price: 25000 }], total: 25000, status: 'confirmed', date: '2024-01-15', payment: 'paid', sellerId: 1, sellerName: 'Ahmed Musa' },
  { id: 'ORD-002', customer: 'Chioma Adeyemi', email: 'chioma@email.com', phone: '+2348023456789', address: '8 Oyinkansola Ave, Ikoyi, Lagos', items: [{ title: 'Classic Denim Jacket', qty: 2, price: 15000 }], total: 30000, status: 'packed', date: '2024-01-16', payment: 'paid', sellerId: 5, sellerName: 'Beauty by Tola' },
  { id: 'ORD-003', customer: 'Emeka Okonkwo', email: 'emeka@email.com', phone: '+2348034567890', address: '42 New Gbari Street, Abuja', items: [{ title: 'Smart Fitness Watch', qty: 1, price: 18000 }], total: 18000, status: 'shipped', date: '2024-01-17', payment: 'paid', sellerId: 1, sellerName: 'Ahmed Musa' },
  { id: 'ORD-004', customer: 'Fatima Bello', email: 'fatima@email.com', phone: '+2348045678901', address: '7 Marina Road, Victoria Island, Lagos', items: [{ title: 'Premium Skincare Set', qty: 3, price: 8500 }], total: 25500, status: 'delivered', date: '2024-01-14', payment: 'paid', sellerId: 5, sellerName: 'Beauty by Tola' },
  { id: 'ORD-005', customer: 'David Igwe', email: 'david@email.com', phone: '+2348056789012', address: '19 Azikiwe Road, Port Harcourt', items: [{ title: 'Organic Hair Serum', qty: 5, price: 5500 }], total: 27500, status: 'dispute', date: '2024-01-18', payment: 'paid', sellerId: 1, sellerName: 'Ahmed Musa', disputeReason: 'Item not received' },
]

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', type: 'fee', amount: 500, status: 'completed', date: '2024-01-15', sellerId: 1, sellerName: 'Ahmed Musa', method: 'Paystack' },
  { id: 'TXN-002', type: 'payout', amount: 45000, status: 'pending', date: '2024-01-18', sellerId: 1, sellerName: 'Ahmed Musa', method: 'Bank Transfer' },
  { id: 'TXN-003', type: 'payout', amount: 67000, status: 'failed', date: '2024-01-17', sellerId: 5, sellerName: 'Beauty by Tola', method: 'Bank Transfer', failureReason: 'Invalid account number' },
  { id: 'TXN-004', type: 'fee', amount: 600, status: 'completed', date: '2024-01-16', sellerId: 5, sellerName: 'Beauty by Tola', method: 'Flutterwave' },
  { id: 'TXN-005', type: 'refund', amount: 8500, status: 'completed', date: '2024-01-14', sellerId: 1, sellerName: 'Ahmed Musa', method: 'Paystack' },
]

const MOCK_AUDIT_LOGS = [
  { id: 1, adminId: 1, adminName: 'Super Admin', action: 'approve_seller', target: 'Chioma Fashion', details: 'KYC verified, approved seller application', ip: '41.242.123.1', timestamp: '2024-01-18T10:30:00WAT' },
  { id: 2, adminId: 1, adminName: 'Super Admin', action: 'suspend_seller', target: 'TechHub Nigeria', details: 'Policy violation - counterfeit items', ip: '41.242.123.1', timestamp: '2024-01-18T09:15:00WAT' },
  { id: 3, adminId: 2, adminName: 'Jane Moderator', action: 'flag_product', target: 'FAKE Designer Bag', details: 'Suspected counterfeit - misleading price', ip: '41.242.123.2', timestamp: '2024-01-17T16:45:00WAT' },
  { id: 4, adminId: 3, adminName: 'John Finance', action: 'process_payout', target: 'Ahmed Musa', details: 'Manual payout trigger - ₦45,000', ip: '41.242.123.3', timestamp: '2024-01-17T14:20:00WAT' },
  { id: 5, adminId: 4, adminName: 'Sarah Support', action: 'resolve_dispute', target: 'ORD-005', details: 'Refund approved - customer did not receive item', ip: '41.242.123.4', timestamp: '2024-01-18T11:00:00WAT' },
]

const MOCK_API_HEALTH = {
  tiktok: { status: 'connected', lastSync: '2024-01-18T10:45:00WAT', errorRate: 0.2, rateLimit: 85, queueLength: 12 },
  paystack: { status: 'connected', latency: 120, uptime: 99.9 },
  flutterwave: { status: 'connected', latency: 180, uptime: 99.8 },
  database: { status: 'connected', queryTime: 45, connections: 23 },
  jobs: { pending: 45, running: 3, failed: 2 },
}

const MOCK_ALERTS = [
  { id: 1, type: 'warning', message: '3 sellers pending KYC approval for > 24 hours', timestamp: '2024-01-18T09:00:00WAT', read: false },
  { id: 2, type: 'error', message: 'Payout failed for Beauty by Tola - Invalid account', timestamp: '2024-01-17T14:20:00WAT', read: true },
  { id: 3, type: 'info', message: 'TikTok API rate limit at 85%', timestamp: '2024-01-18T08:30:00WAT', read: false },
]

const CATEGORIES = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Food', 'Sports']
const NIGERIAN_STATES = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Benin City', 'Kaduna', 'Enugu']

// Animation variants
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const staggerItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

// Animated Counter
function AnimatedCounter({ value, prefix = '₦', suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const duration = 1.5
    const steps = 30
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration * 1000 / steps)
    return () => clearInterval(timer)
  }, [value])
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Store icon component
function Store({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
)

// ============== SELLER FRONTEND COMPONENTS ==============

// Landing Page
function LandingPage() {
  const navigate = useNavigate()
  const { dataSaver, setDataSaver } = useContext(AppContext)

  return (
    <motion.div className="landing-page" initial="hidden" animate="visible" variants={staggerContainer}>
      <motion.header className="landing-header" variants={staggerItem}>
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🎵</span>
            <span className="logo-text">TikShop<span className="ng-badge">NG</span></span>
          </div>
          <div className="header-actions">
            <button className="data-toggle" onClick={() => setDataSaver(!dataSaver)}>
              {dataSaver ? <WifiOff size={18} /> : <Wifi size={18} />}
              {dataSaver ? 'Data Saver ON' : 'Data Saver OFF'}
            </button>
          </div>
        </div>
      </motion.header>

      <motion.section className="hero-section" variants={staggerItem}>
        <div className="hero-bg"><div className="gradient-orb orb-1" /><div className="gradient-orb orb-2" /></div>
        <div className="hero-content">
          <motion.div className="hero-badge" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>🇳🇬 Nigeria's #1 TikTok Shop Platform</motion.div>
          <h1>Build Your TikTok Shop<br /><span className="gradient-text">In Minutes</span></h1>
          <p>The all-in-one platform to create, manage, and grow your TikTok Shop business in Nigeria.</p>
          <div className="hero-buttons">
            <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/register')}>Start Selling <ArrowRight size={18} /></motion.button>
            <motion.button className="btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/login')}>Login</motion.button>
          </div>
          <div className="hero-stats">
            <div className="stat-item"><span className="stat-value">10K+</span><span className="stat-label">Active Sellers</span></div>
            <div className="stat-item"><span className="stat-value">₦500M+</span><span className="stat-label">Total Sales</span></div>
            <div className="stat-item"><span className="stat-value">500K+</span><span className="stat-label">Orders</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <motion.div className="phone-mockup" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <div className="phone-screen">
              <div className="app-header"><span>🎵 TikShop</span><span className="ng">NG</span></div>
              <div className="app-product"><img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200" alt="" /><div className="product-info"><span>Pro Earbuds</span><span className="price">₦25,000</span></div></div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="features-section">
        <h2>Everything You Need to Sell on TikTok</h2>
        <div className="features-grid">
          {[{ icon: Store, title: 'Easy Store Setup', desc: 'Create your shop in minutes' }, { icon: CreditCard, title: 'Local Payments', desc: 'Accept bank transfers, USSD, cards' }, { icon: TrendingUp, title: 'Analytics', desc: 'Track sales in real-time' }, { icon: Users, title: 'Creator Tools', desc: 'Partner with TikTok creators' }].map((f, i) => (
            <motion.div key={i} className="feature-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}><div className="feature-icon"><f.icon size={24} /></div><h3>{f.title}</h3><p>{f.desc}</p></motion.div>
          ))}
        </div>
      </section>

      <footer className="landing-footer"><div className="footer-content"><div className="footer-brand"><span className="logo-icon">🎵</span><span className="logo-text">TikShop<span className="ng-badge">NG</span></span></div><p>© 2024 TikShop NG.</p></div></footer>
    </motion.div>
  )
}

// Login Page
function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setIsAdmin } = useContext(AppContext)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const admin = MOCK_ADMINS.find(a => a.email === email && a.password === password)
      if (admin) {
        setUser(admin)
        setIsAdmin(true)
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }, 1500)
  }

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="auth-container">
        <motion.div className="auth-card" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
          <Link to="/" className="auth-logo"><span className="logo-icon">🎵</span><span className="logo-text">TikShop<span className="ng-badge">NG</span></span></Link>
          <h1>Welcome Back</h1>
          <p>Login to your account</p>
          <form onSubmit={handleLogin}>
            <div className="form-group"><label><Mail size={16} /> Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@email.com" required /></div>
            <div className="form-group"><label><Lock size={16} /> Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required /></div>
            <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>{loading ? <RefreshCw className="spin" size={18} /> : 'Login'}</motion.button>
          </form>
          <p className="auth-footer">Don't have an account? <Link to="/register">Sign up</Link></p>
          <div className="admin-login-hint"><Link to="/admin-login">Admin Login</Link></div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Register Page
function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [accountType, setAccountType] = useState('individual')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = () => { setLoading(true); setTimeout(() => { setLoading(false); setStep(2) }, 1500) }
  const handleVerifyOTP = () => { setLoading(true); setTimeout(() => { setLoading(false); setStep(3) }, 1500) }
  const handleComplete = () => { setLoading(true); setTimeout(() => { navigate('/dashboard') }, 1500) }

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="auth-container">
        <motion.div className="auth-card register-card" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
          <Link to="/" className="auth-logo"><span className="logo-icon">🎵</span><span className="logo-text">TikShop<span className="ng-badge">NG</span></span></Link>
          <h1>Create Account</h1><p>Step {step} of 3</p>
          <div className="step-progress"><div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div><div className="step-line" /><div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div><div className="step-line" /><div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div></div>
          {step === 1 && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}><div className="form-group"><label><Phone size={16} /> Phone Number</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+2348012345678" required /></div><motion.button className="btn-primary" onClick={handleSendOTP} whileHover={{ scale: 1.02 }} disabled={loading}>{loading ? <RefreshCw className="spin" size={18} /> : 'Send OTP'}</motion.button></motion.div>}
          {step === 2 && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}><div className="form-group"><label><Check size={16} /> Enter OTP</label><input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} required /></div><motion.button className="btn-primary" onClick={handleVerifyOTP} whileHover={{ scale: 1.02 }} disabled={loading}>{loading ? <RefreshCw className="spin" size={18} /> : 'Verify OTP'}</motion.button></motion.div>}
          {step === 3 && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}><div className="account-type"><button className={`type-btn ${accountType === 'individual' ? 'active' : ''}`} onClick={() => setAccountType('individual')}><UserCheck size={24} /><span>Individual</span><small>NIN/BVN</small></button><button className={`type-btn ${accountType === 'business' ? 'active' : ''}`} onClick={() => setAccountType('business')}><Building2 size={24} /><span>Business</span><small>CAC</small></button></div><motion.button className="btn-primary" onClick={handleComplete} whileHover={{ scale: 1.02 }} disabled={loading}>{loading ? <RefreshCw className="spin" size={18} /> : 'Complete'}</motion.button></motion.div>}
          <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============== ADMIN LOGIN ==============

function AdminLoginPage() {
  const navigate = useNavigate()
  const { setUser, setIsAdmin } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [showMfa, setShowMfa] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const admin = MOCK_ADMINS.find(a => a.email === email && a.password === password)
      if (admin) {
        if (admin.mfaEnabled) {
          setShowMfa(true)
          setLoading(false)
        } else {
          setUser(admin)
          setIsAdmin(true)
          navigate('/admin')
        }
      } else {
        setError('Invalid credentials')
        setLoading(false)
      }
    }, 1000)
  }

  const handleMfaVerify = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const admin = MOCK_ADMINS.find(a => a.email === email)
      if (mfaCode === '123456' || mfaCode.length === 6) {
        setUser(admin)
        setIsAdmin(true)
        navigate('/admin')
      } else {
        setError('Invalid MFA code')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <motion.div className="auth-page admin-auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="auth-container">
        <motion.div className="auth-card admin-card" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
          <div className="admin-logo"><ShieldCheck size={48} /><span>TikShop Admin</span></div>
          <h1>Admin Portal</h1>
          <p>Secure access for authorized personnel</p>
          {!showMfa ? (
            <form onSubmit={handleLogin}>
              <div className="form-group"><label><Mail size={16} /> Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tiktokshop.ng" required /></div>
              <div className="form-group"><label><Lock size={16} /> Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required /></div>
              {error && <div className="error-message">{error}</div>}
              <motion.button type="submit" className="btn-primary admin-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>{loading ? <RefreshCw className="spin" size={18} /> : 'Login'}</motion.button>
            </form>
          ) : (
            <form onSubmit={handleMfaVerify}>
              <div className="form-group"><label><Shield size={16} /> MFA Code</label><input type="text" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} required /></div>
              <p className="mfa-hint">Enter the code from your authenticator app</p>
              {error && <div className="error-message">{error}</div>}
              <motion.button type="submit" className="btn-primary admin-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>{loading ? <RefreshCw className="spin" size={18} /> : 'Verify'}</motion.button>
              <button type="button" className="btn-link" onClick={() => setShowMfa(false)}>Back to login</button>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============== ADMIN DASHBOARD ==============

function AdminSidebar({ activeTab, setActiveTab }) {
  const { user, darkMode, setDarkMode } = useContext(AppContext)
  const navigate = useNavigate()

  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview', roles: ['super_admin', 'moderator', 'finance', 'support'] },
    { id: 'sellers', icon: Users, label: 'Sellers', roles: ['super_admin', 'moderator', 'finance', 'support'] },
    { id: 'products', icon: Package, label: 'Products', roles: ['super_admin', 'moderator'] },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', roles: ['super_admin', 'moderator', 'finance', 'support'] },
    { id: 'payments', icon: Wallet, label: 'Payments', roles: ['super_admin', 'finance'] },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', roles: ['super_admin', 'finance'] },
    { id: 'api-health', icon: Activity, label: 'API Health', roles: ['super_admin', 'moderator'] },
    { id: 'audit-log', icon: FileText, label: 'Audit Log', roles: ['super_admin'] },
    { id: 'alerts', icon: Bell, label: 'Alerts', roles: ['super_admin', 'moderator', 'finance', 'support'] },
    { id: 'settings', icon: SettingsIcon, label: 'Settings', roles: ['super_admin'] },
  ]

  const filteredMenu = menuItems.filter(item => user?.role && item.roles.includes(user.role))

  return (
    <motion.aside className="admin-sidebar" initial={{ x: -100 }} animate={{ x: 0 }}>
      <div className="sidebar-header">
        <div className="admin-logo-small"><ShieldCheck size={24} /><span>Admin</span></div>
      </div>
      <nav className="sidebar-nav">
        {filteredMenu.map((item) => (
          <motion.button key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)} whileHover={{ x: 4 }}><item.icon size={18} /><span>{item.label}</span></motion.button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="toggles">
          <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
        </div>
        <div className="admin-user-info">
          <div className="avatar">{user?.name?.[0] || 'A'}</div>
          <div className="user-details"><span className="name">{user?.name}</span><span className="role">{user?.role?.replace('_', ' ')}</span></div>
        </div>
        <button className="logout-btn" onClick={() => { navigate('/'); setUser(null); setIsAdmin(false) }}><LogOut size={16} /> Logout</button>
      </div>
    </motion.aside>
  )
}

// Admin Overview
function AdminOverview() {
  const stats = [
    { label: 'Total Sellers', value: 5420, icon: Users, color: 'cyan', prefix: '' },
    { label: 'Total Orders', value: 89450, icon: ShoppingCart, color: 'pink', prefix: '' },
    { label: 'GMV', value: 125000000, icon: DollarSign, color: 'gold', prefix: '₦' },
    { label: 'Platform Fees', value: 2500000, icon: CreditCard, color: 'green', prefix: '₦' },
  ]

  return (
    <motion.div className="admin-overview" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={staggerItem}>Platform Overview</motion.h2>
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div key={i} className="stat-card" variants={staggerItem} whileHover={{ y: -5 }}>
            <div className={`stat-icon ${stat.color}`}><stat.icon size={22} /></div>
            <div className="stat-content"><span className="stat-label">{stat.label}</span><span className="stat-value">{stat.prefix}<AnimatedCounter value={stat.value} /></span></div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-card"><h3>GMV Over Time (₦)</h3><div className="bar-chart">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => <motion.div key={m} className="bar" initial={{ height: 0 }} animate={{ height: `${40 + Math.random() * 60}%` }} transition={{ delay: i * 0.1 }}><span className="bar-label">{m}</span></motion.div>)}</div></div>
        <div className="chart-card"><h3>New Sellers</h3><div className="bar-chart">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => <motion.div key={m} className="bar pink" initial={{ height: 0 }} animate={{ height: `${30 + Math.random() * 70}%` }} transition={{ delay: i * 0.1 }}><span className="bar-label">{m}</span></motion.div>)}</div></div>
      </div>

      <div className="activity-section">
        <div className="chart-card"><h3>Recent Activity</h3>
          <div className="activity-list">
            {MOCK_AUDIT_LOGS.slice(0, 5).map((log, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon"><FileText size={16} /></div>
                <div className="activity-content"><span className="action">{log.adminName} - {log.action.replace('_', ' ')}</span><span className="target">{log.target}</span></div>
                <span className="activity-time">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card"><h3>System Alerts</h3>
          <div className="alerts-list">
            {MOCK_ALERTS.map((alert, i) => (
              <div key={i} className={`alert-item ${alert.type}`}><AlertTriangle size={16} /><span>{alert.message}</span></div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Seller Management
function SellerManagement() {
  const { user } = useContext(AppContext)
  const [sellers] = useState(MOCK_SELLERS)
  const [filter, setFilter] = useState({ status: 'all', tier: 'all', search: '' })
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionComment, setActionComment] = useState('')

  const canWrite = user?.role === 'super_admin' || user?.role === 'moderator'

  const filteredSellers = sellers.filter(s => {
    if (filter.status !== 'all' && s.status !== filter.status) return false
    if (filter.tier !== 'all' && s.tier !== filter.tier) return false
    if (filter.search && !s.name.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const handleAction = (sellerId, action) => {
    alert(`${action} for seller ${sellerId} - Comment: ${actionComment}`)
    setShowModal(false)
    setActionComment('')
  }

  return (
    <motion.div className="seller-management" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div className="page-header" variants={staggerItem}><h2>Seller Management</h2></motion.div>

      <div className="filters-bar">
        <div className="search-input"><Search size={18} /><input type="text" placeholder="Search sellers..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} /></div>
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}><option value="all">All Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option><option value="kyc_failed">KYC Failed</option></select>
        <select value={filter.tier} onChange={(e) => setFilter({ ...filter, tier: e.target.value })}><option value="all">All Tiers</option><option value="individual">Individual</option><option value="business">Business</option></select>
      </div>

      <div className="data-table">
        <div className="table-header"><span>Seller</span><span>Tier</span><span>Status</span><span>KYC</span><span>Registered</span><span>Balance</span><span>Actions</span></div>
        {filteredSellers.map((seller, i) => (
          <motion.div key={seller.id} className="table-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <span className="seller-cell"><strong>{seller.name}</strong><small>{seller.email}</small></span>
            <span><span className={`tier-badge ${seller.tier}`}>{seller.tier}</span></span>
            <span><span className={`status-badge ${seller.status}`}>{seller.status}</span></span>
            <span><span className={`kyc-badge ${seller.kycStatus}`}>{seller.kycStatus}</span></span>
            <span>{seller.registeredAt}</span>
            <span className="balance">₦{seller.balance.toLocaleString()}</span>
            <span className="actions">
              <button title="View Details" onClick={() => { setSelectedSeller(seller); setShowModal(true) }}><Eye size={16} /></button>
              {canWrite && <button title="Approve" onClick={() => handleAction(seller.id, 'Approve')}><Check size={16} className="success" /></button>}
              {canWrite && <button title="Suspend" onClick={() => handleAction(seller.id, 'Suspend')}><Ban size={16} className="warning" /></button>}
              {user?.role === 'super_admin' && <button title="Impersonate" className="impersonate"><ExternalLink size={16} /></button>}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && selectedSeller && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-card seller-modal" initial={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3>{selectedSeller.name}</h3><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
              <div className="modal-tabs"><button className="active">Profile</button><button>KYC</button><button>TikTok</button><button>Bank</button><button>Payouts</button></div>
              <div className="modal-content">
                <div className="detail-row"><span>Email:</span><span>{selectedSeller.email}</span></div>
                <div className="detail-row"><span>Phone:</span><span>{selectedSeller.phone}</span></div>
                <div className="detail-row"><span>Tier:</span><span>{selectedSeller.tier}</span></div>
                <div className="detail-row"><span>TikTok Shop:</span><span>{selectedSeller.tiktokShop}</span></div>
                <div className="detail-row"><span>Bank Account:</span><span>{selectedSeller.bankAccount || 'Not provided'}</span></div>
                <div className="detail-row"><span>Available Balance:</span><span>₦{selectedSeller.balance.toLocaleString()}</span></div>
                <div className="detail-row"><span>Pending Payout:</span><span>₦{selectedSeller.pendingPayout.toLocaleString()}</span></div>
              </div>
              {canWrite && (
                <div className="modal-actions">
                  <div className="form-group"><input type="text" placeholder="Comment (optional)" value={actionComment} onChange={(e) => setActionComment(e.target.value)} /></div>
                  <button className="btn-success" onClick={() => handleAction(selectedSeller.id, 'Approve')}>Approve</button>
                  <button className="btn-danger" onClick={() => handleAction(selectedSeller.id, 'Reject')}>Reject</button>
                  <button className="btn-warning" onClick={() => handleAction(selectedSeller.id, 'Suspend')}>Suspend</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Product Oversight
function ProductOversight() {
  const { user } = useContext(AppContext)
  const [products] = useState(MOCK_PRODUCTS)
  const [filter, setFilter] = useState({ status: 'all', search: '' })
  const [selectedProducts, setSelectedProducts] = useState([])

  const canWrite = user?.role === 'super_admin' || user?.role === 'moderator'

  const filteredProducts = products.filter(p => {
    if (filter.status !== 'all' && p.status !== filter.status) return false
    if (filter.search && !p.title.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const handleBulkAction = (action) => {
    alert(`${action} ${selectedProducts.length} products`)
    setSelectedProducts([])
  }

  return (
    <motion.div className="product-oversight" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div className="page-header" variants={staggerItem}><h2>Product Oversight</h2></motion.div>

      <div className="filters-bar">
        <div className="search-input"><Search size={18} /><input type="text" placeholder="Search products..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} /></div>
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}><option value="all">All Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="flagged">Flagged</option></select>
        {canWrite && selectedProducts.length > 0 && <button className="btn-bulk" onClick={() => handleBulkAction('Approve')}>Approve Selected ({selectedProducts.length})</button>}
      </div>

      <div className="data-table">
        <div className="table-header"><span>Product</span><span>Seller</span><span>Price</span><span>Stock</span><span>Status</span><span>Synced</span><span>Actions</span></div>
        {filteredProducts.map((product, i) => (
          <motion.div key={product.id} className="table-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <span className="product-cell"><input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={(e) => e.target.checked ? setSelectedProducts([...selectedProducts, product.id]) : setSelectedProducts(selectedProducts.filter(p => p !== product.id))} /><img src={product.image} alt="" /><span>{product.title}</span></span>
            <span>{product.sellerName}</span>
            <span className="price">₦{product.price.toLocaleString()}</span>
            <span>{product.stock}</span>
            <span><span className={`status-badge ${product.status}`}>{product.status}</span></span>
            <span>{product.tiktokSynced ? <Check size={16} className="synced" /> : <X size={16} className="not-synced" />}</span>
            <span className="actions">
              <button title="View"><Eye size={16} /></button>
              {canWrite && <button title="Flag" className={product.flagReason ? 'flagged' : ''}><Flag size={16} /></button>}
              {canWrite && <button title="Sync"><RefreshCw size={16} /></button>}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Flag({ size = 16, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
}

// Order Management (Admin)
function OrderManagementAdmin() {
  const { user } = useContext(AppContext)
  const [orders] = useState(MOCK_ORDERS)
  const [filter, setFilter] = useState({ status: 'all', search: '' })
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [adminNote, setAdminNote] = useState('')

  const canWrite = user?.role === 'super_admin' || user?.role === 'moderator'

  const filteredOrders = orders.filter(o => {
    if (filter.status !== 'all' && o.status !== filter.status) return false
    if (filter.search && !o.id.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const exportCSV = () => {
    alert('Exporting orders to CSV...')
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    alert(`Order ${orderId} status updated to ${newStatus}. Note: ${adminNote}`)
    setShowModal(false)
    setAdminNote('')
  }

  return (
    <motion.div className="order-management-admin" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div className="page-header" variants={staggerItem}>
        <h2>Order Management</h2>
        <motion.button className="btn-secondary" onClick={exportCSV} whileHover={{ scale: 1.02 }}><Download size={18} /> Export CSV</motion.button>
      </motion.div>

      <div className="filters-bar">
        <div className="search-input"><Search size={18} /><input type="text" placeholder="Search orders..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} /></div>
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}><option value="all">All Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="packed">Packed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="dispute">Dispute</option></select>
      </div>

      <div className="data-table">
        <div className="table-header"><span>Order ID</span><span>Seller</span><span>Customer</span><span>Total</span><span>Status</span><span>Date</span><span>Actions</span></div>
        {filteredOrders.map((order, i) => (
          <motion.div key={order.id} className="table-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <span className="order-id">{order.id}</span>
            <span>{order.sellerName}</span>
            <span>{order.customer}</span>
            <span className="price">₦{order.total.toLocaleString()}</span>
            <span><span className={`status-badge ${order.status}`}>{order.status}</span></span>
            <span>{order.date}</span>
            <span className="actions">
              <button title="View Details" onClick={() => { setSelectedOrder(order); setShowModal(true) }}><Eye size={16} /></button>
              {canWrite && <button title="Update Status"><Edit size={16} /></button>}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && selectedOrder && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-card" initial={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3>Order {selectedOrder.id}</h3><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
              <div className="modal-content">
                <div className="detail-row"><span>Customer:</span><span>{selectedOrder.customer}</span></div>
                <div className="detail-row"><span>Email:</span><span>{selectedOrder.email}</span></div>
                <div className="detail-row"><span>Phone:</span><span>{selectedOrder.phone}</span></div>
                <div className="detail-row"><span>Address:</span><span>{selectedOrder.address}</span></div>
                <div className="detail-row"><span>Items:</span><span>{selectedOrder.items.map(i => `${i.title} x${i.qty}`).join(', ')}</span></div>
                <div className="detail-row"><span>Total:</span><span>₦{selectedOrder.total.toLocaleString()}</span></div>
                <div className="detail-row"><span>Status:</span><span className={`status-badge ${selectedOrder.status}`}>{selectedOrder.status}</span></div>
                {selectedOrder.disputeReason && <div className="dispute-info"><AlertTriangle size={16} /><span>Dispute: {selectedOrder.disputeReason}</span></div>}
              </div>
              {canWrite && (
                <div className="modal-actions">
                  <div className="form-group"><input type="text" placeholder="Admin note..." value={adminNote} onChange={(e) => setAdminNote(e.target.value)} /></div>
                  <select><option>Update Status...</option><option>Confirmed</option><option>Packed</option><option>Shipped</option><option>Delivered</option></select>
                  {selectedOrder.disputeReason && <><button className="btn-success">Approve Refund</button><button className="btn-danger">Reject Dispute</button></>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Payment Monitoring
function PaymentMonitoring() {
  const { user } = useContext(AppContext)
  const [transactions] = useState(MOCK_TRANSACTIONS)
  const [settings, setSettings] = useState({ minPayout: 5000, schedule: 'weekly' })

  const canWrite = user?.role === 'super_admin' || user?.role === 'finance'

  const totalFees = transactions.filter(t => t.type === 'fee' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const pendingPayouts = transactions.filter(t => t.type === 'payout' && t.status === 'pending').reduce((sum, t) => sum + t.amount, 0)
  const failedPayouts = transactions.filter(t => t.type === 'payout' && t.status === 'failed')

  return (
    <motion.div className="payment-monitoring" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={staggerItem}>Payment & Payout Monitoring</motion.h2>

      <div className="stats-grid">
        <motion.div className="stat-card" variants={staggerItem}><div className="stat-icon cyan"><DollarSign size={22} /></div><div className="stat-content"><span className="stat-label">Total Fees Collected</span><span className="stat-value">₦<AnimatedCounter value={totalFees} /></span></div></motion.div>
        <motion.div className="stat-card" variants={staggerItem}><div className="stat-icon pink"><Wallet size={22} /></div><div className="stat-content"><span className="stat-label">Pending Payouts</span><span className="stat-value">₦<AnimatedCounter value={pendingPayouts} /></span></div></motion.div>
        <motion.div className="stat-card" variants={staggerItem}><div className="stat-icon red"><AlertTriangle size={22} /></div><div className="stat-content"><span className="stat-label">Failed Payouts</span><span className="stat-value">{failedPayouts.length}</span></div></motion.div>
      </div>

      <div className="payment-section">
        <div className="section-card">
          <h3>Transaction History</h3>
          <div className="data-table">
            <div className="table-header"><span>Transaction ID</span><span>Type</span><span>Seller</span><span>Amount</span><span>Status</span><span>Date</span><span>Actions</span></div>
            {transactions.map((txn, i) => (
              <div key={i} className="table-row">
                <span className="txn-id">{txn.id}</span>
                <span><span className={`type-badge ${txn.type}`}>{txn.type}</span></span>
                <span>{txn.sellerName}</span>
                <span className="amount">₦{txn.amount.toLocaleString()}</span>
                <span><span className={`status-badge ${txn.status}`}>{txn.status}</span></span>
                <span>{txn.date}</span>
                <span className="actions">
                  <button title="View"><Eye size={16} /></button>
                  {canWrite && txn.type === 'payout' && txn.status === 'pending' && <button title="Process Now"><Play size={16} /></button>}
                  {canWrite && txn.status === 'failed' && <button title="Retry"><RefreshCw size={16} /></button>}
                </span>
              </div>
            ))}
          </div>
        </div>

        {canWrite && (
          <div className="section-card">
            <h3>Payout Settings</h3>
            <div className="settings-form">
              <div className="form-group"><label>Minimum Payout (₦)</label><input type="number" value={settings.minPayout} onChange={(e) => setSettings({ ...settings, minPayout: e.target.value })} /></div>
              <div className="form-group"><label>Settlement Schedule</label><select value={settings.schedule} onChange={(e) => setSettings({ ...settings, schedule: e.target.value })}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="biweekly">Bi-weekly</option></select></div>
              <button className="btn-primary">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Analytics (Admin)
function AnalyticsAdmin() {
  const topProducts = [
    { name: 'Airo Pro Max Earbuds', revenue: 5850000, sales: 234 },
    { name: 'Premium Skincare Set', revenue: 1606500, sales: 189 },
    { name: 'Classic Denim Jacket', revenue: 2340000, sales: 156 },
    { name: 'Smart Fitness Watch', revenue: 1620000, sales: 90 },
    { name: 'Organic Hair Serum', revenue: 1716000, sales: 312 },
  ]

  return (
    <motion.div className="analytics-admin" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={staggerItem}>Analytics & Reporting</motion.h2>

      <div className="analytics-grid">
        <div className="chart-card large"><h3>GMV Over Time</h3><div className="line-chart">{[65, 45, 75, 55, 85, 70, 90, 80, 95, 88, 100, 95].map((v, i) => <motion.div key={i} className="line-point" initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.05 }} />)}</div></div>
        <div className="chart-card"><h3>Top Products by Revenue</h3><div className="top-products-list">{topProducts.map((p, i) => <div key={i} className="top-product-row"><span className="rank">{i + 1}</span><span className="name">{p.name}</span><span className="sales">{p.sales} sold</span><span className="revenue">₦{p.revenue.toLocaleString()}</span></div>)}</div></div>
        <div className="chart-card"><h3>API Usage</h3><div className="api-usage"><div className="usage-bar"><div className="usage-fill" style={{ width: '75%' }}>75%</div></div><span className="usage-label">Rate Limit Used</span></div></div>
      </div>

      <motion.button className="btn-secondary export-btn" whileHover={{ scale: 1.02 }}><Download size={18} /> Export Report</motion.button>
    </motion.div>
  )
}

// API Health
function APIHealth() {
  const { apiHealth } = useContext(AppContext)
  const [webhookLogs] = useState([
    { event: 'order.created', status: 200, timestamp: '2024-01-18T10:45:00WAT' },
    { event: 'product.updated', status: 200, timestamp: '2024-01-18T10:44:00WAT' },
    { event: 'order.shipped', status: 200, timestamp: '2024-01-18T10:43:00WAT' },
    { event: 'catalog.sync', status: 429, timestamp: '2024-01-18T10:42:00WAT' },
    { event: 'payout.completed', status: 200, timestamp: '2024-01-18T10:41:00WAT' },
  ])

  return (
    <motion.div className="api-health" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={staggerItem}>API Health & Sync Monitoring</motion.h2>

      <div className="stats-grid">
        <motion.div className="stat-card" variants={staggerItem}><div className="stat-icon cyan"><Activity size={22} /></div><div className="stat-content"><span className="stat-label">TikTok Status</span><span className="stat-value success">{apiHealth.tiktok.status}</span></div></motion.div>
        <motion.div className="stat-card" variants={staggerItem}><div className="stat-icon green"><Server size={22} /></div><div className="stat-content"><span className="stat-label">Paystack Latency</span><span className="stat-value">{apiHealth.paystack.latency}ms</span></div></motion.div>
        <motion.div className="stat-card" variants={staggerItem}><div className="stat-icon green"><Database size={22} /></div><div className="stat-content"><span className="stat-label">DB Query Time</span><span className="stat-value">{apiHealth.database.queryTime}ms</span></div></motion.div>
        <motion.div className="stat-card" variants={staggerItem}><div className="stat-icon yellow"><Zap size={22} /></div><div className="stat-content"><span className="stat-label">Pending Jobs</span><span className="stat-value">{apiHealth.jobs.pending}</span></div></motion.div>
      </div>

      <div className="api-details">
        <div className="section-card">
          <h3>TikTok Shop API</h3>
          <div className="api-stats">
            <div className="api-stat"><span>Last Sync</span><span>{apiHealth.tiktok.lastSync}</span></div>
            <div className="api-stat"><span>Error Rate</span><span>{apiHealth.tiktok.errorRate}%</span></div>
            <div className="api-stat"><span>Rate Limit</span><span>{apiHealth.tiktok.rateLimit}%</span></div>
            <div className="api-stat"><span>Queue Length</span><span>{apiHealth.tiktok.queueLength}</span></div>
          </div>
          <button className="btn-secondary"><RefreshCw size={16} /> Force Sync All</button>
        </div>

        <div className="section-card">
          <h3>Webhook Logs</h3>
          <div className="data-table compact">
            <div className="table-header"><span>Event</span><span>Status</span><span>Timestamp</span></div>
            {webhookLogs.map((log, i) => (
              <div key={i} className="table-row">
                <span>{log.event}</span>
                <span><span className={`status-badge ${log.status === 200 ? 'success' : 'error'}`}>{log.status}</span></span>
                <span>{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Audit Log
function AuditLog() {
  const [filter, setFilter] = useState({ action: 'all', admin: 'all', search: '' })
  const [logs] = useState(MOCK_AUDIT_LOGS)

  return (
    <motion.div className="audit-log" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={staggerItem}>Audit Log</motion.h2>

      <div className="filters-bar">
        <div className="search-input"><Search size={18} /><input type="text" placeholder="Search logs..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} /></div>
        <select value={filter.action} onChange={(e) => setFilter({ ...filter, action: e.target.value })}><option value="all">All Actions</option><option value="approve_seller">Approve Seller</option><option value="suspend_seller">Suspend Seller</option><option value="flag_product">Flag Product</option><option value="process_payout">Process Payout</option><option value="resolve_dispute">Resolve Dispute</option></select>
        <select value={filter.admin} onChange={(e) => setFilter({ ...filter, admin: e.target.value })}><option value="all">All Admins</option><option value="1">Super Admin</option><option value="2">Jane Moderator</option><option value="3">John Finance</option><option value="4">Sarah Support</option></select>
      </div>

      <div className="data-table">
        <div className="table-header"><span>Admin</span><span>Action</span><span>Target</span><span>Details</span><span>IP Address</span><span>Timestamp</span></div>
        {logs.map((log, i) => (
          <motion.div key={i} className="table-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <span className="admin-cell">{log.adminName}</span>
            <span><span className="action-badge">{log.action.replace('_', ' ')}</span></span>
            <span>{log.target}</span>
            <span className="details">{log.details}</span>
            <span className="ip">{log.ip}</span>
            <span className="timestamp">{log.timestamp}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Alerts
function Alerts() {
  const { alerts, setAlerts } = useContext(AppContext)
  const [settings, setSettings] = useState({ payoutFailure: 5, apiRateLimit: 80, pendingSeller: 24 })

  const markAsRead = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a))
  }

  return (
    <motion.div className="alerts-page" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={staggerItem}>Alerts & Notifications</motion.h2>

      <div className="alerts-grid">
        <div className="section-card">
          <h3>Active Alerts</h3>
          <div className="alerts-list">
            {alerts.map((alert, i) => (
              <motion.div key={i} className={`alert-item ${alert.type} ${alert.read ? 'read' : ''}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => markAsRead(alert.id)}>
                <AlertTriangle size={18} />
                <div className="alert-content"><span className="message">{alert.message}</span><span className="time">{alert.timestamp}</span></div>
                {!alert.read && <span className="unread-dot" />}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h3>Alert Configuration</h3>
          <div className="alert-settings">
            <div className="setting-row"><span>Payout Failure Rate (%)</span><input type="number" value={settings.payoutFailure} onChange={(e) => setSettings({ ...settings, payoutFailure: e.target.value })} /><span>Alert when exceeded</span></div>
            <div className="setting-row"><span>API Rate Limit (%)</span><input type="number" value={settings.apiRateLimit} onChange={(e) => setSettings({ ...settings, apiRateLimit: e.target.value })} /><span>Alert when exceeded</span></div>
            <div className="setting-row"><span>Pending Seller (hours)</span><input type="number" value={settings.pendingSeller} onChange={(e) => setSettings({ ...settings, pendingSeller: e.target.value })} /><span>Remind after</span></div>
            <button className="btn-primary">Save Configuration</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Admin Settings
function AdminSettings() {
  const [settings, setSettings] = useState({ mfaRequired: true, sessionTimeout: 15, ipWhitelist: '', lowBandwidth: false })
  const [roles] = useState([
    { name: 'Super Admin', permissions: ['all'], users: 1 },
    { name: 'Moderator', permissions: ['sellers', 'products', 'orders'], users: 2 },
    { name: 'Finance', permissions: ['payments'], users: 1 },
    { name: 'Support', permissions: ['view_sellers', 'view_orders'], users: 3 },
  ])

  return (
    <motion.div className="admin-settings" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={staggerItem}>Admin Settings</motion.h2>

      <div className="settings-grid">
        <div className="section-card">
          <h3>Security Settings</h3>
          <div className="setting-item"><div><span>Mandatory MFA</span><small>Require 2FA for all admins</small></div><button className={`toggle-switch ${settings.mfaRequired ? 'active' : ''}`} onClick={() => setSettings({ ...settings, mfaRequired: !settings.mfaRequired })}><span className="toggle-thumb" /></button></div>
          <div className="setting-item"><div><span>Session Timeout (minutes)</span><small>Auto-logout after inactivity</small></div><input type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })} /></div>
          <div className="setting-item"><div><span>IP Whitelist</span><small>Comma-separated IPs (optional)</small></div><input type="text" value={settings.ipWhitelist} onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })} placeholder="e.g., 41.242.123.1, 10.0.0.1" /></div>
        </div>

        <div className="section-card">
          <h3>Role Management</h3>
          <div className="roles-list">{roles.map((role, i) => <div key={i} className="role-row"><span className="role-name">{role.name}</span><span className="role-perms">{role.permissions.join(', ')}</span><span className="role-users">{role.users} user(s)</span></div>)}</div>
        </div>

        <div className="section-card">
          <h3>System Preferences</h3>
          <div className="setting-item"><div><span>Low Bandwidth Mode</span><small>Disable real-time updates</small></div><button className={`toggle-switch ${settings.lowBandwidth ? 'active' : ''}`} onClick={() => setSettings({ ...settings, lowBandwidth: !settings.lowBandwidth })}><span className="toggle-thumb" /></button></div>
        </div>
      </div>

      <motion.button className="btn-primary save-btn" whileHover={{ scale: 1.02 }}>Save All Settings</motion.button>
    </motion.div>
  )
}

// Seller Dashboard (existing component kept for reference)
function DashboardOverview() {
  const stats = [
    { label: 'Total Revenue', value: 1250000, icon: DollarSign, color: 'cyan', prefix: '₦' },
    { label: 'Total Orders', value: 156, icon: ShoppingCart, color: 'pink', prefix: '' },
    { label: 'Products Sold', value: 234, icon: Package, color: 'purple', prefix: '' },
    { label: 'Active Creators', value: 12, icon: Users, color: 'gold', prefix: '' },
  ]

  return (
    <motion.div className="dashboard-overview" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h2 variants={staggerItem}>Dashboard Overview</motion.h2>
      <div className="stats-grid">
        {stats.map((stat, i) => (<motion.div key={i} className="stat-card" variants={staggerItem} whileHover={{ y: -5 }}><div className={`stat-icon ${stat.color}`}><stat.icon size={22} /></div><div className="stat-content"><span className="stat-label">{stat.label}</span><span className="stat-value">{stat.prefix}<AnimatedCounter value={stat.value} /></span></div></motion.div>))}
      </div>
    </motion.div>
  )
}

// Main Admin Dashboard Layout
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user } = useContext(AppContext)

  return (
    <div className="dashboard-layout admin-layout">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left"><h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h1></div>
          <div className="header-right">
            <button className="icon-btn"><Bell size={20} /><span className="notification-dot" /></button>
            <div className="user-profile"><div className="avatar">{user?.name?.[0] || 'A'}</div><span>{user?.name}</span></div>
          </div>
        </header>
        <div className="dashboard-content">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <AdminOverview key="overview" />}
            {activeTab === 'sellers' && <SellerManagement key="sellers" />}
            {activeTab === 'products' && <ProductOversight key="products" />}
            {activeTab === 'orders' && <OrderManagementAdmin key="orders" />}
            {activeTab === 'payments' && <PaymentMonitoring key="payments" />}
            {activeTab === 'analytics' && <AnalyticsAdmin key="analytics" />}
            {activeTab === 'api-health' && <APIHealth key="api-health" />}
            {activeTab === 'audit-log' && <AuditLog key="audit-log" />}
            {activeTab === 'alerts' && <Alerts key="alerts" />}
            {activeTab === 'settings' && <AdminSettings key="settings" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// Main App
function App() {
  const [dataSaver, setDataSaver] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const [apiHealth] = useState(MOCK_API_HEALTH)

  return (
    <AppContext.Provider value={{ dataSaver, setDataSaver, darkMode, setDarkMode, user, setUser, isAdmin, setIsAdmin, alerts, setAlerts, apiHealth }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <AdminLoginPage />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App