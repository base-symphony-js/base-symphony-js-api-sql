import { PrismaService } from '@services'

export const getRolesAndPermissions = async (
  prisma: PrismaService,
  userId: number,
) => {
  // Get active roles of the user
  const roles = await prisma.roles.findMany({
    where: {
      UsersOnRoles: { some: { userId: userId } },
      state: true,
    },
    select: {
      id: true,
      type: true,
      title_en: true,
      title_es: true,
      description_en: true,
      description_es: true,
      state: true,
    },
  })

  // Get list role ids
  const roleIds = roles.map(role => role.id)

  // Get permissions and actions associated with those roles
  const permissions = await prisma.customPermissions.findMany({
    where: { roleId: { in: roleIds }, Actions: { name: 'read' } },
    select: { Permissions: { select: { name: true } } },
  })

  // Map the result to just the permission names and use Set to remove duplicates
  const permissionNames = [
    ...new Set(permissions.map(permission => permission.Permissions.name)),
  ]

  return { roles, permissions: permissionNames }
}
