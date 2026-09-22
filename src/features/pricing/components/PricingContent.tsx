import cn from 'classnames'
import React, { useState } from 'react'
import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiShield,
  FiUser,
  FiX,
  FiZap,
} from 'react-icons/fi'
import {
  HiOutlineBuildingOffice2,
  HiOutlineRocketLaunch,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import { LuSend } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { notify } from '@/utils/toastNotifications'

import { usePaidCheckout } from '../hooks/usePaidCheckout'
import { usePricingCatalog } from '../hooks/usePricingCatalog'
import {
  BillingInterval,
  ComparisonRow,
  isSubscriptionPlan,
  PricingFeature,
  PricingPlan,
} from '../types'
import styles from './PricingContent.module.scss'

const formatNgn = (amount: number | null | undefined, symbol: string) => {
  if (amount == null || Number.isNaN(amount)) return null
  return `${symbol}${amount.toLocaleString('en-NG')}`
}

const featureLabel = (feature: PricingFeature) =>
  feature.text ?? feature.label ?? ''

const featureIncluded = (feature: PricingFeature) => feature.included !== false

const comparisonIcon = (id: string) => {
  switch (id) {
    case 'job_postings':
      return <FiBriefcase size={18} />
    case 'ai_screening':
      return <HiOutlineSparkles size={18} />
    case 'candidate_access':
      return <FiUser size={18} />
    case 'companies':
      return <HiOutlineBuildingOffice2 size={18} />
    case 'bulk_tools':
      return <LuSend size={18} />
    default:
      return <FiCheck size={18} />
  }
}

const valueIcon = (icon: string) => {
  if (icon === 'rocket') return <HiOutlineRocketLaunch size={22} />
  if (icon === 'shield') return <FiShield size={22} />
  return <HiOutlineSparkles size={22} />
}

const cellValue = (value: string | boolean) => {
  if (value === true) return <FiCheck aria-label="Included" />
  if (value === false) return <FiX aria-label="Not included" />
  return value
}

const planIcon = (plan: PricingPlan) => {
  if (plan.key === 'pay_per_use') return <FiBriefcase size={20} />
  if (isSubscriptionPlan(plan) || plan.key === 'paid')
    return <FiZap size={20} />
  return <FiUser size={20} />
}

type PricingContentProps = {
  variant?: 'public' | 'dashboard'
  currentPlan?: string
}

export const PricingContent: React.FC<PricingContentProps> = ({
  variant = 'public',
  currentPlan = 'free',
}) => {
  const { catalog, isLoading, error } = usePricingCatalog()
  const { startCheckout, isCheckingOut } = usePaidCheckout()
  const [interval, setInterval] = useState<BillingInterval>('monthly')
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)

  if (isLoading) return <Spinner fullPage={variant === 'public'} />
  if (error || !catalog) {
    return (
      <p className={styles.subtitle}>Pricing is temporarily unavailable.</p>
    )
  }

  const symbol = catalog.currencySymbol
  const isYearly = interval === 'annually'
  const comparison = catalog.comparison

  const onSelect = async (plan: PricingPlan) => {
    if (plan.key === 'free') {
      if (variant === 'dashboard' || (isLoggedIn && userRole === 'recruiter')) {
        navigate('/recruiterDashboard/dashboard')
        return
      }
      navigate('/register')
      return
    }

    if (plan.key === 'pay_per_use') {
      if (variant === 'dashboard' || (isLoggedIn && userRole === 'recruiter')) {
        notify(
          'info',
          'Pay per Use is billed when you post a job — no monthly subscription.',
        )
        navigate('/recruiterDashboard/myJobPosts')
        return
      }
      navigate('/register')
      return
    }

    if (!isSubscriptionPlan(plan)) {
      notify('error', 'This plan is not available for checkout.')
      return
    }

    const checkoutInterval: BillingInterval =
      isYearly && plan.yearlyAmountNgn == null ? 'monthly' : interval

    await startCheckout(plan.key, checkoutInterval)
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.hero}>
          <p className={styles.kicker}>{catalog.hero.kicker}</p>
          <h1 className={styles.title}>{catalog.hero.title}</h1>
          <p className={styles.subtitle}>{catalog.hero.subtitle}</p>
          <div className={styles.trustRow}>
            <span className={styles.trustItem}>
              <FiShield size={16} /> {catalog.guarantee}
            </span>
            <span className={styles.trustItem}>
              <FiCheck size={16} /> {catalog.cancelAnytime}
            </span>
          </div>
          <div className={styles.billingRow}>
            <div
              className={styles.toggle}
              role="tablist"
              aria-label="Billing interval">
              <button
                type="button"
                className={cn(styles.toggleButton, {
                  [styles.active]: !isYearly,
                })}
                onClick={() => setInterval('monthly')}>
                Monthly
              </button>
              <button
                type="button"
                className={cn(styles.toggleButton, {
                  [styles.active]: isYearly,
                })}
                onClick={() => setInterval('annually')}>
                Yearly
              </button>
            </div>
            <span className={styles.saveBadge}>
              Save up to {catalog.yearlyDiscountPercent}%
            </span>
          </div>
        </header>

        <div className={styles.cards}>
          {catalog.plans.map((plan) => {
            const hasYearly = plan.yearlyAmountNgn != null
            const amount =
              isYearly && hasYearly
                ? plan.yearlyAmountNgn
                : plan.monthlyAmountNgn
            const formatted = formatNgn(amount, symbol)
            const period =
              isYearly && hasYearly
                ? 'year'
                : plan.key === 'pay_per_use'
                ? 'listing'
                : 'month'
            const isCurrent =
              currentPlan === plan.key && variant === 'dashboard'
            const ctaLabel = isCurrent
              ? 'Current plan'
              : plan.key === 'pay_per_use'
              ? plan.cta
              : isSubscriptionPlan(plan)
              ? `${plan.cta} →`
              : plan.cta

            const monthlyFormatted = formatNgn(plan.monthlyAmountNgn, symbol)
            const yearlyFormatted = formatNgn(plan.yearlyAmountNgn, symbol)

            return (
              <article
                key={plan.key}
                className={cn(styles.card, {
                  [styles.cardHighlighted]: plan.highlighted,
                })}>
                {plan.badge && (
                  <span className={styles.popular}>★ {plan.badge}</span>
                )}
                <div className={styles.iconCircle}>{planIcon(plan)}</div>
                <div>
                  <h2 className={styles.planName}>{plan.name}</h2>
                  <p className={styles.planDescription}>{plan.description}</p>
                </div>
                <div>
                  <p className={styles.price}>
                    {formatted ?? plan.priceCaption ?? '—'}
                    {formatted && (
                      <span className={styles.pricePeriod}> /{period}</span>
                    )}
                  </p>
                  {plan.key === 'pay_per_use' || !hasYearly ? (
                    <p className={styles.priceHint}>
                      {plan.priceCaption ?? 'Billed as you go'}
                    </p>
                  ) : isYearly ? (
                    <p className={styles.priceHint}>
                      {monthlyFormatted
                        ? `or ${monthlyFormatted}/month`
                        : plan.priceCaption}
                    </p>
                  ) : (
                    <p className={styles.priceHint}>
                      {yearlyFormatted
                        ? `or ${yearlyFormatted}/year (Save ${catalog.yearlyDiscountPercent}%)`
                        : plan.priceCaption}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className={cn(
                    styles.cta,
                    plan.highlighted ? styles.ctaSolid : styles.ctaOutline,
                  )}
                  onClick={() => onSelect(plan)}
                  disabled={isCheckingOut || isCurrent}>
                  {isCheckingOut && isSubscriptionPlan(plan)
                    ? 'Redirecting…'
                    : ctaLabel}
                </button>
                {plan.featuresIntro && (
                  <p className={styles.priceHint}>{plan.featuresIntro}</p>
                )}
                <ul className={styles.features}>
                  {plan.features.map((feature) => {
                    const label = featureLabel(feature)
                    if (!label) return null
                    const included = featureIncluded(feature)
                    return (
                      <li
                        key={label}
                        className={cn(styles.feature, {
                          [styles.featureExcluded]: !included,
                        })}>
                        {included ? <FiCheck size={16} /> : <FiX size={16} />}
                        <span>{label}</span>
                      </li>
                    )
                  })}
                </ul>
              </article>
            )
          })}
        </div>

        {comparison && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {comparison.columns.map((column) => (
                    <th
                      key={column}
                      className={
                        column.toLowerCase() === 'paid'
                          ? styles.paidCol
                          : undefined
                      }>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row: ComparisonRow) => (
                  <tr key={row.id}>
                    <td>
                      <span className={styles.rowLabel}>
                        {comparisonIcon(row.id)} {row.label}
                      </span>
                      {row.hint && (
                        <span className={styles.rowHint}>{row.hint}</span>
                      )}
                    </td>
                    <td>{cellValue(row.free)}</td>
                    <td className={styles.paidCol}>{cellValue(row.paid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <section className={styles.why}>
          <div>
            <span className={styles.whyBadge}>{catalog.valueProps.badge}</span>
            <h2 className={styles.whyTitle}>{catalog.valueProps.title}</h2>
            <p className={styles.whyBody}>{catalog.valueProps.body}</p>
          </div>
          <div className={styles.whyGrid}>
            {catalog.valueProps.items.map((item) => (
              <div key={item.title} className={styles.whyItem}>
                {valueIcon(item.icon)}
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <p className={styles.contact}>
          {catalog.contact.prompt}{' '}
          <a href={catalog.contact.href}>
            {catalog.contact.cta} <FiArrowRight size={14} />
          </a>
        </p>
      </div>
    </div>
  )
}
