import React from 'react'
import { Link } from 'react-router-dom'

import auxHrLogo from '@/assets/aux_logo.png'
import { paths } from '@/paths'

export const HomeFooter = () => (
  <footer>
    <div className="footer-brand">
      <img src={auxHrLogo} alt="" />
      Auxhr
    </div>
    <div className="footer-links">
      <Link to={`/${paths.privacyPolicy}`}>Privacy Policy</Link>
      <Link to={`/${paths.termsConditions}`}>Terms of Service</Link>
      <a href="mailto:support@auxhr.com">support@auxhr.com</a>
    </div>
    <div>© {new Date().getFullYear()} Auxhr. All rights reserved.</div>
  </footer>
)
