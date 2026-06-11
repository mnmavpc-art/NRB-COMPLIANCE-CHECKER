// NRB Lending Guideline – June 2026
// Complete rules database derived from DBH NRB Guideline PDF

export const REMITTANCE_RULES = {
  ratios: {
    maxFOIR: 45,
    maxLCR: 60,
    preferredTenor: 7,
    maxTenor: 10,
    maxIncomePercent: 75,
  },
  cbpg: {
    preferred: "CB in person or through POA",
    alternate: "PG to be added if CB unavailable; original PG form before disbursement",
    pgRequired: "If CB is local, PG is required (LCP not mandatory)",
    lcpAsCB: "If LCP taken as CB, PG may be waived based on borrower profile & loan amount",
  },
  documents: {
    foreignBS: { label: "Foreign Bank Statement", required: "6–12 months" },
    localBS: { label: "Local Bank Statement", required: "24 months" },
    remittanceSlips: { label: "Remittance Slips", required: "2 years" },
    passport: { label: "Valid Passport / Visa / Work Permit", required: "Mandatory (WP if applicable)" },
  },
  security: {
    preferred: "Registered Mortgage",
    note: "EM not created (UT for RM) and BT not acceptable",
  },
  cpvvop: "CPV or VOP to be confirmed for all local contact persons",
  generalInstructions: [
    "Regular reflection of remittance to be checked cautiously",
    "High value / outlier transactions to be discarded while calculating average remittance inflow",
    "Maximum 75% of income is considerable",
  ],
}

export const REGULAR_RULES = {
  employment: {
    perm: {
      label: "Permanent Salaried (Govt/MNC) / Professional",
      maxLCR: 70,
      maxFOIR: 55,
      maxTenor: 10,
      lcp: "Generally Required (may waive exceptionally with good PG subject to approval & PG verification)",
      lcpMandatory: false,
    },
    contract: {
      label: "Contractual (Renewed) & Temporary",
      maxLCR: 60,
      maxFOIR: 45,
      maxTenor: 10,
      lcp: "Mandatory",
      lcpMandatory: true,
    },
    self: {
      label: "Business Owner / Self-Employed",
      maxLCR: 60,
      maxFOIR: 40,
      maxTenor: 7,
      lcp: "Mandatory",
      lcpMandatory: true,
    },
  },
  country: {
    developed: {
      label: "Developed (USA, UK, EU, Canada, Australia)",
      maxLCR: 70,
      lcp: "Generally Required (may waive for good employed profile NRB)",
      creditReportRequired: true,
    },
    emerging: {
      label: "Emerging Stable (Malaysia, Singapore, South Korea, etc.)",
      maxLCR: 60,
      lcp: "Mandatory (must be close relative + verified income)",
      creditReportRequired: false,
    },
    gulf: {
      label: "Gulf / Middle East (KSA, UAE, Qatar, etc.)",
      maxLCR: 60,
      lcp: "Mandatory (must be close relative + verified income)",
      creditReportRequired: false,
    },
  },
  creditScore: {
    excellent: { label: "Excellent", maxFOIR: 55 },
    good: { label: "Good", maxFOIR: 50 },
    poor: { label: "Poor", maxFOIR: 45 },
    none: { label: "No Credit Score", maxFOIR: 40 },
  },
  lcp: {
    requirement: "Family member with stable income (preferably employed) or relatives as co-applicant",
    doc: "Utility bill of present residence for local contact person required in addition to income documents",
  },
  personalID: {
    rule1: "Passport PIN must be matched with NID",
    rule2: "If PIN based on Birth Certificate, verify online with Birth Registration Server",
    rule3: "Any mismatch in name, DOB, or parents' name in passport and NID — NOT acceptable",
  },
  employment_verification: {
    primary: "Email verification via official employer domain",
    alternate: "Client photo in front of office and at working space",
    selfEmployed: "Photo of business setup + trade license/permission + tax return documents",
  },
  income: {
    range: "50–75% of net salary or professional income may be considered",
    remittancePct: "Adjusted 50–75% of remittance to be considered due to future cash flow variance",
    documents: ["Remittance slips with sender & receiver details", "Remittance bank statement / certificate – last 12 months"],
  },
  security: {
    acceptable: "TPA + RSD / RM / TPA with developers (as applicable)",
    notAcceptable: ["UT for RM (EM not created)", "BT"],
    eftn: "EFTN/PDC from local co-borrower or co-applicant account; joint account acceptable; NRB-only account NOT acceptable",
  },
  aging: {
    employed: "10–12 working days",
    business: "12–15 working days",
  },
  references: {
    creditUSA: "FICO (100-22155) – https://www.usa.gov/creditreports",
    creditAustralia: "File ref: 11-101-13361",
    selfEmployedPhoto: "File refs: 210-167; 104-684; 103-6670",
    noCoBorrower: "File refs: 102-13795; 102-16355",
    goodRevertNote: "File ref: 101-11077",
  },
}

