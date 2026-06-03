import { useState, useEffect } from 'react'
import { publicApi, depositApi } from '../../utils/api'
import { useToast } from '../../components/Toast'
import { Copy, Check, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

const CRYPTO_META = {
  BTC: { name: 'Bitcoin', cls: 'crypto-btc', network: 'Bitcoin', minDeposit: 0.001 },
  ETH: { name: 'Ethereum', cls: 'crypto-eth', network: 'ERC-20', minDeposit: 0.01 },
  USDT: { name: 'Tether', cls: 'crypto-usdt', network: 'TRC-20', minDeposit: 10 },
  LTC: { name: 'Litecoin', cls: 'crypto-ltc', network: 'Litecoin', minDeposit: 0.1 },
  BNB: { name: 'BNB', cls: 'crypto-bnb', network: 'BSC (BEP-20)', minDeposit: 0.01 },
  SOL: { name: 'Solana', cls: 'crypto-sol', network: 'Solana', minDeposit: 0.1 },
}

export default function Deposit() {
  const [step, setStep] = useState(1)
  const [wallets, setWallets] = useState({})
  const [deposits, setDeposits] = useState([])
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState('')
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    Promise.all([publicApi.wallets(), depositApi.list()])
      .then(([w, d]) => { setWallets(w); setDeposits(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const cryptoOptions = Object.entries(wallets).map(([symbol, address]) => ({
    symbol, address, ...CRYPTO_META[symbol]
  })).filter(c => c.name)

  const copyAddress = () => {
    navigator.clipboard.writeText(selected.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await depositApi.create({ amount: parseFloat(amount), cryptoType: selected.symbol, txHash })
      const d = await depositApi.list()
      setDeposits(d)
      setStep(4)
      toast.success('Your deposit is being reviewed by our team.', 'Deposit Submitted!')
    } catch (err) { toast.error(err.message) }
    setSubmitting(false)
  }

  const resetForm = () => { setStep(1); setSelected(null); setAmount(''); setTxHash('') }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const steps = ['Select Crypto', 'Enter Amount', 'Send Payment', 'Confirm']

  return (
    <div>
      <div className="deposit-steps">
        {steps.map((s, i) => (
          <div key={i} className={`deposit-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'completed' : ''}`}>
            <div className="step-num">{step > i + 1 ? <Check size={12} /> : i + 1}</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="fade-in">
          <div className="section-header"><h3>Select Payment Method</h3></div>
          {cryptoOptions.length === 0 ? (
            <div className="card empty-state"><p>No payment methods configured. Contact admin.</p></div>
          ) : (
            <div className="crypto-grid">
              {cryptoOptions.map(c => (
                <div key={c.symbol} className={`crypto-option ${selected?.symbol === c.symbol ? 'selected' : ''}`} onClick={() => setSelected(c)}>
                  <div className={`crypto-icon ${c.cls}`}>{c.symbol[0]}</div>
                  <div className="crypto-name">{c.name}</div>
                  <div className="crypto-symbol">{c.symbol}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{c.network}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" disabled={!selected} onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 2 && selected && (
        <div className="fade-in">
          <div className="card deposit-form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div className={`crypto-icon ${selected.cls}`}>{selected.symbol[0]}</div>
              <div><div style={{ fontWeight: 700 }}>{selected.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Network: {selected.network}</div></div>
            </div>
            <div className="form-group">
              <label className="form-label">Deposit Amount ({selected.symbol})</label>
              <input className="form-input" type="number" placeholder={`Min: ${selected.minDeposit} ${selected.symbol}`} value={amount} onChange={e => setAmount(e.target.value)} step="any" />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
              <button className="btn btn-primary" disabled={!amount || parseFloat(amount) < selected.minDeposit} onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && selected && (
        <div className="fade-in">
          <div className="card deposit-form-card">
            <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Send {amount} {selected.symbol}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 20 }}>
              Send exactly <strong style={{ color: 'var(--accent-cyan)' }}>{amount} {selected.symbol}</strong> to the address below
            </p>
            <div className="wallet-box">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>{selected.name} ({selected.network}) Address</p>
              <div className="wallet-address">{selected.address}</div>
              <button className="btn btn-secondary btn-sm" onClick={copyAddress}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Address</>}
              </button>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: '0.82rem', color: 'var(--warning)' }}>
              ⚠️ Only send {selected.symbol} on the {selected.network} network.
            </div>
            <div className="form-group">
              <label className="form-label">Transaction Hash (TX ID)</label>
              <input className="form-input" type="text" placeholder="Paste your transaction hash here" value={txHash} onChange={e => setTxHash(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button>
              <button className="btn btn-primary" disabled={!txHash || submitting} onClick={handleSubmit}>
                {submitting ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Submit Deposit <ArrowRight size={16} /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && selected && (
        <div className="fade-in" style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <CheckCircle size={40} style={{ color: 'var(--success)' }} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>Deposit Submitted!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
            Your deposit of <strong>{amount} {selected.symbol}</strong> is being reviewed.
          </p>
          <button className="btn btn-primary" onClick={resetForm}>Make Another Deposit</button>
        </div>
      )}

      {step === 1 && deposits.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div className="section-header"><h3>Deposit History</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deposits.map(d => (
              <div key={d.id} className="card tx-item">
                <div className="tx-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <ArrowLeft size={16} style={{ color: 'var(--success)', transform: 'rotate(180deg)' }} />
                </div>
                <div className="tx-info">
                  <div className="tx-label">{d.cryptoType} Deposit</div>
                  <div className="tx-detail">{d.txHash ? `TX: ${d.txHash.substring(0, 20)}...` : 'Pending'}</div>
                </div>
                <div className="tx-amount" style={{ color: 'var(--success)' }}>
                  +{d.amount}
                  <span className="tx-crypto">{d.cryptoType}</span>
                </div>
                <div className="tx-status">
                  <span className={`badge badge-${d.status.toLowerCase()}`}>{d.status}</span>
                  <div className="tx-date">{new Date(d.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .deposit-form-card { max-width: 560px; }
        .tx-item { display: flex; align-items: center; gap: 14px; padding: 14px 18px; }
        .tx-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tx-info { flex: 1; min-width: 0; }
        .tx-label { font-weight: 700; font-size: 0.88rem; color: var(--text-primary); }
        .tx-detail { font-size: 0.75rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tx-amount { text-align: right; flex-shrink: 0; font-weight: 800; font-size: 0.9rem; }
        .tx-crypto { display: block; font-size: 0.72rem; color: var(--text-muted); font-weight: 500; }
        .tx-status { flex-shrink: 0; min-width: 70px; text-align: right; }
        .tx-date { font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }

        @media (max-width: 640px) {
          .deposit-form-card { max-width: 100%; }
          .tx-item { flex-wrap: wrap; padding: 12px; gap: 8px; }
          .tx-info { min-width: calc(100% - 50px); }
          .tx-detail { white-space: normal; }
        }
      `}</style>
    </div>
  )
}
