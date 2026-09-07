 Live Development Preview Link  --  https://email-security-breach-checker.onrender.com



. Live Development Preview Link - https://ais-dev-24bv3ohresmbezrqm7fth4-766537505767.asia-east1.run.app/

# Email Breach & Security Intelligence Platform

A production-grade, defensive cybersecurity web application built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, **Node.js**, and **Express**, integrating authorized breach intelligence sources including the official **Have I Been Pwned (HIBP)** API.

---

## 1. Project Overview

The **Email Breach & Security Intelligence Platform** is designed for individuals, enterprise security teams, and administrators to evaluate credential exposure across documented data breaches, understand attack risks, and execute immediate remediation.

### Core Defensive Principles
- **No Stolen Passwords**: We never store, download, reconstruct, or display actual stolen plaintext passwords or compromised hashes.
- **Zero Pre-Loaded Leak Data**: Leaked information is strictly private. The application never displays or assumes any breach results until the user explicitly inputs their email address and clicks **Check Leaks**.
- **Verified Official Links**: All remediation and password-change buttons link exclusively to verified, official corporate security endpoints (e.g. Canva, Dropbox, Adobe, LinkedIn, Google).
- **k-Anonymity Cryptography**: Password exposure audits use mathematical k-anonymity (SHA-1 prefix hashing) ensuring plaintext passwords never leave the local environment.

---

## 2. Key Features & 8 Dedicated Pages

The platform is structured into an organized **10-page defensive cybersecurity workflow** with an interactive left-side navigation panel and sequential **Next Page ➔** and **⬅ Previous Page** transitions:

| Page | Title | Purpose & Capabilities |
| :--- | :--- | :--- |
| **01** | **Email Breach Overview** | RFC 5322 email input validation, dynamic threat scoring (Low, Medium, High, Critical), executive threat summary, and affected metrics breakdown. |
| **02** | **Where Data Leaked & Direct Fix Links** | Searchable and filterable directory of all compromised websites with **Open [Website] to Change Password ↗** buttons, copy-to-clipboard email helpers, and interactive remediation checklists. |
| **03** | **Forensics & Timeline** | Interactive chronological incident timeline mapping the sequence of breaches from earliest to newest, with detailed data class tags. |
| **04** | **Remediation Action Checklist** | Prioritized defense plan (Priority 1 through 5: password changes, 2FA setup, credential reuse audits, financial freezes) with completed progress tracking. |
| **05** | **Pwned Passwords Audit** | 100% free k-anonymity SHA-1 hash lookup checking against billions of compromised passwords without transmitting the password. |
| **06** | **Breach Catalog Explorer** | Live search through 800+ documented global breaches by company, website, domain, or exposed data category. |
| **07** | **Professional Profile Notice** | Audit of public developer footprint and executive identity using authorized public APIs (e.g. GitHub public directory). |
| **08** | **Demo Showcase** | Pre-configured presentation scenarios (Consumer, Enterprise, Financial/PII, Creative, and Clean) for demonstrations and testing. |
| **09** | **Have I Been Pwned Official Portal** | Dedicated external launch hub for **haveibeenpwned.com** with 1-click direct open, email breach lookup deep-links, Pwned Passwords, Domain Search, and API v3 key portal. |
| **10** | **AI UPI & SMS Fraud Detector** | Gemini AI & heuristic smishing forensics for incoming phone text messages. Detects deceptive UPI collect requests, fake power disconnection notices, bank KYC suspension links, shortened URLs, and integrates with Indian Cyber Helpline 1930 & Chakshu portal. |

### Additional Defense Capabilities
- **Executive Incident Audit Report (1-Click Print & PDF)**: Generate a comprehensive, print-ready security audit document with formatted Markdown export, clipboard copying, and a downloadable 90-day `.ics` calendar reminder for routine credential hygiene.
- **PII Attack Surface & Threat Matrix**: Categorizes all exposed data points into 4 attack vectors (Authentication & Credential Stuffing, Financial & Fraud Risk, Identity Theft & Phishing, and Technical / Infrastructure Profiling) with threat level indicators and defensive countermeasures.
- **Client-Side Cryptographic Password & Passphrase Generator**: Offline NIST 800-63B compliant generator utilizing `window.crypto.getRandomValues`. Offers high-entropy random password mode and Diceware 4-word memorable passphrase mode with real-time entropy calculation.
- **Saved Answers & Reports**: Save security audit snapshots to local storage. View, review, export, or print reports anytime.
- **Left-Side Button Navigation**: Sticky numbered button panel with live audit status indicators and page badges.
- **Flexible Intelligence Modes**: Works out of the box with free open breach intelligence or seamlessly with a paid Have I Been Pwned v3 API key.

---

## 3. Technology Stack

- **Frontend**:
  - React 19 (Hooks, Context, Functional Components)
  - TypeScript (Strict type checking)
  - Tailwind CSS (Utility-first, responsive dark cybersecurity theme)
  - Lucide React (Defensive security vector icons)
  - Motion (Smooth layout transitions)
- **Backend**:
  - Node.js & Express 4
  - TypeScript runtime (`tsx`)
  - Server-side sliding-window rate limiter
  - In-memory HIBP public catalog cache
- **Build & Packaging**:
  - Vite for client bundling and dev server middleware
  - esbuild for server compilation (`dist/server.cjs`)

---

