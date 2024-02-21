import React from 'react'

const ServiceSection = () => {
  return (
    <React.Fragment>
      <div className="service-section">
        <div className="righty">
          <div className="text">
            <div className="inner-texts">
              <p className="top">Hire smarter</p>
              <div>
                <h3>How to attract the best talents for your organization</h3>
                
                <p>Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.</p>
              </div>
            </div>
            <button>
              Find out how
            </button>
          </div>

          <div className="images">
            <img src='../../assets/bing1.png' alt="talents" />
          </div>
        </div>

        <div className="lefty">
          <div className="images">
            <img src='../../assets/bing2.png' alt="talents" />
          </div>
          
          <div className="text">
            <div className="inner-texts">
              <p className="top">Product and Solutions</p>
              <div>
                <h3>Empower Your Hiring Strategy with Top-Tier Tools</h3>
                
                <p>Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.</p>
              </div>
            </div>
            <button>
              Our solutions
            </button>
          </div> 
        </div>

        <div className="righty">
          <div className="text">
            <div className="inner-texts">
              <p className="top">Hiring 101</p>
              <div>
                <h3>New to hiring? Get all you need to start.</h3>
                
                <p>Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.</p>
              </div>
            </div>
            <button>
              Learn more
            </button>
          </div>

          <div className="images">
            <img src='../../assets/bing3.png' alt="talents" />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ServiceSection