/**
 * Curated and verified legitimate security directory.
 * Only official, verified domains and URLs are cataloged here.
 * Never guess or fabricate links.
 */

interface OfficialServiceSecurityMeta {
  company: string;
  passwordResetUrl?: string;
  securityPageUrl?: string;
  twoFactorUrl?: string;
  officialBreachNoticeUrl?: string;
}

const VERIFIED_SECURITY_DIRECTORY: Record<string, OfficialServiceSecurityMeta> = {
  'adobe.com': {
    company: 'Adobe Inc.',
    passwordResetUrl: 'https://account.adobe.com/',
    securityPageUrl: 'https://account.adobe.com/security',
    twoFactorUrl: 'https://helpx.adobe.com/manage-account/using/set-up-two-step-verification.html',
    officialBreachNoticeUrl: 'https://helpx.adobe.com/security.html',
  },
  'dropbox.com': {
    company: 'Dropbox, Inc.',
    passwordResetUrl: 'https://www.dropbox.com/forgot',
    securityPageUrl: 'https://www.dropbox.com/account/security',
    twoFactorUrl: 'https://www.dropbox.com/account/security',
    officialBreachNoticeUrl: 'https://blog.dropbox.com/topics/security',
  },
  'linkedin.com': {
    company: 'LinkedIn Corporation (Microsoft)',
    passwordResetUrl: 'https://www.linkedin.com/checkpoint/rp/request-password-reset',
    securityPageUrl: 'https://www.linkedin.com/psettings/privacy',
    twoFactorUrl: 'https://www.linkedin.com/psettings/two-step-verification',
    officialBreachNoticeUrl: 'https://news.linkedin.com/',
  },
  'canva.com': {
    company: 'Canva Pty Ltd',
    passwordResetUrl: 'https://www.canva.com/login/reset',
    securityPageUrl: 'https://www.canva.com/settings/your-account',
    twoFactorUrl: 'https://www.canva.com/help/two-step-verification/',
    officialBreachNoticeUrl: 'https://www.canva.com/news/security/',
  },
  'myfitnesspal.com': {
    company: 'MyFitnessPal (Under Armour)',
    passwordResetUrl: 'https://www.myfitnesspal.com/account/forgot-password',
    securityPageUrl: 'https://www.myfitnesspal.com/account/settings',
    twoFactorUrl: 'https://support.myfitnesspal.com/hc/en-us/articles/360032625291-Two-Factor-Authentication',
    officialBreachNoticeUrl: 'https://support.myfitnesspal.com/',
  },
  'twitter.com': {
    company: 'X Corp. (formerly Twitter)',
    passwordResetUrl: 'https://twitter.com/account/begin_password_reset',
    securityPageUrl: 'https://twitter.com/settings/security_and_account_access',
    twoFactorUrl: 'https://twitter.com/settings/account/login_verification',
    officialBreachNoticeUrl: 'https://help.twitter.com/en/safety-and-security',
  },
  'x.com': {
    company: 'X Corp.',
    passwordResetUrl: 'https://x.com/account/begin_password_reset',
    securityPageUrl: 'https://x.com/settings/security_and_account_access',
    twoFactorUrl: 'https://x.com/settings/account/login_verification',
    officialBreachNoticeUrl: 'https://help.twitter.com/en/safety-and-security',
  },
  'facebook.com': {
    company: 'Meta Platforms, Inc.',
    passwordResetUrl: 'https://www.facebook.com/recover/initiate/',
    securityPageUrl: 'https://accountscenter.facebook.com/password_and_security',
    twoFactorUrl: 'https://www.facebook.com/security/2fac/settings',
    officialBreachNoticeUrl: 'https://about.fb.com/news/',
  },
  'google.com': {
    company: 'Google LLC (Alphabet Inc.)',
    passwordResetUrl: 'https://myaccount.google.com/signinoptions/password',
    securityPageUrl: 'https://myaccount.google.com/security',
    twoFactorUrl: 'https://myaccount.google.com/signinoptions/two-step-verification',
    officialBreachNoticeUrl: 'https://safety.google/security/',
  },
  'microsoft.com': {
    company: 'Microsoft Corporation',
    passwordResetUrl: 'https://account.live.com/ResetPassword.aspx',
    securityPageUrl: 'https://account.microsoft.com/security',
    twoFactorUrl: 'https://account.live.com/proofs/manage/additional',
    officialBreachNoticeUrl: 'https://msrc.microsoft.com/blog/',
  },
  'github.com': {
    company: 'GitHub, Inc. (Microsoft)',
    passwordResetUrl: 'https://github.com/password_reset',
    securityPageUrl: 'https://github.com/settings/security',
    twoFactorUrl: 'https://github.com/settings/security',
    officialBreachNoticeUrl: 'https://github.blog/tag/security/',
  },
  'zynga.com': {
    company: 'Zynga Inc. (Take-Two Interactive)',
    passwordResetUrl: 'https://accounts.zynga.com/',
    securityPageUrl: 'https://www.zynga.com/privacy/security',
    officialBreachNoticeUrl: 'https://www.zynga.com/privacy/security',
  },
  'wattpad.com': {
    company: 'Wattpad Corp. (Naver)',
    passwordResetUrl: 'https://www.wattpad.com/forgot',
    securityPageUrl: 'https://www.wattpad.com/settings',
    officialBreachNoticeUrl: 'https://support.wattpad.com/',
  },
  'gravatar.com': {
    company: 'Automattic Inc.',
    passwordResetUrl: 'https://gravatar.com/forgot',
    securityPageUrl: 'https://wordpress.com/me/security',
    twoFactorUrl: 'https://wordpress.com/me/security/two-step',
  },
  'yahoo.com': {
    company: 'Yahoo! Inc. (Apollo Global)',
    passwordResetUrl: 'https://login.yahoo.com/forgot',
    securityPageUrl: 'https://login.yahoo.com/account/security',
    twoFactorUrl: 'https://login.yahoo.com/account/security',
    officialBreachNoticeUrl: 'https://help.yahoo.com/kb/security',
  },
  'disqus.com': {
    company: 'Disqus (Zeta Global)',
    passwordResetUrl: 'https://disqus.com/forgot/',
    securityPageUrl: 'https://disqus.com/home/settings/account/',
  },
  'tumblr.com': {
    company: 'Tumblr (Automattic)',
    passwordResetUrl: 'https://www.tumblr.com/forgot_password',
    securityPageUrl: 'https://www.tumblr.com/settings/account',
    twoFactorUrl: 'https://www.tumblr.com/settings/account',
  },
  'kickstarter.com': {
    company: 'Kickstarter, PBC',
    passwordResetUrl: 'https://www.kickstarter.com/reset_password',
    securityPageUrl: 'https://www.kickstarter.com/settings/account',
    twoFactorUrl: 'https://www.kickstarter.com/settings/account',
  },
  'snapchat.com': {
    company: 'Snap Inc.',
    passwordResetUrl: 'https://accounts.snapchat.com/accounts/password_reset_request',
    securityPageUrl: 'https://accounts.snapchat.com/',
    twoFactorUrl: 'https://support.snapchat.com/article/two-factor-authentication',
  },
  'apollo.io': {
    company: 'Apollo.io Inc.',
    passwordResetUrl: 'https://app.apollo.io/#/login',
    securityPageUrl: 'https://app.apollo.io/#/settings',
    twoFactorUrl: 'https://knowledge.apollo.io/',
    officialBreachNoticeUrl: 'https://www.apollo.io/privacy-policy',
  },
  'evite.com': {
    company: 'Evite, Inc.',
    passwordResetUrl: 'https://www.evite.com/forgot-password',
    securityPageUrl: 'https://www.evite.com/profile/settings',
    officialBreachNoticeUrl: 'https://support.evite.com/',
  },
  'neteller.com': {
    company: 'Paysafe Group (Neteller)',
    passwordResetUrl: 'https://member.neteller.com/reset-password',
    securityPageUrl: 'https://www.neteller.com/en/features/security',
    twoFactorUrl: 'https://www.neteller.com/en/features/security',
    officialBreachNoticeUrl: 'https://www.neteller.com/',
  },
  'stratfor.com': {
    company: 'RANE Network Inc. (Stratfor)',
    passwordResetUrl: 'https://worldview.stratfor.com/user/password',
    securityPageUrl: 'https://worldview.stratfor.com/',
    officialBreachNoticeUrl: 'https://worldview.stratfor.com/',
  },
  'myspace.com': {
    company: 'Viant Technology LLC (Myspace)',
    passwordResetUrl: 'https://myspace.com/forgotpassword',
    securityPageUrl: 'https://myspace.com/settings',
  },
  'deezer.com': {
    company: 'Deezer S.A.',
    passwordResetUrl: 'https://www.deezer.com/password/lost',
    securityPageUrl: 'https://www.deezer.com/account',
  },
  'duolingo.com': {
    company: 'Duolingo, Inc.',
    passwordResetUrl: 'https://www.duolingo.com/forgot_password',
    securityPageUrl: 'https://www.duolingo.com/settings/account',
  },
  'zoosk.com': {
    company: 'Spark Networks (Zoosk)',
    passwordResetUrl: 'https://www.zoosk.com/resetpassword',
    securityPageUrl: 'https://www.zoosk.com/settings',
  },
  'houzz.com': {
    company: 'Houzz Inc.',
    passwordResetUrl: 'https://www.houzz.com/forgotPassword',
    securityPageUrl: 'https://www.houzz.com/editProfile',
  },
  'lastpass.com': {
    company: 'LastPass (GoTo)',
    passwordResetUrl: 'https://lastpass.com/forgotpassword.php',
    securityPageUrl: 'https://lastpass.com/my-vault',
  },
  'spotify.com': {
    company: 'Spotify AB',
    passwordResetUrl: 'https://www.spotify.com/password-reset/',
    securityPageUrl: 'https://www.spotify.com/account/overview/',
  },
  'twitch.tv': {
    company: 'Twitch Interactive (Amazon)',
    passwordResetUrl: 'https://www.twitch.tv/user/account-recovery',
    securityPageUrl: 'https://www.twitch.tv/settings/security',
  },
  'netflix.com': {
    company: 'Netflix, Inc.',
    passwordResetUrl: 'https://www.netflix.com/LoginHelp',
    securityPageUrl: 'https://www.netflix.com/youraccount',
  },
  'reddit.com': {
    company: 'Reddit, Inc.',
    passwordResetUrl: 'https://www.reddit.com/password',
    securityPageUrl: 'https://www.reddit.com/settings',
  },
};

