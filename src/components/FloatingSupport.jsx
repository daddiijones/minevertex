import { useState } from 'react'
import { MessageCircle, X, Mail } from 'lucide-react'

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {isOpen && (
        <div className="slide-in" style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 12, 
          padding: 20, 
          marginBottom: 16, 
          width: 280,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Need Help?</h4>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
              <X size={18} />
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.5 }}>
            Our support team is available 24/7. Send us an email and we'll get back to you as soon as possible.
          </p>
          <a 
            href="mailto:support@minevertex.com" 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8 }}
          >
            <Mail size={16} /> support@minevertex.com
          </a>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          background: 'var(--gradient-primary)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  )
}
