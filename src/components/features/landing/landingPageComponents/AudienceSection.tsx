import React from 'react'

import image1 from '@/assets/image1.png'
import image2 from '@/assets/image2.png'
import image3 from '@/assets/image3.png'

const audiences = [
  {
    image: image1,
    title: 'Startups & tech companies',
    body: 'Find engineers, PMs, and marketers without the long wait.',
  },
  {
    image: image2,
    title: 'Recruitment agencies',
    body: 'Scale candidate sourcing with smart automation.',
  },
  {
    image: image3,
    title: 'Growth-stage businesses',
    body: 'Build teams quickly as you expand into new markets.',
  },
]

export const AudienceSection = () => (
  <section className="audience">
    <h2>Designed for modern hiring teams.</h2>
    <div className="audience-grid">
      {audiences.map((item) => (
        <article className="audience-card" key={item.title}>
          <img src={item.image} alt="" />
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
)
