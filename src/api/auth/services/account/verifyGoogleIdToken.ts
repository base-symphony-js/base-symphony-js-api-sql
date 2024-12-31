import { OAuth2Client } from 'google-auth-library'
import { GOOGLE_CLIENT_ID, capitalizeFirstLetter, CustomError } from '@common'

export const verifyGoogleIdToken = async (idToken: string) => {
  // Verify idToken
  const audience = GOOGLE_CLIENT_ID
  const client = new OAuth2Client(audience)
  const ticket = await client.verifyIdToken({ idToken, audience })
  const payload = ticket.getPayload()
  if (!payload) throw CustomError('AUTH_INVALID_CREDENTIALS', 401)

  // Return payload
  const firstName = capitalizeFirstLetter(payload.given_name ?? '')
  const lastName = capitalizeFirstLetter(payload.family_name ?? '')
  const email = payload.email ?? ''
  const photo = payload.picture ?? ''
  return { firstName, lastName, email, photo }
}
