import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext } from 'react'
import LandingPage from './pages/LandingPage'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import CustomerDashboard from './pages/customer/Dashboard'
import Deposit from './pages/customer/Deposit'
import Withdraw from './pages/customer/Withdraw'
import MiningPlans from './pages/customer/MiningPlans'
import MyMinings from './pages/customer/MyMinings'
import Referrals from './pages/customer/Referrals'
import Profile from './pages/customer/Profile'
import Transactions from './pages/customer/Transactions'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminDeposits from './pages/admin/Deposits'
import AdminWithdrawals from './pages/admin/Withdrawals'
import AdminPlans from './pages/admin/ManagePlans'
import AdminMinings from './pages/admin/ActiveMinings'
import AdminSettings from './pages/admin/Settings'
import HelpCenter from './pages/static/HelpCenter'
import ContactUs from './pages/static/ContactUs'
import ApiDocs from './pages/static/ApiDocs'
import StatusPage from './pages/static/StatusPage'
import { TermsOfService, PrivacyPolicy, RefundPolicy, AmlPolicy } from './pages/static/Legal'
import Reviews from './pages/static/Reviews'
import { ToastProvider } from './components/Toast'
import FloatingSupport from './components/FloatingSupport'

export const AuthContext = createContext(null)

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('miningUser')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('miningUser') }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('miningUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('miningUser')
    localStorage.removeItem('miningToken')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0e1a' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
          <Route path="/reset-password" element={user ? <Navigate to="/dashboard" /> : <ResetPassword />} />

          {/* Static Pages */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/aml-policy" element={<AmlPolicy />} />
          <Route path="/reviews" element={<Reviews />} />

          {/* Customer Routes */}
          <Route element={user ? <CustomerLayout /> : <Navigate to="/login" />}>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="plans" element={<MiningPlans />} />
            <Route path="my-minings" element={<MyMinings />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="profile" element={<Profile />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminLayout /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="deposits" element={<AdminDeposits />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="minings" element={<AdminMinings />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <FloatingSupport />
      </BrowserRouter>
      </ToastProvider>
    </AuthContext.Provider>
  )
}

export default App