// Compute effective FOIR limit based on employment type + credit score + country
export function getEffectiveLimits(empType, country, creditScore) {
  const empRule = REGULAR_RULES.employment[empType] || {}
  const countryRule = REGULAR_RULES.country[country] || {}
  const creditRule = REGULAR_RULES.creditScore[creditScore] || {}

  const maxLCR = Math.min(
    empRule.maxLCR || 70,
    countryRule.maxLCR || 70
  )

  // Credit score caps FOIR for developed-country clients
  let maxFOIR = empRule.maxFOIR || 55
  if (creditScore && creditScore !== "na" && countryRule.creditReportRequired) {
    maxFOIR = Math.min(maxFOIR, creditRule.maxFOIR || 55)
  }

  return {
    maxLCR,
    maxFOIR,
    maxTenor: empRule.maxTenor || 10,
    lcpMandatory: empRule.lcpMandatory || false,
    creditReportRequired: countryRule.creditReportRequired || false,
  }
}

export function checkRemittanceCompliance(data) {
  const issues = []
  const warnings = []
  const passed = []

  const { lcr, foir, tenor, cbpg, security, foreignBS, localBS, slips, passport, cpv, incPct } = data

  // LCR
  if (lcr !== "" && lcr !== undefined && lcr !== null) {
    const v = parseFloat(lcr)
    if (!isNaN(v)) {
      if (v > REMITTANCE_RULES.ratios.maxLCR) issues.push({ field: "LCR", msg: `LCR ${v}% exceeds maximum ${REMITTANCE_RULES.ratios.maxLCR}%`, value: v, max: REMITTANCE_RULES.ratios.maxLCR })
      else passed.push({ field: "LCR", msg: `LCR ${v}% is within limit (max ${REMITTANCE_RULES.ratios.maxLCR}%)`, value: v, max: REMITTANCE_RULES.ratios.maxLCR })
    }
  }

  // FOIR
  if (foir !== "" && foir !== undefined && foir !== null) {
    const v = parseFloat(foir)
    if (!isNaN(v)) {
      if (v > REMITTANCE_RULES.ratios.maxFOIR) issues.push({ field: "FOIR", msg: `FOIR ${v}% exceeds maximum ${REMITTANCE_RULES.ratios.maxFOIR}%`, value: v, max: REMITTANCE_RULES.ratios.maxFOIR })
      else passed.push({ field: "FOIR", msg: `FOIR ${v}% is within limit (max ${REMITTANCE_RULES.ratios.maxFOIR}%)`, value: v, max: REMITTANCE_RULES.ratios.maxFOIR })
    }
  }

  // Tenor
  if (tenor !== "" && tenor !== undefined && tenor !== null) {
    const v = parseFloat(tenor)
    if (!isNaN(v)) {
      if (v > REMITTANCE_RULES.ratios.maxTenor) issues.push({ field: "Tenor", msg: `Tenor ${v} years exceeds maximum ${REMITTANCE_RULES.ratios.maxTenor} years` })
      else if (v > REMITTANCE_RULES.ratios.preferredTenor) warnings.push({ field: "Tenor", msg: `Tenor ${v} years is above preferred ${REMITTANCE_RULES.ratios.preferredTenor} years (max is ${REMITTANCE_RULES.ratios.maxTenor})` })
      else passed.push({ field: "Tenor", msg: `Tenor ${v} years — within preferred range` })
    }
  }

  // CB/PG
  if (cbpg) {
    if (cbpg === "pg_only") warnings.push({ field: "CB/PG", msg: "PG only arrangement — original PG form must be obtained before disbursement" })
    else passed.push({ field: "CB/PG", msg: cbpg === "cb_present" ? "CB in person or via POA — preferred arrangement" : "LCP as CB — PG may be waived based on profile and loan amount" })
  }

  // Security
  if (security) {
    if (security === "em" || security === "bt" || security === "ut_rm") issues.push({ field: "Security", msg: `Security mode '${security.toUpperCase()}' is NOT acceptable for NRB files` })
    else passed.push({ field: "Security", msg: `Security mode '${security.toUpperCase()}' — acceptable` })
  }

  // Documents
  const docMap = {
    foreignBS: { label: "Foreign Bank Statement", good: "6plus", warn: "less6", goodMsg: "6–12 months available", badMsg: "Not available — required document", warnMsg: "Less than 6 months — needs supplementing" },
    localBS: { label: "Local Bank Statement (24m)", good: "24plus", warn: "less24", goodMsg: "24 months available", badMsg: "Not available — required document", warnMsg: "Less than 24 months — shortfall" },
    slips: { label: "Remittance Slips (2 yrs)", good: "2yr", warn: "less2", goodMsg: "2 years available", badMsg: "Not available — file cannot be forwarded without slip verification", warnMsg: "Less than 2 years — needs collection" },
    passport: { label: "Passport / Visa / Work Permit", good: "valid", warn: "partial", goodMsg: "All documents valid and collected", badMsg: "Not collected — required before processing", warnMsg: "Partial — missing documents to be collected" },
    cpv: { label: "CPV / VOP", good: "done", warn: "pending", goodMsg: "CPV/VOP confirmed for local contact person", badMsg: "Not done — required for local contact persons", warnMsg: "Pending — must be completed before sanction" },
  }
  const docVals = { foreignBS, localBS, slips, passport, cpv }
  Object.entries(docVals).forEach(([key, val]) => {
    if (!val) return
    const d = docMap[key]
    if (val === d.good) passed.push({ field: d.label, msg: d.goodMsg })
    else if (val === d.warn) warnings.push({ field: d.label, msg: d.warnMsg })
    else issues.push({ field: d.label, msg: d.badMsg })
  })

  // Income %
  if (incPct !== "" && incPct !== undefined && incPct !== null) {
    const v = parseFloat(incPct)
    if (!isNaN(v)) {
      if (v > 75) issues.push({ field: "Income %", msg: `${v}% exceeds maximum 75% income consideration limit` })
      else passed.push({ field: "Income %", msg: `${v}% of remittance income considered — within 75% cap` })
    }
  }

  return { issues, warnings, passed }
}

