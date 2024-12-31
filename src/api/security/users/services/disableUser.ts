import { PrismaService } from '@services'
import { CustomError } from '@common'

export const disableUser = async (
  prisma: PrismaService,
  currentUserId: number,
  userId: number,
) => {
  // Verify user
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      UsersOnRoles: {
        include: {
          Roles: {
            select: { type: true },
          },
        },
      },
    },
  })
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentUserId) throw CustomError('USER_DISABLE_YOURSELF', 400)

  // Verify edition owner
  const currentUser = await prisma.users.findUnique({
    where: { id: currentUserId },
    include: {
      UsersOnRoles: {
        include: {
          Roles: {
            select: { type: true },
          },
        },
      },
    },
  })
  const isOwnerEditUser = user.UsersOnRoles.some(
    userRole => userRole.Roles.type === 'owner',
  )
  let isOwnerCurrentUser = false
  if (currentUser != null) {
    isOwnerCurrentUser = currentUser.UsersOnRoles.some(
      userRole => userRole.Roles.type === 'owner',
    )
  }
  if (!isOwnerCurrentUser && isOwnerEditUser)
    throw CustomError('USER_OWNER_EDIT', 403)

  // Update user
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      updatedAt: new Date(),
      updatedById: currentUserId,
      state: false,
    },
  })

  return updatedUser
}
