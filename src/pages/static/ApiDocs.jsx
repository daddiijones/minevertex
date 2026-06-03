import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ApiDocs() {
  return (
    <div className="landing-page">
      <div className="landing-container" style={{ paddingTop: 100, paddingBottom: 80, maxWidth: 800 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.88rem', marginBottom: 32 }}><ArrowLeft size={16} /> Back to Home</Link>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 8 }}>API Documentation</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 48 }}>Integrate MineVertex into your applications.</p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 32, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--accent-cyan)' }}>REST API v1</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>Our API allows you to programmatically manage your mining operations, check balances, and initiate withdrawals.</p>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
            Base URL: https://api.minevertex.com/v1
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 32 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Available Endpoints</h3>
          {[
            { method: 'POST', path: '/auth/login', desc: 'Authenticate and receive JWT token' },
            { method: 'GET', path: '/user/me', desc: 'Get current user profile and balances' },
            { method: 'GET', path: '/mining/plans', desc: 'List all available mining plans' },
            { method: 'POST', path: '/mining/purchase', desc: 'Purchase a mining plan' },
            { method: 'GET', path: '/mining/my-minings', desc: 'List your active minings' },
            { method: 'POST', path: '/deposits', desc: 'Create a new deposit' },
            { method: 'POST', path: '/withdrawals', desc: 'Request a withdrawal' },
          ].map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ background: e.method === 'GET' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)', color: e.method === 'GET' ? 'var(--success)' : '#3b82f6', padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700 }}>{e.method}</span>
              <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{e.path}</code>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{e.desc}</span>
            </div>
          ))}
          <p style={{ marginTop: 20, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full documentation with request/response examples coming soon. Contact support for early access.</p>
        </div>
      </div>
    </div>
  )
}
