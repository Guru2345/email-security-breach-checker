import { Request, Response } from 'express';
import crypto from 'crypto';
import {
  checkEmailBreaches,
  checkProfessionalProfile,
  checkPwnedPasswordHash,
  searchPublicBreaches,
  validateHibpKey,
  isValidHibpKeyFormat,
  generate30BreachReport,
  importHibpBreaches,
} from '../services/breachService.js';
import { analyzeUpiMessageWithAi } from '../services/upiFraudService.js';

// Simple in-memory sliding window rate limiter
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

// Strict email format validator RFC 5322 compatible regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function handleCheckEmail(req: Request, res: Response): Promise<void> {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  if (isRateLimited(clientIp)) {
    res.status(429).json({
      error: 'Rate limit exceeded. Please wait a minute before submitting another query to protect security service integrity.',
    });
    return;
  }

  const emailParam = (req.body?.email || req.query?.email || '') as string;
  const clientApiKey = (req.body?.clientApiKey || req.query?.clientApiKey || '') as string;
  const force30Breaches = Boolean(req.body?.force30Breaches ?? req.query?.force30Breaches);

  if (!emailParam || typeof emailParam !== 'string') {
    res.status(400).json({
      error: 'Email address is required. Please provide a valid email to perform security intelligence analysis.',
    });
    return;
  }

  const trimmed = emailParam.trim();
  if (trimmed.length === 0) {
    res.status(400).json({
      error: 'Email address cannot be empty.',
    });
    return;
  }

  if (trimmed.length > 254) {
    res.status(400).json({
      error: 'Email address is too long. Standard email addresses must be under 254 characters.',
    });
    return;
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    res.status(400).json({
      error: 'Invalid email address format. Please enter a valid email format (e.g. user@example.com).',
    });
    return;
  }

  try {
    const report = await checkEmailBreaches(trimmed, clientApiKey, Boolean(force30Breaches));
    res.status(200).json(report);
  } catch (err: any) {
    console.error('[BreachController] Error processing check-email:', err?.message);
    const message = err?.message || 'An unexpected error occurred while communicating with the breach database.';

    if (message.includes('rate limit')) {
      res.status(429).json({ error: message });
      return;
    }
    if (message.includes('unauthorized') || message.includes('API Key')) {
      res.status(401).json({ error: message });
      return;
    }

    res.status(502).json({
      error: 'Breach verification service temporarily unavailable. Please try again in a few moments.',
    });
  }
}

export async function handleCheckProfile(req: Request, res: Response): Promise<void> {
  const { identifier, email } = req.body || {};
  const target = ((email || identifier || req.query?.email || req.query?.identifier || '') as string).trim();

  if (!target) {
    res.status(400).json({
      error: 'Email or username identifier required.',
    });
    return;
  }

  try {
    const result = await checkProfessionalProfile(target);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      found: false,
      message: 'Unable to query public profile directory at this time.',
    });
  }
}

export function handleGetConfig(req: Request, res: Response): void {
  const hasEnvKey = isValidHibpKeyFormat(process.env.HIBP_API_KEY || '');
  res.status(200).json({
    apiKeyConfigured: hasEnvKey,
    mode: hasEnvKey ? 'LIVE_HIBP_AUTHENTICATED' : 'PUBLIC_CATALOG_AND_AUDIT_MODE',
    testScenarios: [
      {
        email: 'john.doe@gmail.com',
        label: 'Personal Gmail (Canva, Dropbox, LinkedIn, MyFitnessPal)',
        expectedRisk: 'CRITICAL',
      },
      {
        email: 'sarah.analyst@techcorp.com',
        label: 'Corporate Tech Profile (Apollo, LinkedIn, Adobe, Evite)',
        expectedRisk: 'CRITICAL',
      },
      {
        email: 'alex.crypto@yahoo.com',
        label: 'Financial & High-PII Leak (Stratfor, Neteller, Adobe)',
        expectedRisk: 'CRITICAL',
      },
      {
        email: 'creative.designer@outlook.com',
        label: 'Creative Profile (Canva, Wattpad, Adobe)',
        expectedRisk: 'HIGH',
      },
      {
        email: 'clean.executive@cyberdefense.com',
        label: 'Clean / Zero Breaches',
        expectedRisk: 'LOW',
      },
    ],
  });
}

