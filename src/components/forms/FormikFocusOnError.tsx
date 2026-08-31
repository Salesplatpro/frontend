import { useFormikContext } from 'formik'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { focusFieldByName, focusFirstInvalidField } from '@/utils/focusField'

/**
 * After a failed Formik submit, scroll to and focus the first field with an
 * error so the user does not have to hunt for it.
 */
export const FormikFocusOnError = () => {
  const { errors, isValid, submitCount } = useFormikContext()
  const lastSubmitCount = useRef(0)

  useLayoutEffect(() => {
    if (
      submitCount > 0 &&
      submitCount !== lastSubmitCount.current &&
      !isValid
    ) {
      focusFirstInvalidField(errors)
    }
    lastSubmitCount.current = submitCount
  }, [errors, isValid, submitCount])

  return null
}

/** Focus a named field once the form has mounted. */
export const useFocusFieldOnMount = (name: string) => {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      focusFieldByName(name)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [name])
}
