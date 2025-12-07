import { useEffect, useState } from 'react'
import { useCart } from '../state/CartContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../lib/api.js'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react'

export default function Payment(){
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [checkoutData, setCheckoutData] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Don't redirect if order is already completed
    if (orderCompleted) return
    
    // Get checkout data from sessionStorage
    const data = sessionStorage.getItem('checkoutData')
    if (!data) {
      navigate('/checkout')
      return
    }
    setCheckoutData(JSON.parse(data))

    if (items.length > 0) {
      api.get(`/restaurants/${items[0].restaurant}`)
        .then(({ data }) => setRestaurant(data))
    }
  }, [items, navigate, orderCompleted])

  async function handlePlaceOrder() {
    if (!checkoutData) return
    
    // Handle Cash on Delivery separately
    if (selectedPayment === 'cod') {
      setProcessing(true)
      try {
        const { data: order } = await api.post('/orders', {
          restaurant: checkoutData.restaurant,
          items: items.map(i => ({ menuItem: i._id, quantity: i.qty })),
          total,
          address: `${checkoutData.address}, ${checkoutData.city}`,
          phone: checkoutData.phone,
          instructions: checkoutData.instructions,
          deliveryFee: checkoutData.deliveryFee,
          paymentMethod: 'cod'
        });
        
        // Mark order as completed before clearing data
        setOrderCompleted(true)
        clear();
        sessionStorage.removeItem('checkoutData')
        
        // Navigate to order confirmation
        navigate('/order-confirmation', { 
          state: { 
            order: { 
              ...order, 
              restaurantName: restaurant?.name 
            } 
          } 
        });
      } catch (error) {
        console.error(error);
        alert('Could not place order. Please try again.');
        setProcessing(false)
      }
      return
    }

    // Handle Razorpay payment for Card and UPI
    setProcessing(true)
    try {
      // Create Razorpay order on backend
      const { data: razorpayOrder } = await api.post('/payments/create-order', { 
        amount: checkoutData.grandTotal * 100 // Convert to paise
      });

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        alert('Payment gateway is loading. Please wait a moment and try again.');
        setProcessing(false)
        return
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'FoodTown',
        description: `Order at ${restaurant?.name || 'Restaurant'}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment on backend and place order
            const { data: order } = await api.post('/payments/verify-and-place-order', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              restaurant: checkoutData.restaurant,
              items: items.map(i => ({ 
                _id: i._id, 
                qty: i.qty 
              })),
              total,
              address: `${checkoutData.address}, ${checkoutData.city}`,
              phone: checkoutData.phone,
              instructions: checkoutData.instructions,
              deliveryFee: checkoutData.deliveryFee
            });
            
            // Mark order as completed before clearing data
            setOrderCompleted(true)
            clear();
            sessionStorage.removeItem('checkoutData')
            
            // Navigate to order confirmation
            navigate('/order-confirmation', { 
              state: { 
                order: { 
                  ...order, 
                  restaurantName: restaurant?.name 
                } 
              } 
            });
          } catch (err) {
            console.error(err);
            alert('Failed to confirm order. Please contact support.');
            setProcessing(false)
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: checkoutData.phone || ''
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description || 'Please try again'}`);
        setProcessing(false)
      });
      
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Could not initiate payment. Please try again.');
      setProcessing(false)
    }
  }

  if (!checkoutData) {
    return null
  }

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay with Visa, Mastercard, or RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay using UPI apps like GPay, PhonePe'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Wallet,
      description: 'Pay when your order arrives'
    }
  ]

  return (
    <div style={{maxWidth: 1200, margin: '0 auto', padding: '24px 20px 40px'}}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link to="/checkout" style={{ 
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
          marginTop: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          
        </h1>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 400px',gap:32}}>
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Payment Methods */}
          <div className="ff-card" style={{
            padding: 28,
            borderRadius: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
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
              Select Payment Method
            </h2>
            
            <div style={{ display: 'grid', gap: 16 }}>
              {paymentMethods.map(method => {
                const Icon = method.icon
                const isSelected = selectedPayment === method.id
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    style={{
                      padding: 20,
                      borderRadius: 16,
                      border: `2px solid ${isSelected ? '#667eea' : '#e8ecf4'}`,
                      background: isSelected ? '#f8f9ff' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#c7d2fe'
                        e.currentTarget.style.background = '#f8f9ff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e8ecf4'
                        e.currentTarget.style.background = '#fff'
                      }
                    }}
                  >
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: isSelected 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#fff' : '#666'
                    }}>
                      <Icon size={28} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 700,
                        fontSize: 18,
                        marginBottom: 4,
                        color: '#1a1a1a'
                      }}>
                        {method.name}
                      </div>
                      <div style={{
                        color: '#666',
                        fontSize: 14
                      }}>
                        {method.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}>
                        <CheckCircle size={16} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Payment Details for Card */}
          {selectedPayment === 'card' && (
            <div className="ff-card" style={{
              padding: 28,
              borderRadius: 24,
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Card Details</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <input 
                  placeholder="Card Number" 
                  style={{
                    width: '90%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '2px solid #e8ecf4',
                    fontSize: 15
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <input 
                    placeholder="MM/YY" 
                    style={{
                      width: '90%',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: '2px solid #e8ecf4',
                      fontSize: 15
                    }}
                  />
                  <input 
                    placeholder="CVV" 
                    style={{
                      width: '90%',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: '2px solid #e8ecf4',
                      fontSize: 15
                    }}
                  />
                </div>
                <input 
                  placeholder="Cardholder Name" 
                  style={{
                    width: '90%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '2px solid #e8ecf4',
                    fontSize: 15
                  }}
                />
              </div>
            </div>
          )}

          {/* UPI Details */}
          {selectedPayment === 'upi' && (
            <div className="ff-card" style={{
              padding: 28,
              borderRadius: 24,
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>UPI Details</h3>
              <input 
                placeholder="Enter UPI ID (e.g., yourname@paytm)" 
                style={{
                  width: '90%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '2px solid #e8ecf4',
                  fontSize: 15
                }}
              />
            </div>
          )}

          {/* Delivery Address Summary */}
          <div className="ff-card" style={{
            padding: 28,
            borderRadius: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            background: '#f8f9ff'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Delivery Address</h3>
            <div style={{ color: '#666', lineHeight: 1.8 }}>
              <div style={{ marginBottom: 8 }}>{checkoutData.address}</div>
              <div style={{ marginBottom: 8 }}>{checkoutData.city}</div>
              <div>Phone: {checkoutData.phone}</div>
              {checkoutData.instructions && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e0e0e0' }}>
                  <strong>Instructions:</strong> {checkoutData.instructions}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
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

            {restaurant && (
              <div style={{
                padding: 16,
                background: '#f8f9ff',
                borderRadius: 16,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: `url(${restaurant.image || 'https://picsum.photos/200'}) center/cover`
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                    {restaurant.name}
                  </div>
                  <div style={{ color: '#666', fontSize: 13 }}>
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                <span style={{ color: '#666' }}>Delivery Fee</span>
                {user?.isPremium ? (
                  <span style={{ fontWeight: 600, color: '#10b981' }}>FREE</span>
                ) : (
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{checkoutData.deliveryFee}</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                <span style={{ color: '#666' }}>Taxes & Charges</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>₹{checkoutData.taxes}</span>
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
                  ₹{checkoutData.grandTotal}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 14,
                background: processing 
                  ? '#ccc' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: processing 
                  ? 'none' 
                  : '0 8px 24px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.2s ease',
                opacity: processing ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!processing) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)'
                }
              }}
              onMouseLeave={(e) => {
                if (!processing) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              {processing ? 'Processing...' : `Place Order - ₹${checkoutData.grandTotal}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

