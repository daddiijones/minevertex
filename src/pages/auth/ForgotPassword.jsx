import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../../utils/api'
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react'
import { useToast } from '../../components/Toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return showToast('error', 'Please enter your email')
    setLoading(true)
    try {
      const res = await authApi.forgotPassword({ email })
      showToast('success', res.message || 'Check your email for the reset link')
      setSuccess(true)
    } catch (err) {
      showToast('error', err.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card slide-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'var(--gradient-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', marginBottom: 16
          }}>⛏</div>
          <h2>Reset Password</h2>
          <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)', color: '#10B981',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16
            }}>
              <Mail size={24} />
            </div>
            <h3 style={{ marginBottom: 8 }}>Check your email</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              We sent a password reset link to <strong style={{ color: '#fff' }}>{email}</strong>
            </p>
            <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type="email" placeholder="you@example.com"
                  style={{ paddingLeft: 42 }}
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Send Reset Link <ArrowRight size={18} /></>}
            </button>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={16} /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
