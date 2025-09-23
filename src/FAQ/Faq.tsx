import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import FaqItem from './FaqItem'
import { faqData } from './FaqData'

const Faq = () => {
  const [search, setSearch] = useState('')

  const filteredFaq = faqData.filter((faq) => {
    const faqTerm = search.toLowerCase()
    const searchQuestionMatch = faq.question.toLowerCase().includes(faqTerm)
    const searchAnswerMatch = faq.answer.toLowerCase().includes(faqTerm)

    return searchQuestionMatch || searchAnswerMatch
  })

  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col">
      <div className="flex justify-center items-center flex-col space-y-5 py-14">
        <h1 className="font-raleway font-medium text-[20px] lg:text-[40px] lg:leading-[100%] md:text-[35px] md:leading-[60%] sm:text-[27px] sm:leading-[45%] leading-[30%]">
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
            placeholder="search"
            className="w-[300px] lg:w-[500px] md:w-[450px] sm:w-[380px] h-[40px] rounded-lg bg-[#006BFF1A] border border-[#006BFF] text-black pl-10"
          />
        </div>
        {filteredFaq.length > 0 ? (
          <FaqItem faqs={filteredFaq} />
        ) : (
          <p className="text-gray-400 font-poppins leading-10 text-[20px] font-medium">
            Not Found
          </p>
        )}
      </div>
    </div>
  )
}

export default Faq
