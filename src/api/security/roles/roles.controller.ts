import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import { CreateRoleDto, PermissionManagementDto, UpdateRoleDto } from './dto'
import { RolesService } from './roles.service'

@Controller('api/security/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Get roles list.' })
  async getRoles(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { query, t } = req
    try {
      // Get roles
      const roles = await this.rolesService.getRoles({
        searchQuery: (query.search as string) || '',
        sortField: (query.sortField as string) || 'description_en',
        sortOrder: (query.sortOrder as string) || 'asc',
      })

      // Response
      dataResponse.message = t.ROLES_LISTED
      dataResponse.data = { roles }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Get('/:roleId')
  @ApiResponse({ status: 200, description: 'Get role by ID.' })
  async getRoleById(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t } = req
    try {
      // Get role
      const role = await this.rolesService.getRoleById(roleId)

      // Response
      dataResponse.message = t.ROLE_FOUND
      dataResponse.data = { role }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('/')
  @ApiResponse({ status: 201, description: 'Create new role.' })
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 201, message: '' }
    const { t, userToken } = req
    try {
      // Create role
      const currentUserId = userToken.id
      const role = await this.rolesService.createRole(
        currentUserId,
        createRoleDto,
      )

      // Response
      dataResponse.message = t.ROLE_CREATED
      dataResponse.data = { role }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Put('/:roleId')
  @ApiResponse({ status: 200, description: 'Update role by ID.' })
  async updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      // Update role
      const currentUserId = userToken.id
      const role = await this.rolesService.updateRole(
        currentUserId,
        roleId,
        updateRoleDto,
      )

      // Response
      dataResponse.message = t.ROLE_UPDATED
      dataResponse.data = { role }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Patch('/:roleId/disable')
  @ApiResponse({ status: 200, description: 'Disable role by ID.' })
  async disableRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      // Disable role
      const currentUserId = userToken.id
      const role = await this.rolesService.disableRole(currentUserId, roleId)

      // Response
      dataResponse.message = t.ROLE_DISABLED
      dataResponse.data = { role }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Delete('/:roleId')
  @ApiResponse({ status: 200, description: 'Delete role by ID.' })
  async deleteRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t } = req
    try {
      // Delete role
      const role = await this.rolesService.deleteRole(roleId)

      // Response
      dataResponse.message = t.ROLE_DELETED
      dataResponse.data = { role }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Patch('/:roleId/permission-management')
  @ApiResponse({ status: 200, description: 'Permission management.' })
  async permissionManagement(
    @Body() permissionManagementDto: PermissionManagementDto,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t } = req
    try {
      // Update permissions
      const role = await this.rolesService.permissionManagement(
        roleId,
        permissionManagementDto.permissions,
      )

      // Response
      dataResponse.message = t.ROLE_PERMISSIONS_UPDATED
      dataResponse.data = { role }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }
}
