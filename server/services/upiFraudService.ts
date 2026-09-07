import { GoogleGenAI } from '@google/genai';
import { UpiFraudAnalysisResult, UpiLinkDetails } from '../types.js';

const URL_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  'is.gd',
  'cutt.ly',
  't.co',
  'rb.gy',
  'shorturl.at',
  'ow.ly',
  'buff.ly',
  'goo.gl',
  'rebrand.ly',
  'wa.me',
]);

const TRUSTED_BANK_DOMAINS = [
  'sbi.co.in',
  'onlinesbi.sbi',
  'hdfcbank.com',
  'icicibank.com',
  'axisbank.com',
  'kotak.com',
  'bankofbaroda.in',
  'phonepe.com',
  'paytm.com',
  'google.com',
  'npci.org.in',
  'indiapost.gov.in',
  'incometax.gov.in',
];

/**
 * Parses any extracted URL or UPI URI to identify protocols, parameters, and deceptive indicators.
 */
export function extractAndAnalyzeLinks(text: string): UpiLinkDetails[] {
  const linkRegex = /((?:https?:\/\/|upi:\/\/|intent:\/\/)[^\s]+|(?:[a-zA-Z0-9-]+\.)+(?:com|in|org|net|xyz|online|top|cc|site|live|club|info|app|co|biz|me|tech)[^\s]*)/gi;
  const matches = text.match(linkRegex) || [];
  const results: UpiLinkDetails[] = [];
  const seen = new Set<string>();

  for (let rawUrl of matches) {
    // Strip trailing punctuation often found at end of SMS sentences
    rawUrl = rawUrl.replace(/[.,;!?)]+$/, '');
    if (seen.has(rawUrl.toLowerCase())) continue;
    seen.add(rawUrl.toLowerCase());

    const isUpiScheme = rawUrl.toLowerCase().startsWith('upi://');
    let domain = '';
    let protocol = 'https:';
    const suspiciousIndicators: string[] = [];
    let upiParams: UpiLinkDetails['upiParams'] = undefined;

    if (isUpiScheme) {
      protocol = 'upi:';
      domain = 'UPI Direct Payment Gateway';
      try {
        const queryIndex = rawUrl.indexOf('?');
        if (queryIndex !== -1) {
          const queryString = rawUrl.slice(queryIndex + 1);
          const params = new URLSearchParams(queryString);
          upiParams = {
            payeeVpa: params.get('pa') || undefined,
            payeeName: params.get('pn') || undefined,
            amount: params.get('am') || undefined,
            transactionNote: params.get('tn') || undefined,
            transactionRef: params.get('tr') || undefined,
          };

          if (upiParams.amount && parseFloat(upiParams.amount) > 0) {
            suspiciousIndicators.push(
              `Direct payment intent for ₹${upiParams.amount} to payee VPA: ${upiParams.payeeVpa || 'Unknown'}`
            );
          }
        }
      } catch (e) {
        suspiciousIndicators.push('Malformed UPI protocol string format');
      }
    } else {
      let formattedUrl = rawUrl;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      try {
        const parsed = new URL(formattedUrl);
        domain = parsed.hostname.toLowerCase();
        protocol = parsed.protocol;
      } catch (e) {
        domain = rawUrl.split('/')[0].toLowerCase();
      }
    }

    // Check for URL shorteners
    const isShortenedUrl = URL_SHORTENERS.has(domain.replace(/^www\./, ''));
    if (isShortenedUrl) {
      suspiciousIndicators.push(`Obfuscated link via URL shortener (${domain}) concealing actual destination`);
    }

    // Check for suspicious non-standard TLDs often favored by cybercriminals
    if (
      domain.endsWith('.online') ||
      domain.endsWith('.top') ||
      domain.endsWith('.cc') ||
      domain.endsWith('.xyz') ||
      domain.endsWith('.club') ||
      domain.endsWith('.live') ||
      domain.endsWith('.site') ||
      domain.endsWith('.top') ||
      domain.endsWith('.vip')
    ) {
      suspiciousIndicators.push(`Suspicious low-reputation domain extension (.${domain.split('.').pop()})`);
    }

    // Check for brand name spoofing in domain (e.g. sbi-kyc, phonepe-reward, etc.)
    const suspiciousBrandKeywords = [
      'sbi',
      'yono',
      'phonepe',
      'gpay',
      'paytm',
      'hdfc',
      'icici',
      'axis',
      'bijli',
      'electricity',
      'kyc',
      'pan',
      'reward',
      'cashback',
      'lottery',
      'post',
      'customs',
    ];

    const isOfficiallyTrusted = TRUSTED_BANK_DOMAINS.some(
      (td) => domain === td || domain.endsWith(`.${td}`)
    );

    if (!isOfficiallyTrusted && !isUpiScheme) {
      for (const brand of suspiciousBrandKeywords) {
        if (domain.includes(brand)) {
          suspiciousIndicators.push(
            `Deceptive domain spoofing legitimate financial/government brand "${brand}" (${domain})`
          );
          break;
        }
      }
    }

    // Check for IP address URLs (e.g. http://192.168.1.1/pay)
    if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(domain)) {
      suspiciousIndicators.push('Raw numeric IP address used instead of a legitimate registered domain');
    }

    results.push({
      url: rawUrl,
      domain,
      protocol,
      isUpiScheme,
      upiParams,
      isShortenedUrl,
      suspiciousIndicators,
    });
  }

  return results;
}

