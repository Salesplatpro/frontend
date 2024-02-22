import React from 'react'
// @ts-ignore
import logo from '../assets/logo.png'
// @ts-ignore
import twitter from '../assets/Vectortwitter.svg'
// @ts-ignore
import linkedin from '../assets/Vectorlinkedin.svg'
// @ts-ignore
import youtube from '../assets/Lozengeyoutube.svg'
// @ts-ignore
import telegram from '../assets/Subtracttelegram.svg'
// @ts-ignore
import facebook from '../assets/Vectorfacebook.svg'

const Footer = () => {
  return (
    <React.Fragment>
      <div className="footer">
        <div className="main-contain">
          <div className="quick-link">
            <div className="logo">
              <img src={logo} alt="logo" />

              <p>Design amazing digital experiences that create more happy in the world.</p>
            </div>
            <div className="links">
              <div>
                <h6>Hire talents</h6>
                <div>
                  <a href="">Designers</a>
                  <a href="">Developers</a>
                  <a href="">Sales</a>
                  <a href="">Customer service</a>
                  <a href="">Product</a>
                </div>
              </div>

              <div>
                <h6>Find Jobs</h6>
                <div>
                  <a href="">Remote Jobs</a>
                  <a href="">Internship</a>
                  <a href="">Developers Job</a>
                  <a href="">Support & Success</a>
                  <a href="">Sales Job</a>
                  <a href="">Product Job</a>
                </div>
              </div>

              <div>
                <h6>Product</h6>
                <div>
                  <a href="">Solutions</a>
                  <a href="">Pricing</a>
                </div>
              </div>

              <div>
                <h6>Company</h6>
                <div>
                  <a href="">About Us</a>
                  <a href="">Contact</a>
                  <a href="">Blog</a>
                  <a href="">Help Center</a>
                </div>
              </div>

              <div>
                <h6>Legal</h6>
                <div>
                  <a href="">Terms</a>
                  <a href="">Privacy</a>
                  <a href="">Cookies</a>
                  <a href="">Licenses</a>
                </div>
              </div>
            </div>
          </div>

          <div className="tag-footer">
            <div className="cob">
              <p>&copy; 2023 Salesplat. All rights reserved.</p>

              <div className="socials">
                <a href="">
                  <img src={twitter} alt="" />
                </a>

                <a href="">
                  <img src={linkedin} alt="" />
                </a>

                <a href="">
                  <img src={facebook} alt="" />
                </a>

                <a href="">
                  <img src={telegram} alt="" />
                </a>

                <a href="">
                  <img src={youtube} alt="" />
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