import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import { accrueAllMinings } from '../services/miningAccrual.js'
import { sendUserNotification } from '../services/email.js'

const router = Router()
router.use(authMiddleware, adminMiddleware)

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await req.prisma.user.count({ where: { role: 'USER' } })
    const totalDeposits = await req.prisma.deposit.aggregate({ _sum: { amount: true } })
    const activeMinings = await req.prisma.userMining.count({ where: { status: 'ACTIVE' } })
    const pendingDeposits = await req.prisma.deposit.count({ where: { status: 'PENDING' } })
    const pendingWithdrawals = await req.prisma.withdrawal.count({ where: { status: 'PENDING' } })
    const recentUsers = await req.prisma.user.findMany({
      where: { role: 'USER' }, orderBy: { createdAt: 'desc' }, take: 5,
      select: { id: true, email: true, fullName: true, createdAt: true }
    })
    res.json({ totalUsers, totalDeposits: totalDeposits._sum.amount || 0, activeMinings, pendingDeposits, pendingWithdrawals, recentUsers })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// List all users
router.get('/users', async (req, res) => {
  try {
    const users = await req.prisma.user.findMany({
      where: { role: 'USER' }, orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, fullName: true, isActive: true, createdAt: true,
        balanceBTC: true, balanceETH: true, balanceUSDT: true, balanceLTC: true, balanceBNB: true, balanceSOL: true,
        totalEarned: true, totalDeposited: true, totalWithdrawn: true,
        _count: { select: { userMinings: { where: { status: 'ACTIVE' } } } }
      }
    })
    res.json(users)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Ban/unban user
router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({ where: { id: req.params.id } })
    const updated = await req.prisma.user.update({
      where: { id: req.params.id }, data: { isActive: !user.isActive }
    })
    res.json(updated)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// All deposits
router.get('/deposits', async (req, res) => {
  try {
    const deposits = await req.prisma.deposit.findMany({
      orderBy: { createdAt: 'desc' }, include: { user: { select: { email: true, fullName: true } } }
    })
    res.json(deposits)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Approve/reject deposit
router.put('/deposits/:id', async (req, res) => {
  try {
    const { status } = req.body
    const deposit = await req.prisma.deposit.findUnique({ where: { id: req.params.id } })
    if (!deposit) return res.status(404).json({ error: 'Not found' })

    const updated = await req.prisma.deposit.update({ where: { id: req.params.id }, data: { status } })

    if (status === 'CONFIRMED') {
      const balanceField = `balance${deposit.cryptoType}`
      await req.prisma.user.update({
        where: { id: deposit.userId },
        data: { [balanceField]: { increment: deposit.amount }, totalDeposited: { increment: deposit.amount } }
      })
      // Referral bonus
      const referral = await req.prisma.referral.findUnique({ where: { referredId: deposit.userId } })
      if (referral) {
        const bonus = deposit.amount * 0.05
        await req.prisma.user.update({
          where: { id: referral.referrerId },
          data: { balanceUSDT: { increment: bonus }, totalEarned: { increment: bonus } }
        })
        await req.prisma.referral.update({ where: { id: referral.id }, data: { bonusEarned: { increment: bonus } } })
      }
    }

    const user = await req.prisma.user.findUnique({ where: { id: deposit.userId } })
    await sendUserNotification(user.email, `Deposit ${status}`, `
      <h3>Deposit Update</h3>
      <p>Your deposit of <strong>${deposit.amount} ${deposit.cryptoType}</strong> has been <strong>${status}</strong> by the admin.</p>
    `)

    res.json(updated)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// All withdrawals
router.get('/withdrawals', async (req, res) => {
  try {
    const withdrawals = await req.prisma.withdrawal.findMany({
      orderBy: { createdAt: 'desc' }, include: { user: { select: { email: true, fullName: true } } }
    })
    res.json(withdrawals)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Approve/reject withdrawal
router.put('/withdrawals/:id', async (req, res) => {
  try {
    const { status } = req.body
    const withdrawal = await req.prisma.withdrawal.findUnique({ where: { id: req.params.id } })
    if (status === 'REJECTED') {
      const balanceField = `balance${withdrawal.cryptoType}`
      await req.prisma.user.update({
        where: { id: withdrawal.userId },
        data: { [balanceField]: { increment: withdrawal.amount } }
      })
    }
    if (status === 'COMPLETED') {
      await req.prisma.user.update({
        where: { id: withdrawal.userId },
        data: { totalWithdrawn: { increment: withdrawal.amount } }
      })
    }
    const updated = await req.prisma.withdrawal.update({ where: { id: req.params.id }, data: { status } })

    const user = await req.prisma.user.findUnique({ where: { id: withdrawal.userId } })
    await sendUserNotification(user.email, `Withdrawal ${status}`, `
      <h3>Withdrawal Update</h3>
      <p>Your withdrawal request for <strong>${withdrawal.amount} ${withdrawal.cryptoType}</strong> has been <strong>${status}</strong> by the admin.</p>
    `)

    res.json(updated)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// CRUD mining plans
router.get('/plans', async (req, res) => {
  try { res.json(await req.prisma.miningPlan.findMany({ orderBy: { minDeposit: 'asc' } })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/plans', async (req, res) => {
  try { res.json(await req.prisma.miningPlan.create({ data: req.body })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.put('/plans/:id', async (req, res) => {
  try { res.json(await req.prisma.miningPlan.update({ where: { id: req.params.id }, data: req.body })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

// Minings
router.get('/minings', async (req, res) => {
  try {
    const minings = await req.prisma.userMining.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, fullName: true } },
        plan: { select: { name: true } }
      }
    })
    res.json(minings)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/minings/accrue-all', async (req, res) => {
  try {
    await accrueAllMinings(req.prisma)
    res.json({ message: 'Successfully accrued all active minings' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Settings
router.get('/settings', async (req, res) => {
  try { res.json(await req.prisma.adminSetting.findMany()) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.put('/settings', async (req, res) => {
  try {
    const { settings } = req.body
    for (const s of settings) {
      await req.prisma.adminSetting.upsert({
        where: { key: s.key }, create: { key: s.key, value: s.value, description: s.description },
        update: { value: s.value }
      })
    }
    res.json(await req.prisma.adminSetting.findMany())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
