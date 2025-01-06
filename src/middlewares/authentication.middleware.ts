/*
 * Copyright (c) 2025 Luis Solano. All rights reserved.
 * Licensed under the MIT License. See the LICENSE file in the root of this repository for more information.
 */
import { Injectable, NestMiddleware } from '@nestjs/common'
import type { Response, NextFunction, Request } from 'express'
import type { IDataResponse } from '@interfaces'
import { PrismaService } from '@services'
import { jwt } from '@config'
import { CustomError, MAX_FAILED_PASSWORDS, getErrorResponse } from '@common'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t } = req
    try {
      // Validation token
      const headerToken: string = req.headers.authorization ?? ''
      if (!headerToken?.toLowerCase().startsWith('bearer'))
        throw CustomError('AUTH_INVALID_TOKEN', 401)

      const token: string = headerToken.replace('Bearer ', '')
      if (token.length === 0) throw CustomError('AUTH_INVALID_TOKEN', 401)

      // Validation with JWT
      const userToken = jwt.verifyAccessToken(token)

      // Validation, the user has to exist and the password version has to match the user's current version.
      const userFoundById = await this.prisma.users.findUnique({
        where: { id: userToken.id },
      })
      if (
        userFoundById == null ||
        userFoundById.passwordVersion !== userToken.passwordVersion
      )
        throw CustomError('AUTH_INVALID_TOKEN', 401)

      // Validation, the user must be active.
      if (!userFoundById.state) throw CustomError('USER_DISABLED', 401)

      // Validation, the user is not blocked
      const incorrectPassword: number = userFoundById.incorrectPassword ?? 0
      if (incorrectPassword >= MAX_FAILED_PASSWORDS)
        throw CustomError('AUTH_ACCOUNT_BLOCKED_DETAILS', 401)

      // Next
      req.userToken = userToken
      next()
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
      return res.status(dataResponse.statusCode).send(dataResponse)
    }
  }
}
