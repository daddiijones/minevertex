import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authApi } from '../../utils/api'
import { useToast } from '../../components/Toast'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const token = searchParams.get('token')
  const id = searchParams.get('id')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return showToast('error', 'Passwords do not match')
    }
    if (!token || !id) {
      return showToast('error', 'Invalid reset link')
    }

    setLoading(true)
    try {
      await authApi.resetPassword({ id, token, password })
      showToast('success', 'Password reset successfully')
      setSuccess(true)
    } catch (err) {
      showToast('error', err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!token || !id) {
    return (
      <div className="auth-page">
        <div className="auth-card slide-in" style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16
          }}>
            <Lock size={24} />
          </div>
          <h2 style={{ marginBottom: 8 }}>Invalid Link</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            This password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            Request a new link
          </Link>
        </div>
      </div>
    )
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
          <h2>Create New Password</h2>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)', color: '#10B981',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16
            }}>
              <Lock size={24} />
            </div>
            <h3 style={{ marginBottom: 8 }}>Password Updated</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Your password has been successfully reset.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Continue to Login <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Enter new password"
                  required minLength={6}
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type={showConfirmPass ? 'text' : 'password'} placeholder="Confirm new password"
                  required minLength={6}
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Reset Password <ArrowRight size={18} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
