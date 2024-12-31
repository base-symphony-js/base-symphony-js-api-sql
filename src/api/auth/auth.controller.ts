import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { IDataResponse } from '@interfaces'
import { CustomError, getErrorResponse, getHTMLFile, sendEmail } from '@common'
import { CreateUserDto } from './dto'
import { AuthService } from './auth.service'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email-and-pass')
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with email and password.',
  })
  async loginWithEmailAndPass(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t, lng } = req
    try {
      const email: string = body.email
      const password: string = body.password

      // Validate email and password
      const { user, isSendEmail } = await this.authService.validateEmailAndPass(
        email,
        password,
      )

      // Notify if account is blocked
      if (isSendEmail) {
        const html = getHTMLFile(__dirname, lng, 'blockedAccount')
        await sendEmail(html, {
          recipients: { to: [`${user.firstName} <${user.email}>`] },
          subject: t.AUTH_ACCOUNT_BLOCKED,
          body: { name: user.firstName },
        })
        throw CustomError('AUTH_ACCOUNT_BLOCKED_DETAILS', 401)
      }

      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id)
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Get profile
      const roles = await this.authService.getRoles(user.id)

      // Response
      dataResponse.message = t.AUTH_AUTHENTICATED
      dataResponse.data = { user, tokens, roles }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('login/google')
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with Google.',
  })
  async loginWithGoogle(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t } = req
    try {
      const idToken: string = body.idToken

      // Validate idToken
      const user = await this.authService.validateIdTokenGoogle(idToken)
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id)

      // Get profile
      const roles = await this.authService.getRoles(user.id)

      // Response
      dataResponse.message = t.AUTH_AUTHENTICATED
      dataResponse.data = { user, tokens, roles }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('register/email-and-pass')
  @ApiResponse({
    status: 201,
    description: 'Account successfully registered with email and password.',
  })
  async registerWithEmailAndPass(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let dataResponse: IDataResponse = { statusCode: 201, message: '' }
    const { t, lng } = req
    try {
      // Create user
      const user = await this.authService.createUser(createUserDto)
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Send Email
      const html = getHTMLFile(__dirname, lng, 'registerUser')
      await sendEmail(html, {
        recipients: { to: [`${user.firstName} <${user.email}>`] },
        subject: t.AUTH_ACCOUNT_REGISTRED,
        body: { name: user.firstName },
      })

      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id)

      // Response
      dataResponse.message = t.AUTH_ACCOUNT_REGISTRED
      dataResponse.data = { user, tokens }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('register/google')
  @ApiResponse({
    status: 201,
    description: 'Account successfully registered with Google.',
  })
  async registerWithGoogle(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 201, message: '' }
    const { body, t, lng } = req
    try {
      // Verify Google idToken
      const idToken: string = body.idToken
      const payload = await this.authService.verifyGoogleIdToken(idToken)

      // Create user
      const user = await this.authService.createUser({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        photo: payload.photo,
        phoneNumber: '',
        password: '',
      })
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Send Email
      const html = getHTMLFile(__dirname, lng, 'registerUser')
      await sendEmail(html, {
        recipients: { to: [`${user.firstName} <${user.email}>`] },
        subject: t.AUTH_ACCOUNT_REGISTRED,
        body: { name: user.firstName },
      })

      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id)

      // Response
      dataResponse.message = t.AUTH_ACCOUNT_REGISTRED
      dataResponse.data = { user, tokens }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('login/refresh-tokens')
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated and generated new tokens.',
  })
  async loginRefreshTokens(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t } = req
    try {
      const refreshToken: string = body.refreshToken

      // Validate refreshToken
      const user = await this.authService.validateRefreshToken(refreshToken)

      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id)

      // Response
      dataResponse.message = t.AUTH_AUTHENTICATED
      dataResponse.data = { tokens }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        dataResponse.message = t.RES_EXPIRED_TOKEN
        return res.status(401).send(dataResponse)
      }
      if (error.name === 'JsonWebTokenError') {
        dataResponse.message = t.AUTH_INVALID_TOKEN
        return res.status(401).send(dataResponse)
      }
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('recovery-account/send-otp')
  @ApiResponse({ status: 200, description: 'OTP sent for account recovery.' })
  async recoveryAccountSendOtp(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t, lng } = req
    try {
      const { email } = body

      // Generate OTP
      const { newOtp, user } = await this.authService.generateOtpInternalUser(
        email,
      )

      // Send OTP email
      const html = getHTMLFile(__dirname, lng, 'recoveryAccount')
      await sendEmail(html, {
        recipients: { to: [`${user.firstName} <${user.email}>`] },
        subject: t.AUTH_ACCOUNT_RECOVERY,
        body: {
          name: user.firstName,
          newOtp: newOtp.otp,
        },
      })

      // Response
      dataResponse.message = t.AUTH_OTP_SENT
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('recovery-account/verify-otp')
  @ApiResponse({ status: 200, description: 'OTP successfully verified.' })
  async recoveryAccountVerifyOtp(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t } = req
    try {
      const { otp, email } = body

      // Verify OTP
      await this.authService.verifyOtp(email, otp)

      // Response
      dataResponse.message = t.AUTH_OTP_VALID
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('recovery-account')
  @ApiResponse({ status: 200, description: 'Account recovery successful.' })
  async recoveryAccount(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { body, t } = req
    try {
      const { otp, email, password: newPassword } = body

      // Validate OTP
      await this.authService.verifyOtp(email, otp)

      // Update password
      const user = await this.authService.resetPassword(email, newPassword)
      delete user.password
      delete user.incorrectPassword
      delete user.refreshToken

      // Destroy OTP
      await this.authService.destroyOtp(email, otp)

      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id)

      // Response
      dataResponse.message = t.AUTH_ACCOUNT_RECOVERED
      dataResponse.data = { user, tokens }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }
}
