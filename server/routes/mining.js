import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { sendAdminNotification, sendUserNotification } from '../services/email.js'

const router = Router()

// Get all active plans (public)
router.get('/plans', async (req, res) => {
  try {
    const plans = await req.prisma.miningPlan.findMany({ where: { isActive: true }, orderBy: { minDeposit: 'asc' } })
    res.json(plans)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Purchase a plan (auth required)
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    const { planId, amount, cryptoType } = req.body
    const plan = await req.prisma.miningPlan.findUnique({ where: { id: planId } })
    if (!plan || !plan.isActive) return res.status(400).json({ error: 'Plan not found' })
    const parsedAmount = parseFloat(amount)
    if (parsedAmount < plan.minDeposit || parsedAmount > plan.maxDeposit) {
      return res.status(400).json({ error: `Amount must be between ${plan.minDeposit} and ${plan.maxDeposit}` })
    }

    const user = await req.prisma.user.findUnique({ where: { id: req.userId } })
    const balanceField = `balance${cryptoType}`
    if ((user[balanceField] || 0) < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    const dailyEarning = parsedAmount * (plan.dailyROI / 100)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.durationDays)

    const [mining] = await req.prisma.$transaction([
      req.prisma.userMining.create({
        data: {
          userId: req.userId, planId, investedAmount: parsedAmount, cryptoType,
          dailyEarning, endDate
        }
      }),
      req.prisma.user.update({
        where: { id: req.userId },
        data: { [balanceField]: { decrement: parsedAmount } }
      })
    ])

    await sendAdminNotification('New Mining Contract', `
      <p>A user has purchased a new mining plan.</p>
      <ul>
        <li><strong>User:</strong> ${user.email}</li>
        <li><strong>Plan:</strong> ${plan.name}</li>
        <li><strong>Invested:</strong> ${parsedAmount} ${cryptoType}</li>
      </ul>
    `)

    await sendUserNotification(user.email, 'Mining Contract Started', `
      <h3>Your mining contract is now active!</h3>
      <p>You have successfully invested <strong>${parsedAmount} ${cryptoType}</strong> in the <strong>${plan.name}</strong> plan.</p>
      <p>You will earn <strong>${dailyEarning.toFixed(6)} ${cryptoType}</strong> per day.</p>
    `)

    res.json(mining)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// Get user's minings
router.get('/my-minings', authMiddleware, async (req, res) => {
  try {
    const minings = await req.prisma.userMining.findMany({
      where: { userId: req.userId }, include: { plan: true }, orderBy: { createdAt: 'desc' }
    })
    res.json(minings)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
