import { render, screen } from '@testing-library/react'
import { FormikProvider, useFormik } from 'formik'
import React from 'react'
import { describe, expect, it } from 'vitest'
import * as Yup from 'yup'

import { EMPTY_LOCATION, LocationSelect } from './LocationSelect'
import TextField from './TextField'
import { TextInput } from './TextInput'
import { ValidatedForm, ValidationSchemaProvider } from './ValidatedForm'

const schema = Yup.object({
  role: Yup.string().required('Role is required'),
  nickname: Yup.string(),
  minSalary: Yup.number().required('Min salary is required'),
  company: Yup.object({ name: Yup.string().required('Name is required') }),
  referrer: Yup.string().when('role', {
    is: (role: string) => role === 'referral',
    then: (field) => field.required('Referrer is required'),
  }),
})

const renderField = (
  name: string,
  initialValues: Record<string, unknown> = {},
  props: Record<string, unknown> = {},
) =>
  render(
    <ValidatedForm
      initialValues={{
        role: '',
        nickname: '',
        company: { name: '' },
        ...initialValues,
      }}
      validationSchema={schema}
      onSubmit={() => {}}>
      <TextField label="Field label" name={name} {...props} />
    </ValidatedForm>,
  )

const asterisk = () => screen.queryByText('*')

describe('required-field asterisk', () => {
  it('marks a field the schema requires', () => {
    renderField('role')
    expect(asterisk()).toBeTruthy()
  })

  it('leaves an optional field unmarked', () => {
    renderField('nickname')
    expect(asterisk()).toBeNull()
  })

  it('marks a required non-string field', () => {
    renderField('minSalary')
    expect(asterisk()).toBeTruthy()
  })

  it('marks a required nested field', () => {
    renderField('company.name')
    expect(asterisk()).toBeTruthy()
  })

  it('sets aria-required on the input so the mark is not the only signal', () => {
    renderField('role')
    expect(screen.getByRole('textbox').getAttribute('aria-required')).toBe(
      'true',
    )
  })

  it('resolves a conditional rule against the current values', () => {
    const { unmount } = renderField('referrer')
    expect(asterisk()).toBeNull()
    unmount()

    renderField('referrer', { role: 'referral' })
    expect(asterisk()).toBeTruthy()
  })

  it('lets an explicit prop override the schema in both directions', () => {
    const { unmount } = renderField('nickname', {}, { required: true })
    expect(asterisk()).toBeTruthy()
    unmount()

    renderField('role', {}, { required: false })
    expect(asterisk()).toBeNull()
  })
})

describe('a form with no schema', () => {
  const renderPlain = (props: Record<string, unknown> = {}) =>
    render(
      <ValidatedForm initialValues={{ plain: '' }} onSubmit={() => {}}>
        <TextField label="Plain" name="plain" {...props} />
      </ValidatedForm>,
    )

  it('falls back to the explicit prop and never guesses', () => {
    const { unmount } = renderPlain({ required: true })
    expect(asterisk()).toBeTruthy()
    unmount()

    renderPlain()
    expect(asterisk()).toBeNull()
  })
})

// The auth forms build Formik with useFormik + <FormikProvider>, which has no props for a
// wrapper to read, so they publish the schema themselves.
describe('useFormik + FormikProvider forms', () => {
  const AuthStyleForm = ({ name }: { name: string }) => {
    const formik = useFormik({
      initialValues: { role: '', nickname: '' },
      validationSchema: schema,
      onSubmit: () => {},
    })
    return (
      <FormikProvider value={formik}>
        <ValidationSchemaProvider schema={schema}>
          <TextInput title="Field label" label={name} name={name} />
        </ValidationSchemaProvider>
      </FormikProvider>
    )
  }

  it('marks a required field without the call site saying so', () => {
    render(<AuthStyleForm name="role" />)
    expect(asterisk()).toBeTruthy()
  })

  it('leaves an optional field unmarked', () => {
    render(<AuthStyleForm name="nickname" />)
    expect(asterisk()).toBeNull()
  })
})

// The job form only requires a country for non-remote roles, so the mark has to follow the
// work mode rather than being fixed at the call site.
describe('LocationSelect inside a conditional schema', () => {
  const jobSchema = Yup.object({
    workMode: Yup.array().of(Yup.string()),
    location: Yup.object({
      country: Yup.object({ name: Yup.string() }),
    }).when('workMode', {
      is: (workMode: string[] | undefined) => !!workMode?.includes('onSite'),
      then: (field) =>
        field.shape({
          country: Yup.object({
            name: Yup.string().required('Country is required'),
          }),
        }),
    }),
  })

  const renderLocation = (workMode: string[]) =>
    render(
      <ValidatedForm
        initialValues={{ workMode, location: EMPTY_LOCATION }}
        validationSchema={jobSchema}
        onSubmit={() => {}}>
        <LocationSelect value={EMPTY_LOCATION} onChange={() => {}} />
      </ValidatedForm>,
    )

  it('marks the country only when the work mode needs one', () => {
    const { unmount } = renderLocation(['remote'])
    expect(asterisk()).toBeNull()
    unmount()

    renderLocation(['onSite'])
    expect(asterisk()).toBeTruthy()
  })
})

// A "pick at least one" group is required even though the schema says min(1), not required().
describe('array minimums', () => {
  const pickSchema = Yup.object({
    workMode: Yup.array().of(Yup.string()).min(1, 'Work mode is required'),
    perks: Yup.array().of(Yup.string()),
  })

  const renderPick = (name: string) =>
    render(
      <ValidatedForm
        initialValues={{ workMode: [], perks: [] }}
        validationSchema={pickSchema}
        onSubmit={() => {}}>
        <TextField label="Field label" name={name} />
      </ValidatedForm>,
    )

  it('marks a group that needs at least one value', () => {
    renderPick('workMode')
    expect(asterisk()).toBeTruthy()
  })

  it('leaves a group with no minimum unmarked', () => {
    renderPick('perks')
    expect(asterisk()).toBeNull()
  })
})
