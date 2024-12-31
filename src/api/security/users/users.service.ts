import { Injectable } from '@nestjs/common'
import { IFilterQuery, IPaginationQuery } from '@interfaces'

// DTO
import { CreateUserDto, UpdateUserDto } from './dto'

// Services
import { PrismaService } from '@services'
import * as usersService from './services'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUsers(filters: IFilterQuery, pagination: IPaginationQuery) {
    return usersService.getUsers(this.prisma, filters, pagination)
  }

  getUserById(userId: number) {
    return usersService.getUserById(this.prisma, userId)
  }

  createUser(currentUserId: number, createUserDto: CreateUserDto) {
    return usersService.createUser(this.prisma, currentUserId, createUserDto)
  }

  updateUser(
    currentUserId: number,
    userId: number,
    updateUserDto: UpdateUserDto,
  ) {
    return usersService.updateUser(
      this.prisma,
      currentUserId,
      userId,
      updateUserDto,
    )
  }

  disableUser(currentUserId: number, userId: number) {
    return usersService.disableUser(this.prisma, currentUserId, userId)
  }

  unlockUser(currentUserId: number, userId: number) {
    return usersService.unlockUser(this.prisma, currentUserId, userId)
  }

  deleteUser(currentUserId: number, userId: number) {
    return usersService.deleteUser(this.prisma, currentUserId, userId)
  }

  assignRole(currentUserId: number, userId: number, roleId: number) {
    return usersService.assignRole(this.prisma, currentUserId, userId, roleId)
  }

  removeRole(currentUserId: number, userId: number, roleId: number) {
    return usersService.removeRole(this.prisma, currentUserId, userId, roleId)
  }
}
