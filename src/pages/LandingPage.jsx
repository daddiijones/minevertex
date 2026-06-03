import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Pickaxe, Shield, Zap, TrendingUp, Users, Globe, ArrowRight,
  Check, ChevronRight, Cpu, Lock, BarChart3, Wallet,
  Clock, Award, Layers, Star, Menu, X, ExternalLink
} from 'lucide-react'

/* ─── Animated Counter ─── */
function Counter({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = Date.now()
        const tick = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * end))
          if (progress < 1) requestAnimationFrame(tick)
        }
        tick()
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

/* ─── Crypto ticker ─── */
const cryptos = [
  { symbol: 'BTC', name: 'Bitcoin', price: '67,540', change: '+2.4%', up: true },
  { symbol: 'ETH', name: 'Ethereum', price: '3,812', change: '+1.8%', up: true },
  { symbol: 'BNB', name: 'BNB', price: '612', change: '+0.9%', up: true },
  { symbol: 'SOL', name: 'Solana', price: '172', change: '+5.2%', up: true },
  { symbol: 'LTC', name: 'Litecoin', price: '85', change: '-0.3%', up: false },
  { symbol: 'USDT', name: 'Tether', price: '1.00', change: '0.0%', up: true },
]

const plans = [
  { name: 'Starter', hash: '50 TH/s', roi: '1.5%', price: '$50', duration: '30 days', popular: false },
  { name: 'Professional', hash: '200 TH/s', roi: '2.2%', price: '$1,000', duration: '30 days', popular: true },
  { name: 'Enterprise', hash: '500 TH/s', roi: '3.0%', price: '$10,000', duration: '30 days', popular: false },
  { name: 'VIP Elite', hash: '1 PH/s', roi: '4.0%', price: '$50,000', duration: '30 days', popular: false },
]

const features = [
  { icon: Zap, title: '99.9% Uptime', desc: 'Enterprise-grade servers running 24/7 with redundant power systems and cooling infrastructure.' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'Multi-layer encryption, cold storage, and real-time monitoring to protect your assets.' },
  { icon: TrendingUp, title: 'Daily Returns', desc: 'Earn daily ROI automatically credited to your wallet, even while you sleep.' },
  { icon: Globe, title: 'Global Network', desc: 'Mining farms distributed across 12 countries for optimal performance and redundancy.' },
  { icon: Lock, title: 'Instant Withdrawals', desc: 'Withdraw your earnings anytime with fast processing and minimal fees.' },
  { icon: Users, title: 'Referral Program', desc: 'Earn 5% commission on every deposit your referrals make. Unlimited referrals.' },
]

const allTestimonials = [
  { name: 'James W.', role: 'Investor', country: '🇺🇸', text: 'MineVertex has completely changed my passive income strategy. Consistent returns every single day.', stars: 5 },
  { name: 'Maria K.', role: 'Trader', country: '🇩🇪', text: "The platform is incredibly user-friendly. I started mining within minutes of signing up.", stars: 5 },
  { name: 'David L.', role: 'Business Owner', country: '🇬🇧', text: 'Enterprise plan delivers exactly as promised. The dedicated manager is a huge plus.', stars: 5 },
  { name: 'Sarah M.', role: 'Engineer', country: '🇨🇦', text: "I've tried 5 different mining platforms. MineVertex is the only one with real, consistent payouts.", stars: 5 },
  { name: 'Ahmed R.', role: 'Freelancer', country: '🇦🇪', text: "Earning $200/day passively while I focus on my main work. Life-changing platform!", stars: 5 },
  { name: 'Liu Wei', role: 'Analyst', country: '🇸🇬', text: "The transparency is what sold me. I can verify every payout on the blockchain.", stars: 5 },
  { name: 'Elena P.', role: 'Entrepreneur', country: '🇫🇷', text: "Started with Starter plan, now running Enterprise. Returns compounded beautifully.", stars: 5 },
  { name: 'Michael T.', role: 'Retired', country: '🇦🇺', text: "Finally a platform I can trust for retirement income. 6 months and counting.", stars: 5 },
  { name: 'Olga S.', role: 'Teacher', country: '🇵🇱', text: "Even with a small investment, the returns are impressive. Great referral program too!", stars: 5 },
  { name: 'Carlos R.', role: 'Developer', country: '🇧🇷', text: "Clean UI, fast withdrawals, transparent blockchain proofs. Everything a miner needs.", stars: 5 },
  { name: 'Aisha N.', role: 'Student', country: '🇳🇬', text: "Referred 15 friends and earned over $3,000 in commissions alone. Amazing program!", stars: 5 },
  { name: 'Tomo H.', role: 'Day Trader', country: '🇯🇵', text: "Mining runs 24/7 even when I sleep. My daily ROI has been incredibly consistent.", stars: 5 },
]

