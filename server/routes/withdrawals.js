import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { sendAdminNotification } from '../services/email.js'

const router = Router()
router.use(authMiddleware)

// Create withdrawal
router.post('/', async (req, res) => {
  try {
    const { amount, cryptoType, walletAddress } = req.body
    if (!amount || !cryptoType || !walletAddress) return res.status(400).json({ error: 'All fields required' })
    const user = await req.prisma.user.findUnique({ where: { id: req.userId } })
    const balanceField = `balance${cryptoType}`
    if ((user[balanceField] || 0) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }
    const withdrawal = await req.prisma.withdrawal.create({
      data: { userId: req.userId, amount: parseFloat(amount), cryptoType, walletAddress }
    })
    // Deduct balance immediately
    await req.prisma.user.update({
      where: { id: req.userId },
      data: { [balanceField]: { decrement: parseFloat(amount) } }
    })
    res.json(withdrawal)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// List user withdrawals
router.get('/', async (req, res) => {
  try {
    const withdrawals = await req.prisma.withdrawal.findMany({
      where: { userId: req.userId }, orderBy: { createdAt: 'desc' }
    })
    res.json(withdrawals)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
