import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message, options = {}) => {
    const id = ++idCounter
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 3000,
    }
    setToasts(prev => [...prev, toast])
    if (toast.duration > 0) {
      setTimeout(() => remove(id), toast.duration)
    }
  }, [remove])

  const value = {
    addToast,
    success: (msg, opts) => addToast(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => addToast(msg, { ...opts, type: 'error' }),
    info: (msg, opts) => addToast(msg, { ...opts, type: 'info' }),
  }

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', bottom: 16, right: 16, display: 'grid', gap: 8, zIndex: 9999 }}>
        {toasts.map(t => (
          <div
            key={t.id}
            onClick={() => remove(t.id)}
            className="ff-card"
            style={{
              minWidth: 220,
              maxWidth: 320,
              padding: '10px 14px',
              borderRadius: 999,
              cursor: 'pointer',
              background:
                t.type === 'success'
                  ? '#ecfdf5'
                  : t.type === 'error'
                  ? '#fef2f2'
                  : '#f1f5f9',
              color:
                t.type === 'success'
                  ? '#166534'
                  : t.type === 'error'
                  ? '#991b1b'
                  : '#0f172a',
              boxShadow: '0 10px 25px rgba(15,23,42,0.2)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
