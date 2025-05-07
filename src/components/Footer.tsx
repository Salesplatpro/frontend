import React from 'react'

import logo from '../assets/logo.png'
import youtube from '../assets/Lozengeyoutube.svg'
import telegram from '../assets/Subtracttelegram.svg'
import facebook from '../assets/Vectorfacebook.svg'
import linkedin from '../assets/Vectorlinkedin.svg'
import twitter from '../assets/Vectortwitter.svg'

const Footer: React.FC = () => {
  return (
    <React.Fragment>
      <div className="footer">
        <div className="main-contain">
          <div className="quick-link">
            <div className="logo mb-14 lg:mb-64 ">
              <img src={logo} alt="Company Logo" />
              <p>
                Design amazing digital experiences that create more happiness in
                the world.
              </p>
            </div>
            <div className="links">
              <div>
                <h6>Hire Talents</h6>
                <div>
                  <a href="/">Designers</a>
                  <a href="/">Developers</a>
                  <a href="/">Sales</a>
                  <a href="/">Customer Service</a>
                  <a href="/">Product</a>
                </div>
              </div>

              <div>
                <h6>Find Jobs</h6>
                <div>
                  <a href="/">Remote Jobs</a>
                  <a href="/">Internship</a>
                  <a href="/">Developer Jobs</a>
                  <a href="/">Support & Success</a>
                  <a href="/">Sales Jobs</a>
                  <a href="/">Product Jobs</a>
                </div>
              </div>

              <div>
                <h6>Product</h6>
                <div>
                  <a href="/solution">Solutions</a>
                  <a href="/pricing">Pricing</a>
                </div>
              </div>

              <div>
                <h6>Company</h6>
                <div>
                  <a href="/">About Us</a>
                  <a href="/">Contact</a>
                  <a href="/customerstories">Blog</a>
                  <a href="/">Help Center</a>
                </div>
              </div>

              <div>
                <h6>Legal</h6>
                <div>
                  <a href="/">Terms</a>
                  <a href="/">Privacy</a>
                  <a href="/">Cookies</a>
                  <a href="/">Licenses</a>
                </div>
              </div>
            </div>
          </div>

          <div className="tag-footer">
            <div className="cob">
              <p>&copy; 2023 Salesplat. All rights reserved.</p>

              <div className="socials">
                <a
                  href="https://x.com/thegrowthhub30"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={twitter} alt="Twitter" />
                </a>

                <a
                  href="https://www.linkedin.com/company/the-growth-hub-30/"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={linkedin} alt="LinkedIn" />
                </a>

                <a
                  href="https://www.facebook.com/p/The-Growth-Hub-100093247235214/"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={facebook} alt="Facebook" />
                </a>

                <a
                  href="/"
                  aria-label="Telegram"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={telegram} alt="Telegram" />
                </a>

                <a
                  href="/"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={youtube} alt="YouTube" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Footer
