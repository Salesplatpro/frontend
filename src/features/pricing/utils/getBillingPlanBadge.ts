export const getBillingPlanBadge = (billingPlan?: string | null) =>
  billingPlan === 'paid'
    ? { status: 'Paid', backgroundColor: '#e8f1fc', color: '#2441ab' }
    : { status: 'Free plan', backgroundColor: '#f1f6fd', color: '#4279cb' }
