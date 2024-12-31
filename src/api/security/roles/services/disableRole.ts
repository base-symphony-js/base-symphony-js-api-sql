import { PrismaService } from '@services'
import { CustomError } from '@common'

export const disableRole = async (
  prisma: PrismaService,
  currentUserId: number,
  roleId: number,
) => {
  // Verify role
  const role = await prisma.roles.findUnique({ where: { id: roleId } })
  if (!role) throw CustomError('ROLE_NOT_FOUND', 404)
  if (role.type === 'owner') throw CustomError('ROLE_OWNER', 403)

  // Update role
  const updatedRole = await prisma.roles.update({
    where: { id: roleId },
    data: {
      updatedAt: new Date(),
      updatedById: currentUserId,
      state: false,
    },
  })

  return updatedRole
}
