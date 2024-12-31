import { PrismaService } from '@services'

export const destroyOtp = async (
  prisma: PrismaService,
  email: string,
  otp: string,
) => {
  // Delete otp
  await prisma.otps.deleteMany({
    where: { email, otp },
  })
}
