import { Formik, FormikConfig, FormikProps, FormikValues } from 'formik'
import React, { createContext } from 'react'

/**
 * Formik's types say `validationSchema` is on its context, but `useFormik` never puts it
 * there — the provider value is only the form bag. So the schema is published separately,
 * which is what lets fields mark themselves required straight from the schema instead of
 * every call site repeating it.
 */
export const ValidationSchemaContext = createContext<unknown>(undefined)

/** For forms built with `useFormik` + `<FormikProvider>`, which have no props to read. */
export const ValidationSchemaProvider = ({
  schema,
  children,
}: {
  schema: unknown
  children: React.ReactNode
}) => (
  <ValidationSchemaContext.Provider value={schema}>
    {children}
  </ValidationSchemaContext.Provider>
)

/** Drop-in for `<Formik>` that also publishes the validation schema to its fields. */
export function ValidatedForm<Values extends FormikValues>({
  children,
  ...props
}: FormikConfig<Values>) {
  return (
    <Formik<Values> {...props}>
      {(formik: FormikProps<Values>) => (
        <ValidationSchemaContext.Provider value={props.validationSchema}>
          {typeof children === 'function' ? children(formik) : children}
        </ValidationSchemaContext.Provider>
      )}
    </Formik>
  )
}
