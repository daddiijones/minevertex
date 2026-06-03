import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, referralCode } = req.body
    if (!email || !password || !fullName) return res.status(400).json({ error: 'All fields required' })

    const existing = await req.prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await req.prisma.user.create({
      data: { email, password: hashed, fullName }
    })

    // Handle referral
    if (referralCode) {
      const referrer = await req.prisma.user.findUnique({ where: { referralCode } })
      if (referrer) {
        await req.prisma.referral.create({
          data: { referrerId: referrer.id, referredId: user.id }
        })
      }
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const { password: _, ...userData } = user
    res.json({ user: userData, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await req.prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' })
    if (!user.isActive) return res.status(403).json({ error: 'Account suspended' })

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const { password: _, ...userData } = user
    res.json({ user: userData, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
