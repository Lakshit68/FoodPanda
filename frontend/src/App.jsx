import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
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
  const { authenticated, logout } = useAuth()
  const { count } = useCart()
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  return (
    <>
      <header className="main-nav">
        <Link to="/" className="main-nav-logo">FoodTown</Link>
        <nav className="main-nav-links">
          <button onClick={() => setShowPremiumModal(true)} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Premium</button>
          <Link to="/orders">Orders</Link>
          <Link to="/cart">Cart ({count})</Link>
          {authenticated ? <button onClick={logout} className="ff-outline">Logout</button> : <Link to="/auth" className="ff-primary">Login</Link>}
        </nav>
      </header>
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
    </>
  )
}

function AuthGate({ children }){
  const { authenticated, loading } = useAuth()
  if (loading) return <div style={{padding:24}}>Loading...</div>
  const loc = useLocation()
  if (authenticated && loc.pathname === '/auth') return <Navigate to="/" replace />
  if (!authenticated) return <Auth />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div style={{minHeight:'100dvh',display:'grid',gridTemplateRows:'auto 1fr auto'}}>
          <Nav />
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
          <BottomNav />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}