import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../App'
import { userApi, withdrawalApi } from '../../utils/api'
import { useToast } from '../../components/Toast'
import { ArrowUpFromLine, Wallet, AlertTriangle } from 'lucide-react'

const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin', key: 'balanceBTC', cls: 'crypto-btc' },
  { symbol: 'ETH', name: 'Ethereum', key: 'balanceETH', cls: 'crypto-eth' },
  { symbol: 'USDT', name: 'Tether', key: 'balanceUSDT', cls: 'crypto-usdt' },
  { symbol: 'LTC', name: 'Litecoin', key: 'balanceLTC', cls: 'crypto-ltc' },
  { symbol: 'BNB', name: 'BNB', key: 'balanceBNB', cls: 'crypto-bnb' },
  { symbol: 'SOL', name: 'Solana', key: 'balanceSOL', cls: 'crypto-sol' },
]

export default function Withdraw() {
  const { user, login } = useContext(AuthContext)
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [freshUser, setFreshUser] = useState(null)
  const toast = useToast()

  useEffect(() => {
    Promise.all([withdrawalApi.list(), userApi.me()])
      .then(([w, u]) => { setWithdrawals(w); setFreshUser(u); login(u); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const u = freshUser || user
  const balance = selected ? (u?.[selected.key] || 0) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected || !amount || !address || parseFloat(amount) > balance) return
    setSubmitting(true)
    try {
      await withdrawalApi.create({ amount: parseFloat(amount), cryptoType: selected.symbol, walletAddress: address })
      const [w, nu] = await Promise.all([withdrawalApi.list(), userApi.me()])
      setWithdrawals(w); setFreshUser(nu); login(nu)
      setSuccess(true); setSelected(null); setAmount(''); setAddress('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) { toast.error(err.message) }
    setSubmitting(false)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className="withdraw-grid">
        <div className="card">
          <h4 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><ArrowUpFromLine size={20} /> Request Withdrawal</h4>
          {success ? (
            <div style={{ textAlign: 'center', padding: 32 }}><div style={{ fontSize: '2rem', marginBottom: 12 }}>✅</div><h4 style={{ fontWeight: 700, marginBottom: 8 }}>Withdrawal Requested!</h4><p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Processing time: 1-24 hours</p></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Crypto</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {CRYPTOS.map(c => (
                    <div key={c.symbol} onClick={() => setSelected(c)} style={{
                      padding: '10px 8px', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                      background: selected?.symbol === c.symbol ? 'rgba(0,212,255,0.08)' : 'var(--bg-card)',
                      border: `1.5px solid ${selected?.symbol === c.symbol ? 'var(--accent-cyan)' : 'var(--border-color)'}`, transition: 'all 0.2s ease'
                    }}>
                      <div className={`crypto-icon ${c.cls}`} style={{ width: 28, height: 28, fontSize: '0.6rem', margin: '0 auto 6px' }}>{c.symbol[0]}</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{c.symbol}</div>
                    </div>
                  ))}
                </div>
              </div>
              {selected && (
                <div style={{ background: 'rgba(0,212,255,0.06)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Available Balance</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{balance.toFixed(4)} {selected.symbol}</span>
                </div>
              )}
              <div className="form-group"><label className="form-label">Amount</label><input className="form-input" type="number" step="any" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} />
                {amount && parseFloat(amount) > balance && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}><AlertTriangle size={12} /> Insufficient balance</p>}
              </div>
              <div className="form-group"><label className="form-label">Wallet Address</label><input className="form-input" type="text" placeholder="Enter your wallet address" value={address} onChange={e => setAddress(e.target.value)} /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!selected || !amount || !address || parseFloat(amount) > balance || submitting}>
                {submitting ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Submit Withdrawal'}
              </button>
            </form>
          )}
        </div>
        <div className="card">
          <h4 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Wallet size={20} /> Your Balances</h4>
          {CRYPTOS.map(c => (
            <div key={c.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className={`crypto-icon ${c.cls}`} style={{ width: 32, height: 32, fontSize: '0.65rem' }}>{c.symbol[0]}</div><span style={{ fontWeight: 600 }}>{c.name}</span></div>
              <span style={{ fontWeight: 700 }}>{(u?.[c.key] || 0).toFixed(4)} {c.symbol}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section-header"><h3>Withdrawal History</h3></div>
      {withdrawals.length === 0 ? <div className="card empty-state"><p>No withdrawals yet.</p></div> : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Crypto</th><th>Amount</th><th>Address</th><th>Status</th><th>Date</th></tr></thead><tbody>
          {withdrawals.map(w => (<tr key={w.id}><td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{w.cryptoType}</td><td style={{ fontWeight: 600 }}>{w.amount}</td><td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{w.walletAddress?.substring(0, 16)}...</td><td><span className={`badge badge-${w.status.toLowerCase()}`}>{w.status}</span></td><td>{new Date(w.createdAt).toLocaleDateString()}</td></tr>))}
        </tbody></table></div>
      )}
    </div>
  )
}
