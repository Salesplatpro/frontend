import 'react-phone-input-2/lib/style.css'

import { useField, useFormikContext } from 'formik'
import React from 'react'
import PhoneInput from 'react-phone-input-2'

interface PhoneNumberInputProps {
  name: string
  label?: string
}

export const PhoneNumberInput = ({ name, label }: PhoneNumberInputProps) => {
  const [field] = useField(name)
  const { setFieldValue, errors, touched } = useFormikContext<any>()

  return (
    <div className="flex flex-col my-2 space-y-1">
      {label && <label htmlFor={name}>{label}</label>}

      <PhoneInput
        country={'ng'}
        value={field.value}
        onChange={(value) => setFieldValue('phone', '+' + value)}
        placeholder="Phone number"
        inputProps={{
          name,
        }}
        containerStyle={{ width: '100%' }}
        inputStyle={{ width: '100%', height: '44px' }}
        dropdownStyle={{ width: '400px' }}
      />

      {errors[name] && touched[name] && (
        <p className="text-red-500 text-sm">{errors[name] as string}</p>
      )}
    </div>
  )
}
