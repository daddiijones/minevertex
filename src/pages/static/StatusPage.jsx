import { Link } from 'react-router-dom'
import { ArrowLeft, Activity } from 'lucide-react'

export default function StatusPage() {
  const services = [
    { name: 'Mining Operations', status: 'operational', uptime: '99.99%' },
    { name: 'Deposit Processing', status: 'operational', uptime: '99.95%' },
    { name: 'Withdrawal Processing', status: 'operational', uptime: '99.90%' },
    { name: 'User Dashboard', status: 'operational', uptime: '99.99%' },
    { name: 'API Services', status: 'operational', uptime: '99.98%' },
    { name: 'Authentication', status: 'operational', uptime: '99.99%' },
  ]

  return (
    <div className="landing-page">
      <div className="landing-container" style={{ paddingTop: 100, paddingBottom: 80, maxWidth: 800 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.88rem', marginBottom: 32 }}><ArrowLeft size={16} /> Back to Home</Link>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 8 }}>System Status</h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '8px 18px', marginBottom: 48 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
          <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>All Systems Operational</span>
        </div>

        {services.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontWeight: 600 }}>{s.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Uptime: {s.uptime}</span>
              <span style={{ color: 'var(--success)', fontSize: '0.82rem', fontWeight: 600 }}>Operational</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
