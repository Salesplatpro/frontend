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

import { usePaidCheckout } from '../hooks/usePaidCheckout'
import { usePricingCatalog } from '../hooks/usePricingCatalog'
import { BillingInterval, ComparisonRow, PricingPlan } from '../types'
import styles from './PricingContent.module.scss'

const formatNgn = (amount: number, symbol: string) =>
  `${symbol}${amount.toLocaleString('en-NG')}`

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

type PricingContentProps = {
  variant?: 'public' | 'dashboard'
  currentPlan?: 'free' | 'paid'
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

  const onSelect = async (plan: PricingPlan) => {
    if (plan.key === 'free') {
      if (variant === 'dashboard' || (isLoggedIn && userRole === 'recruiter')) {
        navigate('/recruiterDashboard/dashboard')
        return
      }
      navigate('/register')
      return
    }
    await startCheckout(interval)
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
            const amount = isYearly
              ? plan.yearlyAmountNgn
              : plan.monthlyAmountNgn
            const period = isYearly ? 'year' : 'month'
            const isCurrent =
              currentPlan === plan.key && variant === 'dashboard'
            const ctaLabel =
              isCurrent && plan.key === 'free'
                ? 'Current plan'
                : plan.key === 'paid'
                ? `${plan.cta} →`
                : plan.cta

            return (
              <article
                key={plan.key}
                className={cn(styles.card, {
                  [styles.cardHighlighted]: plan.highlighted,
                })}>
                {plan.badge && (
                  <span className={styles.popular}>★ {plan.badge}</span>
                )}
                <div className={styles.iconCircle}>
                  {plan.key === 'paid' ? (
                    <FiZap size={20} />
                  ) : (
                    <FiUser size={20} />
                  )}
                </div>
                <div>
                  <h2 className={styles.planName}>{plan.name}</h2>
                  <p className={styles.planDescription}>{plan.description}</p>
                </div>
                <div>
                  <p className={styles.price}>
                    {formatNgn(amount, symbol)}
                    {plan.key === 'paid' && (
                      <span className={styles.pricePeriod}> /{period}</span>
                    )}
                  </p>
                  {plan.key === 'free' ? (
                    <p className={styles.priceHint}>{plan.priceCaption}</p>
                  ) : (
                    <p className={styles.priceHint}>
                      {isYearly
                        ? `or ${formatNgn(plan.monthlyAmountNgn, symbol)}/month`
                        : `or ${formatNgn(
                            plan.yearlyAmountNgn,
                            symbol,
                          )}/year (Save ${catalog.yearlyDiscountPercent}%)`}
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
                  disabled={
                    isCheckingOut || (isCurrent && plan.key === 'free')
                  }>
                  {isCheckingOut && plan.key === 'paid'
                    ? 'Redirecting…'
                    : ctaLabel}
                </button>
                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={cn(styles.feature, {
                        [styles.featureExcluded]: !feature.included,
                      })}>
                      {feature.included ? (
                        <FiCheck size={16} />
                      ) : (
                        <FiX size={16} />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {catalog.comparison.columns.map((column) => (
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
              {catalog.comparison.rows.map((row: ComparisonRow) => (
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
