import React from 'react'
import { Field, ErrorMessage } from 'formik'

type TextFieldProps = {
  label: string
  name: string
  placeholder?: string
  type?: string
}

const TextField = ({
  label,
  name,
  placeholder,
  type = 'text',
}: TextFieldProps) => (
  <div className="mb-4">
    <label htmlFor={name} className="font-bold text-[14px] text-[#434144]">
      {label}
    </label>
    <Field
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      className="block border border-[#D0D5DD] p-4 rounded w-full"
    />
    <ErrorMessage name={name} component="div" className="text-red-500" />
  </div>
)

export default TextField
