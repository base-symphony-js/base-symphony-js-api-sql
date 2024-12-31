import { PrismaService } from '@services'
import { CustomError } from '@common'
import { UpdateProfileDto } from '../dto'

export const updateProfile = async (
  prisma: PrismaService,
  userId: number,
  profile: UpdateProfileDto,
) => {
  // Verify user
  const user = await prisma.users.findUnique({
    where: { id: userId },
  })
  if (user == null) throw CustomError('PROFILE_NOT_FOUND', 404)

  // Update profile
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      firstName: profile.firstName ?? user.firstName,
      lastName: profile.lastName ?? user.lastName,
      phoneNumber: profile.phoneNumber ?? user.phoneNumber,
      photo: profile.photo ?? user.photo,
      updatedAt: new Date(),
      updatedById: userId,
    },
  })

  return updatedUser
}
