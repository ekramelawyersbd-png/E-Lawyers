// UddoktaPay Hosted Payment Gateway Service
// Supports automated checkout via bKash, Nagad, Rocket, Upay, Visa, Mastercard, AMEX

export interface UddoktaPayConfigData {
  name: string;
  author: string;
  version: string;
  description: string;
  hosted_url: string;
  api_key_masked: string;
  secret_key_masked: string;
  has_api_key: boolean;
  has_secret_key: boolean;
  is_sandbox: boolean;
  enabled: boolean;
  updated_at?: string;
  supported_methods: Array<{
    name: string;
    type: string;
    color: string;
  }>;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    default?: string;
  }>;
  endpoints?: {
    success_url: string;
    cancel_url: string;
    ipn_url: string;
  };
}

export interface InitiateCheckoutParams {
  fullName: string;
  email: string;
  amount: number | string;
  metadata?: Record<string, any>;
  redirectUrl?: string;
  cancelUrl?: string;
}

export interface InitiateCheckoutResponse {
  status: boolean;
  message?: string;
  payment_url?: string;
  session_id?: string;
  invoice_id?: string;
  amount?: number | string;
  currency?: string;
  api_key_verified?: string;
  gateway?: string;
  is_sandbox?: boolean;
}

export interface VerifyPaymentResponse {
  status: boolean;
  verified: boolean;
  status_code?: string;
  session_id?: string;
  invoice_id?: string;
  amount?: string | number;
  currency?: string;
  charged_amount?: string | number;
  fee?: string;
  payment_method?: string;
  sender_number?: string;
  transaction_id?: string;
  api_key_verified?: string;
  date?: string;
  message?: string;
  metadata?: Record<string, any>;
}

export async function fetchUddoktaPayConfig(): Promise<UddoktaPayConfigData | null> {
  try {
    const res = await fetch('/api/payment/uddoktapay/config');
    const data = await res.json();
    if (data && data.status && data.config) {
      return data.config;
    }
  } catch (err) {
    console.error('Failed to fetch UddoktaPay config:', err);
  }
  return null;
}

export async function saveUddoktaPayConfig(updates: {
  api_key?: string;
  secret_key?: string;
  hosted_url?: string;
  is_sandbox?: boolean;
  enabled?: boolean;
}): Promise<{ status: boolean; message?: string }> {
  try {
    const res = await fetch('/api/payment/uddoktapay/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await res.json();
  } catch (err: any) {
    return { status: false, message: err.message || 'Failed to update config' };
  }
}

export async function initiateUddoktaPayCheckout(
  params: InitiateCheckoutParams
): Promise<InitiateCheckoutResponse> {
  try {
    const res = await fetch('/api/payment/uddoktapay/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: params.fullName,
        email: params.email,
        amount: params.amount,
        metadata: params.metadata || {},
        redirect_url: params.redirectUrl,
        cancel_url: params.cancelUrl,
      }),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Failed to initiate UddoktaPay checkout:', err);
    return {
      status: false,
      message: err.message || 'Network error initiating UddoktaPay checkout',
    };
  }
}

export async function verifyUddoktaPayPayment(
  invoiceId: string
): Promise<VerifyPaymentResponse> {
  try {
    const res = await fetch('/api/payment/uddoktapay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_id: invoiceId }),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Failed to verify payment with UddoktaPay:', err);
    return {
      status: false,
      verified: false,
      message: err.message || 'Network error verifying payment',
    };
  }
}

export interface AuthVerifyResponse {
  status: string;
  authenticated: boolean;
  api_key?: string;
  account?: {
    name: string;
    tier: string;
    sandbox: boolean;
  };
  message: string;
}

export async function authVerifyUddoktaPay(params?: {
  api_key?: string;
  hosted_url?: string;
  is_sandbox?: boolean;
}): Promise<AuthVerifyResponse> {
  try {
    const res = await fetch('/api/payment/uddoktapay/auth-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
    });
    return await res.json();
  } catch (err: any) {
    return {
      status: 'error',
      authenticated: false,
      message: err.message || 'Authentication test failed',
    };
  }
}

