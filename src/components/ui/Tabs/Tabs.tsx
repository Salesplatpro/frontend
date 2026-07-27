import React from 'react'

import styles from './Tabs.module.scss'

export interface TabDef {
  key: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: TabDef[]
  activeKey: string
  onChange: (key: string) => void
}

export const Tabs = ({ tabs, activeKey, onChange }: TabsProps) => (
  <div className={styles.tabs} role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        type="button"
        role="tab"
        aria-selected={activeKey === tab.key}
        className={`${styles.tab} ${
          activeKey === tab.key ? styles.active : ''
        }`}
        onClick={() => onChange(tab.key)}>
        {tab.label}
        {tab.count !== undefined && (
          <span className={styles.count}>{tab.count}</span>
        )}
      </button>
    ))}
  </div>
)
