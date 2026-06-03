import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database...')

  // Create Admin
  const adminPassword = await bcrypt.hash('Admin@2026!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@minevertex.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@minevertex.com',
      password: adminPassword,
      fullName: 'Super Admin',
      role: 'ADMIN',
      referralCode: 'ADMIN001'
    }
  })
  console.log('✅ Admin created:', admin.email)

  // Create Mining Plans
  const plans = [
    { name: 'Starter', description: 'Perfect for beginners', hashRate: '50 TH/s', dailyROI: 1.5, totalROI: 45, durationDays: 30, minDeposit: 50, maxDeposit: 999, cryptoType: 'USDT', tier: 'starter' },
    { name: 'Professional', description: 'Most popular choice', hashRate: '200 TH/s', dailyROI: 2.2, totalROI: 66, durationDays: 30, minDeposit: 1000, maxDeposit: 9999, cryptoType: 'USDT', tier: 'professional' },
    { name: 'Enterprise', description: 'For serious investors', hashRate: '500 TH/s', dailyROI: 3.0, totalROI: 90, durationDays: 30, minDeposit: 10000, maxDeposit: 49999, cryptoType: 'USDT', tier: 'enterprise' },
    { name: 'VIP Elite', description: 'Maximum returns', hashRate: '1 PH/s', dailyROI: 4.0, totalROI: 120, durationDays: 30, minDeposit: 50000, maxDeposit: 500000, cryptoType: 'USDT', tier: 'vip' },
  ]

  for (const plan of plans) {
    await prisma.miningPlan.upsert({
      where: { id: plan.name.toLowerCase().replace(/\s/g, '-') },
      update: plan,
      create: { ...plan, id: plan.name.toLowerCase().replace(/\s/g, '-') }
    })
  }
  console.log('✅ Mining plans created')

  // Create default admin settings
  const settings = [
    { key: 'wallet_BTC', value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', description: 'BTC wallet address' },
    { key: 'wallet_ETH', value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', description: 'ETH wallet address' },
    { key: 'wallet_USDT', value: 'TN2Y3mFk7pcV8xGPb2K3Fv6wR8XjmWDZ3Q', description: 'USDT (TRC-20) wallet address' },
    { key: 'wallet_LTC', value: 'ltc1qnf8pzqe6f5mc6s9xwrfhk8a2k3mtqyd5w', description: 'LTC wallet address' },
    { key: 'wallet_BNB', value: '0xb794f5ea0ba39494ce839613fffba74279579268', description: 'BNB (BSC) wallet address' },
    { key: 'wallet_SOL', value: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV', description: 'SOL wallet address' },
    { key: 'min_deposit', value: '10', description: 'Minimum deposit in USD' },
    { key: 'min_withdrawal', value: '20', description: 'Minimum withdrawal in USD' },
    { key: 'withdrawal_fee', value: '2', description: 'Withdrawal fee percentage' },
    { key: 'referral_bonus', value: '5', description: 'Referral bonus percentage' },
  ]

  for (const s of settings) {
    await prisma.adminSetting.upsert({
      where: { key: s.key }, update: { value: s.value }, create: s
    })
  }
  console.log('✅ Admin settings created')

  console.log('\n🎉 Seeding complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Admin Credentials:')
  console.log('  Email:    admin@minevertex.com')
  console.log('  Password: Admin@2026!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

seed()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
