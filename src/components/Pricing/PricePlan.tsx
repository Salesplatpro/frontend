import React, { Fragment } from 'react'
import PricingCard from './PricingCard'
import { PricingData } from './pricingData'
import ReactCardFlip from 'react-card-flip'
import PricingBackCard from './PricingBackCard'

interface PricePlanProp {
  isFlipped: boolean
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>
}

const PricePlan: React.FC<PricePlanProp> = ({ isFlipped }) => {
  return (
    <div className="w-full my-20 flex flex-col space-y-6 lg:flex lg:flex-row lg:space-x-3 lg:flex-nowrap lg:gap-x-0 lg:gap-y-0 lg:space-y-0 md:flex md:flex-row md:space-y-0 md:flex-wrap md:gap-x-6 md:gap-y-6 sm:flex sm:flex-col sm:space-y-6 justify-center items-center">
      {PricingData.map((item, index) => (
        <Fragment key={index}>
          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <PricingCard
              plan={item.plan}
              item={isFlipped ? item.annually : item.monthly}
            />

            <PricingBackCard
              plan={item.plan}
              item={isFlipped ? item.annually : item.monthly}
            />
          </ReactCardFlip>
        </Fragment>
      ))}
    </div>
  )
}

export default PricePlan
