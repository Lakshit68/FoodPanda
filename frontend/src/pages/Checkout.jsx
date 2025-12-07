import { useEffect, useState } from 'react'
import { useCart } from '../state/CartContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../lib/api.js'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Mail, MessageSquare } from 'lucide-react'

export default function Checkout(){
  const { items, total } = useCart()
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [instructions, setInstructions] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (items.length > 0) {
      api.get(`/restaurants/${items[0].restaurant}`)
        .then(({ data }) => setRestaurant(data))
    }
  }, [items])

  const deliveryFee = user?.isPremium ? 0 : restaurant?.deliveryFee || 29
  const taxes = Math.round(total * 0.05)
  const grandTotal = total + deliveryFee + taxes

  function handleProceedToPayment() {
    if (!address.trim()) {
      alert('Please enter a delivery address')
      return
    }
    if (!city.trim()) {
      alert('Please enter your city')
      return
    }
    if (!phone.trim()) {
      alert('Please enter your phone number')
      return
    }
    
    // Store checkout data in sessionStorage to pass to payment page
    sessionStorage.setItem('checkoutData', JSON.stringify({
      address,
      city,
      phone,
      instructions,
      restaurant: restaurant?._id,
      deliveryFee,
      taxes,
      grandTotal
    }))
    
    navigate('/payment')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf4 50%, #f0f4ff 100%)',
      padding: '80px 0 40px'
    }}>
      <div style={{maxWidth: 1200, margin: '0 auto', padding: '24px 20px'}}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link to="/cart" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 12,
          background: '#f8f9ff',
          textDecoration: 'none',
          color: '#667eea'
        }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{
          fontSize: 36,
          fontWeight: 900,
          margin: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Checkout
        </h1>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Delivery Address */}
          <div className="ff-card" style={{
            padding: 28,
            borderRadius: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            background: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <MapPin size={24} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Delivery Address</h2>
            </div>
            <div style={{display:'grid',gap:16}}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  Street Address
                </label>
                <input 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Enter your street address" 
                  style={{
                    width: '90%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '2px solid #e8ecf4',
                    fontSize: 15,
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e8ecf4'}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  City
                </label>
                <input 
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Enter your city" 
                  style={{
                    width: '90%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '2px solid #e8ecf4',
                    fontSize: 15,
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e8ecf4'}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                  Phone Number
                </label>
                <input 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number" 
                  style={{
                    width: '90%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '2px solid #e8ecf4',
                    fontSize: 15,
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e8ecf4'}
                />
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="ff-card" style={{
            padding: 28,
            borderRadius: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            background: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <MessageSquare size={24} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Special Instructions</h2>
            </div>
            <textarea 
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Add cooking instructions or special requests (optional)" 
              rows={4} 
              style={{
                width: '90%',
                padding: '14px 16px',
                borderRadius: 12,
                border: '2px solid #e8ecf4',
                fontSize: 15,
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e8ecf4'}
            />
          </div>

          {/* Proceed to Payment Button */}
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleProceedToPayment}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)'
              }}
            >
              Proceed to Payment
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
