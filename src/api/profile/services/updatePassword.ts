import { compare, hash } from 'bcrypt'
import { PrismaService } from '@services'
import { BCRYPT_SALT, CustomError } from '@common'

export const updatePassword = async (
  prisma: PrismaService,
  userId: number,
  oldPassword: string,
  newPassword: string,
) => {
  // Verify user
  const user = await prisma.users.findUnique({
    where: { id: userId },
  })
  if (user == null) throw CustomError('PROFILE_NOT_FOUND', 404)

  // Check passwords
  const oldPasswordHash: string = user.password ?? ''
  const checkOldPassword = await compare(oldPassword, oldPasswordHash)
  if (!checkOldPassword) throw CustomError('PROFILE_INVALID_CREDENTIALS', 401)
  if (oldPassword === newPassword)
    throw CustomError('PROFILE_OLD_PASSWORD', 400)
  if (newPassword.length < 8)
    throw CustomError('PROFILE_INSECURE_PASSWORD', 400)

  // Update password
  const newPasswordHash: string = await hash(newPassword, BCRYPT_SALT)
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      password: newPasswordHash,
      updatedAt: new Date(),
      updatedById: userId,
      passwordVersion: user.passwordVersion + 1,
      incorrectPassword: 0,
    },
  })

  return updatedUser
}
