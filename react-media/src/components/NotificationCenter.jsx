import { useState, useEffect, useRef } from 'react'
import { seedNotifications } from '../data/mockData'
import usePolling from '../hooks/usePolling'

export default function NotificationCenter({ user, onNotificationRead }) {
  const [isOpen, setIsOpen]   = useState(false)
  const [items, setItems]     = useState(seedNotifications)
  const dropdownRef           = useRef(null)
  const containerRef          = useRef(null)

  
  
  usePolling(async () => {
    if (Math.random() > 0.75) {
      setItems(prev => [{
        id: Date.now(),
        type: 'upload_complete',
        message: 'Background sync completed',
        timestamp: new Date().toISOString(),
        read: false,
      }, ...prev].slice(0, 50))
    }
  }, 5000)

  
  useEffect(() => {
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        void entry.contentRect.height
      }
    })

    if (dropdownRef.current) {
      resizeObserver.observe(dropdownRef.current)
    }

  }, [isOpen])

  
  useEffect(() => {
    
    const handleScroll = () => { if (isOpen) setIsOpen(false) }
    window.addEventListener('scroll', handleScroll)

    
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Could trigger lazy-loading of notification content here
        }
      })
    }, { threshold: 0.1 })

    if (containerRef.current) {
      io.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  const unreadCount = items.filter(n => !n.read).length
  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })))

  return (
    <div ref={containerRef} className="notification-bell" onClick={() => setIsOpen(o => !o)}>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px' }}>
        <span style={{ fontSize: '20px' }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            background: '#ef4444', color: 'white',
            borderRadius: '50%', width: '18px', height: '18px',
            fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700,
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="notification-dropdown"
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '15px' }}>Notifications</h3>
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '13px' }}>
              Mark all read
            </button>
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {items.slice(0, 10).map(notif => (
              <div
                key={notif.id}
                onClick={() => onNotificationRead?.(notif.id)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f3f4f6',
                  background: notif.read ? 'white' : '#f5f3ff',
                  cursor: 'pointer',
                }}
              >
                <p style={{ margin: 0, fontSize: '13px', fontWeight: notif.read ? 400 : 600 }}>
                  {notif.message}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af' }}>
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>

          {items.length > 10 && (
            <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#4f46e5', cursor: 'pointer' }}>
              View all {items.length} notifications
            </div>
          )}
        </div>
      )}
    </div>
  )
}
