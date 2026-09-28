import React from 'react'
import { FaCheck } from 'react-icons/fa6'

import styles from './AiConfig.module.scss'
import { SCREENING_PRESETS, ScreeningPresetId } from './aiConfigPresets'

type ScreeningPresetsProps = {
  selected: ScreeningPresetId | 'custom'
  onSelect: (id: ScreeningPresetId) => void
}

export const ScreeningPresets = ({
  selected,
  onSelect,
}: ScreeningPresetsProps) => (
  <fieldset className={styles.presets}>
    <legend className={styles.presetsLegend}>
      Pick a starting point, then fine-tune below
    </legend>
    <div className={styles.presetGrid}>
      {SCREENING_PRESETS.map((preset) => {
        const isSelected = selected === preset.id
        return (
          <button
            key={preset.id}
            type="button"
            aria-pressed={isSelected}
            className={[
              styles.presetCard,
              isSelected ? styles.presetSelected : '',
            ].join(' ')}
            onClick={() => onSelect(preset.id)}>
            <span className={styles.presetTop}>
              <span className={styles.presetTitle}>{preset.title}</span>
              {isSelected && <FaCheck aria-hidden />}
            </span>
            <span className={styles.presetSummary}>{preset.summary}</span>
            <span className={styles.presetBestFor}>{preset.bestFor}</span>
          </button>
        )
      })}
      <div
        className={[
          styles.presetCard,
          styles.presetCustom,
          selected === 'custom' ? styles.presetSelected : '',
        ].join(' ')}
        aria-live="polite">
        <span className={styles.presetTop}>
          <span className={styles.presetTitle}>Custom</span>
          {selected === 'custom' && <FaCheck aria-hidden />}
        </span>
        <span className={styles.presetSummary}>Your own mix</span>
        <span className={styles.presetBestFor}>
          {selected === 'custom'
            ? 'You changed the settings below.'
            : 'Change any setting below to make it your own.'}
        </span>
      </div>
    </div>
  </fieldset>
)
