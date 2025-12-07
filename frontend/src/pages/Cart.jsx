import { useEffect, useState } from 'react'
import { useCart } from '../state/CartContext.jsx'
import { api } from '../lib/api'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'

export default function Cart(){
  const { items, add, inc, dec, remove, total, clear } = useCart()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)

  useEffect(() => {
    if (items.length > 0) {
      api.get(`/restaurants/${items[0].restaurant}`)
        .then(({ data }) => setRestaurant(data))
    }
  }, [items])

  async function handleProceedToCheckout() {
    if (items.length === 0) return
    navigate('/checkout')
  }

  const deliveryFee = 29
  const taxes = Math.round(total * 0.05)
  const grandTotal = total + deliveryFee + taxes

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf4 50%, #f0f4ff 100%)',
      padding: '80px 0 40px'
    }}>
      <div style={{maxWidth: 1200, margin: '0 auto', padding: '24px 20px'}}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link to="/" style={{ 
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
          Your Cart
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="ff-card" style={{
          padding: 64,
          textAlign: 'center',
          borderRadius: 24,
          background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)'
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#666', marginBottom: 24 }}>
            Add some delicious items to get started!
          </p>
          <Link to="/" className="ff-primary" style={{
            padding: '14px 28px',
            borderRadius: 14,
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: 16,
            fontWeight: 700
          }}>
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>
          {/* Cart Items */}
          <div>
            {restaurant && (
              <div className="ff-card" style={{
                padding: 20,
                marginBottom: 24,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: `url(${restaurant.image || 'https://picsum.photos/200'}) center/cover`,
                    border: '3px solid rgba(255,255,255,0.3)'
                  }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                      {restaurant.name}
                    </div>
                    <div style={{ opacity: 0.9, fontSize: 14 }}>
                      {(restaurant.cuisine || []).join(' • ')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gap: 16 }}>
              {items.map(i => (
                <div 
                  key={i._id} 
                  className="ff-card"
                  style={{
                    padding: 24,
                    borderRadius: 20,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.12)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 20, alignItems: 'center' }}>
                    {/* Item Image */}
                    <div style={{
                      width: 100,
                      height: 100,
                      borderRadius: 16,
                      background: `url(${i.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400'}) center/cover`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} />

                    {/* Item Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6, color: '#1a1a1a' }}>
                        {i.name}
                      </div>
                      <div style={{ color: '#666', fontSize: 15, marginBottom: 12 }}>
                        {i.description || 'Delicious food item'}
                      </div>
                      <div style={{ 
                        fontSize: 20, 
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        ₹{i.price}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 12px',
                        background: '#f8f9ff',
                        borderRadius: 12,
                        border: '1px solid #e8ecf4'
                      }}>
                        <button
                          onClick={() => dec(i._id)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: 'none',
                            background: '#fff',
                            color: '#667eea',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <div style={{ 
                          minWidth: 30, 
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: 16
                        }}>
                          {i.qty}
                        </div>
                        <button
                          onClick={() => inc(i._id)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i._id)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 10,
                          border: 'none',
                          background: '#fee',
                          color: '#e53e3e',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 600
                        }}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#666', fontSize: 14 }}>Item Subtotal</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a1a' }}>
                      ₹{i.qty * i.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="ff-card" style={{
              padding: 28,
              borderRadius: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <h2 style={{
                fontSize: 24,
                fontWeight: 900,
                marginBottom: 24,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Order Summary
              </h2>

              <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                  <span style={{ color: '#666' }}>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                  <span style={{ color: '#666' }}>Delivery Fee</span>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{deliveryFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                  <span style={{ color: '#666' }}>Taxes & Charges</span>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{taxes}</span>
                </div>
                <div style={{
                  height: 1,
                  background: 'linear-gradient(to right, transparent, #e0e0e0, transparent)',
                  margin: '8px 0'
                }} />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 20,
                  fontWeight: 900
                }}>
                  <span>Grand Total</span>
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.2s ease'
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
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}





