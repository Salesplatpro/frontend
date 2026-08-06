import React from 'react'
import { Link } from 'react-router-dom'

import howItWorks from '@/assets/howItWorks.png'
import { paths } from '@/paths'

export const AccessSection = () => (
  <section className="access">
    <div className="access-card">
      <div>
        <h2>Access exceptional talent with Auxhr.</h2>
        <p>
          Let the numbers talk. Auxhr doesn’t just improve hiring — it
          transforms it: 60% faster time to hire, 3× quicker screening, 90%
          hiring team satisfaction.
        </p>
        <Link className="btn-primary" to={`/${paths.register}`}>
          Get a Demo
        </Link>
        <p className="trust-line">
          Trusted by teams already growing with Auxhr
        </p>
      </div>
      <div className="access-visual">
        <img src={howItWorks} alt="Auxhr hiring workflow" />
      </div>
    </div>
  </section>
)
