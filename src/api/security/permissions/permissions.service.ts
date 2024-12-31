import { Injectable } from '@nestjs/common'

// Services
import { PrismaService } from '@services'

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  // Method to get permissions with hierarchical structure
  async getPermissions() {
    // First, get all root permissions (those without a parentId)
    const permissions = await this.prisma.permissions.findMany({
      where: {
        parentId: null, // Only get root permissions
      },
      include: {
        other_Permissions: true, // Include child permissions for each permission
      },
    })

    // Transform permissions into the required structure
    const permissionsWithChildren = await Promise.all(
      permissions.map(async permission => {
        return {
          permission: permission.name,
          children: await this.getChildren(permission.id), // Get children recursively
        }
      }),
    )

    // Get all actions from the database
    const actions = await this.prisma.actions.findMany({
      select: {
        name: true, // Only select the name of the action
      },
    })

    // Return the structured response
    return {
      permissions: permissionsWithChildren,
      actions: actions.map(action => action.name), // Map actions to a simple array of names
    }
  }

  // Function to get children of a permission recursively
  private async getChildren(permissionId: number) {
    // Get child permissions (if any)
    const children = await this.prisma.permissions.findMany({
      where: {
        parentId: permissionId,
      },
      include: {
        other_Permissions: true, // Include child permissions for each child
      },
    })

    // If no children are found, return an empty array
    if (children.length === 0) return []

    // If there are children, process them recursively
    return Promise.all(
      children.map(async child => {
        return {
          permission: child.name,
          children: await this.getChildren(child.id), // Recursively call to get sub-children
        }
      }),
    )
  }
}
