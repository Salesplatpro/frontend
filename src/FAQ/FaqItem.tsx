import React, { useState } from 'react'
import { CButton, CCollapse } from '@coreui/react'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io'

type FaqItem = {
  id: string
  question: string
  answer: string
}

type FaqsProp = {
  faqs: FaqItem[]
}

const FaqItem: React.FC<FaqsProp> = ({ faqs }) => {
  const [visible, setVisible] = useState<string | null>(null)

  return (
    <div className="w-full max-w-[650px] space-y-3">
      {faqs.map((faq) => {
        const isOpen = visible === faq.id
        return (
          <div key={faq.id} className="py-2">
            <button
              onClick={() => setVisible(isOpen ? null : faq.id)}
              className="w-full bg-[#0027AF] rounded-lg px-3 py-3 flex justify-between items-center">
              <span className="text-white">{faq.question}</span>

              <span className="flex justify-end   items-end text-right">
                {isOpen ? (
                  <IoIosArrowDropup size={20} className="text-white" />
                ) : (
                  <IoIosArrowDropdown size={20} className="text-white" />
                )}
              </span>
            </button>

            <CCollapse visible={isOpen}>
              <div className="p-3 bg-white text-black">{faq.answer}</div>
            </CCollapse>
          </div>
        )
      })}
    </div>
  )
}

export default FaqItem
