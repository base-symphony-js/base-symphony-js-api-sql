import { Controller, Get, Put, Delete, Body, Req, Res } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { IDataResponse } from '@interfaces'
import { getErrorResponse, getHTMLFile, sendEmail } from '@common'
import { UpdateProfileDto } from './dto'
import { AuthService } from '@api/auth/auth.service'
import { ProfileService } from './profile.service'

@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly authService: AuthService,
  ) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Get profile details.' })
  async getProfile(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      // Get profile
      const user = await this.profileService.getProfile(userToken.email)

      // Response
      dataResponse.message = t.PROFILE_FOUND
      dataResponse.data = { user }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Put('/')
  @ApiResponse({ status: 200, description: 'Update profile details.' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      // Update profile
      const currentUserId: number = userToken.id
      const user = await this.profileService.updateProfile(
        currentUserId,
        updateProfileDto,
      )
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Response
      dataResponse.message = t.PROFILE_UPDATED
      dataResponse.data = { user }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Put('/email/send-otp')
  @ApiResponse({ status: 200, description: 'Send OTP to update email.' })
  async updateEmailSendOTP(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t, lng } = req
    try {
      const newEmail: string = body.email

      // Generate OTP
      const newOtp = await this.authService.generateOtpExternalUser(newEmail)

      // Send OTP
      const html = getHTMLFile(__dirname, lng, 'verifyEmail')
      await sendEmail(html, {
        recipients: { to: [`<${newEmail}>`] },
        subject: t.PROFILE_EMAIL_VERIFICATION,
        body: {
          name: '',
          newOtp: newOtp.otp,
        },
      })

      // Response
      dataResponse.message = t.PROFILE_EMAIL_VERIFICATION_SENT
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Put('/email')
  @ApiResponse({ status: 200, description: 'Update email.' })
  async updateEmail(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t, userToken } = req
    try {
      const currentUserId: number = userToken.id
      const newEmail: string = body.email
      const otp: string = body.otp

      // Validate OTP
      await this.authService.verifyOtp(newEmail, otp)

      // Update email
      const user = await this.profileService.updateEmail(
        currentUserId,
        newEmail,
      )
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Destroy OTP
      await this.authService.destroyOtp(newEmail, otp)

      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id)

      // Response
      dataResponse.message = t.PROFILE_EMAIL_UPDATED
      dataResponse.data = { user, tokens }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Put('/password')
  @ApiResponse({ status: 200, description: 'Update password.' })
  async updatePassword(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t, userToken } = req
    try {
      const currentUserId = userToken.id
      const oldPassword: string = body.password ?? ''
      const newPassword: string = body.newPassword ?? ''

      // Update password
      const user = await this.profileService.updatePassword(
        currentUserId,
        oldPassword,
        newPassword,
      )
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id)

      // Response
      dataResponse.message = t.PROFILE_PASSWORD_UPDATED
      dataResponse.data = { user, tokens }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Delete('/')
  @ApiResponse({ status: 200, description: 'Delete account.' })
  async deleteAccount(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      const currentUserId = userToken.id

      // Delete account
      const user = await this.profileService.deleteAccount(currentUserId)
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Response
      dataResponse.message = t.PROFILE_DELETED
      dataResponse.data = { user }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }
}
