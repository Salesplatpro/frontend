import 'react-phone-input-2/lib/style.css'

import { ErrorMessage, Field, useFormikContext } from 'formik'
import React from 'react'
import PhoneInput from 'react-phone-input-2'

//import { TextInput } from './TextInput'

interface FormValues {
  phone: string
}

export const PhoneNumberField = () => {
  const { setFieldValue, values } = useFormikContext<FormValues>()

  return (
    <div className="flex flex-col my-3 space-y-1">
      <label htmlFor="phone">Phone number</label>
      <Field name="phone">
        {({ field }: any) => (
          <PhoneInput
            {...field}
            country={'ng'}
            value={values.phone}
            onChange={(phone) => setFieldValue('phone', phone)}
            inputProps={{
              name: 'phone',
              id: 'phone',
              required: true,
              placeholder: 'Enter Phone Number',
            }}
            inputStyle={{ width: '100%' }}
            enableSearch={true}
          />
        )}
      </Field>
      <ErrorMessage
        name="phone"
        component="p"
        className="text-red-500 text-sm"
      />
    </div>
  )
}
