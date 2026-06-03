import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import depositRoutes from './routes/deposits.js'
import withdrawalRoutes from './routes/withdrawals.js'
import miningRoutes from './routes/mining.js'
import adminRoutes from './routes/admin.js'
import publicRoutes from './routes/public.js'
import { accrueAllMinings } from './services/miningAccrual.js'
import cron from 'node-cron'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Make prisma available to routes
app.use((req, res, next) => {
  req.prisma = prisma
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/deposits', depositRoutes)
app.use('/api/withdrawals', withdrawalRoutes)
app.use('/api/mining', miningRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/public', publicRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Mining accrual cron - runs every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('[CRON] Accruing mining earnings...')
  await accrueAllMinings(prisma)
})

// Initial accrual on startup
accrueAllMinings(prisma).then(() => console.log('[STARTUP] Mining accrual complete'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
