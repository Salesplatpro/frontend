import React from 'react'

const PricingNotification = () => {
  return (
    <div className="w-full h-[450px] flex flex-col justify-center my-12 items-center space-y-10 lg:h-[350px] lg:my-0 lg:space-y-0 lg:flex-row lg:flex lg:justify-evenly lg:items-center md:h-[450px] md:flex md:flex-col md:justify-center md:items-center md:my-8 md:space-y-10 sm:h-[450px] sm:flex sm:flex-col sm:justify-center sm:items-center sm:my-8 sm:space-y-10">
      <div className="w-[300px] lg:w-[500px] md:w-[500px] sm:w-[450px] space-y-4">
        <h1 className="font-normal font-poppins text-xl leading-[18px] lg:text-3xl lg:leading-[40px] md:text-3xl md:leading-[35px] sm:text-2xl sm:leading-[20px]">
          Candidate Assessment slots
        </h1>

        <p className="w-[340px] text-base lg:w-[420px] font-raleway font-normal lg:text-lg leading-[150%] sm:text-lg sm:leading-[100%]">
          Buy more Candidate Assessment Slots at{' '}
          <span className="text-lg leading-[150%]">#10,000 / $7</span> per 10
          candidates{' '}
        </p>

        <button className="px-7 py-4 lg:px-8 lg:py-5 border rounded-full border-[#241C15] shadow-custom-2 cursor-pointer font-raleway font-medium text-sm leading-[20px]">
          Buy Now
        </button>
      </div>
      <div className="border border-[#241C15] w-[300px] lg:w-0 lg:h-[200px] md:w-[500px] md:h-[1px] sm:w-[450px]" />
      <div className="w-[300px] lg:w-[500px] md:w-[500px] sm:w-[450px] space-y-4">
        <h1 className="font-normal font-poppins text-xl leading-[18px] lg:text-3xl lg:leading-[40px] md:text-3xl md:leading-[35px] sm:text-2xl sm:leading-[20px]">
          Candidate Assessment slots
        </h1>

        <p className="w-[300px] text-base  lg:w-[450px] font-raleway font-normal lg:text-lg md:text-lg leading-[150%] sm:text-lg  ">
          We give extra 15 days with reminders to the company that the link will
          stop assessing applicants upon the 45th Day
        </p>

        <p className="w-[300px] text-base lg:w-[420px] font-raleway font-normal lg:text-lg leading-[150%]">
          Company renews link at{' '}
          <span className="text-lg leading-[150%]">#50,000 / $30</span> per
          month after Day 45
        </p>
      </div>
    </div>
  )
}

export default PricingNotification
