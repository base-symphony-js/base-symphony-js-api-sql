import { hash } from 'bcrypt'
import { PrismaService } from '@services'
import { MAX_FAILED_PASSWORDS, CustomError, BCRYPT_SALT } from '@common'

export const unlockUser = async (
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
            select: { id: true, type: true },
          },
        },
      },
    },
  })
  if (!user) throw CustomError('USER_NOT_FOUND', 404)

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
  let isOwnerCurrentUser = currentUser.UsersOnRoles.some(
    userRole => userRole.Roles.type === 'owner',
  )
  if (!isOwnerCurrentUser && isOwnerEditUser)
    throw CustomError('USER_OWNER_EDIT', 403)
  if (user.incorrectPassword < MAX_FAILED_PASSWORDS)
    throw CustomError('USER_UNLOCKED', 200)

  // Update user with new password
  const temporaryPassword = Math.random().toString(36).slice(-10)
  const newPasswordHash = await hash(temporaryPassword, BCRYPT_SALT)
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      password: newPasswordHash,
      passwordVersion: { increment: 1 },
      incorrectPassword: 0,
      updatedAt: new Date(),
      updatedById: currentUserId,
    },
  })

  return { user: updatedUser, temporaryPassword }
}
