import styles from './UI.module.css'

export function Badge({ children, variant = 'default' }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
}

export function Card({ children, className = '' }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>
}

export function Btn({ children, onClick, variant = 'default', disabled, type = 'button', small }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${small ? styles.small : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function Select({ label, id, value, onChange, children, required }) {
  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={id} className={styles.label}>{label}{required && <span className={styles.req}>*</span>}</label>}
      <select id={id} value={value} onChange={onChange} className={styles.select}>
        {children}
      </select>
    </div>
  )
}

export function Input({ label, id, value, onChange, placeholder, min, max, type = 'number', required }) {
  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={id} className={styles.label}>{label}{required && <span className={styles.req}>*</span>}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={styles.input}
      />
    </div>
  )
}

export function SectionTitle({ children }) {
  return <div className={styles.sectionTitle}>{children}</div>
}

export function RatioBar({ label, value, max, status }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className={styles.ratioCard}>
      <div className={styles.ratioLabel}>{label}</div>
      <div className={`${styles.ratioValue} ${styles[status]}`}>{value}%</div>
      <div className={styles.progressBg}>
        <div className={`${styles.progressFill} ${styles[status]}`} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.ratioLimit}>Max: {max}%</div>
    </div>
  )
}

export function CheckItem({ field, msg, status }) {
  const icon = status === 'pass' ? '✓' : status === 'warn' ? '!' : '✗'
  return (
    <div className={`${styles.checkItem} ${styles[`ci_${status}`]}`}>
      <div className={`${styles.checkIcon} ${styles[`icon_${status}`]}`}>{icon}</div>
      <div className={styles.checkBody}>
        <div className={styles.checkField}>{field}</div>
        <div className={styles.checkMsg}>{msg}</div>
      </div>
    </div>
  )
}

export function ResultsSummary({ issues, warnings, passed }) {
  const total = issues.length + warnings.length + passed.length
  const overallOk = issues.length === 0
  return (
    <div className={styles.summaryRow}>
      <div className={`${styles.verdict} ${overallOk ? styles.verdictPass : styles.verdictFail}`}>
        {overallOk
          ? `✓ ${passed.length} checks passed${warnings.length ? `, ${warnings.length} warning${warnings.length > 1 ? 's' : ''}` : ''}`
          : `✗ ${issues.length} issue${issues.length > 1 ? 's' : ''} found`}
      </div>
      <div className={styles.summaryStats}>
        <span className={styles.statPass}>{passed.length} passed</span>
        {warnings.length > 0 && <span className={styles.statWarn}>{warnings.length} warnings</span>}
        {issues.length > 0 && <span className={styles.statFail}>{issues.length} issues</span>}
        <span className={styles.statTotal}>{total} total</span>
      </div>
    </div>
  )
}
