import React from 'react'
import CheckBox from '../../assets/CheckIcon.svg'

interface PricingDataProp {
  plan: string
  price: string
  priceSpan: string
  jobListing: string
  featuresTitle: string
  featuresText: string
  featuresData: string[]
}

const PricingCard: React.FC<PricingDataProp> = ({
  plan,
  price,
  priceSpan,
  jobListing,
  featuresTitle,
  featuresText,
  featuresData,
}) => {
  return (
    <div className="w-[340px] h-[900px]  border-2 rounded-xl border-[#E4E7EC] shadow-custom-2">
      <div className="p-6">
        <div className="my-6 space-y-5">
          <h2 className="font-inter font-medium text-[#667085] text-[18px] leading-[30px]">
            {plan}
          </h2>
          {price === 'Free' ? (
            <h1 className="font-inter font-semibold text-[46px] leading-[64px] text-[#101828]">
              {price}{' '}
              {priceSpan === 'Trail' ? (
                <span className="font-raleway font-medium text-[20px] text-[#667085] leading-[25px]">
                  {priceSpan}
                </span>
              ) : (
                <span className="font-inter font-semibold text-[25px] text-[#101828] leading-[25px]">
                  {priceSpan}
                </span>
              )}
            </h1>
          ) : (
            <h1 className="font-inter font-semibold text-[46px] leading-[64px] text-[#101828]">
              {price}/
              <span className="font-inter font-semibold text-[25px] text-[#101828] leading-[25px]">
                {priceSpan}
              </span>
            </h1>
          )}

          <p className="font-inter font-normal text-[18px] leading-[25px]">
            {jobListing}
          </p>
        </div>
        <div className="w-[250px] flex flex-col justify-center space-y-3">
          <button className="px-4 py-4 text-[18px] bg-[#4985DF] border border-[#4985DF] text-white cursor-pointer font-raleway font-semibold rounded-lg hover:bg-[#FFFFFF] hover:text-[#4985DF] hover:border hover:border-[#D0D5DD]">
            Get started
          </button>
          <button className="px-4 py-4 text-[18px] bg-[#FFFFFF] border border-[#D0D5DD] text-[#344054] cursor-pointer font-raleway font-semibold rounded-lg">
            Chat to Sales
          </button>
        </div>
      </div>
      <div className="border border-[#E4E7EC] mt-6" />

      <div className="p-6">
        <div className="my-6 space-y-3">
          <h1 className="font-inter font-semibold text-[#101828] text-[17px] leading-[25px]">
            {featuresTitle}
          </h1>
          <p className="font-raleway font-semibold text-[16px] leading-[25px] text-[#667085]">
            {featuresText}
          </p>
        </div>

        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="flex flex-row justify-start space-x-2 space-y-4 items-end text-left">
            <img src={CheckBox} alt="check box" className="w-6 h-6" />
            <h1 className="font-inter font-normal text-[16px] leading-[25px]">
              {feature}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingCard
