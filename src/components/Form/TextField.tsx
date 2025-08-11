import { Field } from 'formik'
import React from 'react'

import LabelWithAsterisk from '../../utils/LabelWithAstericks'
import RichTextEditor from '../InputField/RichTextEditor'

interface TextFieldProps {
  label: string
  name: string
  asterick?: boolean
  placeholder?: string
  type?: string
  MAX_WORDS?: number
  // eslint-disable-next-line no-undef
}

const TextField = ({
  label,
  name,
  placeholder,
  asterick,
  type,
  MAX_WORDS,
}: TextFieldProps) => {
  // const [wordCount, setWordCount] = useState(0)

  return (
    <div className="mb-4">
      <LabelWithAsterisk label={label} asterick={asterick} />
      {type === 'textarea' ? (
        <Field name={name}>
          {({ field }: any) => (
            <div>
              {/* <textarea
                {...field}
                id={name}
                placeholder={placeholder}
                maxLength={MAX_WORDS}
                onChange={(e) => {
                  field.onChange(e) // <-- Let Formik handle the value
                  setWordCount(e.target.value.length) // <-- Track word count separately
                }}
                className="border border-[#D0D5DD] p-4 rounded-lg w-full h-[140px] focus:outline-none"
              /> */}
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
          className="block border border-[#D0D5DD] p-4 rounded w-full mt-1"
        />
      )}
    </div>
  )
}

export default TextField
