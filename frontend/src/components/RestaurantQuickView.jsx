import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useCart } from '../state/CartContext.jsx'

export default function RestaurantQuickView({ id, onClose }){
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const { items, add, inc, dec, remove, total } = useCart()

  useEffect(()=>{ (async ()=>{
    const [r, m] = await Promise.all([
      api.get(`/restaurants/${id}`),
      api.get(`/restaurants/${id}/menu`)
    ])
    setRestaurant(r.data)
    setMenu(m.data)
  })() }, [id])

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'grid',placeItems:'end center',zIndex:50}} onClick={onClose}>
      <div className="ff-card" style={{width:'min(960px, 96vw)',maxHeight:'85vh',overflow:'auto',borderBottomLeftRadius:0,borderBottomRightRadius:0}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
          <div>
            {restaurant && (
              <div style={{padding:16}}>
                <div style={{display:'grid',gridTemplateColumns:'80px 1fr',gap:12,alignItems:'center'}}>
                  <div style={{width:80,height:80,borderRadius:12,background:`url(${restaurant.image||'https://picsum.photos/200'}) center/cover`}} />
                  <div>
                    <div style={{fontWeight:800}}>{restaurant.name}</div>
                    <div style={{fontSize:14,color:'#666'}}>{(restaurant.cuisine||[]).join(', ')} • ⭐ {restaurant.rating?.toFixed?.(1)||'0.0'}</div>
                  </div>
                </div>
              </div>
            )}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12,padding:16}}>
              {menu.map(item => (
                <div key={item._id} className="ff-card" style={{overflow:'hidden'}}>
                  <div style={{height:110,background:`url(${item.image||'https://picsum.photos/400?food'}) center/cover`}} />
                  <div style={{padding:12}}>
                    <div style={{fontWeight:600}}>{item.name}</div>
                    <div style={{color:'#666',fontSize:13,margin:'6px 0'}}>{item.description}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div>₹{item.price}</div>
                      <button onClick={()=>add(item)} className="ff-primary" style={{padding:'6px 10px'}}>Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{borderLeft:'1px solid var(--border)',padding:16}}>
            <div style={{fontWeight:800,marginBottom:8}}>Your Bill</div>
            {items.length === 0 && <div style={{color:'#666'}}>No items yet.</div>}
            {items.map(i => (
              <div key={i._id} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,alignItems:'center',marginBottom:8}}>
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
            <button className="ff-primary" style={{marginTop:12,width:'100%',padding:'10px 12px'}}>Checkout</button>
          </div>
        </div>
        <div style={{textAlign:'right',padding:12}}>
          <button onClick={onClose} className="ff-outline" style={{padding:'8px 10px'}}>Close</button>
        </div>
      </div>
    </div>
  )
}





