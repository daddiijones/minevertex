import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { miningApi } from '../../utils/api'
import { useToast } from '../../components/Toast'
import { Check, Zap, ArrowRight } from 'lucide-react'

const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const TIER_FEATURES = {
  starter: ['24/7 Mining', 'Basic Support'],
  professional: ['24/7 Mining', 'Priority Support', 'Auto-Reinvest'],
  enterprise: ['24/7 Mining', 'Dedicated Manager', 'Auto-Reinvest', 'Insurance'],
  vip: ['24/7 Mining', 'VIP Manager', 'Priority Withdrawals', 'Full Insurance', 'Bonus Rewards'],
}

export default function MiningPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(null)
  const [amount, setAmount] = useState('')
  const [cryptoType, setCryptoType] = useState('USDT')
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    miningApi.plans().then(p => { setPlans(p); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handlePurchase = async () => {
    if (!purchasing || !amount) return
    setSubmitting(true)
    try {
      await miningApi.purchase({ planId: purchasing.id, amount: parseFloat(amount), cryptoType })
      toast.success(
        `Your ${purchasing.name} plan is now active! Mining has started and you'll earn ${fmt(parseFloat(amount) * purchasing.dailyROI / 100)} ${cryptoType} daily.`,
        '⛏ Mining Started!'
      )
      setPurchasing(null)
      setAmount('')
      setCryptoType('USDT')
      setTimeout(() => navigate('/my-minings'), 2000)
    } catch (err) {
      toast.error(err.message, 'Purchase Failed')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>Choose Your Mining Plan</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mining continues 24/7 even when you're offline. Balance is debited upon purchase.</p>
      </div>

      {plans.length === 0 ? <div className="card empty-state"><p>No plans available yet.</p></div> : (
        <div className="plans-grid">
          {plans.map(plan => {
            const isPop = plan.tier === 'professional'
            const extras = TIER_FEATURES[plan.tier] || []
            return (
              <div key={plan.id} className={`plan-card card-glow ${isPop ? 'popular' : ''}`}>
                {isPop && <div className="plan-badge">⚡ Most Popular</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: isPop ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={18} style={{ color: isPop ? '#fff' : 'var(--accent-cyan)' }} />
                  </div>
                  <div className="plan-name">{plan.name}</div>
                </div>
                <div className="plan-price">${fmt(plan.minDeposit)} <span>- ${fmt(plan.maxDeposit)}</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}><div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>{plan.dailyROI}%</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily ROI</div></div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}><div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{plan.totalROI}%</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total ROI</div></div>
                </div>
                <ul className="plan-features">
                  <li><Check size={14} /> {plan.hashRate} Hash Power</li>
                  <li><Check size={14} /> {plan.durationDays} Day Duration</li>
                  {extras.map((f, i) => <li key={i}><Check size={14} /> {f}</li>)}
                </ul>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setPurchasing(plan); setAmount(plan.minDeposit.toString()) }}>Start Mining</button>
              </div>
            )
          })}
        </div>
      )}

      {purchasing && (
        <div className="modal-overlay" onClick={() => setPurchasing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Purchase {purchasing.name} Plan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>Select the currency you wish to pay with.</p>
            
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Payment Currency</label>
              <select className="form-input" value={cryptoType} onChange={e => setCryptoType(e.target.value)}>
                <option value="USDT">USDT</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="BNB">BNB</option>
                <option value="SOL">SOL</option>
                <option value="LTC">LTC</option>
              </select>
            </div>

            <div className="form-group"><label className="form-label">Investment Amount ({cryptoType})</label><input className="form-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} min={purchasing.minDeposit} max={purchasing.maxDeposit} /></div>
            {amount && <div style={{ background: 'rgba(0,212,255,0.06)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Daily Earning</span><span style={{ fontWeight: 700, color: 'var(--success)' }}>+{fmt(parseFloat(amount) * purchasing.dailyROI / 100)} {cryptoType}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Return</span><span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>+{fmt(parseFloat(amount) * purchasing.totalROI / 100)} {cryptoType}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 8 }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Debit Amount</span><span style={{ fontWeight: 700, color: 'var(--danger)' }}>-{fmt(parseFloat(amount))} {cryptoType}</span></div>
            </div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPurchasing(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={submitting} onClick={handlePurchase}>
                {submitting ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
