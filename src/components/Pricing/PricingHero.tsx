import React from 'react'

const PricingHero = () => {
  return (
    <div className="w-full h-[250px] lg:h-[400px] md:h-[250px] bg-[#101828] flex justify-center items-center flex-col lg:flex lg:justify-center lg:items-center lg:flex-col md:flex md:justify-center md:items-center md:flex-col sm:h-[300px]">
      <div className="space-y-3 lg:space-y-5  md:space-y-4 text-center">
        <p className="text-[#4985DF] font-inter font-semibold text-[16px] leading-[20px] lg:text-[20px] md:text-[18px] lg:leading-[24px]">
          Pricing
        </p>
        <h1 className="text-white font-raleway font-bold text-[25px] lg:text-[48px] lg:leading-[60px] md:text-[38px] md:leading-[50px] sm:text-[33px] sm:leading-[45px]">
          Simple, transparent pricing
        </h1>

        <p className="text-[#DFEBFA] font-inter font-normal w-[320px] text-[15px] leading-[20px] text-center lg:w-full md:w-full sm:w-[400px] sm:text-[17px] sm:leading-[23px] sm:text-center  lg:text-[22px] lg:leading-[30px] md:text-[18px] md:leading-[25px]">
          We believe Untitled should be accessible to all companies, no matter
          the size.
        </p>

        <button
          className="px-2 py-2 text-[13px] rounded-lg lg:px-4 lg:py-4 lg:text-[18px] md:px-4 md:py-4 md:text-[16px] sm:px-3 sm:py-3 sm:text-[15px] bg-white border border-[#F1F6FD] text-center font-inter font-medium text-[#4985DF] 
         hover:bg-[#4985DF] hover:text-white hover:border-[#4985DF] cursor-pointer">
          Aux HR Pricing
        </button>
      </div>
    </div>
  )
}

export default PricingHero
