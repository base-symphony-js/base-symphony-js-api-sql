import { Injectable } from '@nestjs/common'

// DTO
import { CreateUserDto } from './dto'

// Services
import { PrismaService } from '@services'
import * as authService from './services'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // Account
  createUser(createUserDto: CreateUserDto) {
    return authService.createUser(this.prisma, createUserDto)
  }

  getRolesAndPermissions(userId: number) {
    return authService.getRolesAndPermissions(this.prisma, userId)
  }

  resetPassword(email: string, newPassword: string) {
    return authService.resetPassword(this.prisma, email, newPassword)
  }

  validateEmailAndPass(email: string, password: string) {
    return authService.validateEmailAndPass(this.prisma, email, password)
  }

  validateIdTokenGoogle(idToken: string) {
    return authService.validateIdTokenGoogle(this.prisma, idToken)
  }

  verifyGoogleIdToken(idToken: string) {
    return authService.verifyGoogleIdToken(idToken)
  }

  // Otp
  generateOtp(email: string) {
    return authService.generateOtp(this.prisma, email)
  }

  generateOtpInternalUser(email: string) {
    return authService.generateOtpInternalUser(this.prisma, email)
  }

  generateOtpExternalUser(email: string) {
    return authService.generateOtpExternalUser(this.prisma, email)
  }

  verifyOtp(email: string, otp: string) {
    return authService.verifyOtp(this.prisma, email, otp)
  }

  destroyOtp(email: string, otp: string) {
    return authService.destroyOtp(this.prisma, email, otp)
  }

  // Tokens
  generateTokens(userId: number) {
    return authService.generateTokens(this.prisma, userId)
  }

  validateRefreshToken(refreshToken: string) {
    return authService.validateRefreshToken(this.prisma, refreshToken)
  }
}
