import { OAuth2Client } from 'google-auth-library'
import { PrismaService } from '@services'
import { GOOGLE_CLIENT_ID, CustomError } from '@common'

export const validateIdTokenGoogle = async (
  prisma: PrismaService,
  idToken: string,
) => {
  // Verify idToken
  const audience = GOOGLE_CLIENT_ID
  const client = new OAuth2Client(audience)
  const ticket = await client.verifyIdToken({ idToken, audience })
  const payload = ticket.getPayload()
  if (!payload) throw CustomError('AUTH_INVALID_CREDENTIALS', 401)

  // Verify user, if it is not found, it will register it
  const email = payload.email ?? ''
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) throw CustomError('AUTH_ACCOUNT_NOT_FOUND', 404)
  if (!user.state) throw CustomError('AUTH_ACCOUNT_DISABLED', 400)

  return user
}
