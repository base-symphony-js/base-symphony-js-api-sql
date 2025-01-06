/*
 * Copyright (c) 2025 Luis Solano. All rights reserved.
 * Licensed under the MIT License. See the LICENSE file in the root of this repository for more information.
 */
import { Injectable, NestMiddleware } from '@nestjs/common'
import type { IDataResponse, ILanguages } from '@interfaces'
import { translations } from '@languages'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const dataResponse = {} as IDataResponse
    try {
      // Get user langues
      const userLanguage: string = req.headers['accept-language'] ?? ''
      const language: ILanguages = userLanguage as ILanguages
      const defaultLanguage: ILanguages = 'en'

      // Verify languages selected
      if (Object.keys(translations).includes(language)) {
        req.lng = language
        req.t = translations[language]
      } else {
        req.lng = defaultLanguage
        req.t = translations[defaultLanguage]
      }

      next()
    } catch (error) {
      dataResponse.statusCode = 500
      dataResponse.message = 'Language error'
      dataResponse.data = {
        name: error.name,
        message: error.message,
      }
      return res.status(500).send(dataResponse)
    }
  }
}
