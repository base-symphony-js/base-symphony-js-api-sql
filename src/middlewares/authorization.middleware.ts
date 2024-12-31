/*
 * Copyright (c) 2024 Luis Solano. All rights reserved.
 * Licensed under the MIT License. See the LICENSE file in the root of this repository for more information.
 */
import { CustomError, getErrorResponse } from '@common'
import { IDataResponse } from '@interfaces'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { PrismaService } from '@services'
import type { Response, NextFunction, Request } from 'express'

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, userToken } = req
    try {
      const userId = userToken.id
      const urlArray: string[] = req.baseUrl.replace('/api/', '').split('/')
      const method: string = req.method

      // Get active roles of the user
      const roleIds = (
        await this.prisma.usersOnRoles.findMany({
          where: { userId, Roles: { state: true } },
          select: { roleId: true },
        })
      ).map(role => role.roleId)

      // Check owner permissions
      if (roleIds.includes(1)) {
        next()
        return
      }

      // Get permissions and actions associated with those roles
      const permissions = await this.prisma.customPermissions.findMany({
        where: { roleId: { in: roleIds } },
        select: {
          Permissions: { select: { name: true } },
          Actions: { select: { name: true } },
        },
      })

      // Remove duplicates and group by permission
      const groupedPermissions = permissions.reduce(
        (acc, { Permissions, Actions }) => {
          acc[Permissions.name] = acc[Permissions.name] || []
          if (!acc[Permissions.name].includes(Actions.name)) {
            acc[Permissions.name].push(Actions.name)
          }
          return acc
        },
        {},
      )

      const hasPermissions = verifyPermissions(
        groupedPermissions,
        urlArray,
        method,
      )
      if (!hasPermissions) throw CustomError('RES_FORBIDDEN', 403)

      next()
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
      return res.status(dataResponse.statusCode).send(dataResponse)
    }
  }
}

const verifyPermissions = (
  groupedPermissions: Record<string, string[]>,
  urlArray: string[],
  method: string,
): boolean => {
  const methodActionMap: Record<string, string> = {
    GET: 'read',
    POST: 'add',
    PUT: 'edit',
    PATCH: 'edit',
    DELETE: 'delete',
  }

  // Verify permissions for each part of the URL, except the last one which has its own permission
  for (let i = 0; i < urlArray.length - 1; i++) {
    const permission = urlArray[i]
    // Check if the "read" permission is available in the actions list for that permission
    if (!groupedPermissions[permission]?.includes('read')) {
      return false
    }
  }

  // Verify the last permission with the corresponding action for the HTTP method
  const lastPermission = urlArray[urlArray.length - 1]
  const action = methodActionMap[method]
  if (!groupedPermissions[lastPermission]?.includes(action)) {
    return false
  }

  return true
}
