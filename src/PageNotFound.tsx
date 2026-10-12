import React from 'react'
import { RiArrowGoBackLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { dashboardPathForRole } from '@/features/auth/utils/dashboardPath'

import logo from './assets/aux_logo.png'
import errorImage from './assets/errorImage.png'
import styles from './PageNotFound.module.scss'

function PageNotFound() {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)

  const homePath = dashboardPathForRole(isLoggedIn ? userRole : null)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to={homePath} aria-label="Go to home">
          <img src={logo} alt="Aux HR" className={styles.logo} />
        </Link>
      </header>

      <main className={styles.content}>
        <img src={errorImage} alt="" className={styles.illustration} />

        <div className={styles.copy}>
          <p className={styles.code}>404</p>
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Check the address, or head back to somewhere familiar.
          </p>

          <div className={styles.actions}>
            <Button size="lg" onClick={() => navigate(homePath)}>
              {isLoggedIn ? 'Back to dashboard' : 'Back to home'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              icon={<RiArrowGoBackLine aria-hidden />}
              onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PageNotFound
