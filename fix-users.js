import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fix() {
  console.log('Fixing existing users to be verified...')
  try {
    const res = await prisma.user.updateMany({
      data: { isVerified: true }
    })
    console.log(`✅ Successfully verified ${res.count} existing users!`)
  } catch (err) {
    console.error('❌ Failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

fix()
