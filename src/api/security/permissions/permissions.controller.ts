import { Controller, Get, Req, Res } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import { PermissionsService } from './permissions.service'

@Controller('api/security/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Get permissions list.' })
  async getPermissions(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t } = req
    try {
      // Get permissions
      const permissions = await this.permissionsService.getPermissions()

      // Response
      dataResponse.message = t.PERMISSIONS_LISTED
      dataResponse.data = { permissions }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }
}
