import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, MapPin, Star } from 'lucide-react';

const OrderSkeleton = () => (
  <div className="ff-card" style={{ 
    padding: 28, 
    borderRadius: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    opacity: 0.6 
  }}>
    <div style={{ height: 24, background: '#eee', borderRadius: 8, width: '60%', marginBottom: 12 }}></div>
    <div style={{ height: 16, background: '#eee', borderRadius: 8, width: '40%', marginBottom: 24 }}></div>
    <div style={{ height: 16, background: '#eee', borderRadius: 8, width: '80%', marginBottom: 8 }}></div>
    <div style={{ height: 16, background: '#eee', borderRadius: 8, width: '80%' }}></div>
  </div>
);

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    PLACED: { color: '#667eea', bg: '#f0f4ff', label: 'Placed' },
    PREPARING: { color: '#f59e0b', bg: '#fef3c7', label: 'Preparing' },
    ON_THE_WAY: { color: '#8b5cf6', bg: '#ede9fe', label: 'On the Way' },
    DELIVERED: { color: '#10b981', bg: '#d1fae5', label: 'Delivered' },
    CANCELLED: { color: '#ef4444', bg: '#fee2e2', label: 'Cancelled' },
  };
  
  const config = statusConfig[status] || { color: '#6b7280', bg: '#f3f4f6', label: status };
  
  return (
    <span style={{
      padding: '8px 16px',
      borderRadius: 12,
      fontWeight: 700,
      fontSize: 13,
      color: config.color,
      background: config.bg,
      textTransform: 'capitalize'
    }}>
      {config.label}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate('/auth');
          return;
        }
        setError('Failed to load your orders. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf4 50%, #f0f4ff 100%)',
      padding: '80px 0 40px'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            margin: 0,
            marginBottom: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your Orders
          </h1>
          <p style={{ color: '#666', fontSize: 16, margin: 0 }}>
            Track and manage all your orders
          </p>
        </div>
        
        {loading ? (
          <div style={{ display: 'grid', gap: 20 }}>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        ) : error ? (
          <div className="ff-card" style={{ 
            padding: 64, 
            textAlign: 'center',
            borderRadius: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Unable to fetch orders</h3>
            <p style={{ marginTop: 8, color: '#666' }}>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="ff-card" style={{ 
            padding: 64, 
            textAlign: 'center',
            borderRadius: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>No orders yet</h3>
            <p style={{ marginTop: 8, color: '#666', marginBottom: 24 }}>Looks like you haven't placed any orders with us.</p>
            <Link 
              to="/" 
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                borderRadius: 14,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 16,
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
              Start Ordering
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 24 }}>
            {orders.map(order => (
              <div 
                key={order._id} 
                className="ff-card" 
                style={{ 
                  padding: 28,
                  borderRadius: 24,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  background: '#fff',
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
                {/* Order Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: 24,
                  paddingBottom: 20,
                  borderBottom: '2px solid #f0f0f0'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      {order.restaurant?.image && (
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: 14,
                          background: `url(${order.restaurant.image}) center/cover`,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} />
                      )}
                      <div>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: 22, 
                          fontWeight: 800,
                          color: '#1a1a1a'
                        }}>
                          {order.restaurant?._id ? (
                            <Link 
                              to={`/restaurant/${order.restaurant._id}/details`} 
                              style={{
                                color: '#1a1a1a',
                                textDecoration: 'none',
                                transition: 'color 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#667eea'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}
                            >
                              {order.restaurant?.name || 'Restaurant'}
                            </Link>
                          ) : (
                            <span>{order.restaurant?.name || 'Restaurant unavailable'}</span>
                          )}
                        </h3>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 12, 
                          marginTop: 6,
                          color: '#666',
                          fontSize: 14
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Package size={14} />
                            <span>Order #{order._id.slice(-6)}</span>
                          </div>
                          <span>•</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={14} />
                            <span>{new Date(order.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{
                    margin: '0 0 16px',
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <Package size={18} />
                    Items ({order.items.length})
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gap: 12,
                    padding: 16,
                    background: '#f8f9ff',
                    borderRadius: 16,
                    marginBottom: 20
                  }}>
                    {order.items.map(item => (
                      <div 
                        key={item._id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {item.menuItem?.name || 'Item'}
                          </span>
                          <span style={{ color: '#666', marginLeft: 8 }}>
                            × {item.quantity}
                          </span>
                        </div>
                        <span style={{ fontWeight: 700, color: '#1a1a1a' }}>
                          ₹{((item.menuItem?.price || 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div style={{
                    borderTop: '2px solid #f0f0f0',
                    paddingTop: 16,
                    display: 'grid',
                    gap: 12
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: 15,
                      color: '#666'
                    }}>
                      <span>Subtotal</span>
                      <span>₹{(order.total ?? 0) - (order.deliveryFee ?? 0)}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: 15,
                      color: '#666'
                    }}>
                      <span>Delivery Fee</span>
                      <span>₹{order.deliveryFee ?? 0}</span>
                    </div>
                    <div style={{
                      height: 1,
                      background: 'linear-gradient(to right, transparent, #e0e0e0, transparent)',
                      margin: '4px 0'
                    }} />
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontWeight: 800,
                      fontSize: 20,
                      color: '#1a1a1a'
                    }}>
                      <span>Total Paid</span>
                      <span style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        ₹{order.total ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {order.address && (
                  <div style={{
                    padding: 16,
                    background: '#f8f9ff',
                    borderRadius: 16,
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'start',
                    gap: 12
                  }}>
                    <MapPin size={18} color="#667eea" style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#667eea', marginBottom: 4 }}>
                        Delivery Address
                      </div>
                      <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
                        {order.address}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ 
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: '2px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12
                }}>
                  <button 
                    className="ff-outline"
                    style={{
                      padding: '10px 20px',
                      borderRadius: 12,
                      border: '2px solid #e8ecf4',
                      background: 'transparent',
                      color: '#666',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.color = '#667eea'
                      e.currentTarget.style.background = '#f8f9ff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8ecf4'
                      e.currentTarget.style.color = '#666'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Get Help
                  </button>
                  {order.status === 'DELIVERED' && (
                    <button 
                      style={{
                        padding: '10px 20px',
                        borderRadius: 12,
                        border: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
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
                      <Star size={16} />
                      Rate & Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

