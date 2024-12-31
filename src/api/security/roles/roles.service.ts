import { Injectable } from '@nestjs/common'
import { IFilterQuery } from '@interfaces'

// DTO
import { CreateRoleDto, PermissionDto, UpdateRoleDto } from './dto'

// Services
import { PrismaService } from '@services'
import * as rolesService from './services'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  getRoles(filters: IFilterQuery) {
    return rolesService.getRoles(this.prisma, filters)
  }

  getRoleById(roleId: number) {
    return rolesService.getRoleById(this.prisma, roleId)
  }

  createRole(currentUserId: number, createRoleDto: CreateRoleDto) {
    return rolesService.createRole(this.prisma, currentUserId, createRoleDto)
  }

  updateRole(
    currentUserId: number,
    roleId: number,
    updateRoleDto: UpdateRoleDto,
  ) {
    return rolesService.updateRole(
      this.prisma,
      currentUserId,
      roleId,
      updateRoleDto,
    )
  }

  disableRole(currentUserId: number, roleId: number) {
    return rolesService.disableRole(this.prisma, currentUserId, roleId)
  }

  deleteRole(roleId: number) {
    return rolesService.deleteRole(this.prisma, roleId)
  }

  permissionManagement(roleId: number, permissions: PermissionDto[]) {
    return rolesService.permissionManagement(this.prisma, roleId, permissions)
  }
}
