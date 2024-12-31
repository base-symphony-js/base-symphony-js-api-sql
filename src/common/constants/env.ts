import 'dotenv/config'
import joi from 'joi'

interface EnvVars {
  PORT: number
  SERVER_URL_NAME: string
  JWT_SECRET: string
  JWT_EXPIRED_ACCESS_TOKEN: string
  JWT_EXPIRED_REFRESH_TOKEN: string
  DATABASE_URL: string
  SEED_USER_NAME: string
  SEED_USER_SURNAME: string
  SEED_USER_EMAIL: string
  SEED_USER_PASSWORD: string
  NODEMAILER_HOST: string
  NODEMAILER_PORT: string
  NODEMAILER_NAME: string
  NODEMAILER_MAIL: string
  NODEMAILER_PASS: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRED_ACCESS_TOKEN: joi.string().required(),
    JWT_EXPIRED_REFRESH_TOKEN: joi.string().required(),
    DATABASE_URL: joi.string().required(),
    SEED_USER_NAME: joi.string().required(),
    SEED_USER_SURNAME: joi.string().required(),
    SEED_USER_EMAIL: joi.string().required(),
    SEED_USER_PASSWORD: joi.string().required(),
    NODEMAILER_HOST: joi.string().required(),
    NODEMAILER_PORT: joi.string().required(),
    NODEMAILER_NAME: joi.string().required(),
    NODEMAILER_MAIL: joi.string().required(),
    NODEMAILER_PASS: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
  })
  .unknown(true)

const { error, value } = envsSchema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value

export const PORT = envVars.PORT ?? 3000
export const SERVER_URL_NAME = envVars.SERVER_URL_NAME ?? ''
export const JWT_SECRET = envVars.JWT_SECRET ?? ''
export const JWT_EXPIRED_ACCESS_TOKEN = envVars.JWT_EXPIRED_ACCESS_TOKEN ?? ''
export const JWT_EXPIRED_REFRESH_TOKEN = envVars.JWT_EXPIRED_REFRESH_TOKEN ?? ''
export const DATABASE_URL = envVars.DATABASE_URL ?? ''
export const SEED_USER_NAME = envVars.SEED_USER_NAME ?? ''
export const SEED_USER_SURNAME = envVars.SEED_USER_SURNAME ?? ''
export const SEED_USER_EMAIL = envVars.SEED_USER_EMAIL ?? ''
export const SEED_USER_PASSWORD = envVars.SEED_USER_PASSWORD ?? ''
export const NODEMAILER_HOST = envVars.NODEMAILER_HOST ?? ''
export const NODEMAILER_PORT = envVars.NODEMAILER_PORT ?? ''
export const NODEMAILER_NAME = envVars.NODEMAILER_NAME ?? ''
export const NODEMAILER_MAIL = envVars.NODEMAILER_MAIL ?? ''
export const NODEMAILER_PASS = envVars.NODEMAILER_PASS ?? ''
export const CLOUDINARY_CLOUD_NAME = envVars.CLOUDINARY_CLOUD_NAME ?? ''
export const CLOUDINARY_API_KEY = envVars.CLOUDINARY_API_KEY ?? ''
export const CLOUDINARY_API_SECRET = envVars.CLOUDINARY_API_SECRET ?? ''
export const GOOGLE_CLIENT_ID = envVars.GOOGLE_CLIENT_ID ?? ''
export const GOOGLE_CLIENT_SECRET = envVars.GOOGLE_CLIENT_SECRET ?? ''
