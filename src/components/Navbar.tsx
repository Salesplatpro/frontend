import React from 'react'

const Navbar = () => {
  return (
    <React.Fragment>
      <div className='navi'>
        <div className="container wrapper nav-navigate">
          <nav className="navbar">
            <ul>
              <a href="" className='logo-li'><img src="src/assets/logo.png" alt="" /></a>
              <li><a href="">solutions</a></li>
              <li><a href="">resources</a></li>
              <li><a href="">explore jobs</a></li>
              <li><a href="">customers stories</a></li>
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