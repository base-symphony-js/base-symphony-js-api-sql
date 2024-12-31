import { compare } from 'bcrypt'
import { PrismaService } from '@services'
import { MAX_FAILED_PASSWORDS, CustomError } from '@common'

export const validateEmailAndPass = async (
  prisma: PrismaService,
  email: string,
  password: string,
) => {
  // Verify user
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) throw CustomError('AUTH_INVALID_CREDENTIALS', 401)
  if (!user.state) throw CustomError('AUTH_ACCOUNT_DISABLED', 400)

  // Verify user is blocked
  let incorrectPassword: number = user.incorrectPassword || 0
  if (incorrectPassword >= MAX_FAILED_PASSWORDS)
    throw CustomError('AUTH_ACCOUNT_BLOCKED_DETAILS', 401)

  // Check password and update user if password is incorrect
  const checkPassword = await compare(password, user.password ?? '')
  if (!checkPassword) {
    incorrectPassword++
    if (incorrectPassword <= MAX_FAILED_PASSWORDS) {
      await prisma.users.update({
        where: { id: user.id },
        data: { incorrectPassword },
      })
    }
  }

  // Verify user is blocked and send email once
  let isSendEmail = false
  if (!checkPassword && incorrectPassword === MAX_FAILED_PASSWORDS) {
    isSendEmail = true
    return { user, isSendEmail }
  } else if (!checkPassword) {
    throw CustomError('AUTH_INVALID_CREDENTIALS', 401)
  }

  // Unlock user
  await prisma.users.update({
    where: { id: user.id },
    data: { incorrectPassword: 0 },
  })

  return { user, isSendEmail }
}
