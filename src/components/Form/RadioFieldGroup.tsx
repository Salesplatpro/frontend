import { ErrorMessage, Field } from 'formik'
import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

type RadioFieldOption = {
  value: string
  label: string
}

type RadioFieldGroupProps = {
  name: string
  label: string
  options: RadioFieldOption[]
  icons?: React.ReactNode
  tooltipContent?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  tooltipVariant?: 'dark' | 'light' | 'success' | 'error' | 'info' | 'warning'
}

const RadioFieldGroup = ({
  name,
  label,
  options,
  icons,
  tooltipContent,
  tooltipPosition = 'bottom',
  tooltipVariant = 'info',
}: RadioFieldGroupProps) => {
  return (
    <div className="flex flex-row items-center space-x-4 mb-4">
      <p className="font-semibold text-[16px] text-[#434144] flex-1">{label}</p>
      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={`${name}${option.value}`}
          className="flex items-center space-x-2">
          <Field
            type="radio"
            id={`${name}${option.value}`}
            name={name}
            value={option.value}
          />
          <span>{option.label}</span>
        </label>
      ))}

      {icons && (
        <>
          <span data-tooltip-id={`${name}-tooltip`}>{icons}</span>
          <ReactTooltip
            id={`${name}-tooltip`}
            content={tooltipContent}
            place={tooltipPosition}
            variant={tooltipVariant}
            className="tooltip-wrap"
          />
        </>
      )}

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  )
}

export default RadioFieldGroup
