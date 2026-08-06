import React from 'react'

import testimonial from '@/assets/testimonial.png'

export const HomeQuote = () => (
  <section className="quote">
    <div className="quote-card">
      <img src={testimonial} alt="Hiring team" />
      <div>
        <blockquote>
          “Auxhr gave us back weeks of time. We hired three top-tier developers
          in half the usual time.”
        </blockquote>
        <cite>— Sarah, CTO at SeedTech</cite>
      </div>
    </div>
  </section>
)
