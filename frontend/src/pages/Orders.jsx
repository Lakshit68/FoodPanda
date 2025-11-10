import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

const OrderSkeleton = () => (
  <div className="ff-card" style={{ padding: 24, opacity: 0.6 }}>
    <div style={{ height: 24, background: '#eee', borderRadius: 4, width: '60%', marginBottom: 8 }}></div>
    <div style={{ height: 16, background: '#eee', borderRadius: 4, width: '40%', marginBottom: 24 }}></div>
    <div style={{ height: 16, background: '#eee', borderRadius: 4, width: '80%', marginBottom: 8 }}></div>
    <div style={{ height: 16, background: '#eee', borderRadius: 4, width: '80%' }}></div>
  </div>
);

const OrderStatusBadge = ({ status }) => {
  const style = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.8rem',
    color: '#fff',
  };
  const statusColors = {
    PLACED: '#3498db',
    PREPARING: '#f39c12',
    ON_THE_WAY: '#8e44ad',
    DELIVERED: '#2ecc71',
    CANCELLED: '#e74c3c',
  };
  return <span style={{ ...style, background: statusColors[status] || '#7f8c8d' }}>{status.replace('_', ' ')}</span>;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      <h2 style={{ marginBottom: 24, fontSize: '2rem', fontWeight: 800 }}>Your Orders</h2>
      
      {loading ? (
        <div style={{ display: 'grid', gap: 24 }}>
          <OrderSkeleton />
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <div className="ff-card" style={{ padding: 48, textAlign: 'center' }}>
          <h3 style={{margin:0}}>No orders yet.</h3>
          <p style={{marginTop:8, color:'#666'}}>Looks like you haven't placed any orders with us.</p>
          <Link to="/" className="ff-primary" style={{display:'inline-block', marginTop: 24}}>Start Ordering</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {orders.map(order => (
            <div key={order._id} className="ff-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom:16, borderBottom:'1px solid var(--border)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>
                    <Link to={`/restaurant/${order.restaurant._id}`} className="main-nav-links" style={{color: 'var(--text)'}}>{order.restaurant.name}</Link>
                  </h3>
                  <p style={{ margin: '4px 0 0', color: '#666' }}>Order #{order._id.slice(-6)} &bull; {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div>
                <h4 style={{margin: '0 0 12px', borderBottom: '1px solid #eee', paddingBottom:8}}>Items</h4>
                <div style={{ display: 'grid', gap: 8, marginBottom:16 }}>
                  {order.items.map(item => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', color: '#444' }}>
                      <span>{item.menuItem.name} x {item.quantity}</span>
                      <span>₹{item.menuItem.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                                                    <div style={{borderTop: '1px solid #eee', paddingTop:12, display:'grid', gap:8}}>
                                                      <div style={{ display: 'flex', justifyContent: 'space-between'}}><span>Subtotal</span> <span>₹{order.total - order.deliveryFee}</span></div>
                                                      <div style={{ display: 'flex', justifyContent: 'space-between'}}><span>Delivery Fee</span> <span>₹{order.deliveryFee}</span></div>
                                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize:'1.1rem' }}><span>Total Paid</span> <span>₹{order.total}</span></div>
                                                    </div>              </div>

              <div style={{ marginTop: 24, paddingTop:16, borderTop:'1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="ff-outline">Get Help</button>
                {order.status === 'DELIVERED' && <button className="ff-primary">Rate & Review</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
