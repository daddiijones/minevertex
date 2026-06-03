import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../App'
import { authApi } from '../../utils/api'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Gift, ShieldCheck } from 'lucide-react'

export default function Register() {
  const { login } = useContext(AuthContext)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', referralCode: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [step, setStep] = useState('register') // 'register' | 'otp'
  const [userId, setUserId] = useState(null)
  const [otpCode, setOtpCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

  useEffect(() => {
    let timer
    if (step === 'otp' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [step, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.fullName || !form.email || !form.password) return setError('Please fill in all required fields')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      const data = await authApi.register(form)
      setUserId(data.userId)
      setStep('otp')
      setTimeLeft(600)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (!otpCode) return setError('Please enter the OTP code')
    setLoading(true)
    setError('')
    try {
      const data = await authApi.verifyRegister({ userId, code: otpCode })
      localStorage.setItem('miningToken', data.token)
      login(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card slide-in">
        {step === 'register' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--gradient-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 16 }}>⛏</div>
              <h2>Create Account</h2>
              <p className="auth-subtitle">Start mining crypto today</p>
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>}

            <form onSubmit={handleRegisterSubmit}>
              {[
                { key: 'fullName', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
                { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'you@example.com' },
              ].map(f => (
                <div className="form-group" key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <f.icon size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" type={f.type} placeholder={f.placeholder} style={{ paddingLeft: 42 }}
                      value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" style={{ paddingLeft: 42, paddingRight: 42 }}
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="form-input" type="password" placeholder="Confirm your password" style={{ paddingLeft: 42 }}
                    value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Referral Code (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Gift size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="form-input" type="text" placeholder="Enter referral code" style={{ paddingLeft: 42 }}
                    value={form.referralCode} onChange={e => setForm({ ...form, referralCode: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
                {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Create Account <ArrowRight size={18} /></>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Sign In</Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)', color: '#10B981',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16
              }}>
                <ShieldCheck size={28} />
              </div>
              <h2>Verify Email</h2>
              <p className="auth-subtitle">We sent a 6-digit OTP code to your email.</p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 18,
                color: 'var(--danger)', fontSize: '0.85rem'
              }}>{error}</div>
            )}

            <form onSubmit={handleOtpSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>Enter OTP Code</label>
                <input className="form-input" type="text" placeholder="------" maxLength={6}
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', padding: '12px' }}
                  value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} />
              </div>

              <div style={{ textAlign: 'center', marginBottom: 20, fontSize: '0.9rem', color: timeLeft > 0 ? 'var(--text-secondary)' : 'var(--danger)' }}>
                {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code has expired. Please try registering again.'}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || timeLeft === 0 || otpCode.length !== 6} style={{ width: '100%' }}>
                {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Verify Account <ArrowRight size={18} /></>}
              </button>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button type="button" onClick={() => setStep('register')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                  Back to Registration
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
