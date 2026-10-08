export interface AccountProfile {
  phone: string;
  name: string;
  email: string;
  selected_plan: 'starter' | 'standard' | 'premium' | '';
  is_staff: boolean;
  phone_verified: boolean;
  onboarding_stage: 'kyc' | 'plan' | 'membership' | 'waiting' | 'app';
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'chamaa.accountToken';

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) headers.set('Authorization', `Token ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (response.status === 204) return undefined as T;

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      typeof payload === 'object' && payload !== null && 'detail' in payload &&
      typeof payload.detail === 'string'
        ? payload.detail
        : 'The request could not be completed.';
    throw new Error(detail);
  }

  return payload as T;
}

export function requestOtp(phone: string): Promise<{ debug_code?: string }> {
  return apiRequest('/accounts/otp/request/', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function signupAccount(name: string, email: string, phone: string): Promise<AccountProfile> {
  const result = await apiRequest<{ token: string; user: AccountProfile }>(
    '/accounts/signup/',
    { method: 'POST', body: JSON.stringify({ name, email, phone }) },
  );
  sessionStorage.setItem(TOKEN_STORAGE_KEY, result.token);
  return result.user;
}

export async function verifyOtp(phone: string, code: string): Promise<AccountProfile> {
  const result = await apiRequest<{ token: string; user: AccountProfile }>(
    '/accounts/otp/verify/',
    { method: 'POST', body: JSON.stringify({ phone, code }) },
  );
  sessionStorage.setItem(TOKEN_STORAGE_KEY, result.token);
  return result.user;
}

export function advanceOnboarding(): Promise<AccountProfile> {
  return apiRequest<AccountProfile>('/accounts/onboarding/advance/', { method: 'POST' });
}

export async function submitKyc(data: {
  fullName: string;
  idDocument: File;
  incomeDocument: File;
}): Promise<AccountProfile> {
  const formData = new FormData();
  formData.append('full_name', data.fullName);
  formData.append('id_document', data.idDocument);
  formData.append('income_document', data.incomeDocument);
  const result = await apiRequest<{ user: AccountProfile }>('/accounts/kyc/submit/', {
    method: 'POST',
    body: formData,
  });
  return result.user;
}

export function getCurrentUser(): Promise<AccountProfile | null> {
  if (!sessionStorage.getItem(TOKEN_STORAGE_KEY)) return Promise.resolve(null);
  return apiRequest<AccountProfile>('/accounts/me/');
}

export function updateCurrentUser(
  data: Partial<Pick<AccountProfile, 'name' | 'selected_plan'>>,
): Promise<AccountProfile> {
  return apiRequest<AccountProfile>('/accounts/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function logoutAccount(): Promise<void> {
  try {
    await apiRequest('/accounts/logout/', { method: 'POST' });
  } finally {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function clearAuthToken(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}