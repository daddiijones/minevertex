import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, Phone, MapPin } from 'lucide-react'

export default function HelpCenter() {
  const faqs = [
    { q: 'How do I start mining?', a: 'Create an account, make a deposit, select a mining plan, and your mining starts automatically. You earn returns daily, even when offline.' },
    { q: 'What cryptocurrencies can I deposit?', a: 'We accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT/TRC-20), Litecoin (LTC), BNB (BSC/BEP-20), and Solana (SOL).' },
    { q: 'How long until my deposit is confirmed?', a: 'Deposits are manually verified by our team for security. This typically takes 10 minutes to 2 hours during business hours.' },
    { q: 'Can I withdraw anytime?', a: 'Yes! You can request a withdrawal at any time. Processing takes 1-24 hours depending on network congestion.' },
    { q: 'Do I earn while offline?', a: 'Absolutely. Mining runs 24/7 on our servers. Your earnings accumulate continuously and are credited to your balance.' },
    { q: 'How does the referral program work?', a: 'Share your unique referral link. You earn 5% commission on every deposit made by users who sign up through your link.' },
    { q: 'Is my investment safe?', a: 'We use bank-grade encryption, cold storage for funds, and our mining farms have redundant power and cooling systems across 12 countries.' },
    { q: 'What is the minimum deposit?', a: 'Minimum deposit amounts vary by cryptocurrency. Check the deposit page for current minimums.' },
  ]

  return (
    <div className="landing-page">
      <div className="landing-container" style={{ paddingTop: 100, paddingBottom: 80 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.88rem', marginBottom: 32 }}><ArrowLeft size={16} /> Back to Home</Link>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 8 }}>Help Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 48 }}>Find answers to common questions about our platform.</p>

        <div style={{ maxWidth: 800 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Frequently Asked Questions</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '20px 24px', marginBottom: 12 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--accent-cyan)' }}>{f.q}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
