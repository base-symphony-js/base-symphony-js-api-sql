import { PrismaService } from '@services'
import { CustomError } from '@common'

export const deleteUser = async (
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
  if (user.id === currentUserId) throw CustomError('USER_DELETE_YOURSELF', 400)

  // Verify deletion owner
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
  const isOwnerDeleteUser = user.UsersOnRoles.some(
    userRole => userRole.Roles.type === 'owner',
  )
  let isOwnerCurrentUser = false
  if (currentUser != null) {
    isOwnerCurrentUser = currentUser.UsersOnRoles.some(
      userRole => userRole.Roles.type === 'owner',
    )
  }
  if (!isOwnerCurrentUser && isOwnerDeleteUser)
    throw CustomError('USER_OWNER_DELETE', 403)

  // Delete user
  await prisma.users.delete({
    where: { id: userId },
  })

  return user
}
