export interface AccountProfile {
  phone: string;
  name: string;
  email: string;
  selected_plan: 'starter' | 'standard' | 'premium' | '';
  is_staff: boolean;
  is_admin: boolean;
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
    let message = 'The request could not be completed.';
    if (typeof payload === 'object' && payload !== null) {
      if ('detail' in payload && typeof payload.detail === 'string') {
        message = payload.detail;
      } else {
        const validationMessages = Object.entries(payload).flatMap(([field, value]) => {
          const errors = Array.isArray(value) ? value : [value];
          return errors
            .filter((error): error is string => typeof error === 'string')
            .map((error) => field === 'non_field_errors' ? error : `${field}: ${error}`);
        });
        if (validationMessages.length > 0) message = validationMessages.join(' ');
      }
    }
    throw new Error(message);
  }

  return payload as T;
}

export async function signupAccount(
  name: string,
  email: string,
  password: string,
  phone: string,
): Promise<AccountProfile> {
  const result = await apiRequest<{ token: string; user: AccountProfile }>(
    '/accounts/signup/',
    { method: 'POST', body: JSON.stringify({ name, email, password, phone }) },
  );
  sessionStorage.setItem(TOKEN_STORAGE_KEY, result.token);
  return result.user;
}

export async function loginAccount(email: string, password: string): Promise<AccountProfile> {
  const result = await apiRequest<{ token: string; user: AccountProfile }>(
    '/accounts/login/',
    { method: 'POST', body: JSON.stringify({ email, password }) },
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
  paymentMode: 'manual' | 'direct_debit';
}): Promise<AccountProfile> {
  const formData = new FormData();
  formData.append('full_name', data.fullName);
  formData.append('id_document', data.idDocument);
  formData.append('income_document', data.incomeDocument);
  formData.append('payment_mode', data.paymentMode);
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

export interface AdminAccount {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  payment_mode: 'manual' | 'direct_debit';
  onboarding_stage: AccountProfile['onboarding_stage'];
  kyc_status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  kyc_full_name: string;
  kyc_submitted_at: string | null;
  id_document_uploaded: boolean;
  income_document_uploaded: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_admin: boolean;
  date_joined: string;
}

export function getAdminUsers(): Promise<AdminAccount[]> {
  return apiRequest<AdminAccount[]>('/accounts/admin/users/');
}

export function setAdminUserActive(userId: number, isActive: boolean): Promise<AdminAccount> {
  return apiRequest<AdminAccount>(`/accounts/admin/users/${userId}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  });
}

export interface AdminCircleMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  rotation_order: number | null;
  is_active: boolean;
  joined_at: string;
}

export interface AdminCircle {
  id: number;
  name: string;
  circle_type: 'managed' | 'private';
  plan_tier: 'starter' | 'standard' | 'premium' | '';
  visibility: 'public' | 'private';
  created_by: string | null;
  contribution_amount: number;
  cadence: 'weekly' | 'monthly';
  max_members: number;
  membership_fee_percent: string;
  security_buffer_months: number;
  status: 'forming' | 'active' | 'completed' | 'paused';
  member_count: number;
  is_member: boolean;
  created_at: string;
  members: AdminCircleMember[];
}

export interface AdminGroupActivity {
  id: string;
  kind: string;
  group_id: number;
  group_name: string;
  description: string;
  occurred_at: string;
}

export interface AdminGroupOverview {
  groups: AdminCircle[];
  activity: AdminGroupActivity[];
}

export function getAdminGroupOverview(): Promise<AdminGroupOverview> {
  return apiRequest<AdminGroupOverview>('/groups/admin/overview/');
}

export function createManagedCircle(data: {
  name: string;
  plan_tier: 'starter' | 'standard' | 'premium';
  contribution_amount: number;
  cadence: 'weekly' | 'monthly';
  max_members: 4 | 5;
}): Promise<Omit<AdminCircle, 'members'>> {
  return apiRequest<Omit<AdminCircle, 'members'>>('/groups/circles/', {
    method: 'POST',
    body: JSON.stringify({ ...data, circle_type: 'managed', visibility: 'public' }),
  });
}

export function reviewAdminKyc(
  userId: number,
  status: 'approved' | 'rejected',
): Promise<AdminAccount> {
  return apiRequest<AdminAccount>(`/accounts/admin/users/${userId}/kyc/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getAdminKycDocument(
  userId: number,
  documentType: 'id' | 'income',
): Promise<{ url: string; contentType: string }> {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  const response = await fetch(
    `${API_BASE_URL}/accounts/admin/users/${userId}/kyc/documents/${documentType}/`,
    { headers: token ? { Authorization: `Token ${token}` } : undefined },
  );
  if (!response.ok) throw new Error('Could not open this private document.');
  const blob = await response.blob();
  return {
    url: URL.createObjectURL(blob),
    contentType: response.headers.get('Content-Type') || blob.type,
  };
}