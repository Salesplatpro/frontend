import React, { useState } from 'react'
import { CCollapse } from '@coreui/react'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io'

type FaqData = {
  id: string
  question: string
  answer: string
}

type FaqsProp = {
  faqs: FaqData[]
}

const FaqItem: React.FC<FaqsProp> = ({ faqs }) => {
  const [visible, setVisible] = useState<string | null>(null)

  return (
    <div className="w-full max-w-[350px] lg:max-w-[650px] md:max-w-[550px] sm:max-w-[400px] space-y-3">
      {faqs.map((faq) => {
        const isOpen = visible === faq.id
        return (
          <div key={faq.id} className="py-2">
            <button
              onClick={() => setVisible(isOpen ? null : faq.id)}
              className="w-full bg-[#2441ab] rounded-lg px-3 py-3 flex justify-between items-center">
              <span className="text-white font-normal font-poppins lg:text-[17px]">
                {faq.question}
              </span>

              <span className="flex justify-end items-end text-right">
                {isOpen ? (
                  <IoIosArrowDropup size={20} className="text-white" />
                ) : (
                  <IoIosArrowDropdown size={20} className="text-white" />
                )}
              </span>
            </button>

            <CCollapse visible={isOpen}>
              <div className="w-full my-4 border-1 border-[#3C6FD4]"></div>

              <div className="p-3 bg-white text-black font-normal font-poppins lg:text-[17px]">
                {faq.answer}
              </div>
            </CCollapse>
          </div>
        )
      })}
    </div>
  )
}

export default FaqItem
