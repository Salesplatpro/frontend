import React from 'react'
// @ts-ignore
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <React.Fragment>
      <div className='navi'>
        <div className="container wrapper nav-navigate">
          <nav className="navbar">
            <ul>
              <a href="/" className='logo-li'><img src={logo} alt="" /></a>
              <li><a href="solution">solutions</a></li>
              <li><a href="">resources</a></li>
              <li><a href="explore">explore jobs</a></li>
              <li><a href="customerstories">customers stories</a></li>
            </ul>
          </nav>

          <div className='action-btn nav-font'>
            <button className='login' type="button">login</button>          
            <button className='apply'>Apply for jobs</button>
            <button className='hire'>hire talents</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Navbar