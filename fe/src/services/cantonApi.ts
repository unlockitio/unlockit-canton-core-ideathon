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

  // FIXME: simplified!!
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

  // Handle different response formats from Canton v2 API
  let contracts: Contract<T>[] = [];

  if (Array.isArray(response)) {
    // Direct array response - each item might be a createdEvent wrapper
    contracts = response.map((item: any) => {
      // Check for contractEntry.JsActiveContract.createdEvent structure (Canton v2)
      if (item.contractEntry?.JsActiveContract?.createdEvent) {
        const event = item.contractEntry.JsActiveContract.createdEvent;
        return {
          contractId: event.contractId,
          payload: event.createArgument || event.payload, // Canton uses createArgument for the payload
          templateId: event.templateId,
          signatories: event.signatories || [],
          observers: event.observers || [],
          agreementText: event.agreementText || ''
        };
      }
      // Check if item is wrapped in a createdEvent structure
      if (item.createdEvent) {
        return {
          contractId: item.createdEvent.contractId,
          payload: item.createdEvent.createArgument || item.createdEvent.payload,
          templateId: item.createdEvent.templateId,
          signatories: item.createdEvent.signatories || [],
          observers: item.createdEvent.observers || [],
          agreementText: item.createdEvent.agreementText || ''
        };
      }
      // If it's already in the correct format, return as-is
      console.log('[CantonAPI] Unwrapped contract item:', JSON.stringify(item, null, 2));
      return item;
    });
  } else if (response && typeof response === 'object') {
    // Check for various possible response structures
    if (response.result && Array.isArray(response.result)) {
      contracts = response.result.map((item: any) => {
        // Check for contractEntry.JsActiveContract.createdEvent structure (Canton v2)
        if (item.contractEntry?.JsActiveContract?.createdEvent) {
          const event = item.contractEntry.JsActiveContract.createdEvent;
          return {
            contractId: event.contractId,
            payload: event.createArgument || event.payload,
            templateId: event.templateId,
            signatories: event.signatories || [],
            observers: event.observers || [],
            agreementText: event.agreementText || ''
          };
        }
        if (item.createdEvent) {
          return {
            contractId: item.createdEvent.contractId,
            payload: item.createdEvent.createArgument || item.createdEvent.payload,
            templateId: item.createdEvent.templateId,
            signatories: item.createdEvent.signatories || [],
            observers: item.createdEvent.observers || [],
            agreementText: item.createdEvent.agreementText || ''
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

    // Extract userId from party (format: "alice-9b3970be::122002...")
    // Use the first part before '::' or '-' as userId
    const userId = this.party.split('::')[0].split('-')[0] || this.party

    // Canton v3 API format - note the nested 'commands' structure
    const requestBody = {
      commands: {
        commands: [
          {
            CreateCommand: {
              templateId: fullTemplateId,
              createArguments: payload
            }
          }
        ],
        userId: `${userId}-user`,
        commandId,
        actAs: [this.party]
      }
    }

    console.log('[CantonAPI.create] Request body:', JSON.stringify(requestBody, null, 2))

    const response = await this.request<any>('/v2/commands/submit-and-wait-for-transaction', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    console.log('[CantonAPI.create] Response:', JSON.stringify(response, null, 2))

    // Extract the created contract from the transaction response
    // Canton v3 returns transaction with events array
    if (response.transaction?.events) {
      const createdEvent = response.transaction.events.find((e: any) => e.CreatedEvent || e.created)
      if (createdEvent) {
        const event = createdEvent.CreatedEvent || createdEvent.created
        return {
          contractId: event.contractId,
          payload: event.createArgument || event.payload,
          templateId: event.templateId,
          signatories: event.signatories || [],
          observers: event.observers || [],
          agreementText: event.agreementText || ''
        }
      }
    }

    // Fallback for different response structure
    if (response.result) {
      return response.result
    }

    throw new Error('Unexpected response structure from create command')
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

    // Extract userId from party (format: "alice-9b3970be::122002...")
    const userId = this.party.split('::')[0].split('-')[0] || this.party

    // Canton v3 API format
    const requestBody = {
      commands: {
        commands: [
          {
            ExerciseCommand: {
              templateId: fullTemplateId,
              contractId,
              choice,
              choiceArgument: argument
            }
          }
        ],
        userId: `${userId}-user`,
        commandId,
        actAs: [this.party]
      }
    }

    console.log('[CantonAPI.exercise] Request body:', JSON.stringify(requestBody, null, 2))

    const response = await this.request<any>('/v2/commands/submit-and-wait-for-transaction', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    console.log('[CantonAPI.exercise] Response:', JSON.stringify(response, null, 2))

    // Extract exercise result from transaction response
    // Canton v3 returns transaction with events array
    if (response.transaction) {
      return {
        status: 200,
        result: {
          exerciseResult: response.transaction.exerciseResult || response.transaction,
          events: response.transaction.events || []
        }
      }
    }

    // Fallback
    return response as ExerciseResult<TResult>
  }

  /**
   * Lists all parties on the ledger
   */
  async listAllParties(): Promise<{ parties: Array<{ party: string; displayName: string; isLocal: boolean }> }> {
    const response = await this.requestUnauth<{ partyDetails: Array<{ party: string; isLocal: boolean }> }>('/v2/parties')

    // Transform to expected format with displayName extracted from party ID
    const parties = response.partyDetails.map(p => {
      // Extract display name from party ID (format: "name-hash::...")
      const displayName = p.party.split('::')[0] || p.party
      return {
        party: p.party,
        displayName: displayName,
        isLocal: p.isLocal
      }
    })

    return { parties }
  }

  /**
   * Lists all users from Canton user management
   */
  async listAllUsers(): Promise<{ users: Array<{ id: string; primaryParty?: string; isDeactivated: boolean }> }> {
    const response = await this.requestUnauth<{ users: Array<{ id: string; primaryParty?: string; isDeactivated: boolean }> }>('/v2/users')
    return response
  }

  /**
   * Get all UserAccount contracts from the backend API
   * Backend queries as operator party, so it can see all UserAccounts
   */
  async getAllUserAccounts(): Promise<Array<Contract<{
    operator: string
    user: string
    role: string
    verificationWeight: number
    credentialPresentations: string[]
    registeredAt: string
    status: string
  }>>> {
    // Get a token for making the request (backend just validates format)
    const token = await this.getToken('temp')

    const response = await fetch(`${config.backendUrl}/api/user-accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Backend API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // ===== DEVELOPMENT / ADMIN METHODS =====

  // Unauthenticated request for debug/admin purposes
  private async requestUnauth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
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

  /**
   * Query contracts for a specific party (bypasses current authenticated party)
   * Useful for development to see the full ledger state
   */
  async queryAsParty<T>(
    party: string,
    templateId: string,
    activeAtOffset?: string
  ): Promise<Contract<T>[]> {
    // Fetch the real package ID and construct the full template ID
    const packageId = await this.fetchPackageId()
    const moduleAndName = templateId.replace('#unlockit-canton-core-ideathon:', '')
    const fullTemplateId = `${packageId}:${moduleAndName}`

    // Fetch the current ledger offset if not provided
    let offset = activeAtOffset
    if (!offset) {
      try {
        const ledgerEndResponse = await this.request<{ offset: string }>('/v2/state/ledger-end')
        offset = ledgerEndResponse.offset
      } catch (err) {
        console.warn('[CantonAPI] Failed to fetch ledger-end, using "0":', err)
        offset = '0'
      }
    }

    const requestPayload = {
      filter: {
        filtersByParty: {
          [party]: {
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
    }

    const response = await this.requestUnauth<any>('/v2/state/active-contracts', {
      method: 'POST',
      body: JSON.stringify(requestPayload)
    })

    let contracts: Contract<T>[] = []

    if (Array.isArray(response)) {
      contracts = response.map((item: any) => {
        // Check for contractEntry.JsActiveContract.createdEvent structure (Canton v2)
        if (item.contractEntry?.JsActiveContract?.createdEvent) {
          const event = item.contractEntry.JsActiveContract.createdEvent;
          return {
            contractId: event.contractId,
            payload: event.createArgument || event.payload,
            templateId: event.templateId,
            signatories: event.signatories || [],
            observers: event.observers || [],
            agreementText: event.agreementText || ''
          }
        }
        if (item.createdEvent) {
          return {
            contractId: item.createdEvent.contractId,
            payload: item.createdEvent.createArgument || item.createdEvent.payload,
            templateId: item.createdEvent.templateId,
            signatories: item.createdEvent.signatories || [],
            observers: item.createdEvent.observers || [],
            agreementText: item.createdEvent.agreementText || ''
          }
        }
        return item
      })
    } else if (response && typeof response === 'object') {
      if (response.result && Array.isArray(response.result)) {
        contracts = response.result.map((item: any) => {
          // Check for contractEntry.JsActiveContract.createdEvent structure (Canton v2)
          if (item.contractEntry?.JsActiveContract?.createdEvent) {
            const event = item.contractEntry.JsActiveContract.createdEvent;
            return {
              contractId: event.contractId,
              payload: event.createArgument || event.payload,
              templateId: event.templateId,
              signatories: event.signatories || [],
              observers: event.observers || [],
              agreementText: event.agreementText || ''
            }
          }
          if (item.createdEvent) {
            return {
              contractId: item.createdEvent.contractId,
              payload: item.createdEvent.createArgument || item.createdEvent.payload,
              templateId: item.createdEvent.templateId,
              signatories: item.createdEvent.signatories || [],
              observers: item.createdEvent.observers || [],
              agreementText: item.createdEvent.agreementText || ''
            }
          }
          return item
        })
      } else if (response.contracts && Array.isArray(response.contracts)) {
        contracts = response.contracts
      } else if (response.activeContracts && Array.isArray(response.activeContracts)) {
        contracts = response.activeContracts
      }
    }

    return contracts
  }

  /**
   * Query all contracts across all parties for a given template
   * WARNING: This can be expensive on large ledgers. Use for development only.
   */
  async queryAllParties<T>(templateId: string): Promise<{
    byParty: Record<string, Contract<T>[]>
    allContracts: Array<Contract<T> & { ownerParty: string }>
  }> {
    console.log('[CantonAPI.queryAllParties] Starting for template:', templateId)
    const partiesResponse = await this.listAllParties()
    console.log('[CantonAPI.queryAllParties] Got parties:', partiesResponse.parties.length)

    const byParty: Record<string, Contract<T>[]> = {}
    const allContracts: Array<Contract<T> & { ownerParty: string }> = []

    for (const partyInfo of partiesResponse.parties) {
      try {
        console.log('[CantonAPI.queryAllParties] Querying party:', partyInfo.party)
        const contracts = await this.queryAsParty<T>(partyInfo.party, templateId)
        console.log('[CantonAPI.queryAllParties] Got', contracts.length, 'contracts for party:', partyInfo.displayName)

        byParty[partyInfo.party] = contracts

        // Add to allContracts with party info
        contracts.forEach(contract => {
          allContracts.push({
            ...contract,
            ownerParty: partyInfo.party
          })
        })
      } catch (err) {
        console.warn(`[CantonAPI] Failed to query contracts for party ${partyInfo.party}:`, err)
        byParty[partyInfo.party] = []
      }
    }

    console.log('[CantonAPI.queryAllParties] Total contracts found:', allContracts.length)
    return { byParty, allContracts }
  }

  /**
   * Get the complete ledger state for all known templates
   * Returns all contracts grouped by template and party
   */
  async getFullLedgerState(): Promise<{
    parties: Array<{ party: string; displayName: string; isLocal: boolean }>
    packages: string[]
    contractsByTemplate: Record<string, {
      byParty: Record<string, Contract<any>[]>
      total: number
    }>
  }> {
    const partiesResponse = await this.listAllParties()
    const packagesResponse = await this.request<{ packageIds: string[] }>('/v2/packages')

    return {
      parties: partiesResponse.parties,
      packages: packagesResponse.packageIds,
      contractsByTemplate: {}
    }
  }
}

export const cantonApi = new CantonApiService()
