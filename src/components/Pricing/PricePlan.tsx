import React, { Fragment } from 'react'
import ReactCardFlip from 'react-card-flip'

import {
  usePaymentInitiateMutation,
  usePricingPlanQuery,
} from '../../redux/api/apiSlice'
import { notify } from '../../utils/toastNotifications'
import Loading from '../Loading/Loading'
import PricingBackCard from './PricingBackCard'
import PricingCard from './PricingCard'
import { Plan, PlanApiResponse, PlanDetails } from './pricingData'

interface PricePlanProp {
  isFlipped: boolean
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>
}

const mapPlanToDetails = (plan: Plan): PlanDetails => ({
  name: plan.name,
  price: `₦${(plan.amount / 100).toLocaleString()}`,
  priceSpan: plan.interval,
  description: plan.description,
  featuresTitle: 'Features',
  featuresText: plan.features,
})

const PricePlan: React.FC<PricePlanProp> = ({ isFlipped }) => {
  const {
    data: pricingPlans,
    error: userPlanError,
    isLoading: userPlanLoading,
  } = usePricingPlanQuery({}) as {
    data?: PlanApiResponse
    error?: any
    isLoading: boolean
  }
  const [initializePayment] = usePaymentInitiateMutation()

  const [loadingPlanId, setIsLoadingPlanId] = React.useState<string | null>(
    null,
  )

  if (userPlanLoading) {
    return <Loading />
  }
  if (userPlanError) {
    notify('error', 'DisplayError loading pricing plans')
  }

  const pricingPlansData: Plan[] = pricingPlans?.data?.plans || []

  console.log('Pricing Plans:', pricingPlansData)
  console.log('the Pricing Plans:', pricingPlans?.data)

  const monthlyPlans = pricingPlansData.filter(
    (plan: Plan) => plan.interval === 'monthly',
  )
  const annuallyPlans = pricingPlansData.filter(
    (plan: Plan) => plan.interval === 'annually',
  )

  const handlePayment = async (planId: string) => {
    setIsLoadingPlanId(planId)
    try {
      const response = await initializePayment({ planId }).unwrap()
      const link = response.data.link
      if (link) {
        window.location.href = link
      }
    } catch (error: any) {
      console.error('Payment initialization failed:', error)
      const message =
        error.data?.message ||
        error?.message ||
        'Failed to initialize payment. Please try again.'
      notify('error', message)
    } finally {
      setIsLoadingPlanId(null)
    }
  }

  return (
    <div className="w-full my-20 flex flex-col space-y-6 lg:flex lg:flex-row lg:space-x-3 lg:flex-nowrap lg:gap-x-0 lg:gap-y-0 lg:space-y-0 md:flex md:flex-row md:space-y-0 md:flex-wrap md:gap-x-6 md:gap-y-6 sm:flex sm:flex-col sm:space-y-6 justify-center items-center">
      {monthlyPlans.map((monthlyPlan: Plan) => {
        const matchingAnnualPlan = annuallyPlans.find(
          (annualPlan) => annualPlan.name === monthlyPlan.name,
        )

        return (
          <Fragment key={monthlyPlan._id}>
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
              <PricingCard
                item={mapPlanToDetails(monthlyPlan)}
                onSelect={() => handlePayment(monthlyPlan._id)}
                isLoading={loadingPlanId === monthlyPlan._id}
              />
              <PricingBackCard
                item={
                  matchingAnnualPlan
                    ? mapPlanToDetails(matchingAnnualPlan)
                    : mapPlanToDetails(monthlyPlan)
                }
                onSelect={() =>
                  handlePayment(matchingAnnualPlan?._id || monthlyPlan._id)
                }
                isLoading={loadingPlanId === monthlyPlan._id}
              />
            </ReactCardFlip>
          </Fragment>
        )
      })}
    </div>
  )
}

export default PricePlan
