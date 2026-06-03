import { Link } from 'react-router-dom'
import { ArrowLeft, Star, ArrowRight } from 'lucide-react'

const reviews = [
  { name: 'James W.', role: 'Investor', country: '🇺🇸', text: 'MineVertex has completely changed my passive income strategy. Consistent returns every single day. I started with $500 and now running $15,000 in multiple plans.', stars: 5, plan: 'Enterprise', joined: 'Jan 2024' },
  { name: 'Maria K.', role: 'Trader', country: '🇩🇪', text: "The platform is incredibly user-friendly. I started mining within minutes of signing up. The UI is clean and professional — better than any competitor I've tried.", stars: 5, plan: 'Professional', joined: 'Mar 2024' },
  { name: 'David L.', role: 'Business Owner', country: '🇬🇧', text: 'Enterprise plan delivers exactly as promised. The dedicated manager answers my questions within minutes. Best investment for my company funds.', stars: 5, plan: 'Enterprise', joined: 'Nov 2023' },
  { name: 'Sarah M.', role: 'Software Engineer', country: '🇨🇦', text: "I've tried 5 different mining platforms. MineVertex is the only one with real, consistent payouts. The blockchain verification is what sets them apart.", stars: 5, plan: 'Professional', joined: 'Feb 2024' },
  { name: 'Ahmed R.', role: 'Freelancer', country: '🇦🇪', text: "Earning $200/day passively while I focus on my main work. This platform has given me financial freedom I never thought possible.", stars: 5, plan: 'VIP Elite', joined: 'Dec 2023' },
  { name: 'Liu Wei', role: 'Financial Analyst', country: '🇸🇬', text: "The transparency is what sold me. Every payout is verifiable on the blockchain. No other platform offers this level of proof.", stars: 5, plan: 'Enterprise', joined: 'Apr 2024' },
  { name: 'Elena P.', role: 'Entrepreneur', country: '🇫🇷', text: "Started with Starter plan to test, now running full Enterprise. Returns compounded beautifully over 6 months. My best decision in 2024.", stars: 5, plan: 'Enterprise', joined: 'Jan 2024' },
  { name: 'Michael T.', role: 'Retired Teacher', country: '🇦🇺', text: "Finally a platform I can trust for retirement income. 8 months and counting with zero issues. Withdrawals always arrive within hours.", stars: 5, plan: 'Professional', joined: 'Oct 2023' },
  { name: 'Olga S.', role: 'Teacher', country: '🇵🇱', text: "Even with a small investment of $50, the returns are impressive. The referral program earned me an extra $800 just from sharing with colleagues!", stars: 5, plan: 'Starter', joined: 'May 2024' },
  { name: 'Carlos R.', role: 'Full-Stack Developer', country: '🇧🇷', text: "Clean UI, fast withdrawals, transparent blockchain proofs. As a developer, I can appreciate the technical excellence of this platform.", stars: 5, plan: 'Professional', joined: 'Mar 2024' },
  { name: 'Aisha N.', role: 'Marketing Student', country: '🇳🇬', text: "Referred 15 friends and earned over $3,000 in referral commissions alone. The 5% referral bonus is incredibly generous!", stars: 5, plan: 'Starter', joined: 'Apr 2024' },
  { name: 'Tomo H.', role: 'Day Trader', country: '🇯🇵', text: "Mining runs 24/7 even when I sleep. My daily ROI has been incredibly consistent for 4 months now. No surprises, just profits.", stars: 5, plan: 'Professional', joined: 'Feb 2024' },
  { name: 'Isabella F.', role: 'Accountant', country: '🇮🇹', text: "As an accountant, I appreciate the detailed transaction history and earnings breakdown. Makes my tax reporting so much easier.", stars: 5, plan: 'Enterprise', joined: 'Jan 2024' },
  { name: 'Kwame A.', role: 'Entrepreneur', country: '🇬🇭', text: "This platform has transformed my financial situation. Started with just $100, reinvested profits, now earning over $50/day.", stars: 5, plan: 'Professional', joined: 'Dec 2023' },
  { name: 'Natasha V.', role: 'Graphic Designer', country: '🇷🇺', text: "Beautiful interface, reliable returns, excellent customer support. I recommend MineVertex to everyone looking for passive income.", stars: 5, plan: 'Starter', joined: 'May 2024' },
  { name: 'Robert C.', role: 'Real Estate Agent', country: '🇺🇸', text: "Diversifying into crypto mining was my best move. MineVertex makes it effortless. The VIP plan returns are phenomenal.", stars: 5, plan: 'VIP Elite', joined: 'Nov 2023' },
  { name: 'Priya S.', role: 'Doctor', country: '🇮🇳', text: "I don't have time to actively trade. MineVertex runs in the background and I just check my growing balance daily. Perfect for busy professionals.", stars: 5, plan: 'Enterprise', joined: 'Mar 2024' },
  { name: 'Diego M.', role: 'Chef', country: '🇲🇽', text: "Simple, reliable, profitable. Three words that describe MineVertex perfectly. 6 months in and every withdrawal has been processed within hours.", stars: 5, plan: 'Professional', joined: 'Dec 2023' },
  { name: 'Sophie L.', role: 'Nurse', country: '🇳🇱', text: "I was skeptical at first but tried the Starter plan. After seeing consistent returns for a month, I upgraded immediately. No regrets!", stars: 5, plan: 'Enterprise', joined: 'Feb 2024' },
  { name: 'Yusuf K.', role: 'Student', country: '🇹🇷', text: "Even as a student with limited funds, I'm earning passive income daily. The $50 minimum makes it accessible to everyone.", stars: 5, plan: 'Starter', joined: 'Apr 2024' },
  { name: 'Fatima Z.', role: 'Pharmacist', country: '🇲🇦', text: "I was looking for a way to grow my savings without the volatility of trading. MineVertex is exactly what I needed — steady, predictable returns.", stars: 5, plan: 'Professional', joined: 'Jan 2024' },
  { name: 'Viktor B.', role: 'Mechanical Engineer', country: '🇺🇦', text: "The engineering behind this platform is solid. 99.9% uptime is not just marketing — I've been monitoring and it's real.", stars: 5, plan: 'Enterprise', joined: 'Nov 2023' },
  { name: 'Anna W.', role: 'Photographer', country: '🇸🇪', text: "I love that I can fund my creative projects with passive mining income. Set it and forget it, then check back to a bigger balance.", stars: 5, plan: 'Starter', joined: 'May 2024' },
  { name: 'Kofi M.', role: 'Uber Driver', country: '🇬🇭', text: "Between rides, I check my MineVertex dashboard and smile. My mining earns more than some of my driving days. Game changer.", stars: 5, plan: 'Professional', joined: 'Mar 2024' },
  { name: 'Chen Li', role: 'Data Scientist', country: '🇨🇳', text: "I analyzed the payout patterns statistically. Returns are consistent within 0.1% variance daily. Impressive operational stability.", stars: 5, plan: 'Enterprise', joined: 'Feb 2024' },
  { name: 'Grace O.', role: 'Lawyer', country: '🇰🇪', text: "Reviewed their terms and policies thoroughly. Everything is transparent and well-documented. Trustworthy platform.", stars: 5, plan: 'Enterprise', joined: 'Dec 2023' },
  { name: 'Raj P.', role: 'IT Manager', country: '🇮🇳', text: "Deployed $5,000 across Professional and Enterprise plans. Returns have been clockwork. My team at work is now signing up too.", stars: 5, plan: 'Enterprise', joined: 'Jan 2024' },
  { name: 'Linda J.', role: 'Stay-at-Home Mom', country: '🇺🇸', text: "Started mining as a side income experiment. Now it covers our grocery bill every month. My husband is impressed!", stars: 5, plan: 'Starter', joined: 'Apr 2024' },
  { name: 'Oscar T.', role: 'Pilot', country: '🇪🇸', text: "I'm away flying for days at a time. With MineVertex, my money works while I work. Came back from a 5-day trip to $800 in earnings.", stars: 5, plan: 'VIP Elite', joined: 'Oct 2023' },
  { name: 'Mei Lin', role: 'Fashion Designer', country: '🇹🇼', text: "The sleek design of the platform caught my eye first. The consistent profits kept me. Now 4 months in with zero complaints.", stars: 5, plan: 'Professional', joined: 'Feb 2024' },
  { name: 'Hassan B.', role: 'Import/Export', country: '🇸🇦', text: "I compare MineVertex to my traditional investments. The ROI here outperforms most of my stock portfolio. Seriously considering increasing my allocation.", stars: 5, plan: 'VIP Elite', joined: 'Nov 2023' },
  { name: 'Patricia M.', role: 'Professor', country: '🇵🇹', text: "As an economics professor, I was naturally skeptical. The math checks out, the blockchain verifications check out. I'm convinced.", stars: 5, plan: 'Enterprise', joined: 'Jan 2024' },
  { name: 'Felix N.', role: 'Electrician', country: '🇩🇪', text: "Don't need to understand crypto deeply. Just deposit, pick a plan, earn daily. The simplicity is what makes MineVertex special.", stars: 5, plan: 'Starter', joined: 'May 2024' },
  { name: 'Zara A.', role: 'Content Creator', country: '🇬🇧', text: "Made a video about my MineVertex experience. My followers signed up through my referral link and I earned over $2,000 in bonuses!", stars: 5, plan: 'Professional', joined: 'Mar 2024' },
  { name: 'Thomas R.', role: 'Dentist', country: '🇨🇭', text: "Swiss quality standards in crypto mining. Every franc I've invested has returned exactly as projected. Precision I appreciate.", stars: 5, plan: 'Enterprise', joined: 'Dec 2023' },
  { name: 'Amara D.', role: 'NGO Worker', country: '🇸🇳', text: "Mining income supplements my modest salary. It's allowed me to save for my children's education. Truly grateful.", stars: 5, plan: 'Starter', joined: 'Apr 2024' },
  { name: 'Kevin O.', role: 'Sports Coach', country: '🇮🇪', text: "I tell my athletes about discipline and consistency. MineVertex embodies both. Steady returns, no drama, no volatility.", stars: 5, plan: 'Professional', joined: 'Feb 2024' },
  { name: 'Lena K.', role: 'Architect', country: '🇫🇮', text: "The platform's architecture is as solid as the buildings I design. Clean structure, robust foundation, beautiful execution.", stars: 5, plan: 'Enterprise', joined: 'Jan 2024' },
  { name: 'Jorge S.', role: 'Musician', country: '🇦🇷', text: "Between gigs, my crypto mines. Came back from a tour to find $3,500 in earnings waiting. Best financial instrument for creatives.", stars: 5, plan: 'Professional', joined: 'Nov 2023' },
  { name: 'Ruth W.', role: 'Retired Banker', country: '🇿🇦', text: "30 years in banking taught me to spot scams. MineVertex is legitimate — verifiable payouts, transparent operations, real infrastructure.", stars: 5, plan: 'VIP Elite', joined: 'Oct 2023' },
  { name: 'Dmitri V.', role: 'Game Developer', country: '🇷🇺', text: "The dashboard feels like a well-designed game — satisfying to watch numbers go up. Except this is real money. Love it.", stars: 5, plan: 'Professional', joined: 'Mar 2024' },
  { name: 'Nadia H.', role: 'Journalist', country: '🇪🇬', text: "I investigated MineVertex before investing. Interviewed other users, verified blockchain transactions. The real deal.", stars: 5, plan: 'Enterprise', joined: 'Feb 2024' },
  { name: 'Peter G.', role: 'Farmer', country: '🇳🇿', text: "Out in the fields all day, my crypto mines in the cloud. Simple concept, real results. Already recommended to my entire farming community.", stars: 5, plan: 'Starter', joined: 'May 2024' },
  { name: 'Sakura T.', role: 'Translator', country: '🇯🇵', text: "The platform supports multiple languages which I appreciate. Returns are consistent regardless of market conditions. Very impressed.", stars: 5, plan: 'Professional', joined: 'Apr 2024' },
  { name: 'Emmanuel O.', role: 'Pastor', country: '🇳🇬', text: "I shared MineVertex with my congregation members who were looking for legitimate income sources. 40 people signed up and all are earning daily.", stars: 5, plan: 'Professional', joined: 'Jan 2024' },
  { name: 'Christine B.', role: 'Veterinarian', country: '🇧🇪', text: "Taking care of animals is my passion, not finance. MineVertex takes care of the finance part for me. Simple, effective, reliable.", stars: 5, plan: 'Starter', joined: 'Mar 2024' },
  { name: 'Ali M.', role: 'Taxi Driver', country: '🇵🇰', text: "My brother introduced me. Started with just $50 and now I've grown it to over $2,000 through consistent reinvesting. Life-changing platform.", stars: 5, plan: 'Professional', joined: 'Dec 2023' },
  { name: 'Eva R.', role: 'Yoga Instructor', country: '🇨🇷', text: "Financial peace of mind lets me focus on what I love. MineVertex provides that peace. My passive income now exceeds my teaching income.", stars: 5, plan: 'Enterprise', joined: 'Feb 2024' },
  { name: 'Samuel K.', role: 'Security Guard', country: '🇺🇬', text: "During my night shifts, I watch my MineVertex earnings tick up. It's motivating to see money working for you around the clock.", stars: 5, plan: 'Starter', joined: 'Apr 2024' },
  { name: 'Monica L.', role: 'HR Manager', country: '🇨🇴', text: "I've onboarded 25 people at my workplace onto MineVertex through the referral program. Everyone is happy. I've earned $4,500 in referral bonuses.", stars: 5, plan: 'Enterprise', joined: 'Nov 2023' },
]

export default function Reviews() {
  return (
    <div className="landing-page">
      <div className="landing-container" style={{ paddingTop: 100, paddingBottom: 80 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.88rem', marginBottom: 32 }}><ArrowLeft size={16} /> Back to Home</Link>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 8 }}>Miner Reviews</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 600, margin: '0 auto' }}>Real feedback from {reviews.length} verified miners worldwide. Join our growing community of satisfied investors.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            {Array(5).fill(0).map((_, i) => <Star key={i} size={22} fill="#f59e0b" color="#f59e0b" />)}
            <span style={{ fontWeight: 700, fontSize: '1.1rem', marginLeft: 8 }}>4.9/5</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>({reviews.length} reviews)</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 24, transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {Array(r.stars).fill(0).map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 16 }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{r.country}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.role}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{r.plan}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Since {r.joined}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/register" className="btn btn-primary btn-lg">Start Mining Today <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  )
}
