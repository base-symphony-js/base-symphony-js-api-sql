import { PrismaService } from '@services'
import { CustomError } from '@common'

export const getRoles = async (prisma: PrismaService, userId: number) => {
  // Get user
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      UsersOnRoles: {
        include: {
          Roles: {
            select: { id: true, type: true, state: true },
          },
        },
      },
    },
  })
  if (!user) throw CustomError('USER_NOT_FOUND', 404)

  const roles = user.UsersOnRoles.map(userRole => userRole.Roles)

  return roles
}
