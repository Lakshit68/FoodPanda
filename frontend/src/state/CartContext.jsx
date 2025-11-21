import { createContext, useContext, useMemo, useState } from 'react'

const CartCtx = createContext(null)

export function CartProvider({ children }){
  const [items, setItems] = useState([])
  function add(item){ setItems(prev => {
    const idx = prev.findIndex(x => x._id === item._id)
    if (idx >= 0) return prev.map((x,i)=> i===idx? { ...x, qty: x.qty + 1 } : x)
    return [...prev, { ...item, qty: 1 }]
  }) }
  function inc(id){ setItems(prev => prev.map(x => x._id===id?{...x,qty:x.qty+1}:x)) }
  function dec(id){ setItems(prev => prev.map(x => x._id===id?{...x,qty:Math.max(1,x.qty-1)}:x)) }
  function remove(id){ setItems(prev => prev.filter(x => x._id!==id)) }
  function clear(){ setItems([]) }
  const total = useMemo(()=> items.reduce((s,i)=> s + i.qty * i.price, 0), [items])
  const count = useMemo(()=> items.reduce((s,i)=> s + i.qty, 0), [items])
  return <CartCtx.Provider value={{ items, add, inc, dec, remove, clear, total, count }}>{children}</CartCtx.Provider>
}

export function useCart(){ return useContext(CartCtx) }





