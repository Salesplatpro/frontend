import { Field } from 'formik'
import React, { useState } from 'react'

type TextFieldProps = {
  label: string
  name: string
  placeholder?: string
  type?: string
  MAX_WORDS?: number
}

const TextField = ({
  label,
  name,
  placeholder,
  type,
  MAX_WORDS,
}: TextFieldProps) => {
  const [wordCount, setWordCount] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newWord = e.target.value.length
    setWordCount(newWord)
  }

  return (
    <div className="mb-4">
      <label htmlFor={name} className="font-bold text-[14px] text-[#434144]">
        {label}
      </label>
      {type === 'textarea' ? (
        <div>
          <Field
            as="textarea"
            id={name}
            name={name}
            placeholder={placeholder}
            maxLength={MAX_WORDS}
            onChange={handleChange}
            className="border border-[#D0D5DD] p-4 rounded-lg w-full h-[140px] focus:outline-none"
          />

          {MAX_WORDS && (
            <p className="text-sm text-gray-500 mt-1 text-right">
              {wordCount}/{MAX_WORDS} words
            </p>
          )}
        </div>
      ) : (
        <Field
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          className="block border border-[#D0D5DD] p-4 rounded w-full mt-1"
        />
      )}
    </div>
  )
}

export default TextField
