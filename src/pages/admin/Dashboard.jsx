import { useState, useEffect } from 'react'
import { adminApi } from '../../utils/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Users, DollarSign, Cpu, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.stats().then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const stats = [
    { label: 'Total Users', value: data?.totalUsers || 0, icon: Users, color: 'cyan' },
    { label: 'Total Deposits', value: `$${(data?.totalDeposits || 0).toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'Active Minings', value: data?.activeMinings || 0, icon: Cpu, color: 'purple' },
    { label: 'Pending Deposits', value: data?.pendingDeposits || 0, icon: Clock, color: 'amber' },
  ]

  return (
    <div>
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

      <div className="section-header" style={{ marginTop: 28 }}><h3>Recent Users</h3></div>
      {(data?.recentUsers || []).length === 0 ? <div className="card empty-state"><p>No users yet.</p></div> : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
            <tbody>
              {(data?.recentUsers || []).map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
