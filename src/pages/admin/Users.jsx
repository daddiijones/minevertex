import { useState, useEffect } from 'react'
import { adminApi } from '../../utils/api'
import { Search, Ban, Eye, ShieldCheck } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewUser, setViewUser] = useState(null)

  useEffect(() => {
    adminApi.users().then(u => { setUsers(u); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const toggleUser = async (id) => {
    await adminApi.toggleUser(id)
    const u = await adminApi.users()
    setUsers(u)
    setViewUser(null)
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const filtered = users.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ position: 'relative', width: 320 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Search users..." style={{ paddingLeft: 42 }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{filtered.length} users</div>
      </div>
      <div className="table-container"><table className="data-table">
        <thead><tr><th>User</th><th>USDT Balance</th><th>Active Plans</th><th>Total Deposited</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="topbar-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{u.fullName[0]}</div><div><div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.fullName}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div></div></div></td>
              <td style={{ fontWeight: 700 }}>${(u.balanceUSDT || 0).toFixed(2)}</td>
              <td>{u._count?.userMinings || 0}</td>
              <td>${(u.totalDeposited || 0).toLocaleString()}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td><span className={`badge ${u.isActive ? 'badge-active' : 'badge-rejected'}`}>{u.isActive ? 'ACTIVE' : 'BANNED'}</span></td>
              <td><div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setViewUser(u)}><Eye size={14} /></button>
                <button className="btn btn-sm" style={{ background: u.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: u.isActive ? 'var(--danger)' : 'var(--success)' }} onClick={() => toggleUser(u.id)}>
                  {u.isActive ? <Ban size={14} /> : <ShieldCheck size={14} />}
                </button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table></div>

      {viewUser && (
        <div className="modal-overlay" onClick={() => setViewUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>User Details</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}><div className="topbar-avatar" style={{ width: 48, height: 48, fontSize: '1.1rem' }}>{viewUser.fullName[0]}</div><div><div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{viewUser.fullName}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{viewUser.email}</div></div></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[{ l: 'BTC', v: (viewUser.balanceBTC || 0).toFixed(4) }, { l: 'ETH', v: (viewUser.balanceETH || 0).toFixed(4) }, { l: 'USDT', v: (viewUser.balanceUSDT || 0).toFixed(2) }, { l: 'Total Deposited', v: `$${(viewUser.totalDeposited || 0).toLocaleString()}` }, { l: 'Total Earned', v: `$${(viewUser.totalEarned || 0).toFixed(2)}` }, { l: 'Joined', v: new Date(viewUser.createdAt).toLocaleDateString() }].map((item, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 14 }}><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{item.l}</div><div style={{ fontWeight: 700 }}>{item.v}</div></div>
              ))}
            </div>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setViewUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
