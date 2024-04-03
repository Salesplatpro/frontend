import React from 'react'
// @ts-ignore
import customerHero from '../../assets/customerHero.webp'
import customerDp from '../../assets/Avatar.png'
import { CiLocationOn } from "react-icons/ci";

const CustomerHero = () => {
  return (
    <React.Fragment>
      <section className="customerstory-container">
        <div className='home-pg'>
          <div className='image'>
            <img src={customerHero} alt='Customer Story' />
          </div>

          <div className='text'>
            <div className="inner-text">
              <div className='location-icon'><CiLocationOn /></div>
              <h2>
              Roy’s Peak <br /> <h2 className='h2-sub'>Wanaka, New Zealand</h2> 
              </h2>

              <p className='inner'>
              New Zealand is famous for its breathtaking hiking trails that wind and weave their way through its beautiful landscapes.
              </p>

              <div className='customer-info'>
                <div className='dp'>
                <img src={customerDp} alt='customerDp'/>
                </div>
                <div className='customer-name'>
                  <p>Olivia Ryne</p>
                  <p className='role'>Published in Adventure</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default CustomerHero