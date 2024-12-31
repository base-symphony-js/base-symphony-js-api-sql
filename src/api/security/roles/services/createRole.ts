import { PrismaService } from '@services'
import { CreateRoleDto } from '../dto'

export const createRole = async (
  prisma: PrismaService,
  currentUserId: number,
  createRoleDto: CreateRoleDto,
) => {
  const { title_en, title_es, description_en, description_es, state } =
    createRoleDto

  // Create role
  const role = await prisma.roles.create({
    data: {
      type: 'admin',
      title_en,
      title_es,
      description_en,
      description_es,
      createdAt: new Date(),
      createdById: currentUserId,
      state,
    },
  })

  return role
}
