import React from 'react'
import { FiCheck } from 'react-icons/fi'

import { isSubscriptionPlan, PricingFeature, PricingPlan } from '../types'
import styles from './PricingCard.module.scss'

const formatNgn = (amount: number | null | undefined, symbol: string) => {
  if (amount == null || Number.isNaN(amount)) return null
  return `${symbol}${amount.toLocaleString('en-NG')}`
}

const formatUsd = (amount: number | null | undefined) => {
  if (amount == null || Number.isNaN(amount)) return null
  return `$${amount.toLocaleString('en-US')}`
}

const featureLabel = (feature: PricingFeature) =>
  feature.text ?? feature.label ?? ''

const featureIncluded = (feature: PricingFeature) => feature.included !== false

const planTitle = (name: string) =>
  /plan$/i.test(name.trim()) ? name : `${name} plan`

export type PricingCardProps = {
  plan: PricingPlan
  currencySymbol: string
  isYearly: boolean
  isCurrent: boolean
  isCheckingOut: boolean
  salesHref: string
  onSelect: (plan: PricingPlan) => void
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  currencySymbol,
  isYearly,
  isCurrent,
  isCheckingOut,
  salesHref,
  onSelect,
}) => {
  const hasYearly = plan.yearlyAmountNgn != null && plan.yearlyAmountUsd != null
  const useYearly = isYearly && hasYearly
  const usd = formatUsd(
    useYearly ? plan.yearlyAmountUsd : plan.monthlyAmountUsd,
  )
  const ngn = formatNgn(
    useYearly ? plan.yearlyAmountNgn : plan.monthlyAmountNgn,
    currencySymbol,
  )
  const caption =
    plan.priceCaption ?? (useYearly ? 'Billed annually' : plan.description)
  const isMailto = salesHref.startsWith('mailto:')

  return (
    <article className={styles.card}>
      {plan.badge && (
        <span
          className={
            /test/i.test(plan.badge) ? styles.badgeTesting : styles.badge
          }>
          {plan.badge}
        </span>
      )}
      <p className={styles.planEyebrow}>{planTitle(plan.name)}</p>
      <p className={styles.price}>
        {usd && ngn ? (
          <>
            <span className={styles.priceUsd}>{usd}</span>
            <span className={styles.priceSep}> / </span>
            <span className={styles.priceNgn}>{ngn}</span>
          </>
        ) : (
          ngn ?? usd ?? '—'
        )}
      </p>
      <p className={styles.planCaption}>{caption}</p>

      <div className={styles.ctaStack}>
        <button
          type="button"
          className={styles.ctaPrimary}
          onClick={() => onSelect(plan)}
          disabled={isCheckingOut || isCurrent}>
          {isCheckingOut && isSubscriptionPlan(plan)
            ? 'Redirecting…'
            : isCurrent
            ? 'Current plan'
            : plan.cta}
        </button>
        <a
          className={styles.ctaSecondary}
          href={salesHref}
          target={isMailto ? undefined : '_blank'}
          rel={isMailto ? undefined : 'noopener noreferrer'}>
          {plan.secondaryCta ?? 'Chat to sales'}
        </a>
      </div>

      <div className={styles.featuresBlock}>
        <p className={styles.featuresLabel}>FEATURES</p>
        {plan.featuresIntro && (
          <p className={styles.featuresIntro}>{plan.featuresIntro}</p>
        )}
        <ul className={styles.features}>
          {plan.features.map((feature) => {
            const label = featureLabel(feature)
            if (!label || !featureIncluded(feature)) return null
            return (
              <li key={label} className={styles.feature}>
                <span className={styles.checkIcon} aria-hidden>
                  <FiCheck size={12} />
                </span>
                <span>{label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}