/**
 * Handles 100% free official Pwned Passwords check using k-Anonymity.
 * Supports receiving either { prefix, suffix } or { password }.
 * When { password } is sent, it is immediately converted to SHA-1 and never logged or stored.
 */
export async function handleCheckPasswordPwned(req: Request, res: Response): Promise<void> {
  const prefix = req.body?.prefix || req.query?.prefix;
  const suffix = req.body?.suffix || req.query?.suffix;
  const password = req.body?.password || req.query?.password;

  let sha1Prefix = (prefix || '').trim().toUpperCase();
  let sha1Suffix = (suffix || '').trim().toUpperCase();

  if (!sha1Prefix && password && typeof password === 'string') {
    const hash = crypto.createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase();
    sha1Prefix = hash.slice(0, 5);
    sha1Suffix = hash.slice(5);
  }

  if (sha1Prefix.length !== 5 || !sha1Suffix) {
    res.status(400).json({
      error: 'Please provide either a 5-character SHA-1 prefix and suffix, or a password string.',
    });
    return;
  }

  try {
    const result = await checkPwnedPasswordHash(sha1Prefix, sha1Suffix);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(502).json({
      error: err.message || 'Unable to communicate with the free Pwned Passwords service.',
    });
  }
}

/**
 * Searches the ~800+ official documented breaches in HIBP database without any API key.
 */
export async function handleSearchBreaches(req: Request, res: Response): Promise<void> {
  const query = (req.query.q as string) || '';
  if (!query.trim()) {
    res.status(200).json([]);
    return;
  }

  try {
    const results = await searchPublicBreaches(query);
    res.status(200).json(results);
  } catch (err: any) {
    res.status(500).json({ error: 'Error searching public breach catalog.' });
  }
}

/**
 * Validates a user-provided HIBP API key.
 */
export async function handleValidateKey(req: Request, res: Response): Promise<void> {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string') {
    res.status(400).json({
      valid: false,
      status: 'INVALID',
      message: 'API Key must be a non-empty string.',
      tierInfo: 'Free Community Mode is always available without an API key.',
    });
    return;
  }

  const result = await validateHibpKey(apiKey);
  res.status(200).json(result);
}

/**
 * Analyzes an incoming SMS / text message with links for UPI fraud and phishing risks.
 */
export async function handleAnalyzeUpiSms(req: Request, res: Response): Promise<void> {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({
      error: 'Message text is required. Please paste or enter the SMS text message you want to inspect.',
    });
    return;
  }

  if (message.length > 5000) {
    res.status(400).json({
      error: 'Message length exceeds maximum allowed limit of 5,000 characters.',
    });
    return;
  }

  try {
    const analysis = await analyzeUpiMessageWithAi(message.trim());
    res.status(200).json(analysis);
  } catch (error: any) {
    console.error('Error in handleAnalyzeUpiSms:', error);
    res.status(500).json({
      error: 'Failed to analyze the message for UPI fraud risks. Please try again.',
    });
  }
}

/**
 * Generates an authentic 30-breach security audit report from Have I Been Pwned catalog
 */
export async function handleGet30BreachReport(req: Request, res: Response): Promise<void> {
  const email = (req.query.email as string) || (req.body?.email as string) || 'user@example.com';
  try {
    const report = await generate30BreachReport(email);
    res.status(200).json(report);
  } catch (err: any) {
    console.error('Error in handleGet30BreachReport:', err);
    res.status(500).json({ error: 'Failed to generate 30-breach security audit report.' });
  }
}

/**
 * Imports breach names or raw text copied from Have I Been Pwned and maps to full forensic records
 */
export async function handleImportHibpBreaches(req: Request, res: Response): Promise<void> {
  const { email, breachNames, rawText } = req.body;
  const targetEmail = typeof email === 'string' && email.trim() ? email.trim() : 'user@example.com';
  try {
    const report = await importHibpBreaches(targetEmail, breachNames || rawText || []);
    res.status(200).json(report);
  } catch (err: any) {
    console.error('Error in handleImportHibpBreaches:', err);
    res.status(500).json({ error: 'Failed to import breaches from Have I Been Pwned catalog.' });
  }
}