/* ─── Live Payouts Generator ─── */
const EXPLORER_URLS = {
  BTC: 'https://www.blockchain.com/explorer/transactions/btc/',
  ETH: 'https://etherscan.io/tx/',
  USDT: 'https://tronscan.org/#/transaction/',
  LTC: 'https://blockchair.com/litecoin/transaction/',
  BNB: 'https://bscscan.com/tx/',
  SOL: 'https://solscan.io/tx/',
}

const NAMES = ['Alex M.', 'Chen W.', 'Emma S.', 'Raj P.', 'Ana G.', 'John D.', 'Yuki T.', 'Omar K.', 'Lisa F.', 'Hans B.', 'Fatima A.', 'Pedro L.', 'Min J.', 'Kate R.', 'Ivan S.', 'Rosa M.', 'Tom W.', 'Nina V.', 'Sam K.', 'Leah D.']
const CRYPTO_KEYS = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'LTC']

function genTxHash(crypto) {
  const chars = '0123456789abcdef'
  const len = crypto === 'USDT' ? 64 : crypto === 'SOL' ? 88 : 64
  const prefix = crypto === 'ETH' || crypto === 'BNB' ? '0x' : ''
  let hash = ''
  for (let i = 0; i < len; i++) hash += chars[Math.floor(Math.random() * chars.length)]
  return prefix + hash
}

function genPayout() {
  const crypto = CRYPTO_KEYS[Math.floor(Math.random() * CRYPTO_KEYS.length)]
  const amounts = { BTC: [0.001, 0.15], ETH: [0.01, 2.5], USDT: [50, 15000], LTC: [0.1, 20], BNB: [0.01, 5], SOL: [0.5, 50] }
  const [min, max] = amounts[crypto]
  const amount = (Math.random() * (max - min) + min).toFixed(crypto === 'USDT' ? 2 : 4)
  const txHash = genTxHash(crypto)
  return {
    id: Math.random(), name: NAMES[Math.floor(Math.random() * NAMES.length)],
    crypto, amount, txHash, url: EXPLORER_URLS[crypto] + txHash,
    time: `${Math.floor(Math.random() * 58) + 1}m ago`
  }
}