/**
 * Offline heuristic rule-engine to classify UPI and SMS threats deterministically.
 */
export function analyzeSmsHeuristically(
  messageText: string,
  links: UpiLinkDetails[]
): UpiFraudAnalysisResult {
  const lower = messageText.toLowerCase();
  const redFlags: string[] = [];
  let score = 5;
  let scamCategory = 'Unclassified Message';
  let impersonatedEntity: string | null = null;
  let isUrgentOrThreatening = false;
  let upiCollectTrickDetected = false;

  // 1. UPI PIN / Collect Request Deception Detection
  const hasPinRequest =
    lower.includes('pin') &&
    (lower.includes('enter') ||
      lower.includes('receive') ||
      lower.includes('claim') ||
      lower.includes('deposit') ||
      lower.includes('accept'));

  if (hasPinRequest) {
    upiCollectTrickDetected = true;
    score += 45;
    redFlags.push(
      'CRITICAL DECEPTION: Message claims you must "enter UPI PIN to receive money". In UPI architecture, you NEVER enter your PIN to receive money — only to pay!'
    );
  }

  // 2. Urgent / Threatening Tone (Disconnection, Suspension, Legal)
  const isElectricityDisconnection =
    (lower.includes('electricity') || lower.includes('power') || lower.includes('bijli')) &&
    (lower.includes('disconnect') || lower.includes('cut') || lower.includes('bill') || lower.includes('officer'));

  if (isElectricityDisconnection) {
    scamCategory = 'Fake Electricity Bill Disconnection Scam';
    impersonatedEntity = 'Electricity Distribution Company';
    isUrgentOrThreatening = true;
    score += 40;
    redFlags.push(
      'Threat of immediate utility power cut (e.g., "tonight at 9:30 PM") designed to induce panic and bypass logical scrutiny.'
    );
    redFlags.push(
      'Directs victim to call a personal 10-digit mobile number or click an unofficial portal link rather than official discom portal.'
    );
  }

  const isBankKycSuspension =
    (lower.includes('sbi') ||
      lower.includes('yono') ||
      lower.includes('hdfc') ||
      lower.includes('icici') ||
      lower.includes('bank') ||
      lower.includes('account')) &&
    (lower.includes('kyc') ||
      lower.includes('blocked') ||
      lower.includes('suspended') ||
      lower.includes('pan') ||
      lower.includes('deactivated') ||
      lower.includes('freeze'));

  if (isBankKycSuspension) {
    scamCategory = 'Fake Bank KYC / Account Suspension Phishing';
    impersonatedEntity = lower.includes('sbi')
      ? 'State Bank of India (YONO)'
      : lower.includes('hdfc')
      ? 'HDFC Bank'
      : lower.includes('icici')
      ? 'ICICI Bank'
      : 'Commercial Bank';
    isUrgentOrThreatening = true;
    score += 40;
    redFlags.push(
      'False claim that your bank account or debit card has been blocked/deactivated due to pending KYC or PAN update.'
    );
  }

  const isPrizeOrLottery =
    (lower.includes('won') || lower.includes('lottery') || lower.includes('scratch card') || lower.includes('cashback') || lower.includes('reward')) &&
    (lower.includes('₹') || lower.includes('rs') || lower.includes('inr') || lower.includes('phonepe') || lower.includes('gpay') || lower.includes('paytm'));

  if (isPrizeOrLottery) {
    scamCategory = 'Fake Reward, Cashback or Scratch Card Scam';
    impersonatedEntity = lower.includes('phonepe')
      ? 'PhonePe'
      : lower.includes('gpay') || lower.includes('google pay')
      ? 'Google Pay'
      : lower.includes('paytm')
      ? 'Paytm'
      : 'Payment Rewards App';
    score += 35;
    redFlags.push(
      'Offers unprompted cash rewards, lottery prizes, or cashback requiring user action via a link.'
    );
  }

  const isWorkFromHome =
    (lower.includes('part-time') || lower.includes('part time') || lower.includes('earn daily') || lower.includes('work from home')) &&
    (lower.includes('youtube') || lower.includes('telegram') || lower.includes('like') || lower.includes('review') || lower.includes('wa.me'));

  if (isWorkFromHome) {
    scamCategory = 'Part-Time Task & Telegram Prepayment Scam';
    impersonatedEntity = 'Recruitment / Social Media Marketing Agency';
    score += 35;
    redFlags.push(
      'Offers unrealistic daily income (e.g. ₹3,000–₹8,000) for trivial tasks like liking videos, leading to a prepaid crypto/UPI deposit trap.'
    );
  }

  const isDeliveryCustoms =
    (lower.includes('parcel') || lower.includes('courier') || lower.includes('india post') || lower.includes('fedex') || lower.includes('delivery')) &&
    (lower.includes('address') || lower.includes('fee') || lower.includes('hold') || lower.includes('customs') || lower.includes('track'));

  if (isDeliveryCustoms) {
    scamCategory = 'Fake Postal Delivery / Customs Fee Scam';
    impersonatedEntity = lower.includes('india post') ? 'India Post' : 'Postal / Courier Service';
    score += 35;
    redFlags.push(
      'Claims parcel delivery failed due to incomplete address and demands an urgent nominal payment via link.'
    );
  }

  // Check for remote desktop application references
  if (
    lower.includes('anydesk') ||
    lower.includes('teamviewer') ||
    lower.includes('rustdesk') ||
    lower.includes('quicksupport')
  ) {
    score += 45;
    redFlags.push(
      'DANGEROUS: Solicits installation of remote screen-sharing software (AnyDesk, TeamViewer, RustDesk) which allows attackers to take over your device.'
    );
  }

  // Check link flags
  for (const link of links) {
    if (link.isUpiScheme) {
      score += 25;
      redFlags.push(`Contains direct UPI intent URI (${link.url})`);
    }
    if (link.isShortenedUrl) {
      score += 15;
      redFlags.push(`Conceals actual link destination via URL shortener (${link.domain})`);
    }
    for (const ind of link.suspiciousIndicators) {
      if (!redFlags.includes(ind)) {
        redFlags.push(ind);
        score += 10;
      }
    }
  }

  // Safe bank credit alert detection
  const isLegitimateBankAlert =
    (lower.includes('credited with inr') || lower.includes('credited with rs') || lower.includes('credited with ₹')) &&
    (lower.includes('avail bal') || lower.includes('available balance')) &&
    links.length === 0 &&
    !hasPinRequest &&
    !isUrgentOrThreatening;

  if (isLegitimateBankAlert) {
    scamCategory = 'Legitimate Bank Transaction Notification';
    score = 0;
    redFlags.length = 0;
  }

  // Clamp score
  score = Math.min(100, Math.max(0, score));

  let riskLevel: UpiFraudAnalysisResult['riskLevel'] = 'LOW' as any;
  if (score >= 70) {
    riskLevel = 'CRITICAL';
  } else if (score >= 45) {
    riskLevel = 'HIGH';
  } else if (score >= 20) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'SAFE';
  }

  const defensiveRecommendations: string[] = [];
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    defensiveRecommendations.push('DO NOT click or tap on any link contained in this text message.');
    if (upiCollectTrickDetected) {
      defensiveRecommendations.push(
        'REMEMBER: You NEVER enter your UPI PIN to receive funds. Entering your PIN authorizes money to leave your account immediately.'
      );
    }
    defensiveRecommendations.push('Block and report the sender number immediately on your smartphone.');
    defensiveRecommendations.push(
      'Report the fraudulent message on the Indian Government Chakshu Portal (sancharsaathi.gov.in) and National Cyber Crime Portal (cybercrime.gov.in) or call Helpline 1930.'
    );
    if (impersonatedEntity) {
      defensiveRecommendations.push(
        `Contact ${impersonatedEntity} only through their official customer support number printed on your debit card or verified official website.`
      );
    }
  } else if (riskLevel === 'MEDIUM') {
    defensiveRecommendations.push('Verify the sender through an independent official channel before engaging.');
    defensiveRecommendations.push('Never share OTPs, UPI PINs, or card CVVs with anyone.');
  } else {
    defensiveRecommendations.push('Message appears to be an informational notification. Always verify transaction amounts against your official banking mobile app.');
  }

  let summary = '';
  if (riskLevel === 'CRITICAL') {
    summary = `This message exhibits hallmarks of an active cyber fraud attempt (${scamCategory}). It utilizes deceptive urgency or payment links designed to drain bank funds.`;
  } else if (riskLevel === 'HIGH') {
    summary = `High risk detected. The message incorporates suspicious payment vectors, unverified domains, or impersonation techniques (${scamCategory}).`;
  } else if (riskLevel === 'MEDIUM') {
    summary = 'Moderate risk detected. Exercise caution and verify the source before clicking any attachments or links.';
  } else {
    summary = 'No immediate fraud vectors detected. Appears to be a standard informational alert.';
  }

  return {
    messageText,
    riskLevel,
    riskScore: score,
    scamCategory,
    summary,
    isUrgentOrThreatening,
    impersonatedEntity,
    redFlags,
    extractedLinks: links,
    upiCollectTrickDetected,
    defensiveRecommendations,
    helplineNotice: {
      indiaCyberHelpline: '1930',
      portal: 'https://cybercrime.gov.in',
      chakshuPortal: 'https://sancharsaathi.gov.in/sfc/',
    },
    analyzedBy: 'HEURISTIC_SECURITY_ENGINE',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analyzes an incoming SMS / text message with Gemini AI + Heuristic fallback.
 */
export async function analyzeUpiMessageWithAi(
  messageText: string
): Promise<UpiFraudAnalysisResult> {
  const links = extractAndAnalyzeLinks(messageText);
  const heuristicResult = analyzeSmsHeuristically(messageText, links);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('[UPI Fraud AI] GEMINI_API_KEY not found in environment. Using heuristic security engine.');
    return heuristicResult;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a certified cyber fraud forensic investigator and financial security expert specializing in Indian digital payment frauds (UPI, smishing, collect request scams, electricity bill disconnection frauds, bank KYC scams, part-time job Telegram scams, APK malware downloads).
Analyze the user's SMS/text message thoroughly and return a valid JSON object matching this exact structure:
{
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "SAFE",
  "riskScore": number (0 to 100),
  "scamCategory": string,
  "summary": string,
  "isUrgentOrThreatening": boolean,
  "impersonatedEntity": string | null,
  "redFlags": string[],
  "upiCollectTrickDetected": boolean,
  "defensiveRecommendations": string[]
}
Guidelines:
1. If the message claims the user must "enter UPI PIN to receive money", set upiCollectTrickDetected to true, riskLevel to CRITICAL, and riskScore to at least 95.
2. If it threatens power cut / electricity disconnection tonight, set riskLevel to CRITICAL, scamCategory to "Fake Electricity Bill Disconnection Scam".
3. If it claims bank account/PAN/KYC is blocked with a shortened link, set riskLevel to CRITICAL.
4. If it is a legitimate transaction alert from a bank with available balance and no malicious links, set riskLevel to SAFE and riskScore under 10.
Return ONLY valid JSON.`;

    const userPrompt = `Analyze this received SMS text message:
"""
${messageText}
"""

Extracted Links and Domains:
${JSON.stringify(links, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    const cleaned = rawText.trim();
    const parsed = JSON.parse(cleaned);

    return {
      messageText,
      riskLevel: parsed.riskLevel || heuristicResult.riskLevel,
      riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : heuristicResult.riskScore,
      scamCategory: parsed.scamCategory || heuristicResult.scamCategory,
      summary: parsed.summary || heuristicResult.summary,
      isUrgentOrThreatening:
        typeof parsed.isUrgentOrThreatening === 'boolean'
          ? parsed.isUrgentOrThreatening
          : heuristicResult.isUrgentOrThreatening,
      impersonatedEntity: parsed.impersonatedEntity || heuristicResult.impersonatedEntity,
      redFlags: Array.isArray(parsed.redFlags) && parsed.redFlags.length > 0 ? parsed.redFlags : heuristicResult.redFlags,
      extractedLinks: links,
      upiCollectTrickDetected:
        typeof parsed.upiCollectTrickDetected === 'boolean'
          ? parsed.upiCollectTrickDetected
          : heuristicResult.upiCollectTrickDetected,
      defensiveRecommendations:
        Array.isArray(parsed.defensiveRecommendations) && parsed.defensiveRecommendations.length > 0
          ? parsed.defensiveRecommendations
          : heuristicResult.defensiveRecommendations,
      helplineNotice: {
        indiaCyberHelpline: '1930',
        portal: 'https://cybercrime.gov.in',
        chakshuPortal: 'https://sancharsaathi.gov.in/sfc/',
      },
      analyzedBy: 'GEMINI_AI',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[UPI Fraud AI] Gemini generation error, falling back to heuristic engine:', error);
    return heuristicResult;
  }
}
