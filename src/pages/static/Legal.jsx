import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function LegalPage({ title, children }) {
  return (
    <div className="landing-page">
      <div className="landing-container" style={{ paddingTop: 100, paddingBottom: 80, maxWidth: 800 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.88rem', marginBottom: 32 }}><ArrowLeft size={16} /> Back to Home</Link>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 8 }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 40 }}>Last updated: June 1, 2026</p>
        <div className="legal-content" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.92rem' }}>{children}</div>
      </div>
    </div>
  )
}

export function TermsOfService() {
  return (
    <LegalPage title="Terms of Service">
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>1. Acceptance of Terms</h3>
        <p>By accessing and using MineVertex ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not use our services.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>2. Account Registration</h3>
        <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>3. Mining Services</h3>
        <p>MineVertex provides cloud mining services. Mining returns are based on current market conditions and hash rate performance. Past performance does not guarantee future results. Returns may vary based on network difficulty and market prices.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>4. Deposits and Withdrawals</h3>
        <p>All deposits are subject to verification. Withdrawal requests are processed within 1-24 hours. The platform reserves the right to request additional verification for large withdrawals.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>5. Limitation of Liability</h3>
        <p>MineVertex shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Cryptocurrency investments carry inherent risks.</p>
      </div>
    </LegalPage>
  )
}

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Information We Collect</h3>
        <p>We collect your email address, full name, and transaction data to provide our services. We do not sell your personal information to third parties.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>How We Use Your Data</h3>
        <p>Your data is used to: provide mining services, process transactions, communicate important updates, prevent fraud, and improve our platform.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Data Security</h3>
        <p>We employ bank-grade encryption (AES-256) and follow industry best practices to protect your personal information and financial data.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Your Rights</h3>
        <p>You have the right to access, modify, or delete your personal data at any time by contacting our support team or through your profile settings.</p>
      </div>
    </LegalPage>
  )
}

export function RefundPolicy() {
  return (
    <LegalPage title="Refund Policy">
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Deposit Refunds</h3>
        <p>Once a deposit has been confirmed and applied to your account, it is considered final due to the nature of blockchain transactions. Deposits pending verification can be cancelled upon request.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Mining Plan Refunds</h3>
        <p>Active mining plans cannot be refunded once started, as computing resources have been allocated. Unused balance from cancelled plans may be refunded at the platform's discretion.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Dispute Resolution</h3>
        <p>For any refund disputes, please contact our support team at support@minevertex.com with your transaction details. We aim to resolve all disputes within 72 hours.</p>
      </div>
    </LegalPage>
  )
}

export function AmlPolicy() {
  return (
    <LegalPage title="AML Policy">
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Anti-Money Laundering Commitment</h3>
        <p>MineVertex is committed to preventing money laundering and terrorist financing. We comply with applicable AML regulations and maintain robust internal procedures.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Know Your Customer (KYC)</h3>
        <p>We may request identity verification for transactions above certain thresholds. This includes government-issued ID and proof of address.</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Suspicious Activity Reporting</h3>
        <p>We monitor transactions for suspicious patterns and reserve the right to freeze accounts and report suspicious activity to relevant authorities.</p>
      </div>
    </LegalPage>
  )
}
