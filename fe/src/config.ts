import { SignJWT } from 'jose'

export async function makeLocalToken(userId: string): Promise<string> {
  const secret = new TextEncoder().encode('mydevsecretkeythatshouldbelongenough123')
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setAudience('daml_ledger_api')
    .setExpirationTime('2h')
    .sign(secret)

  return jwt
}

export const userManagement = {
  primaryParty: async (userId: string): Promise<string> => {
    return userId
  },
  publicParty: async (): Promise<string> => {
    return 'public'
  }
}

export const authConfig = {
  provider: 'none' as const,
  makeToken: makeLocalToken,
  userManagement: userManagement
}

export const CANTON_JSON_API_URL = import.meta.env.VITE_CANTON_API_URL
export const CANTON_WS_URL = import.meta.env.VITE_CANTON_WS_URL

export const config = {
  apiUrl: CANTON_JSON_API_URL,
  wsUrl: CANTON_WS_URL
}
