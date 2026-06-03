import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { accrueUserMinings } from '../services/miningAccrual.js'

const router = Router()
router.use(authMiddleware)

// Get current user profile + accrued earnings
router.get('/me', async (req, res) => {
  try {
    await accrueUserMinings(req.prisma, req.userId)
    const user = await req.prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true, email: true, fullName: true, role: true,
        balanceBTC: true, balanceETH: true, balanceUSDT: true,
        balanceLTC: true, balanceBNB: true, balanceSOL: true,
        referralCode: true, totalEarned: true, totalDeposited: true,
        totalWithdrawn: true, isActive: true, createdAt: true
      }
    })
    res.json(user)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    await accrueUserMinings(req.prisma, req.userId)
    const user = await req.prisma.user.findUnique({ where: { id: req.userId } })
    const activeMinings = await req.prisma.userMining.count({ where: { userId: req.userId, status: 'ACTIVE' } })
    const recentDeposits = await req.prisma.deposit.findMany({
      where: { userId: req.userId }, orderBy: { createdAt: 'desc' }, take: 10
    })
    const recentWithdrawals = await req.prisma.withdrawal.findMany({
      where: { userId: req.userId }, orderBy: { createdAt: 'desc' }, take: 10
    })
    const recentMinings = await req.prisma.userMining.findMany({
      where: { userId: req.userId }, orderBy: { createdAt: 'desc' }, take: 10, include: { plan: true }
    })
    res.json({ user, activeMinings, recentDeposits, recentWithdrawals, recentMinings })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Full transaction history - unified view of all credits and debits
router.get('/transactions', async (req, res) => {
  try {
    const deposits = await req.prisma.deposit.findMany({
      where: { userId: req.userId }, orderBy: { createdAt: 'desc' }
    })
    const withdrawals = await req.prisma.withdrawal.findMany({
      where: { userId: req.userId }, orderBy: { createdAt: 'desc' }
    })
    const minings = await req.prisma.userMining.findMany({
      where: { userId: req.userId }, orderBy: { createdAt: 'desc' }, include: { plan: true }
    })

    // Build unified transaction list
    const transactions = [
      ...deposits.map(d => ({
        id: d.id, type: 'deposit', direction: 'credit',
        label: `Deposit (${d.cryptoType})`, amount: d.amount,
        cryptoType: d.cryptoType, status: d.status,
        detail: d.txHash ? `TX: ${d.txHash.substring(0, 16)}...` : '',
        createdAt: d.createdAt
      })),
      ...withdrawals.map(w => ({
        id: w.id, type: 'withdrawal', direction: 'debit',
        label: `Withdrawal (${w.cryptoType})`, amount: w.amount,
        cryptoType: w.cryptoType, status: w.status,
        detail: w.walletAddress ? `To: ${w.walletAddress.substring(0, 16)}...` : '',
        createdAt: w.createdAt
      })),
      ...minings.map(m => ({
        id: m.id, type: 'mining', direction: 'debit',
        label: `Mining Plan: ${m.plan?.name || 'Plan'}`, amount: m.investedAmount,
        cryptoType: m.cryptoType, status: m.status,
        detail: `${m.plan?.hashRate} • ${m.plan?.dailyROI}% daily`,
        createdAt: m.createdAt
      })),
      ...minings.filter(m => m.totalEarned > 0).map(m => ({
        id: `${m.id}-earn`, type: 'mining-earning', direction: 'credit',
        label: `Mining Earning: ${m.plan?.name || 'Plan'}`, amount: m.totalEarned,
        cryptoType: m.cryptoType, status: m.status === 'ACTIVE' ? 'ACCRUING' : 'COMPLETED',
        detail: `Earned so far from ${m.plan?.hashRate}`,
        createdAt: m.updatedAt
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(transactions)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const { fullName } = req.body
    const user = await req.prisma.user.update({
      where: { id: req.userId }, data: { fullName },
      select: { id: true, email: true, fullName: true, role: true }
    })
    res.json(user)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
