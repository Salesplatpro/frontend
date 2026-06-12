import React from 'react'

import CheckBox from '../../assets/CheckIcon.svg'
import { PricingDataProp } from './pricingData'

const PricingBackCard: React.FC<PricingDataProp> = ({
  item,
  onSelect,
  isLoading,
}) => {
  return (
    <div className="w-[360px] h-[1000px]  border-2 rounded-xl border-grey-200 shadow-custom-2">
      <div className="p-6">
        <div className="my-6 space-y-5">
          <h2 className="font-inter font-medium text-grey-500 text-[18px] leading-[30px]">
            {item.name}
          </h2>
          {item.price === 'Free' ? (
            <h1 className="font-inter font-semibold text-[36px] leading-[64px] text-grey-900">
              {item.price}{' '}
              {item.priceSpan === 'Trail' ? (
                <span className="font-raleway font-medium text-[18px] text-grey-500 leading-[25px]">
                  {item.priceSpan}
                </span>
              ) : (
                <span className="font-inter font-semibold text-[18px] text-grey-900 leading-[25px]">
                  {item.priceSpan}
                </span>
              )}
            </h1>
          ) : (
            <h1 className="font-inter font-semibold text-[36px] leading-[64px] text-grey-900">
              {item.price}/
              <span className="font-inter font-semibold text-[20px] text-grey-900 leading-[25px]">
                {item.priceSpan}
              </span>
            </h1>
          )}

          <p className="font-inter font-normal text-[18px] leading-[25px]">
            {item.name}
          </p>
        </div>
        <div className="w-[250px] flex flex-col justify-center space-y-3">
          <button
            onClick={onSelect}
            disabled={isLoading}
            className={`px-4 py-4 text-[18px] ${
              isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'bg-primary text-white cursor-pointer'
            } border border-primary font-raleway font-semibold rounded-lg hover:bg-white hover:text-primary hover:border hover:border-grey-300`}
          >
            {isLoading ? 'Loading...' : 'Get started'}
          </button>
          <button className="px-4 py-4 text-[18px] bg-white border border-grey-300 text-grey-700 cursor-pointer font-raleway font-semibold rounded-lg">
            Chat to Sales
          </button>
        </div>
      </div>
      <div className="border border-grey-200 mt-6" />

      <div className="p-6">
        <div className="my-6 space-y-3">
          <h1 className="font-inter font-semibold text-grey-900 text-[17px] leading-[25px]">
            {item.featuresTitle}
          </h1>
          <p className="font-raleway font-semibold text-[16px] leading-[25px] text-grey-500">
            {item.description}
          </p>
        </div>

        {item.featuresText.map((feature, index) => (
          <div
            key={index}
            className="flex flex-row justify-start space-x-2 space-y-4 items-end text-left"
          >
            <img src={CheckBox} alt="check box" className="w-6 h-6" />
            <h1 className="font-inter font-normal text-[16px] leading-[25px] text-grey-500">
              {feature}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingBackCard
