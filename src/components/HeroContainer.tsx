import React from 'react'
// @ts-ignore
import homepages from '../assets/homepage.png'

const HeroContainer = () => {
  return (
    <React.Fragment>
      <section className="main-container">
        <div className='home-pg'>
          <div className='text'>
            <div className="inner-text">
              <h2>
                Hire the best talents for your organization
              </h2>

              <p className='inner'>
                Streamline Your Hiring Process and Make Confident Decisions with SupportPro&#39;s Comprehensive Platform.
              </p>

              <button>
                start Hiring
              </button>
              
              <div className="outer-text">
               Looking for jobs instead?  &nbsp; <a href="#">Apply for jobs</a>
              </div>
            </div>

            
          </div>
          <div className='image'>
            <img src={homepages} alt='brain-storm'/>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default HeroContainer