function LivePayouts() {
  const [payouts, setPayouts] = useState(() => Array.from({ length: 8 }, genPayout))

  useEffect(() => {
    const interval = setInterval(() => {
      setPayouts(prev => [genPayout(), ...prev.slice(0, 9)])
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {payouts.map((p, i) => (
        <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
            background: i === 0 ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${i === 0 ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)'}`,
            borderRadius: 10, transition: 'all 0.3s ease', textDecoration: 'none',
            animation: i === 0 ? 'fadeIn 0.5s ease' : 'none'
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check size={16} style={{ color: '#10b981' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#f1f5f9' }}>{p.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{p.time}</div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#10b981', flexShrink: 0 }}>
            +{p.amount} {p.crypto}
          </div>
          <ExternalLink size={13} style={{ color: '#64748b', flexShrink: 0 }} />
        </a>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="landing-page">
      {/* ─── NAVBAR ─── */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-container nav-inner">
          <Link to="/" className="nav-brand">
            <div className="brand-icon-lg">⛏</div>
            <span className="brand-text-lg">MineVertex</span>
          </Link>

          <div className={`nav-links ${mobileMenu ? 'open' : ''}`}>
            <a href="#features" onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#plans" onClick={() => setMobileMenu(false)}>Plans</a>
            <a href="#payouts" onClick={() => setMobileMenu(false)}>Payouts</a>
            <a href="#testimonials" onClick={() => setMobileMenu(false)}>Reviews</a>
            <div className="nav-auth-mobile">
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </div>

          <div className="nav-auth">
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started <ArrowRight size={16} /></Link>
          </div>

          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>

        <div className="landing-container hero-content">
          <div className="hero-badge">
            <Zap size={14} /> #1 Cloud Mining Platform — Trusted by 50,000+ miners
          </div>
          <h1 className="hero-title">
            Mine Crypto
            <span className="gradient-text"> Effortlessly.</span>
            <br />Earn
            <span className="gradient-text"> Daily Returns.</span>
          </h1>
          <p className="hero-subtitle">
            Start earning passive income with our enterprise-grade mining infrastructure.
            No hardware needed. No technical knowledge required. Just deposit, select a plan,
            and watch your earnings grow — 24/7, even while you're offline.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg hero-btn-glow">
              Start Mining Now <ArrowRight size={18} />
            </Link>
            <a href="#plans" className="btn btn-secondary btn-lg">
              View Plans <ChevronRight size={18} />
            </a>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <div className="hero-stat-value"><Counter end={50000} suffix="+" /></div>
              <div className="hero-stat-label">Active Miners</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">$<Counter end={125} suffix="M+" /></div>
              <div className="hero-stat-label">Total Paid Out</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value"><Counter end={99} suffix=".9%" /></div>
              <div className="hero-stat-label">Uptime</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value"><Counter end={12} /></div>
              <div className="hero-stat-label">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CRYPTO TICKER ─── */}
      <section className="ticker-section">
        <div className="ticker-track">
          {[...cryptos, ...cryptos].map((c, i) => (
            <div className="ticker-item" key={i}>
              <span className="ticker-symbol">{c.symbol}</span>
              <span className="ticker-price">${c.price}</span>
              <span className={`ticker-change ${c.up ? 'up' : 'down'}`}>{c.change}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="features-section" id="features">
        <div className="landing-container">
          <div className="section-intro">
            <span className="section-tag"><Shield size={14} /> Why MineVertex</span>
            <h2 className="section-title">Built for <span className="gradient-text">Serious Miners</span></h2>
            <p className="section-desc">
              Our platform combines cutting-edge technology with user-friendly design to deliver
              the most reliable cloud mining experience available.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon-wrap">
                  <f.icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="how-section">
        <div className="landing-container">
          <div className="section-intro">
            <span className="section-tag"><Layers size={14} /> Simple Process</span>
            <h2 className="section-title">Start Mining in <span className="gradient-text">3 Steps</span></h2>
          </div>

          <div className="steps-grid">
            {[
              { num: '01', title: 'Create Account', desc: 'Sign up in seconds with just your email. No KYC required to start.', icon: Users },
              { num: '02', title: 'Make a Deposit', desc: 'Choose from 6 cryptocurrencies. BTC, ETH, USDT, LTC, BNB, or SOL.', icon: Wallet },
              { num: '03', title: 'Earn Daily', desc: 'Select a plan and start earning. Withdraw anytime, anywhere.', icon: TrendingUp },
            ].map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon-wrap"><s.icon size={28} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 2 && <div className="step-arrow"><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANS ─── */}
      <section className="plans-section" id="plans">
        <div className="landing-container">
          <div className="section-intro">
            <span className="section-tag"><Pickaxe size={14} /> Mining Plans</span>
            <h2 className="section-title">Choose Your <span className="gradient-text">Mining Power</span></h2>
            <p className="section-desc">From beginner to whale — we have a plan for every investor.</p>
          </div>

          <div className="landing-plans-grid">
            {plans.map((p, i) => (
              <div className={`landing-plan-card ${p.popular ? 'popular' : ''}`} key={i}>
                {p.popular && <div className="popular-tag">⚡ Most Popular</div>}
                <h3>{p.name}</h3>
                <div className="plan-roi">
                  <span className="roi-value">{p.roi}</span>
                  <span className="roi-label">Daily ROI</span>
                </div>
                <ul>
                  <li><Check size={16} /> {p.hash} Hash Power</li>
                  <li><Check size={16} /> {p.duration} Duration</li>
                  <li><Check size={16} /> From {p.price}</li>
                  <li><Check size={16} /> 24/7 Mining</li>
                  <li><Check size={16} /> Instant Withdrawals</li>
                </ul>
                <Link to="/register" className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE PAYOUTS ─── */}
      <section className="payouts-section" id="payouts">
        <div className="landing-container">
          <div className="section-intro">
            <span className="section-tag"><BarChart3 size={14} /> Verified Payouts</span>
            <h2 className="section-title">Live <span className="gradient-text">Blockchain Payouts</span></h2>
            <p className="section-desc">Real payouts verified on the blockchain. Click any payout to verify on the explorer.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} /> Live Feed
              </h4>
              <LivePayouts />
            </div>
            <div>
              <div className="stats-banner" style={{ flexDirection: 'column', gap: 20 }}>
                <div className="stats-banner-item" style={{ textAlign: 'center' }}>
                  <BarChart3 size={28} />
                  <div className="stats-banner-value" style={{ fontSize: '2.2rem' }}>$<Counter end={125} suffix="M" /></div>
                  <div className="stats-banner-label">Total Payouts</div>
                </div>
                <div className="stats-banner-item" style={{ textAlign: 'center' }}>
                  <Users size={28} />
                  <div className="stats-banner-value" style={{ fontSize: '2.2rem' }}><Counter end={52400} /></div>
                  <div className="stats-banner-label">Paid Miners</div>
                </div>
                <div className="stats-banner-item" style={{ textAlign: 'center' }}>
                  <Clock size={28} />
                  <div className="stats-banner-value" style={{ fontSize: '2.2rem' }}><Counter end={847} suffix="K" /></div>
                  <div className="stats-banner-label">Total Transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE STATS ─── */}
      <section className="stats-section" id="stats">
        <div className="landing-container">
          <div className="stats-banner">
            <div className="stats-banner-item">
              <BarChart3 size={28} />
              <div className="stats-banner-value">$<Counter end={125} suffix="M" /></div>
              <div className="stats-banner-label">Total Payouts</div>
            </div>
            <div className="stats-banner-item">
              <Users size={28} />
              <div className="stats-banner-value"><Counter end={52400} /></div>
              <div className="stats-banner-label">Registered Users</div>
            </div>
            <div className="stats-banner-item">
              <Cpu size={28} />
              <div className="stats-banner-value"><Counter end={8750} /></div>
              <div className="stats-banner-label">Active Mining Contracts</div>
            </div>
            <div className="stats-banner-item">
              <Clock size={28} />
              <div className="stats-banner-value"><Counter end={1095} /> days</div>
              <div className="stats-banner-label">Online Since 2023</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials-section" id="testimonials">
        <div className="landing-container">
          <div className="section-intro">
            <span className="section-tag"><Star size={14} /> Testimonials</span>
            <h2 className="section-title">What Our <span className="gradient-text">Miners Say</span></h2>
            <p className="section-desc">Join thousands of satisfied miners from around the world.</p>
          </div>

          <div className="testimonials-grid">
            {allTestimonials.slice(0, 6).map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="stars">{Array(t.stars).fill(0).map((_, j) => <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />)}</div>
                <p>"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.country}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/reviews" className="btn btn-secondary btn-lg">View All Reviews <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="landing-container cta-inner">
          <div className="cta-orb" />
          <h2>Ready to Start Mining?</h2>
          <p>Join 50,000+ miners earning passive income every day. No hardware. No hassle. Just profits.</p>
          <Link to="/register" className="btn btn-primary btn-lg hero-btn-glow">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="landing-footer">
        <div className="landing-container footer-inner">
          <div className="footer-brand">
            <div className="nav-brand" style={{ marginBottom: 12 }}>
              <div className="brand-icon-lg">⛏</div>
              <span className="brand-text-lg">MineVertex</span>
            </div>
            <p>Enterprise-grade cloud mining platform trusted by miners worldwide since 2023.</p>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#plans">Mining Plans</a>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/api-docs">API Docs</Link>
            <Link to="/status">Status Page</Link>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/refund-policy">Refund Policy</Link>
            <Link to="/aml-policy">AML Policy</Link>
          </div>
        </div>
        <div className="footer-bottom landing-container">
          <p>© 2023-2026 MineVertex. All rights reserved.</p>
          <div className="footer-cryptos">
            {['BTC', 'ETH', 'USDT', 'LTC', 'BNB', 'SOL'].map(c => (
              <span key={c} className="footer-crypto-badge">{c}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        .payouts-section { padding: 80px 0; background: var(--bg-secondary); }
        @media (max-width: 768px) {
          .payouts-section > div > div[style] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
