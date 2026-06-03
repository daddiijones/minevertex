import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, MapPin, Clock } from 'lucide-react'

export default function ContactUs() {
  return (
    <div className="landing-page">
      <div className="landing-container" style={{ paddingTop: 100, paddingBottom: 80 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.88rem', marginBottom: 32 }}><ArrowLeft size={16} /> Back to Home</Link>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 8 }}>Contact Us</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 48 }}>We're here to help. Reach out through any channel below.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 800 }}>
          {[
            { icon: Mail, title: 'Email Support', detail: 'support@minevertex.com', sub: 'Response within 24 hours' },
            { icon: MessageCircle, title: 'Live Chat', detail: 'Available on Dashboard', sub: 'Mon-Fri, 9am-6pm UTC' },
            { icon: MapPin, title: 'Headquarters', detail: 'Global Operations', sub: 'Mining farms in 12 countries' },
            { icon: Clock, title: 'Business Hours', detail: '24/7 Mining Operations', sub: 'Support: Mon-Fri 9am-6pm UTC' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28 }}>
              <c.icon size={28} style={{ color: 'var(--accent-cyan)', marginBottom: 14 }} />
              <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{c.detail}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
