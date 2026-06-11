import styles from './Guideline.module.css'

export default function GuidelinePage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.section}>
        <h2 className={styles.h2}>Remittance income based NRB files</h2>
        <table className={styles.table}>
          <tbody>
            <tr><td className={styles.tdKey}>Remitter as CB/PG</td><td>CB preferred in person or through POA. During unavailability as CB: PG to be added and original PG form to be taken before disbursement.</td></tr>
            <tr><td className={styles.tdKey}>PG requirement</td><td>If CB is local, PG required (LCP not mandatory). If LCP taken as CB, PG may be waived based on borrower profile & loan amount.</td></tr>
            <tr><td className={styles.tdKey}>Max FOIR</td><td><strong>45%</strong></td></tr>
            <tr><td className={styles.tdKey}>Max LCR</td><td><strong>60%</strong></td></tr>
            <tr><td className={styles.tdKey}>Tenor</td><td>Preferably 7 years · Maximum 10 years</td></tr>
            <tr><td className={styles.tdKey}>Security mode</td><td>Registered Mortgage preferred. EM (not created) and BT not acceptable.</td></tr>
            <tr><td className={styles.tdKey}>Income %</td><td>Maximum 75% of remittance income considerable. Discard high-value / outlier transactions when calculating average.</td></tr>
            <tr><td className={styles.tdKey}>Documents</td><td>Foreign BS: 6–12 months · Local BS: 24 months · Remittance slips: 2 years · Valid passport / visa / work permit</td></tr>
            <tr><td className={styles.tdKey}>CPV / VOP</td><td>Must be confirmed for all local contact persons</td></tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.h2}>Regular income based NRB files — employment ratios</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employment type</th>
              <th>Max LCR</th>
              <th>Max FOIR</th>
              <th>Max tenor</th>
              <th>LCP requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Permanent salaried (Govt/MNC) / Professional</td>
              <td><strong>70%</strong></td>
              <td><strong>55%</strong></td>
              <td>10 years</td>
              <td>Generally required (may waive exceptionally with good PG, subject to approval & verification)</td>
            </tr>
            <tr>
              <td>Contractual (renewed) & Temporary</td>
              <td><strong>60%</strong></td>
              <td><strong>45%</strong></td>
              <td>10 years</td>
              <td>Mandatory</td>
            </tr>
            <tr>
              <td>Business owner / Self-employed</td>
              <td><strong>60%</strong></td>
              <td><strong>40%</strong></td>
              <td>7 years</td>
              <td>Mandatory</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.h2}>Country of residence — LCR & LCP</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Country category</th><th>Max LCR</th><th>LCP</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Developed (USA, UK, EU, Canada, Australia)</td>
              <td><strong>70%</strong></td>
              <td>Generally required (may waive for good employed profile NRB)</td>
            </tr>
            <tr>
              <td>Emerging stable (Malaysia, Singapore, South Korea, etc.) & Gulf/Middle East (KSA, UAE, Qatar, etc.)</td>
              <td><strong>60%</strong></td>
              <td>Mandatory — must be close relative + verified income</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.h2}>Credit score — FOIR limits (developed countries)</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Credit score</th><th>Max FOIR</th><th>Agencies</th></tr>
          </thead>
          <tbody>
            <tr><td>Excellent</td><td><strong>55%</strong></td><td rowSpan={4}>FICO, Equifax, Experian, TransUnion</td></tr>
            <tr><td>Good</td><td><strong>50%</strong></td></tr>
            <tr><td>Poor</td><td><strong>45%</strong></td></tr>
            <tr><td>No credit score</td><td><strong>40%</strong></td></tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.h2}>Security & EFTN rules</h2>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.tdKey}>Acceptable security</td>
              <td>TPA + RSD / RM / TPA with developers (as applicable)</td>
            </tr>
            <tr>
              <td className={styles.tdKey}>Not acceptable</td>
              <td className={styles.danger}>UT for RM (EM not created) · BT</td>
            </tr>
            <tr>
              <td className={styles.tdKey}>EFTN / PDC</td>
              <td>From local co-borrower or co-applicant account. Joint account of NRB + local co-applicant acceptable. <span className={styles.danger}>EFTN from NRB-only bank account is NOT acceptable.</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.h2}>Sanction timeline (aging)</h2>
        <table className={styles.table}>
          <tbody>
            <tr><td className={styles.tdKey}>Employed NRB</td><td>10–12 working days</td></tr>
            <tr><td className={styles.tdKey}>Businessman / others</td><td>12–15 working days</td></tr>
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.h2}>Reference files</h2>
        <ul className={styles.refList}>
          <li>Credit score USA — FICO (100-22155): <a href="https://www.usa.gov/creditreports" target="_blank" rel="noreferrer" className={styles.link}>usa.gov/creditreports</a></li>
          <li>Credit score Australia: 11-101-13361</li>
          <li>NRB businessperson / self-employed with photo: 210-167 · 104-684 · 103-6670</li>
          <li>NRB client with no co-borrower: 102-13795 · 102-16355</li>
          <li>NRB file with good revert note: 101-11077</li>
        </ul>
      </div>
    </div>
  )
}
