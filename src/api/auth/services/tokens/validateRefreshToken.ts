import { jwt } from '@config'
import { PrismaService } from '@services'
import { CustomError } from '@common'

export const validateRefreshToken = async (
  prisma: PrismaService,
  refreshToken: string,
) => {
  // Verify refresh token
  if (!refreshToken) throw CustomError('AUTH_INVALID_TOKEN', 401)
  const userToken = jwt.verifyRefreshToken(refreshToken)

  // Verify user
  const user = await prisma.users.findUnique({
    where: { id: userToken.id },
  })
  if (!user || user.refreshToken !== refreshToken)
    throw CustomError('AUTH_INVALID_TOKEN', 401)
  if (!user.state) throw CustomError('AUTH_ACCOUNT_DISABLED', 400)

  return user
}
