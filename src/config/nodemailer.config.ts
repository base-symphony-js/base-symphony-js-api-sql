import {
  NODEMAILER_HOST,
  NODEMAILER_MAIL,
  NODEMAILER_PASS,
  NODEMAILER_PORT,
} from '@common'
import { createTransport } from 'nodemailer'

const port = Number(NODEMAILER_PORT) || 0

export const transporter = createTransport({
  host: NODEMAILER_HOST,
  port,
  secure: port === 465,
  auth: {
    user: NODEMAILER_MAIL,
    pass: NODEMAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})
