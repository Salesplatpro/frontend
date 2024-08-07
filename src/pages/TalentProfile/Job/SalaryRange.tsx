import './JobFilter.scss'

import Slider from '@mui/material/Slider'
import * as React from 'react'

type SalaryRangeProps = {
  salary: number[]
  handleSalaryChange: (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => void
}

export const SalaryRange = ({
  salary,
  handleSalaryChange,
}: SalaryRangeProps) => (
  <>
    <Slider
      getAriaLabel={() => 'Minimum distance'}
      value={salary}
      onChange={handleSalaryChange}
      valueLabelDisplay="auto"
      size="medium"
      disableSwap
      min={100}
      max={10000}
      step={100}
    />
    <div className="salary-range-values">
      <div>${salary[0]}</div>
      <div>${salary[1]}</div>
    </div>
  </>
)
