import { IFilterQuery, IPaginationQuery } from '@interfaces'
import { PrismaService } from '@services'

export const getUsers = async (
  prisma: PrismaService,
  filters: IFilterQuery,
  pagination: IPaginationQuery,
) => {
  // Get filters
  const { searchQuery, sortField, sortOrder } = filters
  const order = sortOrder === 'desc' ? 'desc' : 'asc'
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  // Get users
  const users = await prisma.users.findMany({
    where: {
      OR: [
        { firstName: { contains: searchQuery } },
        { lastName: { contains: searchQuery } },
        { email: { contains: searchQuery } },
        { phoneNumber: { contains: searchQuery } },
      ],
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      state: true,
    },
    orderBy: { [sortField]: order },
    skip,
    take: limit,
  })

  // Get users quantity
  const totalUsers = await prisma.users.count({
    where: {
      OR: [
        { firstName: { contains: searchQuery } },
        { lastName: { contains: searchQuery } },
        { email: { contains: searchQuery } },
        { phoneNumber: { contains: searchQuery } },
      ],
    },
  })

  return { totalUsers, users }
}
