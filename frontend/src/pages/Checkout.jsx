import { useEffect, useState } from 'react'
import { useCart } from '../state/CartContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'

export default function Checkout(){
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (items.length > 0) {
      api.get(`/restaurants/${items[0].restaurant}`)
        .then(({ data }) => setRestaurant(data))
    }
  }, [items])

  const deliveryFee = user?.isPremium ? 0 : restaurant?.deliveryFee || 0
  const taxes = Math.round(total * 0.18)
  const grandTotal = total + deliveryFee + taxes

  async function placeOrder() {
    try {
      const { data: order } = await api.post('/orders', {
        restaurant: restaurant._id,
        items: items.map(i => ({ menuItem: i._id, quantity: i.qty })),
        total,
        address,
        deliveryFee
      });
      clear();
      navigate('/order-confirmation', { state: { order: { ...order, restaurantName: restaurant.name } } });
    } catch (error) {
      console.error(error);
      alert('Could not place order');
    }
  }

  return (
    <div style={{maxWidth:960,margin:'24px auto',padding:'0 16px'}}>
      <h2 style={{marginBottom:12}}>Your Order</h2>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
        <div>
          <div className="ff-card" style={{padding:16,marginBottom:12}}>
            <div style={{fontWeight:700,marginBottom:8}}>Deliver to</div>
            <div style={{display:'grid',gap:8}}>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address line" className="ff-outline" style={{padding:12}} />
              <input placeholder="City" className="ff-outline" style={{padding:12}} />
              <input placeholder="Phone" className="ff-outline" style={{padding:12}} />
            </div>
          </div>
          <div className="ff-card" style={{padding:16,marginBottom:12}}>
            <div style={{fontWeight:700,marginBottom:8}}>Special instructions</div>
            <textarea placeholder="Add cooking instructions or special requests" rows={4} className="ff-outline" style={{padding:12,width:'100%'}} />
          </div>
          <div className="ff-card" style={{padding:16,marginBottom:12}}>
            <div style={{fontWeight:700,marginBottom:8}}>Payment method</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <button className="ff-outline" style={{padding:'10px 12px'}}>Visa **** 1234</button>
              <button className="ff-outline" style={{padding:'10px 12px'}}>UPI</button>
              <button className="ff-outline" style={{padding:'10px 12px'}}>Cash on Delivery</button>
            </div>
          </div>
        </div>
        <div>
          <div className="ff-card" style={{padding:16}}>
            <div style={{fontWeight:800,marginBottom:10}}>Bill Details</div>
            <div style={{display:'grid',gap:6}}>
              <div style={{display:'flex',justifyContent:'space-between'}}><span>Subtotal</span><span>₹{total}</span></div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span>Delivery Fee</span>
                {user?.isPremium ? <span><del>₹{restaurant?.deliveryFee}</del> FREE</span> : <span>₹{deliveryFee}</span>}
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}><span>Taxes</span><span>₹{taxes}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:800}}><span>Grand Total</span><span>₹{grandTotal}</span></div>
            </div>
            <button onClick={placeOrder} className="ff-primary" style={{marginTop:12,width:'100%',padding:'12px'}}>Place Order</button>
          </div>
        </div>
      </div>
    </div>
  )
}
