import React from 'react'

import { usePricingCatalog } from '../hooks/usePricingCatalog'
import styles from './PlanUsage.module.scss'

type PlanUsageProps = {
  interval?: string | null
}

export const PlanUsage: React.FC<PlanUsageProps> = ({ interval }) => {
  const { catalog } = usePricingCatalog()
  const items = catalog?.dummyUsage ?? []
  const period = interval === 'annually' ? 'yearly' : 'monthly'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Current plan</p>
        <h1 className={styles.title}>You&apos;re on Paid</h1>
        <p className={styles.subtitle}>
          Unlimited hiring tools on the {period} plan. Usage below is sample
          data — the product is not gated yet.
        </p>
      </header>

      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.id} className={styles.card}>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.value}>{item.used.toLocaleString()}</p>
            <p className={styles.limit}>{item.limit}</p>
          </article>
        ))}
      </div>

      <p className={styles.note}>
        Billing status updates as soon as Paystack confirms payment. Feature
        limits are not enforced in this release.
      </p>
    </div>
  )
}
