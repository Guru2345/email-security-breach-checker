export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface NormalizedBreach {
  website: string;
  domain: string;
  company: string;
  breachDate: string;
  dataExposed: string[];
  description: string;
  sourceUrl: string;
  passwordDataReported: boolean;
  securityActions: string[];
  passwordResetUrl: string | null;
  securityPageUrl: string | null;
  twoFactorUrl: string | null;
  isVerified: boolean;
  pwnCount?: number;
  logoPath?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  directWebsiteUrl?: string;
  changeDataUrl?: string;
}

export interface SecurityReportResponse {
  email: string;
  riskLevel: RiskLevel;
  riskExplanation: string;
  breachCount: number;
  affectedWebsitesCount: number;
  affectedCompaniesCount: number;
  passwordRelatedCount: number;
  latestBreachDate: string | null;
  breaches: NormalizedBreach[];
  checkedAt: string;
  dataSource: 'HIBP_LIVE_API' | 'PUBLIC_VERIFIED_DATASET' | 'AUDIT_CATALOG' | 'FREE_OPEN_INTELLIGENCE' | 'HIBP_30_BREACH_INTELLIGENCE' | 'HIBP_IMPORT';
  apiKeyConfigured: boolean;
  hibpDirectSearchUrl?: string;
  canLoad30Breaches?: boolean;
}

export interface ProfessionalProfileResponse {
  found: boolean;
  message?: string;
  profile?: {
    name: string | null;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    education: {
      institution: string;
      degree?: string;
      fieldOfStudy?: string;
      graduationYear?: string;
    } | null;
    professional: {
      position: string | null;
      company: string | null;
      skills: string[];
      profileUrl: string | null;
      bio?: string | null;
    } | null;
  };
}

export interface PasswordCheckResponse {
  pwned: boolean;
  count: number;
  hashPrefix: string;
  recommendation: string;
}

export interface KeyValidationResult {
  valid: boolean;
  status: 'VALID' | 'INVALID' | 'RATE_LIMITED' | 'NETWORK_ERROR';
  message: string;
  tierInfo: string;
}

export interface UpiLinkDetails {
  url: string;
  domain: string;
  protocol: string;
  isUpiScheme: boolean;
  upiParams?: {
    payeeVpa?: string;
    payeeName?: string;
    amount?: string;
    transactionNote?: string;
    transactionRef?: string;
  };
  isShortenedUrl: boolean;
  suspiciousIndicators: string[];
}

export interface UpiFraudAnalysisResult {
  messageText: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SAFE';
  riskScore: number;
  scamCategory: string;
  summary: string;
  isUrgentOrThreatening: boolean;
  impersonatedEntity: string | null;
  redFlags: string[];
  extractedLinks: UpiLinkDetails[];
  upiCollectTrickDetected: boolean;
  defensiveRecommendations: string[];
  helplineNotice: {
    indiaCyberHelpline: string;
    portal: string;
    chakshuPortal: string;
  };
  analyzedBy: 'GEMINI_AI' | 'HEURISTIC_SECURITY_ENGINE';
  timestamp: string;
}


