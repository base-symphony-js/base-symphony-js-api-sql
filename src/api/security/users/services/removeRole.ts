import { PrismaService } from '@services'
import { CustomError } from '@common'

export const removeRole = async (
  prisma: PrismaService,
  currentUserId: number,
  userId: number,
  roleId: number,
) => {
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
  if (user.id === currentUserId) throw CustomError('USER_CHANGE_YOURSELF', 400)

  // Verify edit owner
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

  // Verify role
  const role = await prisma.roles.findUnique({
    where: { id: roleId },
  })
  if (!role) throw CustomError('ROLE_NOT_FOUND', 404)
  const hasRole = user.UsersOnRoles.some(
    userRole => userRole.Roles.id === roleId,
  )
  if (!hasRole) throw CustomError('USER_ALREADY_REMOVE_ROLE', 409)

  // Remove role and update user
  await prisma.users.update({
    where: { id: userId },
    data: {
      updatedAt: new Date(),
      updatedById: currentUserId,
      UsersOnRoles: {
        delete: {
          userId_roleId: {
            userId: userId,
            roleId: roleId,
          },
        },
      },
    },
  })

  return role
}
