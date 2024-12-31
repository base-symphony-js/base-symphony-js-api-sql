import { PrismaService } from '@services'
import { CustomError } from '@common'

export const verifyOtp = async (
  prisma: PrismaService,
  email: string,
  otp: string,
) => {
  // Verify otp
  const otpEntry = await prisma.otps.findFirst({
    where: {
      email,
      otp,
      expiresAt: {
        gte: new Date(),
      },
    },
  })
  if (!otpEntry) throw CustomError('AUTH_OTP_INVALID_OR_EXPIRED', 400)

  return otpEntry
}
