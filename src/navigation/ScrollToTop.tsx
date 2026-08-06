import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Open every route at the top of the page.
 * Hash-only changes on the same path are ignored so in-page anchors still work.
 */
export const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, search])

  return null
}
