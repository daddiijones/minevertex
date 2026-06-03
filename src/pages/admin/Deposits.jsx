import { useState, useEffect } from 'react'
import { adminApi } from '../../utils/api'
import { Check, X, ExternalLink } from 'lucide-react'

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const load = () => adminApi.deposits().then(d => { setDeposits(d); setLoading(false) })
  useEffect(() => { load() }, [])

  const handleAction = async (id, status) => {
    await adminApi.updateDeposit(id, { status })
    load()
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const filtered = filter === 'ALL' ? deposits : deposits.filter(d => d.status === filter)

  return (
    <div>
      <div className="tabs" style={{ marginBottom: 20 }}>
        {['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f} {f === 'PENDING' && `(${deposits.filter(d => d.status === 'PENDING').length})`}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? <div className="card empty-state"><p>No deposits found.</p></div> : (
        <div className="table-container"><table className="data-table">
          <thead><tr><th>User</th><th>Crypto</th><th>Amount</th><th>TX Hash</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.user?.email}</td>
                <td style={{ fontWeight: 700 }}>{d.cryptoType}</td>
                <td style={{ fontWeight: 600 }}>{d.amount}</td>
                <td><span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{d.txHash?.substring(0, 16)}...</span></td>
                <td style={{ fontSize: '0.82rem' }}>{new Date(d.createdAt).toLocaleString()}</td>
                <td><span className={`badge badge-${d.status.toLowerCase()}`}>{d.status}</span></td>
                <td>{d.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-success" onClick={() => handleAction(d.id, 'CONFIRMED')}><Check size={14} /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleAction(d.id, 'REJECTED')}><X size={14} /></button>
                  </div>
                ) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </div>
  )
}
