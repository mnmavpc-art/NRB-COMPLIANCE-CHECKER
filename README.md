# NRB Compliance Checker

DBH NRB Lending Guideline — June 2026  
Internal compliance tool for loan officers.

## Features

- **Remittance income checker** — validates LCR (max 60%), FOIR (max 45%), tenor, CB/PG, all required documents, CPV/VOP, income % cap
- **Regular income checker** — dynamic limits based on employment type + country + credit score, LCP validation, PIN/NID check, employment verification, security & EFTN rules
- **Full guideline page** — all rules in one readable reference
- **PDF export** — professional compliance report with pass/warn/fail breakdown

## Deploy to Vercel (2 minutes)

### Option A — Drag & drop (easiest)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag this entire `nrb-checker` folder onto the page
3. Click **Deploy**
4. Your live URL will appear in ~60 seconds

### Option B — Vercel CLI
```bash
npm install -g vercel
cd nrb-checker
npm install
vercel
```

### Option C — GitHub
1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) → Import Git Repository
3. Select your repo → Deploy

## Run locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Project structure
```
nrb-checker/
  lib/
    rules.js          ← All compliance rules & logic
    pdfExport.js      ← PDF generation
  components/
    RemittanceChecker.js
    RegularChecker.js
    GuidelinePage.js
    UI.js / UI.module.css
    Checker.module.css
    Guideline.module.css
  pages/
    index.js          ← Main app
    _app.js
  styles/
    globals.css
    Home.module.css
  vercel.json
  package.json
```

## Guideline source
NRB Lending Guideline – June 2026 (DBH)
