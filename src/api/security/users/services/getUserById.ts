import { PrismaService } from '@services'
import { CustomError } from '@common'

export const getUserById = async (prisma: PrismaService, userId: number) => {
  // Get user
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      Users_Users_createdByIdToUsers: { select: { id: true, email: true } },
      Users_Users_updatedByIdToUsers: { select: { id: true, email: true } },
      UsersOnRoles: {
        include: {
          Roles: {
            select: {
              id: true,
              title_en: true,
              title_es: true,
              description_en: true,
              description_es: true,
              state: true,
            },
          },
        },
      },
    },
  })
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  // Get assigned roles and available roles
  const assignedRoles = user.UsersOnRoles.map(userRole => userRole.Roles)
  const assignedRoleIds = assignedRoles.map(role => role.id)
  const availableRoles = await prisma.roles.findMany({
    where: { NOT: { id: { in: assignedRoleIds } } },
    select: {
      id: true,
      title_en: true,
      title_es: true,
      description_en: true,
      description_es: true,
      state: true,
    },
  })
  delete user.UsersOnRoles

  return {
    user: user,
    roles: {
      assignedRoles,
      availableRoles,
    },
  }
}
