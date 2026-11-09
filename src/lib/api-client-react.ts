import {
  useMutation,
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface ShipperSession {
  authenticated: boolean;
  email?: string;
  isAdmin?: boolean;
}

export interface SubmissionReceipt {
  id: string;
  createdAt: string;
}

export interface ShipperLoad extends SubmissionReceipt {
  companyName: string;
  email: string;
  origin: string;
  destination: string;
  pickupDate: string;
}

interface TradeReference {
  company: string;
  contact: string;
  phone: string;
  email: string;
}

interface CreditApplication {
  legalName: string;
  dba: string;
  address: string;
  ein: string;
  yearsInBusiness: number;
  monthlyVolume: string;
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;
  apName: string;
  apPhone: string;
  apEmail: string;
  tradeReferences: TradeReference[];
  signatureName: string;
  signatureDate: string;
  authorized: boolean;
}

interface CreditApplicationDetail {
  email: string;
  application: CreditApplication;
}

interface GeneratedQueryOptions<T> {
  query?: Omit<UseQueryOptions<T, ApiError, T, QueryKey>, 'queryKey' | 'queryFn'> & {
    queryKey?: QueryKey;
  };
  request?: RequestInit;
}

interface GeneratedMutationOptions {
  request?: RequestInit;
}

async function apiRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json() as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // The development server may return a plain-text 404 when no API is attached.
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function postJson<T>(url: string, data: unknown, request: RequestInit = {}) {
  return apiRequest<T>(url, {
    ...request,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
    body: JSON.stringify(data),
  });
}

export const getGetShipperSessionQueryKey = () => ['/api/shipper/session'] as const;
export const getListAdminCreditApplicationsQueryKey = () => ['/api/shipper/admin/credit-applications'] as const;
export const getListAdminShipperLoadsQueryKey = () => ['/api/shipper/admin/loads'] as const;
export const getGetAdminCreditApplicationQueryKey = (id: string) => [`/api/shipper/admin/credit-applications/${encodeURIComponent(id)}`] as const;

export function useGetShipperSession(options: GeneratedQueryOptions<ShipperSession> = {}) {
  const queryKey = options.query?.queryKey ?? getGetShipperSessionQueryKey();
  return useQuery<ShipperSession, ApiError>({
    ...options.query,
    queryKey,
    queryFn: () => apiRequest<ShipperSession>('/api/shipper/session', options.request),
  });
}

export function useListAdminCreditApplications(options: GeneratedQueryOptions<SubmissionReceipt[]> = {}) {
  const queryKey = options.query?.queryKey ?? getListAdminCreditApplicationsQueryKey();
  return useQuery<SubmissionReceipt[], ApiError>({
    ...options.query,
    queryKey,
    queryFn: () => apiRequest<SubmissionReceipt[]>('/api/shipper/admin/credit-applications', options.request),
  });
}

export function useListAdminShipperLoads(options: GeneratedQueryOptions<ShipperLoad[]> = {}) {
  const queryKey = options.query?.queryKey ?? getListAdminShipperLoadsQueryKey();
  return useQuery<ShipperLoad[], ApiError>({
    ...options.query,
    queryKey,
    queryFn: () => apiRequest<ShipperLoad[]>('/api/shipper/admin/loads', options.request),
  });
}

export function useGetAdminCreditApplication(id: string, options: GeneratedQueryOptions<CreditApplicationDetail> = {}) {
  const queryKey = options.query?.queryKey ?? getGetAdminCreditApplicationQueryKey(id);
  return useQuery<CreditApplicationDetail, ApiError>({
    ...options.query,
    queryKey,
    queryFn: () => apiRequest<CreditApplicationDetail>(`/api/shipper/admin/credit-applications/${encodeURIComponent(id)}`, options.request),
  });
}

export function useSubmitContact(options: GeneratedMutationOptions = {}) {
  return useMutation<unknown, ApiError, { data: unknown }>({
    mutationFn: ({ data }) => postJson('/api/contact', data, options.request),
  });
}

export function useSubmitQuote(options: GeneratedMutationOptions = {}) {
  return useMutation<unknown, ApiError, { data: unknown }>({
    mutationFn: ({ data }) => postJson('/api/quote', data, options.request),
  });
}

export function useLogoutShipper(options: GeneratedMutationOptions = {}) {
  return useMutation<unknown, ApiError, void>({
    mutationFn: () => postJson('/api/shipper/logout', {}, options.request),
  });
}

export function useLogoutAllShipperDevices(options: GeneratedMutationOptions = {}) {
  return useMutation<unknown, ApiError, void>({
    mutationFn: () => postJson('/api/shipper/logout-all', {}, options.request),
  });
}
