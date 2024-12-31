import { jwt } from '@config'
import { PrismaService } from '@services'
import { MAX_FAILED_PASSWORDS, CustomError } from '@common'

export const generateTokens = async (prisma: PrismaService, userId: number) => {
  // Verify user
  const user = await prisma.users.findUnique({
    where: { id: userId },
  })
  if (user == null) throw CustomError('AUTH_ACCOUNT_NOT_FOUND', 401)
  if (!user.state) throw CustomError('AUTH_ACCOUNT_DISABLED', 400)
  if (user.incorrectPassword === MAX_FAILED_PASSWORDS)
    throw CustomError('AUTH_ACCOUNT_BLOCKED', 400)

  // Generate tokens
  const accessToken = jwt.generateAccessToken({
    id: userId,
    email: user.email,
    passwordVersion: user.passwordVersion,
  })
  const refreshToken = jwt.generateRefreshToken({ id: userId })

  // Update user
  await prisma.users.update({
    where: { id: userId },
    data: { refreshToken },
  })

  return { accessToken, refreshToken }
}
