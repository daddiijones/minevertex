import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../App'
import {
  LayoutDashboard, ArrowDownToLine, ArrowUpFromLine,
  Pickaxe, Cpu, Users, UserCircle, LogOut, Menu, X, Bell, History
} from 'lucide-react'

export default function CustomerLayout() {
  const { user, logout } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const getPageTitle = () => {
    const map = {
      '/dashboard': 'Dashboard',
      '/deposit': 'Deposit Funds',
      '/withdraw': 'Withdraw',
      '/plans': 'Mining Plans',
      '/my-minings': 'My Minings',
      '/referrals': 'Referrals',
      '/profile': 'Profile',
      '/transactions': 'Transaction History',
    }
    return map[location.pathname] || 'Dashboard'
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/deposit', icon: ArrowDownToLine, label: 'Deposit' },
    { to: '/withdraw', icon: ArrowUpFromLine, label: 'Withdraw' },
    { to: '/plans', icon: Pickaxe, label: 'Mining Plans' },
    { to: '/my-minings', icon: Cpu, label: 'My Minings' },
    { to: '/referrals', icon: Users, label: 'Referrals' },
    { to: '/transactions', icon: History, label: 'Transactions' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ]

  return (
    <div className="app-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', zIndex: 99
      }} />}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">⛏</div>
          <h1>MineVertex</h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main Menu</div>
            {navItems.map(item => (
              <NavLink
                key={item.to} to={item.to}
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
          <button className="nav-link logout-btn" onClick={() => { localStorage.removeItem('miningToken'); logout() }} style={{ width: '100%', color: 'var(--danger)', cursor: 'pointer' }}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="btn-secondary" onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', padding: '8px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              id="mobile-menu-btn"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2>{getPageTitle()}</h2>
          </div>
          <div className="topbar-right">
            <button style={{ position: 'relative', background: 'none', color: 'var(--text-secondary)' }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--danger)'
              }} />
            </button>
            <div className="topbar-avatar">{user?.fullName?.[0] || 'U'}</div>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user?.fullName || 'User'}</span>
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
          #mobile-menu-btn { display: flex !important; }
          .sidebar.open { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  )
}
