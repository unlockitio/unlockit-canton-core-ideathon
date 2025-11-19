import { config } from '../config'
import { SignJWT } from 'jose'
import type { Contract, QueryResult, ExerciseResult, CreateResult } from '../types/canton'

class CantonApiService {
  private token: string | null = null
  private party: string | null = null
  private packageId: string | null = null
  private packageIdPromise: Promise<string> | null = null

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

  private async fetchPackageId(): Promise<string> {
    // If we already have the package ID, return it
    if (this.packageId) {
      return this.packageId
    }

    // If a fetch is already in progress, wait for it
    if (this.packageIdPromise) {
      return this.packageIdPromise
    }

    // Start fetching the package ID
    this.packageIdPromise = (async () => {
      try {
        const response = await this.request<{ packageIds: string[] }>('/v2/packages')

        // Find the package ID for our application by checking package details
        // We look for packages that contain "RETVN" or "W3C" module references
        for (const pkgId of response.packageIds) {
          try {
            // Fetch package details as text to search for identifying strings
            const pkgResponse = await fetch(`${config.apiUrl}/v2/packages/${pkgId}`)
            if (pkgResponse.ok) {
              const pkgText = await pkgResponse.text()
              // Check if this package contains our application modules
              if (pkgText.includes('RETVN') && pkgText.includes('VerifiableCredential')) {
                console.log('[CantonAPI] Found package ID:', pkgId)
                this.packageId = pkgId
                return pkgId
              }
            }
          } catch (err) {
            // Skip packages we can't read
            continue
          }
        }

        throw new Error('Could not find RETVN application package ID')
      } catch (error) {
        // Reset the promise so we can retry
        this.packageIdPromise = null
        throw error
      }
    })()

    return this.packageIdPromise
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
  _query?: Record<string, any>, // Reserved for future field-level filtering support
  activeAtOffset?: string
): Promise<Contract<T>[]> {
  if (!this.party) {
    throw new Error('Party not set. Call setAuth() first.')
  }

  // Fetch the real package ID and construct the full template ID
  console.log('[CantonAPI] Original templateId:', templateId)
  const packageId = await this.fetchPackageId()
  console.log('[CantonAPI] Fetched packageId:', packageId)

  // Strip the placeholder prefix if it exists
  const moduleAndName = templateId.replace('#unlockit-canton-core-ideathon:', '')
  console.log('[CantonAPI] Module and name:', moduleAndName)
  const fullTemplateId = `${packageId}:${moduleAndName}`
  console.log('[CantonAPI] Full templateId:', fullTemplateId)
  console.log('[CantonAPI] Querying for party:', this.party)

  // Fetch the current ledger offset if not provided
  let offset = activeAtOffset
  if (!offset) {
    try {
      const ledgerEndResponse = await this.request<{ offset: string }>('/v2/state/ledger-end')
      offset = ledgerEndResponse.offset
      console.log('[CantonAPI] Fetched ledger offset:', offset)
    } catch (err) {
      console.warn('[CantonAPI] Failed to fetch ledger-end, using "0":', err)
      offset = '0'
    }
  }

  const requestPayload = {
    filter: {
      filtersByParty: {
        [this.party]: {
          cumulative: [
            {
              identifierFilter: {
                TemplateFilter: {
                  value: {
                    templateId: fullTemplateId,
                    includeCreatedEventBlob: true
                  }
                }
              }
            }
          ]
        }
      }
    },
    verbose: true,
    activeAtOffset: offset
  };

  console.log('[CantonAPI] Request payload:', JSON.stringify(requestPayload, null, 2))

  const response = await this.request<any>('/v2/state/active-contracts', {
    method: 'POST',
    body: JSON.stringify(requestPayload),
  });

  console.log('[CantonAPI] Query response:', JSON.stringify(response, null, 2))
  console.log('[CantonAPI] Response type:', typeof response)
  console.log('[CantonAPI] Is array?', Array.isArray(response))

  // Handle different response formats from Canton v2 API
  let contracts: Contract<T>[] = [];

  if (Array.isArray(response)) {
    // Direct array response - each item might be a createdEvent wrapper
    contracts = response.map((item: any) => {
      // Check if item is wrapped in a createdEvent structure
      if (item.createdEvent) {
        return {
          contractId: item.createdEvent.contractId,
          payload: item.createdEvent.payload,
          templateId: item.createdEvent.templateId,
          signatories: item.createdEvent.signatories,
          observers: item.createdEvent.observers
        };
      }
      // If it's already in the correct format, return as-is
      return item;
    });
  } else if (response && typeof response === 'object') {
    // Check for various possible response structures
    if (response.result && Array.isArray(response.result)) {
      contracts = response.result.map((item: any) => {
        if (item.createdEvent) {
          return {
            contractId: item.createdEvent.contractId,
            payload: item.createdEvent.payload,
            templateId: item.createdEvent.templateId,
            signatories: item.createdEvent.signatories,
            observers: item.createdEvent.observers
          };
        }
        return item;
      });
    } else if (response.contracts && Array.isArray(response.contracts)) {
      contracts = response.contracts;
    } else if (response.activeContracts && Array.isArray(response.activeContracts)) {
      contracts = response.activeContracts;
    } else {
      console.warn('[CantonAPI] Unexpected response structure:', JSON.stringify(response, null, 2));
    }
  }

  console.log('[CantonAPI] Number of contracts found:', contracts.length)
  if (contracts.length > 0) {
    console.log('[CantonAPI] First contract structure:', JSON.stringify(contracts[0], null, 2))
  }
  return contracts;
}



  async create<T>(templateId: string, payload: T): Promise<Contract<T>> {
    if (!this.party) {
      throw new Error('Party not set. Call setAuth() first.')
    }

    // Fetch the real package ID and construct the full template ID
    const packageId = await this.fetchPackageId()

    // Strip the placeholder prefix if it exists
    const moduleAndName = templateId.replace('#unlockit-canton-core-ideathon:', '')
    const fullTemplateId = `${packageId}:${moduleAndName}`

    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

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

    // Fetch the real package ID and construct the full template ID
    const packageId = await this.fetchPackageId()

    // Strip the placeholder prefix if it exists
    const moduleAndName = templateId.replace('#unlockit-canton-core-ideathon:', '')
    const fullTemplateId = `${packageId}:${moduleAndName}`

    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

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
