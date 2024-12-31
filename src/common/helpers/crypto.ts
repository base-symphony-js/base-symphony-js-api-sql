import crypto from 'crypto'
import { CLOUDINARY_API_SECRET } from '../constants'
import { cloudinary } from '@config'

export const generateOTPCrypto = () => {
  return crypto.randomInt(100000, 999999).toString()
}

export const validateCloudinarySignature = (
  signature: string,
  folder: string,
  timestamp: number,
) => {
  const paramsToSign = { timestamp, folder }
  const expectedSignature = cloudinary.config.utils.api_sign_request(
    paramsToSign,
    CLOUDINARY_API_SECRET,
  )
  if (signature === expectedSignature) {
    const now = Math.round(new Date().getTime() / 1000)
    const maxDiff = 3600 // 1 hour
    return now - maxDiff <= timestamp && timestamp <= now + maxDiff
  }
  return false
}