export function checkRegularCompliance(data) {
  const issues = []
  const warnings = []
  const passed = []

  const { empType, country, lcr, foir, tenor, creditScore, lcp, incPct, pin, evoe, slips, remitCert, security, eftn } = data
  const limits = getEffectiveLimits(empType, country, creditScore)

  // LCR
  if (lcr !== "" && lcr !== undefined && lcr !== null) {
    const v = parseFloat(lcr)
    if (!isNaN(v)) {
      if (v > limits.maxLCR) issues.push({ field: "LCR", msg: `LCR ${v}% exceeds maximum ${limits.maxLCR}% for this profile`, value: v, max: limits.maxLCR })
      else passed.push({ field: "LCR", msg: `LCR ${v}% within limit (max ${limits.maxLCR}%)`, value: v, max: limits.maxLCR })
    }
  }

  // FOIR
  if (foir !== "" && foir !== undefined && foir !== null) {
    const v = parseFloat(foir)
    if (!isNaN(v)) {
      if (v > limits.maxFOIR) issues.push({ field: "FOIR", msg: `FOIR ${v}% exceeds maximum ${limits.maxFOIR}% for this profile${limits.creditReportRequired && creditScore ? ` (credit score adjusted)` : ""}`, value: v, max: limits.maxFOIR })
      else passed.push({ field: "FOIR", msg: `FOIR ${v}% within limit (max ${limits.maxFOIR}%)`, value: v, max: limits.maxFOIR })
    }
  }

  // Tenor
  if (tenor !== "" && tenor !== undefined && tenor !== null) {
    const v = parseFloat(tenor)
    if (!isNaN(v)) {
      if (v > limits.maxTenor) issues.push({ field: "Tenor", msg: `Tenor ${v} years exceeds maximum ${limits.maxTenor} years for this employment type` })
      else passed.push({ field: "Tenor", msg: `Tenor ${v} years — within limit (max ${limits.maxTenor} years)` })
    }
  }

  // LCP
  if (lcp) {
    if (limits.lcpMandatory && lcp === "none") issues.push({ field: "LCP", msg: "LCP is mandatory for this employment type — file cannot proceed without it" })
    else if (limits.lcpMandatory && lcp === "waived_pg") issues.push({ field: "LCP", msg: "LCP cannot be waived for contractual/self-employed profiles — it is mandatory" })
    else if (!limits.lcpMandatory && lcp === "waived_pg") warnings.push({ field: "LCP", msg: "LCP waived with strong PG — requires formal approval and PG verification" })
    else if (lcp === "none") warnings.push({ field: "LCP", msg: "LCP not provided — generally required; exception needs strong PG and approval" })
    else passed.push({ field: "LCP", msg: "LCP provided — family member/relative with income confirmed" })
  }

  // Credit Report
  if (limits.creditReportRequired && creditScore && creditScore !== "na") {
    const cr = REGULAR_RULES.creditScore[creditScore]
    if (cr) passed.push({ field: "Credit Score", msg: `${cr.label} — Max FOIR ${cr.maxFOIR}% (from internationally recognised agency)` })
  } else if (limits.creditReportRequired && (!creditScore || creditScore === "na")) {
    warnings.push({ field: "Credit Report", msg: "Credit report required for developed-country NRB clients (FICO/Equifax/Experian/TransUnion)" })
  }

  // Personal ID
  if (pin) {
    if (pin === "mismatch") issues.push({ field: "Passport PIN / NID", msg: "Mismatch in name, DOB, or parents' name — NOT acceptable; must be resolved before proceeding" })
    else if (pin === "bc") warnings.push({ field: "Passport PIN / NID", msg: "PIN based on birth certificate — must be verified online on Birth Registration Server" })
    else passed.push({ field: "Passport PIN / NID", msg: "Passport PIN matched with NID — complied" })
  }

  // Employment verification
  if (evoe) {
    if (evoe === "none") issues.push({ field: "Employment Verification", msg: "Employment not verified — required before processing" })
    else if (evoe === "photo") warnings.push({ field: "Employment Verification", msg: "Photo at office/workspace accepted as alternative when official email unavailable" })
    else if (evoe === "self_photo") warnings.push({ field: "Employment Verification", msg: "Self-employed: photo of business + trade license + tax return required" })
    else passed.push({ field: "Employment Verification", msg: "Employer email via official domain — primary verification method satisfied" })
  }

  // Remittance slips
  if (slips) {
    if (slips === "ok") passed.push({ field: "Remittance Slips", msg: "Slips with sender & receiver details collected" })
    else if (slips === "partial") warnings.push({ field: "Remittance Slips", msg: "Incomplete — details of sender & receiver required (Western Union / exchange slips)" })
    else issues.push({ field: "Remittance Slips", msg: "Not available — must be collected; file cannot proceed" })
  }

  // Remittance certificate
  if (remitCert) {
    if (remitCert === "12m") passed.push({ field: "Remittance Certificate / BS", msg: "12-month remittance bank statement/certificate available" })
    else if (remitCert === "less") warnings.push({ field: "Remittance Certificate / BS", msg: "Less than 12 months — needs supplementing" })
    else issues.push({ field: "Remittance Certificate / BS", msg: "Not available — required document; must be collected" })
  }

  // Security
  if (security) {
    if (security === "tpa_rm") passed.push({ field: "Security", msg: "TPA + RSD/RM/TPA with developer — acceptable" })
    else issues.push({ field: "Security", msg: `Security mode not acceptable for NRB: ${security === "em" ? "EM (not yet created)" : security === "bt" ? "BT" : "UT for RM"} — use TPA+RSD/RM instead` })
  }

  // EFTN
  if (eftn) {
    if (eftn === "nrb_only") issues.push({ field: "EFTN / PDC", msg: "EFTN from NRB-only bank account is NOT acceptable — must be from local co-borrower or joint account" })
    else passed.push({ field: "EFTN / PDC", msg: eftn === "local_cb" ? "From local co-borrower/co-applicant account — complied" : "From joint NRB + local co-applicant account — acceptable" })
  }

  // Income %
  if (incPct !== "" && incPct !== undefined && incPct !== null) {
    const v = parseFloat(incPct)
    if (!isNaN(v)) {
      if (v < 50) warnings.push({ field: "Income %", msg: `${v}% is below the 50% floor — guideline range is 50–75%` })
      else if (v > 75) issues.push({ field: "Income %", msg: `${v}% exceeds maximum 75% income consideration limit` })
      else passed.push({ field: "Income %", msg: `${v}% within guideline range (50–75%)` })
    }
  }

  return { issues, warnings, passed }
}
