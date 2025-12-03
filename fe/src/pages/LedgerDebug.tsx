import React, { useEffect, useState } from 'react'
import { cantonApi } from '../services/cantonApi'
import type { Contract } from '../types/canton'

interface PartyInfo {
  party: string
  displayName: string
  isLocal: boolean
}

interface ContractWithParty extends Contract<any> {
  ownerParty: string
  ownerDisplayName?: string
}

export default function LedgerDebug() {
  const [parties, setParties] = useState<PartyInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [contracts, setContracts] = useState<ContractWithParty[]>([])
  const [loadingContracts, setLoadingContracts] = useState(false)
  const [contractsError, setContractsError] = useState<string | null>(null)
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set())

  // Common templates in your application (based on DAML modules)
  const templateOptions = [
    // W3C Verifiable Credentials
    '#unlockit-canton-core-ideathon:W3C.VC:VerifiableCredential',
    '#unlockit-canton-core-ideathon:W3C.VC:PresentationReceipt',
    '#unlockit-canton-core-ideathon:W3C.VC:CredentialIssuanceRequest',
    // RETVN Role templates
    '#unlockit-canton-core-ideathon:RETVN.Role:UserAccount',
    '#unlockit-canton-core-ideathon:RETVN.Role:RegistrationRequest',
    '#unlockit-canton-core-ideathon:RETVN.Role:TransactionSubmissionRight',
    '#unlockit-canton-core-ideathon:RETVN.Role:TransactionVerificationRight',
    '#unlockit-canton-core-ideathon:RETVN.Role:TransactionVerificationDelegation',
    '#unlockit-canton-core-ideathon:RETVN.Role:MarketDataAccessRight',
    // RETVN Transaction templates
    '#unlockit-canton-core-ideathon:RETVN.Transaction:TransactionData',
    '#unlockit-canton-core-ideathon:RETVN.Transaction:TransactionSubmissionProposal',
    '#unlockit-canton-core-ideathon:RETVN.Transaction:VerificationProposal',
    '#unlockit-canton-core-ideathon:RETVN.Transaction:MarketDataAggregate',
    // RETVN MarketInsight templates
    '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsightOrder',
    '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaymentPendingOrder',
    '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaidMarketInsightOrder',
    '#unlockit-canton-core-ideathon:RETVN.MarketInsight:FailedPaymentOrder',
    '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsight',
    '#unlockit-canton-core-ideathon:RETVN.MarketInsight:ContributorReward',
  ]

  useEffect(() => {
    fetchParties()
  }, [])

  const fetchParties = async () => {
    try {
      const result = await cantonApi.listAllParties()
      setParties(result.parties)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch parties:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch parties')
    } finally {
      setLoading(false)
    }
  }

  const fetchContractsForTemplate = async (templateId: string) => {
    if (!templateId) return

    console.log('[LedgerDebug] Starting to fetch contracts for template:', templateId)
    setLoadingContracts(true)
    setContractsError(null)
    try {
      console.log('[LedgerDebug] Calling queryAllParties...')
      const result = await cantonApi.queryAllParties(templateId)
      console.log('[LedgerDebug] queryAllParties returned:', result)

      if (!result || !result.allContracts) {
        console.error('[LedgerDebug] Invalid result from queryAllParties:', result)
        setContractsError('Invalid response from server')
        setContracts([])
        return
      }

      // Enrich contracts with party display names
      console.log('[LedgerDebug] Enriching contracts...')
      const enrichedContracts = result.allContracts.map(contract => ({
        ...contract,
        ownerDisplayName: parties.find((p: PartyInfo) => p.party === contract.ownerParty)?.displayName || contract.ownerParty
      }))

      console.log('[LedgerDebug] Setting contracts:', enrichedContracts.length)
      setContracts(enrichedContracts)
    } catch (err) {
      console.error('[LedgerDebug] Error fetching contracts:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch contracts'
      setContractsError(errorMsg)
      setContracts([])
    } finally {
      setLoadingContracts(false)
      console.log('[LedgerDebug] Finished fetching contracts')
    }
  }

  const toggleContractExpansion = (contractId: string) => {
    const newExpanded = new Set(expandedContracts)
    if (newExpanded.has(contractId)) {
      newExpanded.delete(contractId)
    } else {
      newExpanded.add(contractId)
    }
    setExpandedContracts(newExpanded)
  }

  const getTemplateShortName = (fullTemplateId: string | undefined) => {
    if (!fullTemplateId) return 'Unknown Template'
    const parts = fullTemplateId.split(':')
    return parts.length >= 2 ? parts.slice(-2).join(':') : fullTemplateId
  }

  if (loading) return <div className="container">Loading ledger state...</div>

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="card-header" style={{ color: '#e53e3e' }}>Error Loading Ledger State</h2>
          <div style={{ padding: '1rem' }}>
            <p style={{ color: '#e53e3e', marginBottom: '1rem' }}>{error}</p>
            <button className="btn btn-primary" onClick={() => { setLoading(true); fetchParties(); }}>
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Ledger Debug Console</h1>
        <p className="text-muted">Development tool to inspect the full ledger state</p>
      </div>

      {/* Parties Section */}
      <div className="card mb-4">
        <h2 className="card-header">All Parties on Ledger ({parties.length})</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {parties.map((party: PartyInfo) => (
            <div
              key={party.party}
              style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div className="font-semibold">{party.displayName || party.party}</div>
                <div className="text-sm text-muted" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {party.party}
                </div>
              </div>
              <span className={`badge ${party.isLocal ? 'badge-success' : 'badge-secondary'}`}>
                {party.isLocal ? 'Local' : 'Remote'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Query Section */}
      <div className="card mb-4">
        <h2 className="card-header">Query Contracts Across All Parties</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="template-select" className="form-label">
            Select Template
          </label>
          <select
            id="template-select"
            className="form-input"
            value={selectedTemplate}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedTemplate(e.target.value)
              fetchContractsForTemplate(e.target.value)
            }}
          >
            <option value="">-- Select a template --</option>
            {templateOptions.map(template => (
              <option key={template} value={template}>
                {getTemplateShortName(template)}
              </option>
            ))}
          </select>
        </div>

        {loadingContracts && <div className="text-muted">Loading contracts...</div>}

        {contractsError && (
          <div style={{ padding: '1rem', backgroundColor: '#fff5f5', border: '1px solid #fc8181', borderRadius: '4px', marginBottom: '1rem' }}>
            <div style={{ color: '#c53030', fontWeight: 'bold', marginBottom: '0.5rem' }}>Error</div>
            <div style={{ color: '#742a2a' }}>{contractsError}</div>
          </div>
        )}

        {!loadingContracts && selectedTemplate && !contractsError && (
          <div>
            <div className="mb-2">
              <strong>Total Contracts: {contracts.length}</strong>
            </div>

            {contracts.length === 0 ? (
              <div className="text-muted">No contracts found for this template</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {contracts.map((contract: ContractWithParty) => {
                  const isExpanded = expandedContracts.has(contract.contractId)
                  return (
                    <div
                      key={contract.contractId}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Contract Header */}
                      <div
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#f7fafc',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleContractExpansion(contract.contractId)}
                      >
                        <div style={{ flex: 1 }}>
                          <div className="font-semibold text-sm">
                            {getTemplateShortName(contract.templateId)}
                          </div>
                          <div className="text-xs text-muted" style={{ fontFamily: 'monospace' }}>
                            {contract.contractId ? contract.contractId.substring(0, 20) + '...' : 'No ID'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="badge badge-info">{contract.ownerDisplayName}</span>
                          <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>

                      {/* Contract Details (Expandable) */}
                      {isExpanded && (
                        <div style={{ padding: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong className="text-sm">Contract ID:</strong>
                            <pre
                              style={{
                                fontSize: '0.75rem',
                                backgroundColor: '#f7fafc',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                marginTop: '0.25rem',
                                overflow: 'auto'
                              }}
                            >
                              {contract.contractId || 'N/A'}
                            </pre>
                          </div>

                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong className="text-sm">Owner Party:</strong>
                            <div className="text-sm">{contract.ownerDisplayName} ({contract.ownerParty})</div>
                          </div>

                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong className="text-sm">Signatories:</strong>
                            <div className="text-sm">{contract.signatories ? contract.signatories.join(', ') : 'None'}</div>
                          </div>

                          {contract.observers && contract.observers.length > 0 && (
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong className="text-sm">Observers:</strong>
                              <div className="text-sm">{contract.observers.join(', ')}</div>
                            </div>
                          )}

                          <div>
                            <strong className="text-sm">Payload:</strong>
                            <pre
                              style={{
                                fontSize: '0.75rem',
                                backgroundColor: '#f7fafc',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                marginTop: '0.25rem',
                                overflow: 'auto',
                                maxHeight: '300px'
                              }}
                            >
                              {JSON.stringify(contract.payload, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contract Summary by Party */}
      {!loadingContracts && contracts.length > 0 && (
        <div className="card">
          <h2 className="card-header">Contracts by Party</h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {parties.map((party: PartyInfo) => {
              const partyContracts = contracts.filter((c: ContractWithParty) => c.ownerParty === party.party)
              if (partyContracts.length === 0) return null

              return (
                <div
                  key={party.party}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div className="font-semibold">{party.displayName || party.party}</div>
                    <div className="text-sm text-muted">{partyContracts.length} contract(s)</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
