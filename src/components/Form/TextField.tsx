import { useField } from 'formik'
import React, { useState } from 'react'

import LabelWithAsterisk from '../../utils/LabelWithAstericks'

interface TextFieldProps {
  label: string
  name: string
  asterick?: boolean
  placeholder?: string
  type?: string
  MAX_WORDS?: number
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  asterick,
  placeholder,
  type = 'text',
  MAX_WORDS,
}) => {
  const [field, meta, helpers] = useField(name)
  const [wordCount, setWordCount] = useState(0)

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value
    const words = value.trim().split(/\s+/)

    if (MAX_WORDS && words.length > MAX_WORDS) {
      value = words.slice(0, MAX_WORDS).join(' ')
    }

    setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0)
    helpers.setValue(value)
  }

  return (
    <div className="mb-4">
      <LabelWithAsterisk label={label} asterick={asterick} name={name} />

      {type === 'textarea' ? (
        <div>
          <textarea
            {...field}
            id={name}
            placeholder={placeholder}
            onChange={handleTextAreaChange}
            className="border border-[#D0D5DD] p-4 rounded-lg w-full h-[140px] focus:outline-none"
          />

          {MAX_WORDS && (
            <p className="text-sm text-gray-500 mt-1 text-right">
              {wordCount}/{MAX_WORDS} words
            </p>
          )}
        </div>
      ) : (
        <input
          {...field}
          type={type}
          id={name}
          placeholder={placeholder}
          className="block border border-[#D0D5DD] p-4 rounded w-full mt-1"
        />
      )}

      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm">{meta.error}</div>
      )}
    </div>
  )
}

export default TextField
