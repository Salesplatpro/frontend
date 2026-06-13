import { useFormikContext } from 'formik'
import React from 'react'

const BioTextArea = () => {
  const { values, setFieldValue } = useFormikContext<any>()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (value.length <= 1000) {
      setFieldValue('bio', value)
    }
  }

  return (
    <>
      <textarea
        id="bio"
        name="bio"
        value={values.bio}
        onChange={handleChange}
        placeholder="Tell us about yourself"
        className="w-[100%] px-4 pb-16 rounded-lg border border-grey-300 h-[128px] mt-1 pt-4"
      />

      <p> {values.bio?.length || 0}/1000 </p>
    </>
  )
}

export default BioTextArea
