import { hash } from 'bcrypt'
import { PrismaService } from '@services'
import { BCRYPT_SALT, CustomError } from '@common'
import { CreateUserDto } from '../dto'

export const createUser = async (
  prisma: PrismaService,
  currentUserId: number,
  createUserDto: CreateUserDto,
) => {
  // Verify user
  const { firstName, lastName, email, state } = createUserDto
  const anotherUser = await prisma.users.findUnique({
    where: { email },
  })
  if (anotherUser != null) throw CustomError('USER_ALREADY_EXISTS', 409)

  // Create user
  const temporaryPassword = Math.random().toString(36).slice(-10)
  const newPassword = await hash(temporaryPassword, BCRYPT_SALT)
  const user = await prisma.users.create({
    data: {
      firstName,
      lastName,
      email,
      password: newPassword,
      passwordVersion: 1,
      createdAt: new Date(),
      createdById: currentUserId,
      state,
    },
  })

  return { user, temporaryPassword }
}
