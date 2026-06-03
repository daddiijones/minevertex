import { useState, useEffect } from 'react'
import { adminApi } from '../../utils/api'
import { Save, Wallet, Check } from 'lucide-react'

const CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin', cls: 'crypto-btc' },
  { symbol: 'ETH', name: 'Ethereum (ERC-20)', cls: 'crypto-eth' },
  { symbol: 'USDT', name: 'Tether (TRC-20)', cls: 'crypto-usdt' },
  { symbol: 'LTC', name: 'Litecoin', cls: 'crypto-ltc' },
  { symbol: 'BNB', name: 'BNB (BSC/BEP-20)', cls: 'crypto-bnb' },
  { symbol: 'SOL', name: 'Solana', cls: 'crypto-sol' },
]

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    adminApi.settings().then(list => {
      const obj = {}
      list.forEach(s => { obj[s.key] = s.value })
      setSettings(obj)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const settingsArr = Object.entries(settings).map(([key, value]) => ({ key, value }))
    await adminApi.updateSettings({ settings: settingsArr })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Wallet size={20} /> Platform Wallet Addresses</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 20 }}>These addresses are shown to users for deposits. Change them anytime.</p>
        {CRYPTOS.map(c => (
          <div className="form-group" key={c.symbol}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={`crypto-icon ${c.cls}`} style={{ width: 22, height: 22, fontSize: '0.55rem' }}>{c.symbol[0]}</div>
              {c.name} ({c.symbol})
            </label>
            <input className="form-input" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
              value={settings[`wallet_${c.symbol}`] || ''} onChange={e => setSettings({ ...settings, [`wallet_${c.symbol}`]: e.target.value })} />
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ fontWeight: 700, marginBottom: 20 }}>General Settings</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[{ k: 'min_deposit', l: 'Minimum Deposit (USD)' }, { k: 'min_withdrawal', l: 'Minimum Withdrawal (USD)' }, { k: 'withdrawal_fee', l: 'Withdrawal Fee (%)' }, { k: 'referral_bonus', l: 'Referral Bonus (%)' }].map(f => (
            <div className="form-group" key={f.k}><label className="form-label">{f.l}</label><input className="form-input" type="number" value={settings[f.k] || ''} onChange={e => setSettings({ ...settings, [f.k]: e.target.value })} /></div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
        {saved ? <><Check size={18} /> Saved!</> : saving ? 'Saving...' : <><Save size={18} /> Save All Settings</>}
      </button>
    </div>
  )
}
