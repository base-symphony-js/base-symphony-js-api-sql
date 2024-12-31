import { PrismaService } from '@services'
import { CustomError } from '@common'

export const deleteAccount = async (prisma: PrismaService, userId: number) => {
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
  if (user == null) throw CustomError('PROFILE_NOT_FOUND', 404)

  // Verify is owner
  let isOwner = false
  isOwner = user.UsersOnRoles.some(userRole => userRole.Roles.type === 'owner')
  if (isOwner) throw CustomError('PROFILE_OWNER_DELETE', 400)

  // Delete user
  await prisma.users.delete({
    where: { id: userId },
  })

  return user
}
