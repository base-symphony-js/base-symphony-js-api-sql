import { compare, hash } from 'bcrypt'
import { PrismaService } from '@services'
import { CustomError, BCRYPT_SALT } from '@common'

export const resetPassword = async (
  prisma: PrismaService,
  email: string,
  newPassword: string,
) => {
  // Verify user
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) throw CustomError('AUTH_ACCOUNT_NOT_FOUND', 404)
  if (!user.state) throw CustomError('AUTH_ACCOUNT_DISABLED', 400)

  // Verify old password
  const oldPasswordHash: string = user.password ?? ''
  const checkOldPassword = await compare(newPassword, oldPasswordHash)
  if (checkOldPassword) throw CustomError('AUTH_OLD_PASSWORD', 400)
  if (newPassword.length < 8) throw CustomError('AUTH_INSECURE_PASSWORD', 400)

  // Update password
  const newPasswordHash = await hash(newPassword, BCRYPT_SALT)
  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: {
      password: newPasswordHash,
      updatedAt: new Date(),
      updatedById: user.id,
      passwordVersion: user.passwordVersion + 1,
      incorrectPassword: 0,
    },
  })

  return updatedUser
}
