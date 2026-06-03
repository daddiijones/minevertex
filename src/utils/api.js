const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('miningToken')
}

function headers() {
  const h = { 'Content-Type': 'application/json' }
  const t = getToken()
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export async function api(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: headers(),
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const authApi = {
  login: (body) => api('/auth/login', { method: 'POST', body }),
  verifyLogin: (body) => api('/auth/verify-login', { method: 'POST', body }),
  register: (body) => api('/auth/register', { method: 'POST', body }),
  verifyRegister: (body) => api('/auth/verify-register', { method: 'POST', body }),
  forgotPassword: (body) => api('/auth/forgot-password', { method: 'POST', body }),
  resetPassword: (body) => api('/auth/reset-password', { method: 'POST', body }),
}

export const userApi = {
  me: () => api('/user/me'),
  dashboard: () => api('/user/dashboard'),
  updateProfile: (body) => api('/user/profile', { method: 'PUT', body }),
  transactions: () => api('/user/transactions'),
}

export const depositApi = {
  create: (body) => api('/deposits', { method: 'POST', body }),
  list: () => api('/deposits'),
}

export const withdrawalApi = {
  create: (body) => api('/withdrawals', { method: 'POST', body }),
  list: () => api('/withdrawals'),
}

export const miningApi = {
  plans: () => api('/mining/plans'),
  purchase: (body) => api('/mining/purchase', { method: 'POST', body }),
  myMinings: () => api('/mining/my-minings'),
}

export const publicApi = {
  wallets: () => api('/public/wallets'),
  info: () => api('/public/info'),
}

export const referralApi = {
  list: () => api('/public/referrals'),
}

export const adminApi = {
  stats: () => api('/admin/stats'),
  users: () => api('/admin/users'),
  toggleUser: (id) => api(`/admin/users/${id}/toggle`, { method: 'PUT' }),
  deposits: () => api('/admin/deposits'),
  updateDeposit: (id, body) => api(`/admin/deposits/${id}`, { method: 'PUT', body }),
  withdrawals: () => api('/admin/withdrawals'),
  updateWithdrawal: (id, body) => api(`/admin/withdrawals/${id}`, { method: 'PUT', body }),
  plans: () => api('/admin/plans'),
  createPlan: (body) => api('/admin/plans', { method: 'POST', body }),
  updatePlan: (id, body) => api(`/admin/plans/${id}`, { method: 'PUT', body }),
  settings: () => api('/admin/settings'),
  updateSettings: (body) => api('/admin/settings', { method: 'PUT', body }),
  minings: () => api('/admin/minings'),
  accrueMinings: () => api('/admin/minings/accrue-all', { method: 'POST' }),
}
