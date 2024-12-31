import type { IUserToken } from './endpoint'
import type { ILanguages, ITranslation } from '@languages'

declare global {
  namespace Express {
    interface Request {
      userToken: IUserToken
      lng: ILanguages
      t: ITranslation
    }
  }
}

declare namespace Express {
  interface Request {
    file?: Express.Multer.File
  }
}

export type * from './endpoint'
export type { ILanguages, ITranslation }
