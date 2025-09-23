import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import FaqItem from './FaqItem'
import { faqData } from './FaqData'

const Faq = () => {
  const [search, setSearch] = useState('')
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col">
      <div className="flex justify-center items-center flex-col space-y-5 py-14">
        <h1 className="font-raleway font-medium lg:text-[40px] leading-[100%]">
          Frequently Asked Questions (FAQs)
        </h1>
        <div className="relative">
          <FiSearch
            fontSize={20}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            className="lg:w-[500px] lg:h-[40px] rounded-lg bg-[#006BFF1A] border border-[#006BFF] text-black pl-10"
          />
        </div>
        <FaqItem faqs={faqData} />
      </div>
    </div>
  )
}

export default Faq
