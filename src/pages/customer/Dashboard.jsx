import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../App'
import { userApi } from '../../utils/api'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Wallet, TrendingUp, Cpu, DollarSign, ArrowDownToLine, ArrowUpFromLine, Pickaxe, ArrowRight, Activity } from 'lucide-react'

const PRICES = { BTC: 67500, ETH: 3800, USDT: 1, LTC: 85, BNB: 610, SOL: 170 }
const CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin', key: 'balanceBTC', cls: 'crypto-btc' },
  { symbol: 'ETH', name: 'Ethereum', key: 'balanceETH', cls: 'crypto-eth' },
  { symbol: 'USDT', name: 'Tether', key: 'balanceUSDT', cls: 'crypto-usdt' },
  { symbol: 'LTC', name: 'Litecoin', key: 'balanceLTC', cls: 'crypto-ltc' },
  { symbol: 'BNB', name: 'BNB', key: 'balanceBNB', cls: 'crypto-bnb' },
  { symbol: 'SOL', name: 'Solana', key: 'balanceSOL', cls: 'crypto-sol' },
]
const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function CustomerDashboard() {
  const { user, login } = useContext(AuthContext)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userApi.dashboard().then(d => {
      setData(d)
      const { password, ...u } = d.user
      login(u)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const u = data?.user || user
  const totalBalance = CRYPTOS.reduce((sum, c) => sum + (u?.[c.key] || 0) * PRICES[c.symbol], 0)

  const chartData = (data?.recentMinings || []).slice(0, 7).reverse().map((m, i) => ({
    day: `Day ${i + 1}`, earnings: m.totalEarned || 0
  }))
  if (chartData.length === 0) for (let i = 1; i <= 7; i++) chartData.push({ day: `Day ${i}`, earnings: 0 })

  const stats = [
    { label: 'Total Balance', value: `$${fmt(totalBalance)}`, icon: Wallet, color: 'cyan' },
    { label: 'Total Earned', value: `$${fmt(u?.totalEarned || 0)}`, icon: TrendingUp, color: 'green' },
    { label: 'Active Minings', value: data?.activeMinings || 0, icon: Cpu, color: 'purple' },
    { label: 'Total Deposited', value: `$${fmt(u?.totalDeposited || 0)}`, icon: DollarSign, color: 'amber' },
  ]

  // Build unified transaction list from all sources
  const allTx = [
    ...(data?.recentDeposits || []).map(d => ({
      id: d.id, type: 'deposit', direction: 'credit',
      label: `Deposit (${d.cryptoType})`, amount: d.amount,
      cryptoType: d.cryptoType, status: d.status, createdAt: d.createdAt
    })),
    ...(data?.recentWithdrawals || []).map(w => ({
      id: w.id, type: 'withdrawal', direction: 'debit',
      label: `Withdrawal (${w.cryptoType})`, amount: w.amount,
      cryptoType: w.cryptoType, status: w.status, createdAt: w.createdAt
    })),
    ...(data?.recentMinings || []).map(m => ({
      id: m.id, type: 'mining', direction: 'debit',
      label: `Mining: ${m.plan?.name || 'Plan'}`, amount: m.investedAmount,
      cryptoType: m.cryptoType, status: m.status, createdAt: m.createdAt
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)

  return (
    <div>
      <div style={{ background: 'var(--gradient-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Welcome back, {u?.fullName || 'Miner'} 👋</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your mining operations overview.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/deposit" className="btn btn-primary"><ArrowDownToLine size={16} /> Deposit</Link>
          <Link to="/plans" className="btn btn-secondary"><Pickaxe size={16} /> Start Mining</Link>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header">
              <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
              <div className={`stat-icon ${s.color}`}><s.icon size={20} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Mining Earnings</h4>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs><linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} /><stop offset="95%" stopColor="#00d4ff" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }} formatter={(v) => [`$${fmt(v)}`, 'Earnings']} />
              <Area type="monotone" dataKey="earnings" stroke="#00d4ff" strokeWidth={2} fill="url(#earnGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Wallet Balances</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CRYPTOS.map(c => {
              const bal = u?.[c.key] || 0
              return (
                <div key={c.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className={`crypto-icon ${c.cls}`}>{c.symbol[0]}</div>
                    <div><div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.symbol}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.name}</div></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>{c.symbol === 'USDT' ? fmt(bal) : bal.toFixed(4)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>≈ ${fmt(bal * PRICES[c.symbol])}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3>Recent Transactions</h3>
        <Link to="/transactions" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>View All →</Link>
      </div>
      {allTx.length === 0 ? (
        <div className="card empty-state"><p>No transactions yet. Make your first deposit!</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {allTx.map(tx => {
            const isCredit = tx.direction === 'credit'
            return (
              <div key={tx.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: tx.type === 'deposit' ? 'rgba(16,185,129,0.1)' : tx.type === 'mining' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'
                }}>
                  {tx.type === 'deposit' ? <ArrowDownToLine size={16} style={{ color: 'var(--success)' }} />
                    : tx.type === 'mining' ? <Pickaxe size={16} style={{ color: 'var(--warning)' }} />
                    : <ArrowUpFromLine size={16} style={{ color: 'var(--danger)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{tx.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isCredit ? 'var(--success)' : 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>
                  {isCredit ? '+' : '-'}${fmt(tx.amount)}
                </div>
                <span className={`badge badge-${tx.status.toLowerCase()}`} style={{ minWidth: 70, textAlign: 'center' }}>{tx.status}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
