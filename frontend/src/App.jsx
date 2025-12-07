import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useState } from 'react'
import Home from './pages/Home.jsx'
import Restaurant from './pages/Restaurant.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Payment from './pages/Payment.jsx'
import Auth from './pages/Auth.jsx'
import Orders from './pages/Orders.jsx'
import Dining from './pages/Dining.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Profile from './pages/Profile.jsx'
import RestaurantDetails from './pages/RestaurantDetails.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import { AuthProvider, useAuth } from './state/AuthContext.jsx'
import { CartProvider, useCart } from './state/CartContext.jsx'

function PremiumModal({ onClose }) {
  const { user, togglePremium } = useAuth();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 999 }}>
      <div className="ff-card" style={{ maxWidth: 400, width: '100%', padding: 24, background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Premium Membership</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ marginTop: 16 }}>
          <p>Become a premium member to get exclusive benefits:</p>
          <ul>
            <li>Free delivery on all orders</li>
            <li>Exclusive discounts on selected restaurants</li>
            <li>Early access to new features</li>
          </ul>
          {user?.isPremium ? (
            <div>
              <p>You are already a premium member!</p>
              <button onClick={() => { togglePremium(); onClose(); }} className="ff-outline" style={{ padding: '10px 12px', width: '100%', marginTop: 8 }}>Cancel Membership</button>
            </div>
          ) : (
            <button onClick={() => { togglePremium(); onClose(); }} className="ff-primary" style={{ padding: '10px 12px', width: '100%', marginTop: 8 }}>Become a Premium Member</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Nav(){
  const { authenticated, logout, user } = useAuth()
  const { count } = useCart()
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  function Icon({ name }){
    if (name==='crown') return (<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M3 7l5 4 4-6 4 6 5-4v10H3z"/></svg>)
    if (name==='cart') return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6h15l-1.5 9h-12z" stroke="#fff" strokeWidth="2"/><circle cx="9" cy="20" r="1.5" fill="#fff"/><circle cx="18" cy="20" r="1.5" fill="#fff"/></svg>)
    return null
  }

  return (
    <>
      <header style={{
        position:'fixed',top:0,left:0,right:0,zIndex:100,
        background:'rgba(255,255,255,0.98)',
        backdropFilter:'blur(20px) saturate(180%)',
        WebkitBackdropFilter:'blur(20px) saturate(180%)',
        boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
        borderBottom:'1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth:1280,
          margin:'0 auto',
          padding:'10px 20px',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between'
        }}> 
          <Link to="/" style={{
            fontSize: 28,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            letterSpacing: '-0.5px'
          }}>
            FoodTown
          </Link>
          <nav style={{display:'flex',alignItems:'center',gap:12}}>
            <button 
              onClick={() => setShowPremiumModal(true)} 
              style={{ 
                display:'inline-flex', 
                alignItems:'center', 
                gap:6, 
                background: 'linear-gradient(135deg,#ff416c,#ff4b2b)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontWeight: 700,
                fontSize: 14,
                boxShadow:'0 4px 12px rgba(255,75,43,0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,75,43,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,75,43,0.3)'
              }}
            >
              <Icon name="crown" /> Premium
            </button>
            <Link 
              to="/cart" 
              style={{
                display:'inline-flex',
                alignItems:'center',
                gap:8,
                background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color:'#fff',
                padding:'10px 18px',
                borderRadius:12,
                textDecoration:'none',
                boxShadow:'0 4px 12px rgba(102, 126, 234, 0.3)',
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              <Icon name="cart" /> 
              <span>Cart</span>
              {count > 0 && (
                <span style={{
                  marginLeft: 4,
                  background: 'rgba(255,255,255,0.3)',
                  padding: '2px 8px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {count}
                </span>
              )}
            </Link>
            {authenticated ? (
              <div style={{position:'relative'}}>
                <button 
                  onClick={()=>setOpenProfile(v=>!v)} 
                  style={{
                    width:42,
                    height:42,
                    borderRadius:'50%',
                    border:'2px solid #e8ecf4',
                    background:`url(${user?.image||'https://i.pravatar.cc/100'}) center/cover`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8ecf4'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                {openProfile && (
                  <div 
                    className="ff-card" 
                    style={{
                      position:'absolute',
                      right:0,
                      top:'calc(100% + 12px)',
                      minWidth:200,
                      padding:8,
                      borderRadius: 16,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      background: '#fff'
                    }} 
                    onMouseLeave={()=>setOpenProfile(false)}
                  >
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f0f0f0',
                      marginBottom: 4
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 2 }}>
                        {user?.fullName || 'User'}
                      </div>
                      <div style={{ fontSize: 13, color: '#666' }}>
                        {user?.email || ''}
                      </div>
                    </div>
                    <Link 
                      to="/profile" 
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:10,
                        padding:'10px 14px',
                        textDecoration:'none',
                        color:'#333',
                        borderRadius: 10,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f8f9ff'
                        e.currentTarget.style.color = '#667eea'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#333'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:10,
                        padding:'10px 14px',
                        textDecoration:'none',
                        color:'#333',
                        borderRadius: 10,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f8f9ff'
                        e.currentTarget.style.color = '#667eea'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#333'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      Orders
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:10,
                        padding:'10px 14px',
                        textDecoration:'none',
                        color:'#333',
                        borderRadius: 10,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f8f9ff'
                        e.currentTarget.style.color = '#667eea'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#333'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      My Bookings
                    </Link>
                    <div style={{
                      height: 1,
                      background: '#f0f0f0',
                      margin: '8px 0'
                    }} />
                    <button 
                      onClick={logout} 
                      style={{
                        width:'100%',
                        padding:'10px 14px',
                        background: 'transparent',
                        border: '1px solid #e8ecf4',
                        borderRadius: 10,
                        color: '#e53e3e',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee'
                        e.currentTarget.style.borderColor = '#e53e3e'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = '#e8ecf4'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/auth" 
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
    </>
  )
}

function AuthGate({ children }){
  const { authenticated, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <div style={{padding:24}}>Loading...</div>
  if (authenticated && loc.pathname === '/auth') return <Navigate to="/" replace />
  if (!authenticated) return <Auth />
  return children
}

export default function App() {
  const loc = useLocation()
  const showChrome = loc.pathname !== '/auth'
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <div style={{minHeight:'100dvh',display:'grid',gridTemplateRows:'auto 1fr'}}>
            {showChrome && <Nav />}
            <AuthGate>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dining" element={<Dining />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/restaurant/:id/details" element={<RestaurantDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
              </Routes>
            </AuthGate>
          </div>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}
