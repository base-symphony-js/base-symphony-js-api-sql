import { PrismaService } from '@services'
import { CustomError } from '@common'
import { UpdateRoleDto } from '../dto'

export const updateRole = async (
  prisma: PrismaService,
  currentUserId: number,
  roleId: number,
  updateRoleDto: UpdateRoleDto,
) => {
  const { title_en, title_es, description_en, description_es, state } =
    updateRoleDto

  // Verify role
  const role = await prisma.roles.findUnique({
    where: { id: roleId },
  })
  if (!role) throw CustomError('ROLE_NOT_FOUND', 404)
  if (role.type === 'owner') throw CustomError('ROLE_OWNER', 403)

  // Update role
  const updatedRole = await prisma.roles.update({
    where: { id: roleId },
    data: {
      title_en: title_en ?? role.title_en,
      title_es: title_es ?? role.title_es,
      description_en: description_en ?? role.description_en,
      description_es: description_es ?? role.description_es,
      updatedAt: new Date(),
      updatedById: currentUserId,
      state: state ?? role.state,
    },
  })

  return updatedRole
}
