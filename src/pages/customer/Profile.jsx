import { useContext, useState } from 'react'
import { AuthContext } from '../../App'
import { userApi } from '../../utils/api'
import { UserCircle, Lock, Shield } from 'lucide-react'

export default function Profile() {
  const { user, login } = useContext(AuthContext)
  const [form, setForm] = useState({ fullName: user?.fullName || '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await userApi.updateProfile({ fullName: form.fullName })
      login({ ...user, ...updated })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (err) { alert(err.message) }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><UserCircle size={20} /> Profile Information</h4>
        <form onSubmit={handleSave}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} /></div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={20} /> Change Password</h4>
        <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="Enter current password" /></div>
        <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="Enter new password" /></div>
        <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" placeholder="Confirm new password" /></div>
        <button className="btn btn-secondary">Update Password</button>
      </div>
      <div className="card">
        <h4 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={20} /> Security</h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}><div><div style={{ fontWeight: 600, marginBottom: 2 }}>Two-Factor Authentication</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Add an extra layer of security</div></div><span className="badge badge-pending">Coming Soon</span></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}><div><div style={{ fontWeight: 600, marginBottom: 2 }}>KYC Verification</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Verify your identity for higher limits</div></div><span className="badge badge-pending">Not Verified</span></div>
      </div>
    </div>
  )
}
