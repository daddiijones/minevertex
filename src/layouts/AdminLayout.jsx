import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../App'
import {
  LayoutDashboard, Users, ArrowDownToLine, ArrowUpFromLine,
  Pickaxe, Settings, LogOut, Menu, X, Shield, Activity
} from 'lucide-react'

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const getPageTitle = () => {
    const map = {
      '/admin': 'Admin Dashboard',
      '/admin/users': 'User Management',
      '/admin/deposits': 'Deposit Management',
      '/admin/withdrawals': 'Withdrawal Management',
      '/admin/plans': 'Manage Plans',
      '/admin/minings': 'Active Minings',
      '/admin/settings': 'Platform Settings',
    }
    return map[location.pathname] || 'Admin'
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/deposits', icon: ArrowDownToLine, label: 'Deposits' },
    { to: '/admin/withdrawals', icon: ArrowUpFromLine, label: 'Withdrawals' },
    { to: '/admin/plans', icon: Pickaxe, label: 'Mining Plans' },
    { to: '/admin/minings', icon: Activity, label: 'Active Minings' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="app-layout">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', zIndex: 99
      }} />}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #7c3aed)' }}>
            <Shield size={18} />
          </div>
          <h1 style={{ background: 'linear-gradient(135deg, #ef4444, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Panel
          </h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            {navItems.map(item => (
              <NavLink
                key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/dashboard" className="nav-link" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            <LayoutDashboard /> <span>Customer View</span>
          </NavLink>
          <button className="nav-link logout-btn" onClick={() => { localStorage.removeItem('miningToken'); logout() }} style={{ width: '100%', color: 'var(--danger)', cursor: 'pointer' }}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', padding: '8px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              id="admin-menu-btn"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2>{getPageTitle()}</h2>
          </div>
          <div className="topbar-right">
            <span className="badge badge-active">ADMIN</span>
            <div className="topbar-avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #7c3aed)' }}>
              {user?.fullName?.[0] || 'A'}
            </div>
            <button onClick={() => { localStorage.removeItem('miningToken'); logout() }}
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600 }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <div className="page-content fade-in">
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          #admin-menu-btn { display: flex !important; }
          .sidebar.open { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  )
}
