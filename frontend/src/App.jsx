import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useState } from 'react'
import Home from './pages/Home.jsx'
import Restaurant from './pages/Restaurant.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Auth from './pages/Auth.jsx'
import Orders from './pages/Orders.jsx'
import Dining from './pages/Dining.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Profile from './pages/Profile.jsx'
import RestaurantDetails from './pages/RestaurantDetails.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import { AuthProvider, useAuth } from './state/AuthContext.jsx'
import { CartProvider, useCart } from './state/CartContext.jsx'
import BottomNav from './components/BottomNav.jsx'

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
        position:'sticky',top:0,zIndex:100,
        background:'linear-gradient(to right, rgba(255,255,255,0.65), rgba(255,255,255,0.75))',
        backdropFilter:'saturate(180%) blur(12px)',
        WebkitBackdropFilter:'saturate(180%) blur(12px)',
        boxShadow:'0 8px 28px rgba(0,0,0,0.08)',
        borderBottom:'1px solid rgba(255,255,255,0.5)'
      }}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}> 
          <Link to="/" className="main-nav-logo">FoodTown</Link>
          <nav style={{display:'flex',alignItems:'center',gap:14}}>
            <button onClick={() => setShowPremiumModal(true)} style={{ display:'inline-flex', alignItems:'center', gap:8, background: 'linear-gradient(135deg,#ff416c,#ff4b2b)', color: 'white', border: 'none', borderRadius: '12px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', boxShadow:'0 6px 16px rgba(255,75,43,0.35)' }}>
              <Icon name="crown" /> Premium
            </button>
            <Link to="/orders" style={{textDecoration:'none',padding:'8px 10px',borderRadius:10,color:'#333'}}>Orders</Link>
            <Link to="/cart" style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--brand)',color:'#fff',padding:'6px 12px',borderRadius:12,textDecoration:'none',boxShadow:'0 6px 16px rgba(255,75,43,0.25)'}}>
              <Icon name="cart" /> Cart ({count})
            </Link>
            {authenticated ? (
              <div style={{position:'relative'}}>
                <button onClick={()=>setOpenProfile(v=>!v)} style={{width:36,height:36,borderRadius:'50%',border:'1px solid var(--border)',background:`url(${user?.image||'https://i.pravatar.cc/100'}) center/cover`}} />
                {openProfile && (
                  <div className="ff-card" style={{position:'absolute',right:0,top:'calc(100% + 8px)',minWidth:180,padding:8}} onMouseLeave={()=>setOpenProfile(false)}>
                    <Link to="/profile" style={{display:'block',padding:'8px 10px',textDecoration:'none'}}>Profile</Link>
                    <Link to="/my-bookings" style={{display:'block',padding:'8px 10px',textDecoration:'none'}}>My Bookings</Link>
                    <button onClick={logout} className="ff-outline" style={{width:'100%',marginTop:8}}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="ff-primary">Login</Link>
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
          <div style={{minHeight:'100dvh',display:'grid',gridTemplateRows:'auto 1fr auto'}}>
            {showChrome && <Nav />}
            <AuthGate>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dining" element={<Dining />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/restaurant/:id/details" element={<RestaurantDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
              </Routes>
            </AuthGate>
            {showChrome && <BottomNav />}
          </div>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}
