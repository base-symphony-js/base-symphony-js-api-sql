import { PrismaService } from '@services'
import { CustomError } from '@common'
import { UpdateUserDto } from '../dto'

export const updateUser = async (
  prisma: PrismaService,
  currentUserId: number,
  userId: number,
  updateUserDto: UpdateUserDto,
) => {
  const { firstName, lastName, email, state } = updateUserDto

  // Verify user
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      UsersOnRoles: {
        include: {
          Roles: {
            select: { id: true, type: true },
          },
        },
      },
    },
  })
  if (!user) throw CustomError('USER_NOT_FOUND', 404)
  if (userId === currentUserId && !state)
    throw CustomError('USER_DISABLE_YOURSELF', 400)

  // Verify another user
  if (email) {
    const anotherUser = await prisma.users.findUnique({
      where: { email },
    })
    if (anotherUser && anotherUser.email !== user.email)
      throw CustomError('USER_ALREADY_EXISTS', 409)
  }

  // Verify edition owner
  const currentUser = await prisma.users.findUnique({
    where: { id: currentUserId },
    include: {
      UsersOnRoles: {
        include: {
          Roles: {
            select: { id: true, type: true },
          },
        },
      },
    },
  })
  if (!currentUser) throw CustomError('USER_NOT_FOUND', 404)
  const isOwnerEditUser = user.UsersOnRoles.some(
    userRole => userRole.Roles.type === 'owner',
  )
  const isOwnerCurrentUser = currentUser.UsersOnRoles.some(
    userRole => userRole.Roles.type === 'owner',
  )
  if (!isOwnerCurrentUser && isOwnerEditUser)
    throw CustomError('USER_OWNER_EDIT', 403)

  // Update user
  const updatedUserData: any = {
    firstName: firstName ?? user.firstName,
    lastName: lastName ?? user.lastName,
    email: email ?? user.email,
    state: state ?? user.state,
    updatedAt: new Date(),
    updatedById: currentUserId,
  }
  if (user.email !== email) {
    updatedUserData.passwordVersion = user.passwordVersion + 1
  }
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: updatedUserData,
  })

  return updatedUser
}
