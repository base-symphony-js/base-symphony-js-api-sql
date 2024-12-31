import jwt from 'jsonwebtoken'
import type { IUserToken } from '@interfaces'
import {
  CustomError,
  JWT_EXPIRED_ACCESS_TOKEN,
  JWT_EXPIRED_REFRESH_TOKEN,
  JWT_SECRET,
} from '@common'

const ALGORITHM = 'HS256'

export const generateAccessToken = (payload: IUserToken): string => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: JWT_EXPIRED_ACCESS_TOKEN,
  })
}

export const generateRefreshToken = (
  payload: Pick<IUserToken, 'id'>,
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: JWT_EXPIRED_REFRESH_TOKEN,
  })
}

export const verifyAccessToken = (token: string): IUserToken => {
  try {
    const tokenVerificated: any = jwt.verify(token, JWT_SECRET, {
      algorithms: [ALGORITHM],
    })
    const userToken: IUserToken = {
      id: tokenVerificated.id,
      email: tokenVerificated.email,
      passwordVersion: tokenVerificated.passwordVersion,
    }
    return userToken
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      throw CustomError('RES_EXPIRED_TOKEN', 401)
    if (error.name === 'JsonWebTokenError')
      throw CustomError('AUTH_INVALID_TOKEN', 401)
  }
}

export const verifyRefreshToken = (token: string): Pick<IUserToken, 'id'> => {
  const tokenVerificated: any = jwt.verify(token, JWT_SECRET, {
    algorithms: [ALGORITHM],
  })
  return tokenVerificated
}
