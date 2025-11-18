import { config } from '../config'
import { SignJWT } from 'jose'
import type { Contract, QueryResult, ExerciseResult, CreateResult } from '../types/canton'

class CantonApiService {
  private token: string | null = null
  private party: string | null = null

  setAuth(token: string, party: string) {
    this.token = token
    this.party = party
  }

  getParty(): string | null {
    return this.party
  }

  clearAuth() {
    this.token = null
    this.party = null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getToken(userId: string): Promise<string> {
    const secret = new TextEncoder().encode('mydevsecretkeythatshouldbelongenough123')
    const jwt = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setAudience('daml_ledger_api')
      .setExpirationTime('2h')
      .sign(secret)
    return jwt
  }

  async allocateParty(displayName: string, identifierHint?: string): Promise<{ party: string }> {
    return this.request('/v2/parties', {
      method: 'POST',
      body: JSON.stringify({
        identifierHint: identifierHint || displayName.replace(/\s+/g, '_'),
        displayName
      })
    })
  }

  async createUser(userId: string, primaryParty: string): Promise<{ id: string }> {
    return this.request('/v2/users', {
      method: 'POST',
      body: JSON.stringify({
        id: userId,
        primaryParty
      })
    })
  }

async query<T>(
  templateId: string,
  query?: Record<string, any>,
  activeAtOffset = '0'
): Promise<Contract<T>[]> {
  if (!this.party) {
    throw new Error('Party not set. Call setAuth() first.')
  }

  // Ensure templateId has the package prefix
  const fullTemplateId = templateId.startsWith('#') ? templateId : `#unlockit-canton-core-ideathon:${templateId}`

  const response = await this.request<Contract<T>[]>('/v2/state/active-contracts', {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        templateIds: [fullTemplateId],
        filtersByParty: {
          [this.party]: query || {}
        }
      },
      verbose: false,
      activeAtOffset
    }),
  });

  // Canton API returns array directly, not { result: [...] }
  return response;
}



  async create<T>(templateId: string, payload: T): Promise<Contract<T>> {
    if (!this.party) {
      throw new Error('Party not set. Call setAuth() first.')
    }

    // Ensure templateId has the package prefix
    const fullTemplateId = templateId.startsWith('#') ? templateId : `#unlockit-canton-core-ideathon:${templateId}`

    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const response = await this.request<CreateResult<T>>('/v2/commands/submit-and-wait', {
      method: 'POST',
      body: JSON.stringify({
        commandId,
        actAs: [this.party],
        commands: [
          {
            create: {
              templateId: fullTemplateId,
              payload
            }
          }
        ]
      })
    })

    return response.result
  }

  async exercise<TChoice, TResult>(
    templateId: string,
    contractId: string,
    choice: string,
    argument: TChoice
  ): Promise<ExerciseResult<TResult>> {
    if (!this.party) {
      throw new Error('Party not set. Call setAuth() first.')
    }

    // Ensure templateId has the package prefix
    const fullTemplateId = templateId.startsWith('#') ? templateId : `#unlockit-canton-core-ideathon:${templateId}`

    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return this.request('/v2/commands/submit-and-wait', {
      method: 'POST',
      body: JSON.stringify({
        commandId,
        actAs: [this.party],
        commands: [
          {
            exercise: {
              templateId: fullTemplateId,
              contractId,
              choice,
              argument
            }
          }
        ]
      })
    })
  }
}

export const cantonApi = new CantonApiService()
