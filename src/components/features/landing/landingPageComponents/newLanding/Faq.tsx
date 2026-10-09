import React, { useState } from 'react'
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi2'

import styles from './Faq.module.scss'
import { faqItems } from './faqData'

export const Faq = () => {
  const [openId, setOpenId] = useState<string | null>(faqItems[0].id)

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Frequently asked questions</h2>
        <p className={styles.subcopy}>
          Everything you need to know about the product and billing.
        </p>
      </div>

      <div className={styles.list}>
        {faqItems.map((item) => {
          const isOpen = item.id === openId
          return (
            <div key={item.id} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}>
                <span>{item.question}</span>
                {isOpen ? (
                  <HiOutlineMinusCircle size={20} />
                ) : (
                  <HiOutlinePlusCircle size={20} />
                )}
              </button>
              {isOpen && <p className={styles.answer}>{item.answer}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
