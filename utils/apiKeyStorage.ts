
const STORAGE_KEY = 'gemini_api_key';

export const getStoredApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return atob(stored);
  } catch (e) {
    console.error('Failed to decode API key', e);
    return null;
  }
};

export const setStoredApiKey = (apiKey: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, btoa(apiKey));
};

export const removeStoredApiKey = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
