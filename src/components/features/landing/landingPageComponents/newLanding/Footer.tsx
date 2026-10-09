import React from 'react'

import logoMark from './assets/logo-mark.png'
import styles from './Footer.module.scss'
import { footerColumns } from './footerLinks'

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.columns}>
        {footerColumns.map((column) => (
          <div key={column.title} className={styles.column}>
            <span className={styles.columnTitle}>{column.title}</span>
            {column.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className={styles.link}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <img src={logoMark} alt="AuxHR" className={styles.logo} />
        <p className={styles.copyright}>
          © {new Date().getFullYear()} AuxHr. All rights reserved. Powered by
          Salesplay
        </p>
      </div>
    </div>
  </footer>
)
