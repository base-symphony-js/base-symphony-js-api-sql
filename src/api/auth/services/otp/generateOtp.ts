import { PrismaService } from '@services'
import { CustomError, generateOTPCrypto } from '@common'

export const generateOtp = async (prisma: PrismaService, email: string) => {
  // Generate otp
  const newOtp = generateOTPCrypto()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 5)
  const otpEntry = await prisma.otps.create({
    data: { email, otp: newOtp, expiresAt },
  })

  return otpEntry
}

export const generateOtpInternalUser = async (
  prisma: PrismaService,
  email: string,
) => {
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) throw CustomError('AUTH_ACCOUNT_NOT_FOUND', 404)
  if (!user.state) throw CustomError('AUTH_ACCOUNT_DISABLED', 400)

  // Generate otp
  const newOtp = generateOTPCrypto()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 5)
  const otpEntry = await prisma.otps.create({
    data: { email, otp: newOtp, expiresAt },
  })

  return { newOtp: otpEntry, user }
}

export const generateOtpExternalUser = async (
  prisma: PrismaService,
  email: string,
) => {
  const user = await prisma.users.findUnique({ where: { email } })
  if (user) throw CustomError('AUTH_ACCOUNT_ALREADY_EXISTS', 409)

  // Generate otp
  const newOtp = generateOTPCrypto()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 5)
  const otpEntry = await prisma.otps.create({
    data: { email, otp: newOtp, expiresAt },
  })

  return otpEntry
}
