import React, { Fragment } from 'react'
import PricingCard from './PricingCard'
import { PricingData } from './pricingData'

const PricePlan = () => {
  return (
    <div className="w-full my-20  lg:flex lg:flex-row lg:space-x-3 justify-center items-center">
      {PricingData.map((item, index) => (
        <Fragment>
          <PricingCard key={index} {...item} />
        </Fragment>
      ))}
    </div>
  )
}

export default PricePlan
