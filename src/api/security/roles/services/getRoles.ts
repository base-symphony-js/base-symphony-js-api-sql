import { IFilterQuery } from '@interfaces'
import { PrismaService } from '@services'

export const getRoles = async (
  prisma: PrismaService,
  filters: IFilterQuery,
) => {
  // Get roles
  const { searchQuery, sortField, sortOrder } = filters
  const order = sortOrder === 'desc' ? 'desc' : 'asc'

  const roles = await prisma.roles.findMany({
    where: {
      OR: [
        { type: { contains: searchQuery } },
        { title_en: { contains: searchQuery } },
        { title_es: { contains: searchQuery } },
        { description_en: { contains: searchQuery } },
        { description_es: { contains: searchQuery } },
      ],
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
    orderBy: {
      [sortField]: order,
    },
  })

  return roles
}
