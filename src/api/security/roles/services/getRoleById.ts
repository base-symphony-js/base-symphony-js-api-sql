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
          Permissions: true,
          Actions: true,
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
        ...curr.Permissions,
        actions: [],
      }
      acc.push(permission)
    }

    // Add the action to the corresponding permission
    permission.actions.push({ ...curr.Actions })

    return acc
  }, [])

  const groupedPermissions = []

  // First, iterate through each permission and add it to a temporary object with its ID as the key
  const permissionsMap = permissionsWithActions.reduce((acc, permission) => {
    acc[permission.id] = { ...permission, children: [] }
    return acc
  }, {})

  // Now, group the permissions that have a parentId
  permissionsWithActions.forEach(permission => {
    if (permission.parentId) {
      // If it has a parentId, add it to the children property of its parent permission
      const parentPermission = permissionsMap[permission.parentId]
      if (parentPermission) {
        parentPermission.children.push(permission)
      }
    } else {
      // If it doesn't have a parentId, it's a root permission, so add it to the main group
      groupedPermissions.push(permissionsMap[permission.id])
    }
  })

  // Return the role with the organized permissions and actions
  const transformedRole = {
    ...role,
    createdBy: role.Users_Roles_createdByIdToUsers,
    updatedBy: role.Users_Roles_updatedByIdToUsers,
    Users_Roles_createdByIdToUsers: undefined,
    Users_Roles_updatedByIdToUsers: undefined,
  }
  return {
    ...transformedRole,
    CustomPermissions: groupedPermissions,
  }
}
