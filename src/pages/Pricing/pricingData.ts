export interface PlanDetails {
  name?: string
  price: string
  description: string
  priceSpan: string
  featuresTitle: string
  featuresText: string[]
}

export interface Plan {
  _id: string
  name: string
  amount: number
  interval: 'monthly' | 'annually' | string
  paystackPlanCode: string
  currency: 'NGN' | 'USD' | string
  description: string
  features: string[]
  isDeleted: boolean
}

export type PlansData = {
  plans: Plan[]
}

export interface PlanApiResponse {
  status: boolean
  message: string
  data: PlansData
}

export interface PricingDataProp {
  item: PlanDetails
  onSelect?: () => void
  isLoading?: boolean
}
