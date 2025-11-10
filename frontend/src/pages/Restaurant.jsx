import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useCart } from '../state/CartContext.jsx'
import { Heart, Share, ArrowLeft, Star } from 'lucide-react'

export default function Restaurant() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const { items: cart, add, inc, dec, remove, total } = useCart()
  const [active, setActive] = useState('All')

  useEffect(() => { load() }, [id])

  async function load() {
    const [r, m] = await Promise.all([
      api.get(`/restaurants/${id}`),
      api.get(`/restaurants/${id}/menu`)
    ])
    setRestaurant(r.data)
    setMenu(m.data)
  }

  function addToCart(item) { add(item) }

  const categories = ['All', ...Array.from(new Set(menu.map(i => i.tags || []).flat())).slice(0, 6)]
  const filtered = active === 'All' ? menu : menu.filter(i => (i.tags || []).includes(active))

  return (
    <div>
      <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="ff-link"><ArrowLeft /></Link>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="ff-link"><Share size={20} /></button>
            <button className="ff-link"><Heart size={20} /></button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 16px' }}>
        {restaurant && (
          <div style={{ margin: '24px 0' }}>
            <div style={{ height: 280, borderRadius: 16, background: `url(${restaurant.image || 'https://picsum.photos/1200/400?food'}) center/cover`, marginBottom: 16 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{restaurant.name}</div>
                <div style={{ color: '#666', marginTop: 4 }}>{(restaurant.cuisine || []).join(', ')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#666', marginTop: 4 }}>
                  <Star size={16} fill='var(--primary)' color='var(--primary)' /> {restaurant.rating?.toFixed?.(1) || '0.0'} ({restaurant.ratingCount || 0} ratings)
                </div>
                <div style={{ color: '#666', marginTop: 4 }}>{restaurant.address}</div>
                <div style={{ color: '#666', marginTop: 4 }}>{restaurant.openingHours}</div>
                <div style={{ marginTop: 8, fontSize: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`ff-badge ${restaurant.isOpen ? 'open' : 'closed'}`}>{restaurant.isOpen ? 'Open Now' : 'Closed'}</span>
                  <span>{restaurant.deliveryTimeMins || 30} mins</span>
                  <span>₹{restaurant.deliveryFee || 29} Delivery Fee</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            <div style={{ position: 'sticky', top: 60, background: 'white', zIndex: 5 }}>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '12px 0', marginBottom: 16 }}>
                {categories.map(c => (
                  <button key={c} onClick={() => setActive(c)} className={c === active ? 'ff-primary' : 'ff-outline'} style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              {filtered.map(item => (
                <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{item.name} <span style={{ color: item.isVeg ? 'green' : 'red' }}>●</span></div>
                    <div style={{ color: '#666', fontSize: 14, margin: '6px 0' }}>{item.description}</div>
                    <div>₹{item.price}</div>
                  </div>
                  <div style={{ width: 120, height: 120, borderRadius: 8, background: `url(${item.image || 'https://picsum.photos/400?food'}) center/cover`, position: 'relative' }}>
                    {item.customization?.length > 0 ? (
                      <button className="ff-outline" style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', padding: '6px 20px', width: '80%' }}>Customize</button>
                    ) : (
                      <button onClick={() => addToCart(item)} className="ff-primary" style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', padding: '6px 20px', width: '80%' }}>Add</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '24px 0' }}>
              <h3 style={{ marginBottom: 12 }}>Reviews</h3>
              <div className="ff-card" style={{ padding: 16 }}>
                <p>View all {restaurant?.ratingCount || 0} reviews</p>
              </div>
            </div>
          </div>
          <div>
            <div className="ff-card" style={{ position: 'sticky', top: 120, padding: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Your Order</div>
              {cart.length === 0 && <div style={{ color: '#666', textAlign: 'center', padding: '24px 0' }}>Your cart is empty</div>}
              {cart.map(i => (
                <div key={i._id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 14 }}>
                    <div style={{ fontWeight: 600 }}>{i.name}</div>
                    <div style={{ color: '#666' }}>₹{i.price}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => dec(i._id)} className="ff-outline" style={{ padding: '4px 8px' }}>-</button>
                    <div>{i.qty}</div>
                    <button onClick={() => inc(i._id)} className="ff-outline" style={{ padding: '4px 8px' }}>+</button>
                  </div>
                </div>
              ))}
              {cart.length > 0 &&
                <>
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8, display: 'grid', gap: 6, fontSize: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{total}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery Fee</span><span>₹{total ? 29 : 0}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Taxes</span><span>₹{Math.round(total * 0.05)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, marginTop: 8 }}><span>Grand Total</span><span>₹{total ? total + 29 + Math.round(total * 0.05) : 0}</span></div>
                  </div>
                  <button className="ff-primary" style={{ marginTop: 12, width: '100%', padding: '12px' }}>Place Order</button>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



