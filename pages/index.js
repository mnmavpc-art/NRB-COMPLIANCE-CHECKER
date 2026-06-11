import { useState } from 'react'
import Head from 'next/head'
import RemittanceChecker from '../components/RemittanceChecker'
import RegularChecker from '../components/RegularChecker'
import GuidelinePage from '../components/GuidelinePage'
import styles from '../styles/Home.module.css'

const TABS = [
  { id: 'remittance', label: 'Remittance income' },
  { id: 'regular', label: 'Regular income' },
  { id: 'guideline', label: 'Full guideline' },
]

export default function Home() {
  const [tab, setTab] = useState('remittance')

  return (
    <>
      <Head>
        <title>NRB Compliance Checker — DBH</title>
        <meta name="description" content="DBH NRB Lending Guideline June 2026 — Compliance checker for loan officers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <div className={styles.logo}>DBH</div>
              <div>
                <div className={styles.brandName}>NRB Compliance Checker</div>
                <div className={styles.brandSub}>Lending Guideline · June 2026</div>
              </div>
            </div>
            <div className={styles.headerBadge}>Internal use only</div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.tabs}>
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.card}>
              {tab === 'remittance' && <RemittanceChecker />}
              {tab === 'regular' && <RegularChecker />}
              {tab === 'guideline' && <GuidelinePage />}
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.container}>
            DBH NRB Compliance Checker · NRB Lending Guideline June 2026 · Internal Use Only
          </div>
        </footer>
      </div>
    </>
  )
}
