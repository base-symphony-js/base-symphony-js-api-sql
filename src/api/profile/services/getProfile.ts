import { PrismaService } from '@services'
import { CustomError } from '@common'

export const getProfile = async (prisma: PrismaService, email: string) => {
  // Get user
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      photo: true,
      state: true,
    },
  })
  if (!user) throw CustomError('PROFILE_NOT_FOUND', 404)

  return user
}
