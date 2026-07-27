import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FiSearch } from 'react-icons/fi'

import { faqData } from './FaqData'
import FaqItem from './FaqItem'

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
      <Helmet>
        <title>FAQ — AuxHR</title>
        <meta
          name="description"
          content="Answers to frequently asked questions about AuxHR's recruitment platform."
        />
        <link rel="canonical" href="https://auxhr.com/faq" />
        <meta property="og:title" content="FAQ — AuxHR" />
        <meta
          property="og:description"
          content="Answers to frequently asked questions about AuxHR's recruitment platform."
        />
        <meta property="og:url" content="https://auxhr.com/faq" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="flex justify-center items-center flex-col space-y-5 py-14">
        <h1 className="font-raleway font-medium text-xl lg:text-4xl lg:leading-[100%] md:text-3xl md:leading-[60%] sm:text-2xl sm:leading-[45%] leading-[30%]">
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
            className="w-[300px] lg:w-[500px] md:w-[450px] sm:w-[380px] h-[40px] rounded-lg bg-[#006BFF1A] border border-info text-black pl-10"
          />
        </div>
        {filteredFaq.length > 0 ? (
          <FaqItem faqs={filteredFaq} />
        ) : (
          <p className="text-gray-400 font-poppins leading-10 text-xl font-medium">
            Not Found
          </p>
        )}
      </div>
    </div>
  )
}

export default Faq
