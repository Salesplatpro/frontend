import React from 'react'

import { usePricingCatalog } from '../hooks/usePricingCatalog'
import styles from './PlanUsage.module.scss'

type PlanUsageProps = {
  interval?: string | null
  planKey?: string | null
}

const planDisplayName = (planKey?: string | null, catalogName?: string) => {
  if (catalogName) return catalogName
  if (!planKey || planKey === 'free') return 'Free'
  if (planKey === 'paid') return 'Paid'
  if (planKey === 'pay_per_use') return 'Pay per Use'
  return planKey
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const PlanUsage: React.FC<PlanUsageProps> = ({ interval, planKey }) => {
  const { catalog } = usePricingCatalog()
  const items = catalog?.dummyUsage ?? []
  const period = interval === 'annually' ? 'yearly' : 'monthly'
  const catalogPlan = catalog?.plans.find((plan) => plan.key === planKey)
  const name = planDisplayName(planKey, catalogPlan?.name)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Current plan</p>
        <h1 className={styles.title}>You&apos;re on {name}</h1>
        <p className={styles.subtitle}>
          Hiring tools on the {period} plan
          {items.length > 0
            ? '. Usage below is sample data — the product is not gated yet.'
            : '.'}
        </p>
      </header>

      {items.length > 0 && (
        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.value}>{item.used.toLocaleString()}</p>
              <p className={styles.limit}>{item.limit}</p>
            </article>
          ))}
        </div>
      )}

      <p className={styles.note}>
        Billing status updates as soon as Paystack confirms payment. Feature
        limits are not enforced in this release.
      </p>
    </div>
  )
}
