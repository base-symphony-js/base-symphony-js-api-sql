import { PrismaService } from '@services'
import { CustomError } from '@common'

export const getRoleById = async (prisma: PrismaService, roleId: number) => {
  const role = await prisma.roles.findUnique({
    where: { id: roleId },
    include: {
      Users_Roles_createdByIdToUsers: {
        select: { id: true, email: true },
      },
      Users_Roles_updatedByIdToUsers: {
        select: { id: true, email: true },
      },
      CustomPermissions: {
        select: {
          Permissions: {
            select: {
              id: true,
              name: true,
              title_en: true,
              title_es: true,
              description_en: true,
              description_es: true,
              parentId: true,
            },
          },
          Actions: {
            select: {
              id: true,
              name: true,
              title_en: true,
              title_es: true,
            },
          },
        },
      },
    },
  })
  if (!role) throw CustomError('ROLE_NOT_FOUND', 404)

  // Accumulate permissions and their actions, avoiding duplicates
  const permissionsWithActions = role.CustomPermissions.reduce((acc, curr) => {
    // Find if the permission already exists in the accumulator
    let permission = acc.find(p => p.id === curr.Permissions.id)

    if (!permission) {
      // If the permission doesn't exist yet, create a new entry
      permission = {
        id: curr.Permissions.id,
        name: curr.Permissions.name,
        title_en: curr.Permissions.title_en,
        title_es: curr.Permissions.title_es,
        description_en: curr.Permissions.description_en,
        description_es: curr.Permissions.description_es,
        parentId: curr.Permissions.parentId,
        actions: [],
      }
      acc.push(permission)
    }

    // Add the action to the corresponding permission
    permission.actions.push({
      id: curr.Actions.id,
      name: curr.Actions.name,
      title_en: curr.Actions.title_en,
      title_es: curr.Actions.title_es,
    })

    return acc
  }, [])

  // Return the role with the organized permissions and actions
  return {
    ...role,
    CustomPermissions: permissionsWithActions,
  }
}
