import { Controller, Req, Res, Post, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { IDataResponse } from '@interfaces'
import { cloudinary } from '@config'
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CustomError,
  getErrorResponse,
  validateCloudinarySignature,
} from '@common'

@Controller('api/utils')
export class UtilsController {
  @Get('/cloudinary/:folder/signature')
  @ApiResponse({ status: 200, description: 'Get cloudinary signature.' })
  async getCloudinarySignature(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { params, t } = req
    try {
      // Get signature
      const folder: string = params.folder
      const timestamp = Math.round(new Date().getTime() / 1000) // 1 hour duration
      const paramsToSign = { timestamp, folder }
      const signature = cloudinary.config.utils.api_sign_request(
        paramsToSign,
        CLOUDINARY_API_SECRET,
      )

      // Response
      dataResponse.message = t.UTILS_CLOUDINARY_GET_SIGNATURE
      dataResponse.data = {
        signature,
        timestamp,
        api_key: CLOUDINARY_API_KEY,
        cloud_name: CLOUDINARY_CLOUD_NAME,
        folder,
      }
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }

  @Post('/cloudinary/file/delete')
  @ApiResponse({ status: 200, description: 'Get cloudinary signature.' })
  async deleteCloudinaryFile(@Req() req: Request, @Res() res: Response) {
    let dataResponse: IDataResponse = { statusCode: 200, message: '' }
    const { t, body } = req
    try {
      // Validate fields
      const url: string = body.url
      const signature: string = body.signature
      const timestamp: number = body.timestamp
      const folder: string = body.folder
      if (!url || !signature || !timestamp || !folder)
        throw CustomError('UTILS_CLOUDINARY_REQUIRED_PARAMETERS', 400)

      // Get public_id from url
      const id: string = url.split('profile-pictures')[1].split('.')[0]
      const publicId = folder + id

      // Validate signature
      if (!validateCloudinarySignature(signature, folder, timestamp))
        throw CustomError('UTILS_CLOUDINARY_INVALID_SIGNATURE', 400)
      const resource = await cloudinary.config.uploader.destroy(publicId)

      // Response
      dataResponse.statusCode = resource.result === 'ok' ? 200 : 400
      dataResponse.message = resource.result
      dataResponse.data = resource
    } catch (error) {
      dataResponse = getErrorResponse(t, error)
    }
    return res.status(dataResponse.statusCode).send(dataResponse)
  }
}
