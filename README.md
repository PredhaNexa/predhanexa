# Predhanexa Private Limited — Corporate Website & Application Platform

A production-grade, 3D animated corporate web application for **Predhanexa Private Limited**, a Private Limited software development company specializing in software design, engineering, cloud deployment, and long-term technical maintenance.

---

## 1. Key Technical Features

* **Cinematic 3D Entrance Animation**: 7-stage interactive sequence constructed with Three.js (rotating technological core, particle acceleration, holographic brand reveal, forward camera glide, and smooth hero transition). Includes skip button (`ESC`), mobile optimization, and reduced-motion fallback.
* **Interactive 3D Software Architecture Hero**: Dynamic Three.js spatial viewport featuring interconnected modular nodes (client, API gateway, microservice cluster, database store), glowing data buses, and mouse parallax interaction.
* **Dynamic Service Management System**: Complete administrative CRUD (Create, Read, Update, Delete) with image and icon selection, enable/disable toggles, drag/arrow reordering, and 1-click suggested templates.
* **Interactive 3D Founders & Leadership Section**: 3D tilt cards with cursor-responsive spotlight lighting for Founder **N. Dhanush Kumar** and Co-Founder **N. Prudhvi Vilas**. Includes Director Identification Number (DIN) privacy rules, photo uploads via admin, and direct WhatsApp / email routing.
* **Direct Communication Channels**:
  * Company Email: `predhanexa@gmail.com`
  * Company Mobile: `9494408539`
  * Founder WhatsApp: `6302836330`
  * Founder Email: `naragantiumadevi@gmail.com`
* **Zero Seed Data Compliance**: Built with a dedicated empty-state architecture. No fake clients, statistics, reviews, or mock portfolio items.
* **Executive Admin Panel (`/admin`)**: Secure password-protected administration console managing company information, leadership profiles, photo uploads, services, SEO metadata, and client inquiry inbox.
* **Netlify Deployment Support**: Native `netlify.toml` configuration with SPA redirects, HTTP security headers, and serverless contact functions (`netlify/functions/contact.ts`).
* **Full-Stack Express Integration**: `server.ts` powering `/api/contact`, `/api/health`, `/robots.txt`, `/sitemap.xml`, and Vite middleware.

---

## 2. Directory Structure

```text
├── netlify/
│   └── functions/
│       └── contact.ts          # Serverless contact handler for Netlify
├── public/
│   ├── robots.txt              # Search crawler rules
│   └── sitemap.xml             # XML sitemap of real public pages
├── src/
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── modals/             # ServiceDetailModal
│   │   ├── sections/           # HeroSection, AboutSection, ServicesSection,
│   │   │                       # DevelopmentProcess, FoundersSection, ContactSection
│   │   ├── seo/                # SeoHead with JSON-LD Schema.org
│   │   └── three/              # Intro3DAnimation, Hero3DCanvas
│   ├── pages/                  # HomePage, AboutPage, ServicesPage, TeamPage,
│   │                           # ContactPage, PrivacyPolicyPage, TermsPage, AdminPage
│   ├── services/
│   │   └── configService.ts    # Centralized single-source-of-truth service
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Core application and router
│   ├── index.css               # Tailwind CSS v4 and theme setup
│   └── main.tsx                # Client entry point
├── .env.example                # Environment variable reference
├── netlify.toml                # Netlify deployment rules
├── package.json
├── server.ts                   # Express full-stack server
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Local Development Instructions

### Prerequisites
* Node.js $\ge 18$
* npm or bun

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
```
Populate optional SMTP and Google credentials if desired.

### Step 3: Start the Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## 4. Admin Portal Access & Setup

1. Open your browser and navigate to `/admin` or click the lock icon in the website footer.
2. **Default Master Passkey**:
   ```text
   Predhanexa@2026
   ```
3. Once authenticated, you can:
   * Upload real photos for the **Founder** and **Co-Founder** (automatically resized and compressed in-browser).
   * Enter the Founder's **DIN** (Director Identification Number).
   * Add services using custom forms or 1-click templates.
   * Update company contact numbers or emails.
   * Change the master passkey in **Deployment & Backup -> Administrative Passkey Update**.
   * Export or import full backups as JSON files.

---

## 5. Netlify Deployment Guide

1. Push this repository to GitHub or GitLab.
2. In Netlify, click **Add new site -> Import an existing project**.
3. Select your repository. Netlify will auto-detect the configuration from `netlify.toml`:
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
   * **Functions directory**: `netlify/functions`
4. Set Environment Variables in **Site Settings -> Environment Variables**:
   * `CONTACT_EMAIL`: `predhanexa@gmail.com`
   * `FOUNDER_EMAIL`: `naragantiumadevi@gmail.com`
   * `COMPANY_PHONE`: `9494408539`
   * `FOUNDER_WHATSAPP`: `6302836330`
   * `GOOGLE_SITE_VERIFICATION`: (Optional verification string from Google Search Console)
   * `GOOGLE_ANALYTICS_ID`: (Optional GA4 ID, e.g. `G-XXXXXXXXXX`)
5. Click **Deploy Site**.

---

## 6. Google Search Console & SEO Verification

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your domain property (e.g. `predhanexa.com`).
3. Select verification method: **HTML tag** (or DNS verification).
4. Copy the verification code from Google:
   * Either set `GOOGLE_SITE_VERIFICATION="your_token"` in your `.env` / Netlify environment variables, or:
   * Paste it into the Admin Panel under **SEO & Search Console -> Google Search Console Verification Token** and click **Save**.
5. Google Search Console will detect `<meta name="google-site-verification" content="..." />` and verify your ownership.
6. Under **Sitemaps** in Search Console, submit:
   ```text
   https://predhanexa.com/sitemap.xml
   ```
7. Search Console will begin crawling your canonical routes (`/`, `/about`, `/services`, `/team`, `/contact`).
