import { PrismaService } from '@services'
import { CustomError } from '@common'

export const updateEmail = async (
  prisma: PrismaService,
  userId: number,
  newEmail: string,
) => {
  // Verify user
  const user = await prisma.users.findUnique({
    where: { id: userId },
  })
  if (user == null) throw CustomError('PROFILE_NOT_FOUND', 404)

  // Verify used email
  const anotherUser = await prisma.users.findUnique({
    where: { email: newEmail },
  })
  if (anotherUser != null)
    throw CustomError('PROFILE_EMAIL_ALREADY_EXISTS', 409)

  // Update email
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      email: newEmail ?? user.email,
      updatedAt: new Date(),
      updatedById: userId,
      passwordVersion: user.passwordVersion + 1,
    },
  })

  return updatedUser
}
