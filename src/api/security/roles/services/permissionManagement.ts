import { PrismaService } from '@services'
import { PermissionDto } from '../dto'

export const permissionManagement = async (
  prisma: PrismaService,
  roleId: number,
  permissions: PermissionDto[],
) => {
  // Start by initializing an empty array for the permissions to process
  const processedPermissions: any[] = []
  const processedPermissionIds: Set<number> = new Set() // Set to track processed permissions to avoid duplicates

  // Remove all permissions for this role
  await prisma.customPermissions.deleteMany({
    where: {
      roleId: roleId,
    },
  })

  // Process each permission from the input
  for (const permissionData of permissions) {
    const { permission: permissionName, actions } = permissionData

    // Find the permission by name
    const permission = await prisma.permissions.findUnique({
      where: { name: permissionName },
    })

    // If the permission doesn't exist, skip to the next one
    if (!permission) continue

    // If permission is already processed, skip it
    if (processedPermissionIds.has(permission.id)) continue

    // Add the permission to the processed list
    const permissionWithActions = {
      permissionId: permission.id,
      actions: [],
    }

    // Add actions to this permission if they exist and are valid
    for (const actionName of actions) {
      const action = await prisma.actions.findUnique({
        where: { name: actionName },
      })

      if (action) {
        // Add the action to the permission
        permissionWithActions.actions.push(action.id)
      }
    }

    // Add parent permissions recursively (if not already processed)
    await addParentPermissions(
      prisma,
      roleId,
      permission.id,
      processedPermissions,
      processedPermissionIds,
    )

    // Add the current permission to the processed list
    processedPermissions.push(permissionWithActions)
    processedPermissionIds.add(permission.id) // Mark the permission as processed
  }

  // Associate the permissions and actions to the role
  for (const permissionData of processedPermissions) {
    const { permissionId, actions } = permissionData

    // Create associations between the permission and actions
    for (const actionId of actions) {
      await prisma.customPermissions.upsert({
        where: {
          roleId_permissionId_actionId: {
            roleId: roleId,
            permissionId,
            actionId,
          },
        },
        create: {
          roleId: roleId,
          permissionId,
          actionId,
        },
        update: {},
      })
    }
  }

  return processedPermissions
}

// Function to check and add parent permissions recursively
const addParentPermissions = async (
  prisma: PrismaService,
  roleId: number,
  permissionId: number,
  processedPermissions: any[],
  processedPermissionIds: Set<number>, // Track processed permissions to avoid duplicates
) => {
  const permission = await prisma.permissions.findUnique({
    where: { id: permissionId },
  })

  if (permission && permission.parentId) {
    const parentPermission = await prisma.permissions.findUnique({
      where: { id: permission.parentId },
    })

    if (parentPermission) {
      // Check if the parent is already associated, if not, add it
      const parentPermissionAssociation =
        await prisma.customPermissions.findFirst({
          where: {
            roleId: roleId,
            permissionId: parentPermission.id,
          },
        })

      // If the parent is not associated and hasn't been processed, add it
      if (
        !parentPermissionAssociation &&
        !processedPermissionIds.has(parentPermission.id)
      ) {
        processedPermissions.push({
          permissionId: parentPermission.id,
          actions: [1], // Default action is "read"
        })
        processedPermissionIds.add(parentPermission.id) // Mark the parent permission as processed
      }

      // Recursively call for the parent's parent
      await addParentPermissions(
        prisma,
        roleId,
        parentPermission.id,
        processedPermissions,
        processedPermissionIds,
      )
    }
  }
}
