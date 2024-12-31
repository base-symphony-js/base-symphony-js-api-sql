import { PrismaService } from '@services'
import { CustomError } from '@common'

export const deleteRole = async (prisma: PrismaService, roleId: number) => {
  // Verify role
  const role = await prisma.roles.findUnique({
    where: { id: roleId },
  })
  if (!role) throw CustomError('ROLE_NOT_FOUND', 404)
  if (role.type === 'owner') throw CustomError('ROLE_OWNER', 403)

  // Verify users with this role
  const usersWithRole = await prisma.usersOnRoles.findMany({
    where: { roleId },
  })
  if (usersWithRole.length > 0) throw CustomError('ROLE_ALREADY_USED', 409)

  // Delete role
  await prisma.roles.delete({
    where: { id: roleId },
  })

  return role
}
