import { useState, useEffect } from 'react'
import { adminApi } from '../../utils/api'
import { useToast } from '../../components/Toast'
import { Play, Search, Activity, CheckCircle, XCircle } from 'lucide-react'

export default function AdminMinings() {
  const [minings, setMinings] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [accruing, setAccruing] = useState(false)
  const toast = useToast()

  const fetchMinings = async () => {
    try {
      const data = await adminApi.minings()
      setMinings(data)
    } catch (err) {
      toast.error('Failed to load minings')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchMinings() }, [])

  const handleAccrueAll = async () => {
    setAccruing(true)
    try {
      await adminApi.accrueMinings()
      toast.success('Successfully manually increased all active minings')
      await fetchMinings()
    } catch (err) {
      toast.error('Failed to accrue minings')
    } finally { setAccruing(false) }
  }

  const filtered = minings.filter(m => 
    m.user?.email.toLowerCase().includes(search.toLowerCase()) ||
    m.plan?.name.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = minings.filter(m => m.status === 'ACTIVE').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0', color: '#f8fafc' }}>Mining Operations</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
            {activeCount} Active Mining Contracts
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleAccrueAll} 
          disabled={accruing || activeCount === 0}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {accruing ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Play size={18} />}
          Force Manual Accrual
        </button>
      </div>

      <div className="dashboard-card" style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by user email or plan name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', padding: '12px 16px 12px 42px', 
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', 
              borderRadius: 8, color: '#fff', fontSize: '0.95rem' 
            }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Daily Rate</th>
                <th>Total Earned</th>
                <th>Status</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No minings found</td></tr>
              ) : (
                filtered.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.user?.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.user?.fullName}</div>
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, fontSize: '0.85rem' }}>
                        {m.plan?.name}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{m.investedAmount} {m.cryptoType}</td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>+{m.dailyEarning} / day</td>
                    <td style={{ fontWeight: 700 }}>{m.totalEarned.toFixed(6)} {m.cryptoType}</td>
                    <td>
                      <span className={`badge badge-${m.status.toLowerCase()}`}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
