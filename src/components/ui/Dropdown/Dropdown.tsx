import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './Dropdown.module.scss'

export interface DropdownItem {
  key?: string
  label: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  /** Set to false for checkbox-style menus (e.g. a column picker) where the menu should stay open after each selection. */
  closeOnSelect?: boolean
}

export const Dropdown = ({
  trigger,
  items,
  align = 'right',
  closeOnSelect = true,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    const triggerEl = containerRef.current
    if (!triggerEl) return
    const rect = triggerEl.getBoundingClientRect()
    const next: React.CSSProperties = {
      position: 'fixed',
      top: rect.bottom + 4,
      zIndex: 1200,
    }
    if (align === 'left') {
      next.left = rect.left
    } else {
      next.right = window.innerWidth - rect.right
    }
    setMenuStyle(next)
  }

  useLayoutEffect(() => {
    if (!isOpen) return
    updatePosition()
  }, [isOpen, align])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (containerRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setIsOpen(false)
    }

    const handleDismiss = () => setIsOpen(false)

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleDismiss)
    window.addEventListener('scroll', handleDismiss, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleDismiss)
      window.removeEventListener('scroll', handleDismiss, true)
    }
  }, [isOpen])

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return
    item.onClick()
    if (closeOnSelect) setIsOpen(false)
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menu}
            style={menuStyle}
            role="menu">
            {items.map((item, index) => (
              <button
                key={item.key ?? index}
                type="button"
                className={styles.item}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}>
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}
