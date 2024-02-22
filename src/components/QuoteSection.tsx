import React from 'react'
// @ts-ignore
import quotes from '../assets/quote1.jpeg'

const QuoteSection = () => {
  return (
    <React.Fragment>
      <div className="quote-section">
        <div className="text">
          <div className="cover">
            <div className="inner">
              <h5>Hire the best talents</h5>
              <p>Join over 100+ brands already growing with Supportpro</p>
            </div>
            <button>
              Start Hiring
            </button>
          </div>
        </div>

        <div className="testimonial">
          <div className="cover">
            <img src={quotes} alt="" />
            <div className="text">
              <h5>
                Love the simplicity of the service and the prompt customer support. We can&#39;t imagine working without it.
              </h5>

              <div className="inner">
                <p className='tip'>— Olivia Rhye</p>
                <p>Head of Design, Layers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default QuoteSection