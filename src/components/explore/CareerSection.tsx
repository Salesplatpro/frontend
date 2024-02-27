import React from 'react'
import JobPost from './JobPost'
// @ts-ignore
import jonImg from '../../assets/jobpost2.png'
// @ts-ignore
import jop2 from '../../assets/jobpost.png'
// @ts-ignore
import searchIcon from '../../assets/searchsearcn.svg'

const jobs = [
  {title: "Product Designer", description: "We’re looking for a mid-level product designer to join our team.", color: "#175CD3", image: jonImg, badge: "Design", bdbg: "#EFF8FF"},

  {title: "Engineering Manager", description: "We’re looking for an experienced engineering manager to join our team.", color: "#C11574", image: jop2, badge: "Software Development", bdbg: "#FDF2FA"},

  {title: "Customer Success Manager", description: "We’re looking for a customer success manager to join our team.", color: "#027A48", image: jonImg, badge: "Customer Success", bdbg: "#ECFDF3"},

  {title: "Account Executive", description: "We’re looking for an account executive to join our team.", color: "#3538CD", image: jop2, badge: "Sales", bdbg: "#EEF4FF"},

  {title: "SEO Marketing Manager", description: "We’re looking for an experienced SEO marketing manager to join our team.", color: "#C4320A", image: jop2, badge: "Marketing", bdbg: "#FFF6ED"},

  {title: "Product Designer", description: "We’re looking for a mid-level product designer to join our team.", color: "#175CD3", image: jonImg, badge: "Design", bdbg: "#EFF8FF"},

  {title: "Engineering Manager", description: "We’re looking for an experienced engineering manager to join our team.", color: "#C11574", image: jop2, badge: "Software Development", bdbg: "#FDF2FA"},

  {title: "Customer Success Manager", description: "We’re looking for a customer success manager to join our team.", color: "#027A48", image: jonImg, badge: "Customer Success", bdbg: "#ECFDF3"},

  {title: "Account Executive", description: "We’re looking for an account executive to join our team.", color: "#3538CD", image: jop2, badge: "Sales", bdbg: "#EEF4FF"},

  {title: "SEO Marketing Manager", description: "We’re looking for an experienced SEO marketing manager to join our team.", color: "#C4320A", image: jop2, badge: "Marketing", bdbg: "#FFF6ED"},

]


const CareerSection = () => {
  return (
    <React.Fragment>
      <div className="career-section">
        <div className="content">
          <div className="jobs">
            <div className="content">
              {jobs.map((job, index) => (
                <JobPost title={job.title} description={job.description} badge={job.badge} color={job.color} bdbg={job.bdbg} image={job.image}/>
              ))}
            </div>
          </div>

          <div className="job-search">
            <div className="search-tool">
              <label>Filter</label>
              <div className="search-box">
                <img src={searchIcon} alt="search" />
              <input type="text" placeholder='Search'/>
              </div>

              <div className='divider'/>

              <label>Specialties</label>

              <div className="radio-group">
                <div>
                  <input type="checkbox"/>
                  <p>Design & UI/UX</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>Brand / Graphic Design</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>Product</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>Recruiting and HR</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>Sales</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>UI / Visual Design</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>Product Design</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>UX Design / Research</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>Web Design</p>
                </div>
              </div>

              <div className="divider"/>

              <label>Location</label>

              <div className="search-box">
              <input type="text" placeholder='Enter Loation..'/>
              </div>

              <div className="radio-group">
                <div>
                  <input type="checkbox"/>
                  <p>Open to remote</p>
                </div>
              </div>

              <div className="divider"/>

              <div className="radio-group">
                <div>
                  <input type="checkbox"/>
                  <p>Full-Time</p>
                </div>

                <div>
                  <input type="checkbox"/>
                  <p>Freelance/Contract</p>
                </div>
              </div>

              <button>Filter</button>
            </div>
          </div>
        </div>

       <div style={{ display: "flex", justifyContent: "center" }}>
        <button className='closeing'>Load more</button>
       </div>
      </div>
    </React.Fragment>
  )
}

export default CareerSection