/**
 * Normalizes and formats a date string (e.g. 2024-05-15 -> 15 May 2024)
 */
export function formatBreachDate(dateStr?: string): string {
  if (!dateStr) return 'Information unavailable';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Returns verified official security information for a domain or company.
 * Never generates fake URLs.
 */
export function getOfficialSecurityLinks(domain: string, serviceTitle?: string): {
  company: string;
  passwordResetUrl: string | null;
  securityPageUrl: string | null;
  twoFactorUrl: string | null;
  officialBreachNoticeUrl: string | null;
  directWebsiteUrl: string | null;
  changeDataUrl: string | null;
} {
  const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const match = VERIFIED_SECURITY_DIRECTORY[cleanDomain];

  const isValidDomain =
    cleanDomain &&
    cleanDomain !== 'unknown-domain.com' &&
    !cleanDomain.includes('unavailable') &&
    cleanDomain.includes('.');

  const fallbackDomainUrl = isValidDomain ? `https://${cleanDomain}` : null;

  if (match) {
    return {
      company: match.company,
      passwordResetUrl: match.passwordResetUrl || fallbackDomainUrl,
      securityPageUrl: match.securityPageUrl || fallbackDomainUrl,
      twoFactorUrl: match.twoFactorUrl || null,
      officialBreachNoticeUrl: match.officialBreachNoticeUrl || fallbackDomainUrl,
      directWebsiteUrl: fallbackDomainUrl,
      changeDataUrl: match.passwordResetUrl || match.securityPageUrl || fallbackDomainUrl,
    };
  }

  // Fallback if domain is valid but not in static dictionary
  if (isValidDomain) {
    return {
      company: serviceTitle ? `${serviceTitle}` : `${cleanDomain}`,
      passwordResetUrl: `https://${cleanDomain}`,
      securityPageUrl: `https://${cleanDomain}`,
      twoFactorUrl: null,
      officialBreachNoticeUrl: `https://${cleanDomain}`,
      directWebsiteUrl: `https://${cleanDomain}`,
      changeDataUrl: `https://${cleanDomain}`,
    };
  }

  return {
    company: serviceTitle || 'Company information unavailable',
    passwordResetUrl: null,
    securityPageUrl: null,
    twoFactorUrl: null,
    officialBreachNoticeUrl: null,
    directWebsiteUrl: null,
    changeDataUrl: null,
  };
}

/**
 * Computes security actions based strictly on data categories exposed.
 */
export function determineSecurityActions(dataClasses: string[]): {
  actions: string[];
  passwordExposed: boolean;
  priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
} {
  const normalized = dataClasses.map((d) => d.toLowerCase());
  const actions: string[] = [];

  const hasPassword = normalized.some((d) =>
    d.includes('password') || d.includes('auth') || d.includes('token') || d.includes('secret')
  );
  const hasEmail = normalized.some((d) => d.includes('email'));
  const hasPhone = normalized.some((d) => d.includes('phone') || d.includes('mobile'));
  const hasUsername = normalized.some((d) => d.includes('username') || d.includes('user name'));
  const hasPersonalInfo = normalized.some(
    (d) =>
      d.includes('name') ||
      d.includes('address') ||
      d.includes('birth') ||
      d.includes('dob') ||
      d.includes('national id') ||
      d.includes('social security') ||
      d.includes('ssn')
  );
  const hasFinancial = normalized.some(
    (d) => d.includes('credit') || d.includes('card') || d.includes('bank') || d.includes('payment')
  );

  if (hasPassword) {
    actions.push('Change your password immediately for this account.');
    actions.push('If you reused this password on other services, change it on those accounts immediately.');
    actions.push('Enable Two-Factor Authentication (2FA) with an authenticator app.');
    actions.push('Review recent login sessions and active connected devices.');
  }

  if (hasEmail) {
    actions.push('Be alert for targeted phishing emails, fake reset notices, and suspicious attachments.');
  }

  if (hasPhone) {
    actions.push('Be cautious of suspicious SMS messages (smishing), phone calls, or SIM-swap attempts.');
  }

  if (hasUsername) {
    actions.push('Consider changing this username where practical, especially if reused elsewhere.');
  }

  if (hasPersonalInfo) {
    actions.push('Be cautious about targeted impersonation, social engineering, or identity theft attempts.');
  }

  if (hasFinancial) {
    actions.push('Monitor bank/card statements closely and consider placing a fraud alert on credit bureaus.');
  }

  if (actions.length === 0) {
    actions.push('Review your account settings and update your security credentials.');
  }

  let priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (hasPassword && (hasFinancial || hasPersonalInfo || dataClasses.length >= 4)) {
    priorityLevel = 'CRITICAL';
  } else if (hasPassword) {
    priorityLevel = 'HIGH';
  } else if (hasPersonalInfo || hasPhone || hasEmail) {
    priorityLevel = 'MEDIUM';
  }

  return {
    actions,
    passwordExposed: hasPassword,
    priorityLevel,
  };
}
