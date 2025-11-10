import { config } from '../config';
import type { Contract, QueryResult, ExerciseResult, CreateResult } from '../types/canton';

class CantonApiService {
  private token: string | null = null;
  private party: string | null = null;

  setAuth(token: string, party: string) {
    this.token = token;
    this.party = party;
  }

  getParty(): string | null {
    return this.party;
  }

  clearAuth() {
    this.token = null;
    this.party = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async allocateParty(displayName: string, identifierHint?: string): Promise<{ party: string }> {
    return this.request('/v1/parties/allocate', {
      method: 'POST',
      body: JSON.stringify({
        identifierHint: identifierHint || displayName.replace(/\s+/g, '_'),
        displayName,
      }),
    });
  }

  async createUser(userId: string, primaryParty: string): Promise<{ userId: string }> {
    return this.request('/v1/user/create', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        primaryParty,
      }),
    });
  }

  async getToken(userId: string): Promise<string> {
    const response = await this.request<{ token: string }>('/v1/user/token', {
      method: 'POST',
      body: JSON.stringify({
        userId,
      }),
    });
    return response.token;
  }

  async query<T>(
    templateId: string,
    query?: Record<string, any>
  ): Promise<Contract<T>[]> {
    const response = await this.request<QueryResult<T>>('/v1/query', {
      method: 'POST',
      body: JSON.stringify({
        templateIds: [templateId],
        query: query || {},
      }),
    });
    return response.result;
  }

  async create<T>(
    templateId: string,
    payload: T
  ): Promise<Contract<T>> {
    const response = await this.request<CreateResult<T>>('/v1/create', {
      method: 'POST',
      body: JSON.stringify({
        templateId,
        payload,
      }),
    });
    return response.result;
  }

  async exercise<TChoice, TResult>(
    templateId: string,
    contractId: string,
    choice: string,
    argument: TChoice
  ): Promise<ExerciseResult<TResult>> {
    return this.request(`/v1/exercise`, {
      method: 'POST',
      body: JSON.stringify({
        templateId,
        contractId,
        choice,
        argument,
      }),
    });
  }
}

export const cantonApi = new CantonApiService();
