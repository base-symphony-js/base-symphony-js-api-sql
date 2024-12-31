import { hash } from 'bcrypt'
import { BCRYPT_SALT, CustomError } from '@common'
import { PrismaService } from '@services'
import { CreateUserDto } from '../../dto'

export const createUser = async (
  prisma: PrismaService,
  newUser: CreateUserDto,
) => {
  // Verify used email
  const { firstName, lastName, email, password, phoneNumber, photo } = newUser
  const anotherUser = await prisma.users.findUnique({
    where: { email },
  })
  if (anotherUser != null) throw CustomError('AUTH_ACCOUNT_ALREADY_EXISTS', 409)

  // Register user
  let newPasswordHash: string
  if (password) {
    newPasswordHash = await hash(password, BCRYPT_SALT)
  }
  const user = await prisma.users.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
      photo,
      password: newPasswordHash,
      passwordVersion: newPasswordHash ? 1 : 0,
      incorrectPassword: 0,
      state: true,
    },
  })

  return user
}
