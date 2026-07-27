import React, { useEffect, useRef, useState } from 'react'

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

// Generic button-triggered floating menu — click-outside-to-close, same
// mousedown+ref pattern already used by Select.tsx and JobsTable's StatusCell.
export const Dropdown = ({
  trigger,
  items,
  align = 'right',
  closeOnSelect = true,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
        onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </button>
      {isOpen && (
        <div
          className={`${styles.menu} ${
            align === 'left' ? styles.alignLeft : styles.alignRight
          }`}>
          {items.map((item, index) => (
            <button
              key={item.key ?? index}
              type="button"
              className={styles.item}
              disabled={item.disabled}
              onClick={() => handleItemClick(item)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
