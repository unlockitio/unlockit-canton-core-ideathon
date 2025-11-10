export const CANTON_JSON_API_URL = import.meta.env.VITE_CANTON_API_URL || 'http://localhost:7575';
export const CANTON_WS_URL = import.meta.env.VITE_CANTON_WS_URL || 'ws://localhost:7575';

export const config = {
  apiUrl: CANTON_JSON_API_URL,
  wsUrl: CANTON_WS_URL,
};
