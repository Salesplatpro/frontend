import { Field } from 'formik'
import React from 'react'

import LabelWithAsterisk from '../../utils/LabelWithAstericks'
import RichTextEditor from './RichTextEditor'

interface TextFieldProps {
  label: string
  name: string
  asterick?: boolean
  placeholder?: string
  type?: string
  MAX_WORDS?: number
  disabled?: boolean
  /** Rendered under the input, e.g. to explain why a field is locked. */
  hint?: string
}

const TextField = ({
  label,
  name,
  placeholder,
  asterick,
  type,
  MAX_WORDS,
  disabled,
  hint,
}: TextFieldProps) => {
  return (
    <div className="mb-4">
      <LabelWithAsterisk label={label} asterick={asterick} />
      {type === 'textarea' ? (
        <Field name={name}>
          {({ field }: any) => (
            <div>
              <RichTextEditor
                id={name}
                value={field.value}
                onChange={(value: string) => {
                  field.onChange({ target: { name, value } })
                }}
                placeholder={placeholder}
                maxLength={MAX_WORDS}
              />
            </div>
          )}
        </Field>
      ) : (
        <Field
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={`block border border-grey-300 p-4 rounded w-full mt-1 ${
            disabled ? 'bg-grey-100 text-grey-600 cursor-not-allowed' : ''
          }`}
        />
      )}
      {hint && <p className="text-sm text-grey-600 mt-1">{hint}</p>}
    </div>
  )
}

export default TextField
