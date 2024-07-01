import React from 'react'

// @ts-ignore
import clock from '../../assets/clockicon.svg'
// @ts-ignore
import marker from '../../assets/Iconmap.svg'

const JobPost = ({
  title,
  description,
  color,
  image,
  badge,
  bdbg,
}: {
  title: string
  description: string
  color: string
  image: any
  badge: string
  bdbg: string
}) => {
  return (
    <React.Fragment>
      <div className="job-post">
        <div className="images">
          <img src={image} alt="" />
        </div>
        <div className="description">
          <div className="top">
            <div className="badge">
              <h6>{title}</h6>
              <div className="color-bdg" style={{ backgroundColor: bdbg }}>
                <div className="dot" style={{ backgroundColor: color }} />
                <p style={{ color: color }}>{badge}</p>
              </div>
            </div>
            <p>{description}</p>
          </div>

          <div className="bottom">
            <div>
              <img src={clock} alt="" />
              <p>Full time</p>
            </div>
            <div>
              <img src={marker} alt="" />
              <p>Remote</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default JobPost