## 4. Application Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (SPA)                     │
│  - 8 Dedicated Security Pages with Left-Side Navigation     │
│  - Email Search & RFC 5322 Input Validation                 │
│  - Direct Fix Links Directory with Verified Official URLs   │
│  - Visual Timeline & Prioritized Defense Checklist          │
│  - Client-Side SHA-1 k-Anonymity Password Hashing           │
│  - Saved Answers & Audit Reports Modal                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS (Internal API calls)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 NODE.JS / EXPRESS BACKEND                   │
│  - In-Memory IP Sliding-Window Rate Limiting                │
│  - Strict Server-Side Payload Sanitization                  │
│  - Verified Security URLs & Domains Mapping Dictionary       │
│  - Dynamic Risk Assessment & Score Calculation Engine       │
│  - Public Catalog Warmup & In-Memory Cache (800+ Breaches)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Secure Server-Side Requests
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL INTELLIGENCE APIS                  │
│  - Have I Been Pwned API v3 (Live Key Queries)              │
│  - Free Open Breach Intelligence API (Zero-Key Mode)        │
│  - HIBP Pwned Passwords k-Anonymity Range API (Free)        │
│  - HIBP Public Breaches Catalog Endpoint                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/email-breach-security-platform.git
   cd email-breach-security-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional):
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   ```env
   # Optional: Have I Been Pwned v3 API Key for live email queries
   HIBP_API_KEY=

   # Optional: Gemini API Key if using AI-assisted analysis
   GEMINI_API_KEY=
   ```

> **Note**: An API key is **not** required to use the platform. In Free Intelligence Mode, the platform operates using authorized free community intelligence endpoints and the public HIBP catalog.

---

## 6. Development & Production Scripts

### Start Development Server
Starts the unified Express server with Vite middleware on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Lint Codebase
Runs the TypeScript compiler to verify all types without emitting files:
```bash
npm run lint
```

### Production Build
Builds the static client assets with Vite and compiles `server.ts` into a standalone CommonJS bundle (`dist/server.cjs`):
```bash
npm run build
```

### Run Production Server
Launches the compiled production bundle:
```bash
npm start
```

---

## 7. API Endpoints Reference

The backend exposes several endpoints under `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/check-email` | Audits an email address against authorized breach databases. Accepts `{ email, clientApiKey? }`. |
| `POST` | `/api/check-password-pwned` | Accepts `{ hashPrefix }` (first 5 SHA-1 chars) and checks the free k-Anonymity HIBP range API. |
| `POST` | `/api/check-profile` | Checks public directories (e.g. GitHub) for exposed public identity footprint. |
| `GET` | `/api/search-breaches` | Queries the cached 800+ HIBP breach catalog by keyword, domain, or category. |
| `GET` | `/api/config` | Returns API status, active mode, and safe demo scenarios. |
| `POST` | `/api/validate-key` | Validates the format and authenticity of a user-supplied HIBP API key. |

---

## 8. Directory Structure

```text
├── index.html                   # HTML entry point with security metadata
├── metadata.json                # Application configuration & permissions
├── package.json                 # Project dependencies and build scripts
├── server.ts                    # Main Express server and Vite integration
├── server/
│   ├── controllers/
│   │   └── breachController.ts  # Route handlers and rate limiting
│   ├── routes/
│   │   └── breachRoutes.ts      # Express API routes definition
│   ├── services/
│   │   └── breachService.ts     # Breach intelligence, risk scoring, APIs
│   ├── types.ts                 # Server TypeScript data types
│   └── utils/
│       └── securityLinks.ts     # Verified official URLs & remediation rules
└── src/
    ├── App.tsx                  # Main workspace, 8-page state & left navigation
    ├── main.tsx                 # React entry point
    ├── index.css                # Global styling with Tailwind CSS
    ├── types.ts                 # Frontend shared TypeScript interfaces
    └── components/
        ├── CompromisedWebsitesDirectory.tsx  # Page 2: Direct fix links
        ├── EmailSearch.tsx                   # Page 1: Search & input
        ├── SecuritySummary.tsx               # Threat score & metrics breakdown
        ├── BreachTimeline.tsx                # Page 3: Chronological visualization
        ├── BreachList.tsx                    # Detailed incident cards
        ├── SecurityActionCenter.tsx          # Page 4: Remediation checklist
        ├── PasswordChecker.tsx               # Page 5: k-Anonymity password audit
        ├── BreachCatalog.tsx                 # Page 6: 800+ Breaches catalog
        ├── ProfessionalProfileAudit.tsx      # Page 7: Public profile footprint
        ├── DemoShowcase.tsx                  # Page 8: Persona evaluator scenarios
        ├── ApiKeyModal.tsx                   # HIBP key tester & configuration modal
        └── SavedReportsModal.tsx             # Saved audits & answers manager
```

---

## 9. Security & Ethical Computing Standards

1. **Defensive Only**: Built exclusively for incident awareness, credential hygiene, and proactive defense.
2. **Zero Storage of Searched Emails**: Searched emails are evaluated in-memory and never written to a persistent database or log file.
3. **No Brute-Forcing or Scraping**: The app accesses only public APIs and authorized datasets with strict request rate limiting.
4. **Authentic Security Redirection**: Every external password reset or two-factor authentication link directs exclusively to authentic, verified domains.

---

## 10. License

This project is licensed under the [MIT License](LICENSE).
