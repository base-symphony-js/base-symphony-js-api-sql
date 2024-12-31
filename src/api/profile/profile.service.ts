import { Injectable } from '@nestjs/common'

// DTO
import { UpdateProfileDto } from './dto'

// Services
import { PrismaService } from '@services'
import * as profileService from './services'

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  getProfile(email: string) {
    return profileService.getProfile(this.prisma, email)
  }

  updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    return profileService.updateProfile(this.prisma, userId, updateProfileDto)
  }

  updatePassword(userId: number, oldPassword: string, newPassword: string) {
    return profileService.updatePassword(
      this.prisma,
      userId,
      oldPassword,
      newPassword,
    )
  }

  updateEmail(userId: number, newEmail: string) {
    return profileService.updateEmail(this.prisma, userId, newEmail)
  }

  deleteAccount(userId: number) {
    return profileService.deleteAccount(this.prisma, userId)
  }
}
