import React from 'react'

// @ts-ignore
import brand1 from '../assets/brand1.png'
// @ts-ignore
import brand2 from '../assets/brand2.png'
// @ts-ignore
import brand3 from '../assets/brand3.png'
// @ts-ignore
import brand4 from '../assets/brand4.png'
// @ts-ignore
import brand5 from '../assets/brand5.png'
// @ts-ignore
import brand6 from '../assets/brand6.png'
// @ts-ignore
import brand7 from '../assets/brand7.png'
// @ts-ignore
import brand8 from '../assets/brand8.png'
// @ts-ignore
import brand9 from '../assets/brand9.png'
// @ts-ignore
import brand10 from '../assets/brand10.png'
// @ts-ignore
import brand11 from '../assets/brand11.png'
// @ts-ignore
import brand12 from '../assets/brand12.png'
// @ts-ignore
import brand13 from '../assets/brand13.png'
// @ts-ignore
import brand14 from '../assets/brand14.png'

const FeaturedBrand = () => {
  return (
    <React.Fragment>
      <div className="featured-brands">
        <div className="texts">
          <div className="inner">
            <div className="headings">
              <p>Don&#39;t take our word for it</p>
              <h4>Join over 100+ brands already growing with Supportpro</h4>
            </div>

            <p>
              Connect your tools, connect your teams. With over 200 apps already
              available in our directory, your team&#39;s favorite tools are
              just a click away.
            </p>
          </div>
        </div>

        <div className="images">
          <div className="overall">
            <img src={brand1} alt="" />
            <img src={brand2} alt="" />
            <img src={brand3} alt="" />
            <img src={brand4} alt="" />
            <img src={brand5} alt="" />
            <img src={brand6} alt="" />
            <img src={brand7} alt="" />
            <img src={brand14} alt="" />
            <img src={brand13} alt="" />
            <img src={brand12} alt="" />
            <img src={brand11} alt="" />
            <img src={brand10} alt="" />
            <img src={brand9} alt="" />
            <img src={brand8} alt="" />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default FeaturedBrand
