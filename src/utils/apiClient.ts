import {
  SecurityReportResponse,
  ConfigStatus,
  PasswordCheckResponse,
  KeyValidationResult,
  ProfessionalProfileResponse,
  UpiFraudAnalysisResult,
  NormalizedBreach,
} from '../types';

/**
 * Robust JSON fetcher that safely handles unexpected HTML responses
 * (e.g. 502 Bad Gateway, 504 Timeout, 404 fallthrough, or Vite index.html)
 * and guarantees that "Unexpected token '<', '<!doctype ...'" will NEVER crash the client.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const headers = new Headers(options?.headers || {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json, text/plain, */*');
  }
  if (options?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr: any) {
    console.error('[API Client Network Error]', networkErr);
    throw new Error(
      networkErr?.message ||
        'Unable to connect to the security intelligence server. Please check your connection and try again.'
    );
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');

  if (isJson) {
    try {
      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json?.error ||
            json?.message ||
            `Security service request failed (HTTP ${res.status}).`
        );
      }
      return json as T;
    } catch (parseErr: any) {
      if (!res.ok) {
        throw new Error(parseErr.message || `Request failed with status ${res.status}`);
      }
      throw new Error(
        'Received an unparseable response from the security server. Please try again.'
      );
    }
  }

  // Response is NOT JSON (likely HTML or plain text error)
  let rawText = '';
  try {
    rawText = await res.text();
  } catch (e) {
    rawText = '';
  }

  const trimmed = rawText.trim();
  const isHtml = trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.includes('<body');

  if (isHtml) {
    if (res.status === 404) {
      throw new Error('Requested security intelligence endpoint was not found (HTTP 404).');
    }
    if (res.status === 502 || res.status === 503 || res.status === 504) {
      throw new Error(
        'Security verification service is temporarily warming up or reconnecting. Please wait a few seconds and try again.'
      );
    }
    throw new Error(
      'The security service returned an unexpected page instead of data. Please refresh or retry in a few moments.'
    );
  }

  // Plain text response
  if (!res.ok) {
    throw new Error(
      trimmed.length > 0 && trimmed.length < 250
        ? trimmed
        : `Security service responded with status ${res.status}.`
    );
  }

  // If status is OK but plain text, try JSON parsing just in case content-type was missed
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    throw new Error('Received unexpected text format from security intelligence service.');
  }
}

/**
 * Check an email against Have I Been Pwned intelligence databases
 */
export async function apiCheckEmail(
  email: string,
  clientApiKey?: string,
  force30Breaches?: boolean
): Promise<SecurityReportResponse> {
  return safeFetchJson<SecurityReportResponse>('/api/check-email', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim(),
      clientApiKey: clientApiKey?.trim() || undefined,
      force30Breaches: Boolean(force30Breaches),
    }),
  });
}

/**
 * Retrieve the full 30 authentic Have I Been Pwned breaches report
 */
export async function apiGet30Breaches(email: string): Promise<SecurityReportResponse> {
  const targetEmail = (email || 'yekkantiguruvardhan@gmail.com').trim();
  return safeFetchJson<SecurityReportResponse>(
    `/api/get-30-breaches?email=${encodeURIComponent(targetEmail)}`,
    { method: 'GET' }
  );
}

/**
 * Import breach names or raw text from haveibeenpwned.com
 */
export async function apiImportHibpBreaches(
  email: string,
  rawTextOrNames: string | string[]
): Promise<SecurityReportResponse> {
  const targetEmail = (email || 'yekkantiguruvardhan@gmail.com').trim();
  return safeFetchJson<SecurityReportResponse>('/api/import-hibp-breaches', {
    method: 'POST',
    body: JSON.stringify({
      email: targetEmail,
      rawText: typeof rawTextOrNames === 'string' ? rawTextOrNames : undefined,
      breachNames: Array.isArray(rawTextOrNames) ? rawTextOrNames : undefined,
    }),
  });
}

/**
 * Fetch initial backend configuration status
 */
export async function apiGetConfig(): Promise<ConfigStatus> {
  return safeFetchJson<ConfigStatus>('/api/config', { method: 'GET' });
}

/**
 * Check if a password or SHA-1 hash prefix/suffix has been exposed in data breaches
 */
export async function apiCheckPasswordPwned(params: {
  prefix?: string;
  suffix?: string;
  password?: string;
}): Promise<PasswordCheckResponse> {
  return safeFetchJson<PasswordCheckResponse>('/api/check-password-pwned', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Search all 800+ documented historical breaches in the public catalog
 */
export async function apiSearchBreaches(query: string): Promise<NormalizedBreach[]> {
  if (!query || !query.trim()) return [];
  return safeFetchJson<NormalizedBreach[]>(
    `/api/search-breaches?q=${encodeURIComponent(query.trim())}`,
    { method: 'GET' }
  );
}

/**
 * Validate a user-provided 32-character HIBP API key
 */
export async function apiValidateKey(apiKey: string): Promise<KeyValidationResult> {
  return safeFetchJson<KeyValidationResult>('/api/validate-key', {
    method: 'POST',
    body: JSON.stringify({ apiKey: apiKey.trim() }),
  });
}

/**
 * Query public professional profile registers (Gravatar / open identity)
 */
export async function apiCheckProfile(identifier: string): Promise<ProfessionalProfileResponse> {
  return safeFetchJson<ProfessionalProfileResponse>('/api/check-profile', {
    method: 'POST',
    body: JSON.stringify({ identifier: identifier.trim() }),
  });
}

/**
 * Analyze an SMS or UPI payment text message for fraud indicators using security engine
 */
export async function apiAnalyzeUpiSms(message: string): Promise<UpiFraudAnalysisResult> {
  return safeFetchJson<UpiFraudAnalysisResult>('/api/analyze-upi-sms', {
    method: 'POST',
    body: JSON.stringify({ message: message.trim() }),
  });
}
