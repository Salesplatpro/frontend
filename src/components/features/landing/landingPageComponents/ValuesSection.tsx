import React from 'react'

import cvmatchIcon from '@/assets/cvmatchIcon.webp'
import personalizedIcon from '@/assets/personalizedIcon.webp'
import pretestIcon from '@/assets/pretestIcon.webp'

const values = [
  {
    icon: cvmatchIcon,
    title: 'Better fits',
    body: 'AI talent matching surfaces candidates by skills, experience, and role shape — not keyword spam.',
  },
  {
    icon: pretestIcon,
    title: 'Less noise',
    body: '70% fewer unqualified applicants. Quality shortlists over quantity — so your team spends time where it counts.',
  },
  {
    icon: personalizedIcon,
    title: 'More warmth',
    body: 'Clear collaboration and faster screening — relationships that hire, not transactional inbox chaos.',
  },
]

export const ValuesSection = () => (
  <section className="values" id="about">
    <h2>Hiring that feels human.</h2>
    <p className="values-lead">
      Auxhr combines AI and human judgment to help you find the work — and the
      people — that truly fit.
    </p>
    <div className="value-grid">
      {values.map((value) => (
        <article className="value" key={value.title}>
          <img src={value.icon} alt="" />
          <h3>{value.title}</h3>
          <p>{value.body}</p>
        </article>
      ))}
    </div>
  </section>
)
