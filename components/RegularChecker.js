import { useState, useCallback } from 'react'
import { Select, Input, Btn, SectionTitle, RatioBar, CheckItem, ResultsSummary } from './UI'
import { checkRegularCompliance, getEffectiveLimits, REGULAR_RULES } from '../lib/rules'
import styles from './Checker.module.css'

const INIT = {
  empType: '', country: '', lcr: '', foir: '', tenor: '', creditScore: '',
  lcp: '', incPct: '', pin: '', evoe: '', slips: '', remitCert: '', security: '', eftn: ''
}

export default function RegularChecker() {
  const [form, setForm] = useState(INIT)
  const [results, setResults] = useState(null)
  const [exporting, setExporting] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const limits = form.empType ? getEffectiveLimits(form.empType, form.country, form.creditScore) : null

  const check = useCallback(() => {
    const r = checkRegularCompliance(form)
    setResults(r)
    setTimeout(() => document.getElementById('ri-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [form])

  const reset = () => { setForm(INIT); setResults(null) }

  const exportPDF = async () => {
    setExporting(true)
    try {
      const { generatePDF } = await import('../lib/pdfExport')
      await generatePDF({ type: 'regular', formData: form, results, effectiveLimits: limits })
    } finally { setExporting(false) }
  }

  const ratioChecks = limits ? [
    ...(form.lcr !== '' && !isNaN(parseFloat(form.lcr)) ? [{ label: 'LCR', value: parseFloat(form.lcr), max: limits.maxLCR }] : []),
    ...(form.foir !== '' && !isNaN(parseFloat(form.foir)) ? [{ label: 'FOIR', value: parseFloat(form.foir), max: limits.maxFOIR }] : []),
  ] : []

  const showCreditReport = form.country === 'developed' || form.country === 'emerging' || form.country === 'gulf'
  const creditReportRequired = form.country === 'developed'

  return (
    <div>
      {limits && (
        <div className={styles.limitsBox}>
          <span className={styles.limitsLabel}>Applicable limits for this profile:</span>
          <span className={styles.limitPill}>Max LCR: <strong>{limits.maxLCR}%</strong></span>
          <span className={styles.limitPill}>Max FOIR: <strong>{limits.maxFOIR}%</strong></span>
          <span className={styles.limitPill}>Max tenor: <strong>{limits.maxTenor}yr</strong></span>
          <span className={`${styles.limitPill} ${limits.lcpMandatory ? styles.limitRed : styles.limitAmber}`}>
            LCP: <strong>{limits.lcpMandatory ? 'Mandatory' : 'Generally required'}</strong>
          </span>
        </div>
      )}

      <SectionTitle>Employment & location</SectionTitle>
      <div className={styles.grid2}>
        <Select label="Employment type" id="ri-emp" value={form.empType} onChange={set('empType')}>
          <option value="">Select type</option>
          <option value="perm">Permanent salaried (Govt/MNC) / Professional</option>
          <option value="contract">Contractual (renewed) & Temporary</option>
          <option value="self">Business owner / Self-employed</option>
        </Select>
        <Select label="Country of residence" id="ri-country" value={form.country} onChange={set('country')}>
          <option value="">Select country</option>
          <option value="developed">USA / UK / EU / Canada / Australia</option>
          <option value="emerging">Malaysia / Singapore / South Korea</option>
          <option value="gulf">KSA / UAE / Qatar / Gulf</option>
        </Select>
      </div>

      <SectionTitle>Loan ratios & tenor</SectionTitle>
      <div className={styles.grid2}>
        <Input label={`Actual LCR (%)${limits ? ` — max ${limits.maxLCR}%` : ''}`} id="ri-lcr" value={form.lcr} onChange={set('lcr')} placeholder="e.g. 60" min="0" max="100" />
        <Input label={`Actual FOIR (%)${limits ? ` — max ${limits.maxFOIR}%` : ''}`} id="ri-foir" value={form.foir} onChange={set('foir')} placeholder="e.g. 45" min="0" max="100" />
        <Input label={`Loan tenor (years)${limits ? ` — max ${limits.maxTenor}yr` : ''}`} id="ri-tenor" value={form.tenor} onChange={set('tenor')} placeholder="e.g. 8" min="1" max="30" />
        <Input label="Income % considered (50–75%)" id="ri-incpct" value={form.incPct} onChange={set('incPct')} placeholder="e.g. 65" min="0" max="100" />
      </div>

      <SectionTitle>Credit & LCP</SectionTitle>
      <div className={styles.grid2}>
        {showCreditReport && (
          <Select
            label={`Credit score quality${creditReportRequired ? ' (required for this country)' : ''}`}
            id="ri-credit"
            value={form.creditScore}
            onChange={set('creditScore')}
          >
            <option value="">Select</option>
            <option value="excellent">Excellent — max FOIR 55%</option>
            <option value="good">Good — max FOIR 50%</option>
            <option value="poor">Poor — max FOIR 45%</option>
            <option value="none">No credit score — max FOIR 40%</option>
            <option value="na">Not applicable</option>
          </Select>
        )}
        <Select label="LCP status" id="ri-lcp" value={form.lcp} onChange={set('lcp')}>
          <option value="">Select</option>
          <option value="provided">Provided — family/relative with income</option>
          <option value="waived_pg">Waived — strong PG (needs approval)</option>
          <option value="none">Not provided</option>
        </Select>
      </div>

      <SectionTitle>Identity & verification</SectionTitle>
      <div className={styles.grid2}>
        <Select label="Passport PIN vs NID" id="ri-pin" value={form.pin} onChange={set('pin')}>
          <option value="">Select</option>
          <option value="matched">Matched ✓</option>
          <option value="mismatch">Mismatch — not acceptable</option>
          <option value="bc">Birth certificate basis (verify online)</option>
        </Select>
        <Select label="Employment verification" id="ri-evoe" value={form.evoe} onChange={set('evoe')}>
          <option value="">Select</option>
          <option value="email">Email via official employer domain ✓</option>
          <option value="photo">Photo at office / workspace</option>
          <option value="self_photo">Self-employed: photo + trade license + tax return</option>
          <option value="none">Not done</option>
        </Select>
      </div>

      <SectionTitle>Documents</SectionTitle>
      <div className={styles.grid2}>
        <Select label="Remittance slips" id="ri-slips" value={form.slips} onChange={set('slips')}>
          <option value="">Select</option>
          <option value="ok">Available with sender/receiver details ✓</option>
          <option value="partial">Available but incomplete</option>
          <option value="na">Not available</option>
        </Select>
        <Select label="Remittance BS / certificate (12m)" id="ri-remit-cert" value={form.remitCert} onChange={set('remitCert')}>
          <option value="">Select</option>
          <option value="12m">Last 12 months available ✓</option>
          <option value="less">Less than 12 months</option>
          <option value="na">Not available</option>
        </Select>
      </div>

      <SectionTitle>Security & EFTN</SectionTitle>
      <div className={styles.grid2}>
        <Select label="Security mode" id="ri-security" value={form.security} onChange={set('security')}>
          <option value="">Select</option>
          <option value="tpa_rm">TPA + RSD / RM / TPA with developer ✓</option>
          <option value="em">EM (not yet created) — not acceptable</option>
          <option value="bt">BT — not acceptable</option>
          <option value="ut_rm">UT for RM — not acceptable</option>
        </Select>
        <Select label="EFTN / PDC account source" id="ri-eftn" value={form.eftn} onChange={set('eftn')}>
          <option value="">Select</option>
          <option value="local_cb">Local co-borrower / co-applicant ✓</option>
          <option value="joint">Joint account (NRB + local) ✓</option>
          <option value="nrb_only">NRB bank account only — not acceptable</option>
        </Select>
      </div>

      <div className={styles.actions}>
        <Btn variant="primary" onClick={check}>Check compliance</Btn>
        <Btn variant="ghost" onClick={reset}>Reset</Btn>
      </div>

      {results && (
        <div id="ri-results" className={styles.results}>
          <div className={styles.resultsHeader}>Compliance result</div>
          <ResultsSummary {...results} />

          {ratioChecks.length > 0 && (
            <div className={styles.ratioGrid}>
              {ratioChecks.map(r => (
                <RatioBar key={r.label} label={r.label} value={r.value} max={r.max}
                  status={r.value <= r.max ? 'pass' : 'fail'} />
              ))}
            </div>
          )}

          {results.issues.length > 0 && (
            <div className={styles.checkSection}>
              <div className={styles.checkSectionLabel} style={{ color: 'var(--red)' }}>Issues — must resolve</div>
              <div className={styles.checkList}>
                {results.issues.map((item, i) => <CheckItem key={i} {...item} status="fail" />)}
              </div>
            </div>
          )}
          {results.warnings.length > 0 && (
            <div className={styles.checkSection}>
              <div className={styles.checkSectionLabel} style={{ color: 'var(--amber)' }}>Warnings — review required</div>
              <div className={styles.checkList}>
                {results.warnings.map((item, i) => <CheckItem key={i} {...item} status="warn" />)}
              </div>
            </div>
          )}
          {results.passed.length > 0 && (
            <div className={styles.checkSection}>
              <div className={styles.checkSectionLabel} style={{ color: 'var(--green)' }}>Complied</div>
              <div className={styles.checkList}>
                {results.passed.map((item, i) => <CheckItem key={i} {...item} status="pass" />)}
              </div>
            </div>
          )}

          <div className={styles.actions} style={{ marginTop: '1rem' }}>
            <Btn onClick={exportPDF} disabled={exporting}>
              {exporting ? 'Generating PDF...' : '↓ Export PDF report'}
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}
