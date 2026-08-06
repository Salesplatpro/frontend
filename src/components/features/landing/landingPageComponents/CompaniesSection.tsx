import React from 'react'

import { companies } from './companiesData'

export const CompaniesSection = () => {
  const row = [...companies, ...companies]

  return (
    <section className="companies" id="companies">
      <h2>Companies across Africa are already using Auxhr.</h2>
      <p>
        Join over 100+ brands already growing with Auxhr — from Lagos to
        Nairobi, Accra to Cape Town.
      </p>
      <div className="marquee" aria-label="Companies using Auxhr">
        <div className="marquee-track">
          {row.map((company, index) => (
            <div className="company" key={`${company.name}-${index}`}>
              <span>
                {company.name}
                {company.accent ? (
                  <>
                    {' '}
                    <span>{company.accent}</span>
                  </>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
