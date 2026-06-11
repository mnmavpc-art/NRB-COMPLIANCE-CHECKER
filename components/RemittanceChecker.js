import { useState, useCallback } from 'react'
import { Select, Input, Btn, SectionTitle, RatioBar, CheckItem, ResultsSummary } from './UI'
import { checkRemittanceCompliance, REMITTANCE_RULES } from '../lib/rules'
import styles from './Checker.module.css'

const INIT = {
  country: '', cbpg: '', lcr: '', foir: '', tenor: '', security: '',
  foreignBS: '', localBS: '', slips: '', passport: '', cpv: '', incPct: ''
}

export default function RemittanceChecker() {
  const [form, setForm] = useState(INIT)
  const [results, setResults] = useState(null)
  const [exporting, setExporting] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const check = useCallback(() => {
    const r = checkRemittanceCompliance(form)
    setResults(r)
    setTimeout(() => document.getElementById('r-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [form])

  const reset = () => { setForm(INIT); setResults(null) }

  const exportPDF = async () => {
    setExporting(true)
    try {
      const { generatePDF } = await import('../lib/pdfExport')
      await generatePDF({ type: 'remittance', formData: form, results })
    } finally { setExporting(false) }
  }

  const ratioChecks = [
    ...(form.lcr !== '' ? [{ label: 'LCR', value: parseFloat(form.lcr), max: REMITTANCE_RULES.ratios.maxLCR }] : []),
    ...(form.foir !== '' ? [{ label: 'FOIR', value: parseFloat(form.foir), max: REMITTANCE_RULES.ratios.maxFOIR }] : []),
  ].filter(r => !isNaN(r.value))

  return (
    <div>
      <div className={styles.infoBox}>
        <strong>Remittance income files</strong> — FOIR max 45% · LCR max 60% · Tenor preferably 7 years (max 10) · Income max 75%
      </div>

      <SectionTitle>Borrower & loan details</SectionTitle>
      <div className={styles.grid2}>
        <Select label="Country of remitter" id="r-country" value={form.country} onChange={set('country')}>
          <option value="">Select country</option>
          <option value="developed">USA / UK / EU / Canada / Australia</option>
          <option value="emerging">Malaysia / Singapore / South Korea</option>
          <option value="gulf">KSA / UAE / Qatar / Gulf</option>
        </Select>
        <Select label="CB / PG arrangement" id="r-cbpg" value={form.cbpg} onChange={set('cbpg')}>
          <option value="">Select</option>
          <option value="cb_present">CB in person or via POA (preferred)</option>
          <option value="cb_lcp">LCP as CB</option>
          <option value="pg_only">PG only — CB unavailable</option>
        </Select>
        <Input label="Actual LCR (%)" id="r-lcr" value={form.lcr} onChange={set('lcr')} placeholder="e.g. 55" min="0" max="100" />
        <Input label="Actual FOIR (%)" id="r-foir" value={form.foir} onChange={set('foir')} placeholder="e.g. 40" min="0" max="100" />
        <Input label="Loan tenor (years)" id="r-tenor" value={form.tenor} onChange={set('tenor')} placeholder="e.g. 7" min="1" max="30" />
        <Select label="Security mode" id="r-security" value={form.security} onChange={set('security')}>
          <option value="">Select</option>
          <option value="rm">Registered Mortgage (preferred)</option>
          <option value="tpa">TPA</option>
          <option value="tpa_rsd">TPA + RSD</option>
          <option value="em">EM (equitable mortgage)</option>
          <option value="bt">BT</option>
          <option value="ut_rm">UT for RM</option>
        </Select>
        <Input label="Income % considered (max 75%)" id="r-incpct" value={form.incPct} onChange={set('incPct')} placeholder="e.g. 70" min="0" max="100" />
      </div>

      <SectionTitle>Documents collected</SectionTitle>
      <div className={styles.grid2}>
        <Select label="Foreign bank statement" id="r-fbs" value={form.foreignBS} onChange={set('foreignBS')}>
          <option value="">Select</option>
          <option value="6plus">6–12 months available</option>
          <option value="less6">Less than 6 months</option>
          <option value="na">Not available</option>
        </Select>
        <Select label="Local bank statement" id="r-lbs" value={form.localBS} onChange={set('localBS')}>
          <option value="">Select</option>
          <option value="24plus">24 months available</option>
          <option value="less24">Less than 24 months</option>
          <option value="na">Not available</option>
        </Select>
        <Select label="Remittance slips" id="r-slips" value={form.slips} onChange={set('slips')}>
          <option value="">Select</option>
          <option value="2yr">2 years with sender/receiver</option>
          <option value="less2">Less than 2 years</option>
          <option value="na">Not available</option>
        </Select>
        <Select label="Passport / Visa / Work permit" id="r-passport" value={form.passport} onChange={set('passport')}>
          <option value="">Select</option>
          <option value="valid">All valid & collected</option>
          <option value="partial">Partial</option>
          <option value="na">Not collected</option>
        </Select>
        <Select label="CPV / VOP for local contact" id="r-cpv" value={form.cpv} onChange={set('cpv')}>
          <option value="">Select</option>
          <option value="done">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="na">Not done</option>
        </Select>
      </div>

      <div className={styles.actions}>
        <Btn variant="primary" onClick={check}>Check compliance</Btn>
        <Btn variant="ghost" onClick={reset}>Reset</Btn>
      </div>

      {results && (
        <div id="r-results" className={styles.results}>
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
              <div className={styles.checkSectionLabel} style={{ color: 'var(--red)' }}>Issues — must resolve before sanction</div>
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
