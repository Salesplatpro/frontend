import { ErrorMessage, Field } from 'formik'
import React from 'react'

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
      className="block border border-[#D0D5DD] p-4 rounded w-full mt-1"
    />
    <ErrorMessage name={name} component="div" className="text-red-500" />
  </div>
)

export default TextField
