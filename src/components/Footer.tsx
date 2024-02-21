import React from 'react'

const Footer = () => {
  return (
    <React.Fragment>
      <div className="footer">
        <div className="main-contain">
          <div className="quick-link">
            <div className="logo">
              <img src="src/assets/logo.png" alt="logo" />

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
            </div>
          </div>

          <div className="tag-footer">
            <div className="cob">
              <p>&copy; 2023 Salesplat. All rights reserved.</p>

              <div className="socials">
                <a href="">
                  <img src="src/assets/Vectortwitter.svg" alt="" />
                </a>

                <a href="">
                  <img src="src/assets/Vectorlinkedin.svg" alt="" />
                </a>

                <a href="">
                  <img src="src/assets/Vectorfacebook.svg" alt="" />
                </a>

                <a href="">
                  <img src="src/assets/Subtracttelegram.svg" alt="" />
                </a>

                <a href="">
                  <img src="src/assets/Lozengeyoutube.svg" alt="" />
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