import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Patch,
  Req,
  Res,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { IDataResponse } from '@interfaces'
import { getErrorResponse, getHTMLFile, sendEmail } from '@common'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UsersService } from './users.service'

@Controller('api/security/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Get list of users' })
  async getUsers(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { query, t } = req
    try {
      const users = await this.usersService.getUsers(
        {
          searchQuery: (query.search as string) || '',
          sortField: (query.sortField as string) || 'firstName',
          sortOrder: (query.sortOrder as string) || 'asc',
        },
        {
          page: parseInt(query.page as string, 10) || 1,
          limit: parseInt(query.limit as string, 10) || 10,
        },
      )

      // Response
      dataResponse.message = t.USERS_LISTED
      dataResponse.data = { ...users }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Get('/:userId')
  @ApiResponse({ status: 200, description: 'Get user by ID' })
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t } = req
    try {
      const { user, roles } = await this.usersService.getUserById(userId)
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Response
      dataResponse.message = t.USER_FOUND
      dataResponse.data = { user, roles }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('/')
  @ApiResponse({ status: 201, description: 'Create a new user' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 201, message: '' }
    const { t, userToken, lng } = req
    try {
      const currentUserId = userToken.id
      const { user, temporaryPassword } = await this.usersService.createUser(
        currentUserId,
        createUserDto,
      )
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Send Email
      const html = getHTMLFile(__dirname, lng, 'createAccount')
      await sendEmail(html, {
        recipients: { to: [`${user.firstName} <${user.email}>`] },
        subject: t.USER_CREATED,
        body: {
          name: user.firstName,
          newPassword: temporaryPassword,
        },
      })

      // Response
      dataResponse.message = t.USER_CREATED
      dataResponse.data = { user }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Put('/:userId')
  @ApiResponse({ status: 200, description: 'Update user by ID' })
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      const currentUserId = userToken.id
      const user = await this.usersService.updateUser(
        currentUserId,
        userId,
        updateUserDto,
      )
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Response
      dataResponse.message = t.USER_UPDATED
      dataResponse.data = { user }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Patch('/:userId/disable')
  @ApiResponse({ status: 200, description: 'Disable user by ID' })
  async disableUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      const currentUserId = userToken.id
      const user = await this.usersService.disableUser(currentUserId, userId)
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      dataResponse.message = t.USER_DISABLED
      dataResponse.data = { user }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Patch('/:userId/unlock')
  @ApiResponse({ status: 200, description: 'Unlock user by ID' })
  async unlockUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken, lng } = req
    try {
      const currentUserId = userToken.id
      const { user, temporaryPassword } = await this.usersService.unlockUser(
        currentUserId,
        userId,
      )
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Send Email
      const html = getHTMLFile(__dirname, lng, 'unlockedUser')
      await sendEmail(html, {
        recipients: { to: [`${user.firstName} <${user.email}>`] },
        subject: t.USER_UNLOCKED,
        body: {
          name: user.firstName,
          newPassword: temporaryPassword,
        },
      })

      dataResponse.message = t.USER_UNLOCKED
      dataResponse.data = { user }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Delete('/:userId')
  @ApiResponse({ status: 200, description: 'Delete user by ID' })
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      const currentUserId = userToken.id
      const user = await this.usersService.deleteUser(currentUserId, userId)
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      dataResponse.message = t.USER_DELETED
      dataResponse.data = { user }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Patch('/:userId/assignRole')
  @ApiResponse({ status: 200, description: 'Assign role to user by ID' })
  async assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { roleId: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      const currentUserId = userToken.id
      const { roleId } = body
      const role = await this.usersService.assignRole(
        currentUserId,
        userId,
        roleId,
      )

      dataResponse.message = t.USER_ASSIGN_ROLE
      dataResponse.data = { role }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Patch('/:userId/removeRole')
  @ApiResponse({ status: 200, description: 'Remove role from user by ID' })
  async removeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { roleId: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      const currentUserId = userToken.id
      const { roleId } = body
      const role = await this.usersService.removeRole(
        currentUserId,
        userId,
        roleId,
      )

      dataResponse.message = t.USER_REMOVE_ROLE
      dataResponse.data = { role }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }
}
