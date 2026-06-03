import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendResetEmail } from '../services/email.js'

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

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const user = await req.prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Don't leak whether user exists
      return res.json({ message: 'If the email exists, a reset link has been sent.' })
    }

    // Create a one-time link valid for 15 minutes. We use the current password hash in the secret so it invalidates once changed.
    const secret = process.env.JWT_SECRET + user.password
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '15m' })
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}&id=${user.id}`

    await sendResetEmail(user.email, resetLink)
    res.json({ message: 'If the email exists, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { id, token, password } = req.body
    if (!id || !token || !password) return res.status(400).json({ error: 'Invalid request' })

    const user = await req.prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(400).json({ error: 'Invalid or expired link' })

    const secret = process.env.JWT_SECRET + user.password
    try {
      jwt.verify(token, secret)
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired link' })
    }

    const hashed = await bcrypt.hash(password, 10)
    await req.prisma.user.update({
      where: { id },
      data: { password: hashed }
    })

    res.json({ message: 'Password has been successfully reset' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
