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
}

const TextField = ({
  label,
  name,
  placeholder,
  asterick,
  type,
  MAX_WORDS,
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
          className="block border border-grey-300 p-4 rounded w-full mt-1"
        />
      )}
    </div>
  )
}

export default TextField
