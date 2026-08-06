import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import auxHrLogo from '@/assets/aux_logo.png'
import { paths } from '@/paths'
import { useTheme } from '@/theme'

export const HomeNavbar = () => {
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="nav">
      <button
        type="button"
        className="logo"
        onClick={() => {
          navigate(paths.home)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}>
        <img src={auxHrLogo} alt="" />
        Auxhr
      </button>
      <nav className="nav-center" aria-label="Primary">
        <a
          href="#how"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('how')
          }}>
          How it works
        </a>
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('about')
          }}>
          About us
        </a>
      </nav>
      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle"
          aria-label="Toggle color theme"
          title="Toggle light/dark theme"
          onClick={toggleTheme}>
          <svg
            className="icon-sun"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg
            className="icon-moon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
          </svg>
        </button>
        <Link className="btn-outline" to={`/${paths.login}`}>
          Log in
        </Link>
        <Link className="btn-solid" to={`/${paths.register}`}>
          Try it Free
        </Link>
      </div>
    </header>
  )
}
