import { useEffect, useState } from 'react'
import { useCart } from '../state/CartContext.jsx'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

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

  async function handlePlaceOrder() {
    if (items.length === 0) return

    const order = {
      restaurant: items[0].restaurant,
      items: items.map(item => ({ menuItem: item._id, quantity: item.qty })),
      total: total + 29 + Math.round(total * 0.05),
      address: '123 Food Street, Foodville' // Hardcoded for now
    }

    try {
      const { data: placedOrder } = await api.post('/orders', order)
      clear()
      navigate('/order-confirmation', { state: { order: { ...placedOrder, restaurantName: restaurant.name } } });
    } catch (error) {
      console.error('Failed to place order', error)
      alert('Failed to place order. Please try again.')
    }
  }

  return (
    <div style={{maxWidth:960,margin:'24px auto',padding:'0 16px'}}>
      <h2 style={{fontWeight:800,marginBottom:16}}>Your Cart</h2>
      {items.length === 0 && <div className="ff-card" style={{padding:32,textAlign:'center',color:'#666'}}>Your cart is empty.</div>}
      {items.length > 0 && (
        <div className="ff-card" style={{padding:24}}>
          <div style={{fontWeight:800,marginBottom:8}}>Your Bill</div>
          {items.map(i => (
            <div key={i._id} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,alignItems:'center',marginBottom:8,borderBottom:'1px solid var(--border)',paddingBottom:8}}>
              <div>
                <div style={{fontWeight:600}}>{i.name}</div>
                <div style={{color:'#666',fontSize:13}}>₹{i.price}</div>
              </div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <button onClick={()=>dec(i._id)} className="ff-outline">-</button>
                <div>{i.qty}</div>
                <button onClick={()=>inc(i._id)} className="ff-outline">+</button>
                <button onClick={()=>remove(i._id)} className="ff-outline" style={{marginLeft:8}}>×</button>
              </div>
              <div style={{gridColumn:'1 / -1',display:'flex',justifyContent:'space-between'}}>
                <span>Subtotal</span>
                <span>₹{i.qty * i.price}</span>
              </div>
            </div>
          ))}
          <div style={{borderTop:'1px solid var(--border)',marginTop:8,paddingTop:8,display:'grid',gap:6}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span>Subtotal</span><span>₹{total}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span>Delivery Fee</span><span>₹{total? 29: 0}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span>Taxes</span><span>₹{Math.round(total*0.05)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontWeight:800}}><span>Grand Total</span><span>₹{total? total+29+Math.round(total*0.05):0}</span></div>
          </div>
          <button onClick={handlePlaceOrder} className="ff-primary" style={{marginTop:12,width:'100%',padding:'10px 12px'}}>Place Order</button>
        </div>
      )}
    </div>
  )
}





