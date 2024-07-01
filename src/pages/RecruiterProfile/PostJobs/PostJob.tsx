import { ErrorMessage, Field, Form, Formik, FieldArray } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import Location from '../../../components/global/Location'
// import { FormValues } from './types';
import { FormValues, LocationValues } from '../../../utils/jobPostTypes'

const initialValues: FormValues = {
  description: '',
  minSalary: '',
  maxSalary: '',
  experience: '',
  location: {
    country: { name: '', geoId: null },
    state: { name: '', geoId: null },
    city: { name: '', geoId: null },
  },
  address: '',
  remote: '',
  responsibilities: [''],
  skills: [''],
  goals: [''],
}

const validationSchema = Yup.object({
  description: Yup.string().required('Description is required'),
  minSalary: Yup.number()
    .required('Minimum Salary is required')
    .positive('Minimum Salary must be positive'),
  maxSalary: Yup.number()
    .required('Maximum Salary is required')
    .positive('Maximum Salary must be positive'),
  experience: Yup.string().required('Experience level is required'),
  location: Yup.object({
    country: Yup.object({
      name: Yup.string().required('Country is required'),
      geoId: Yup.number().required('Country ID is required'),
    }),
    state: Yup.object({
      name: Yup.string().required('State is required'),
      geoId: Yup.number().required('State ID is required'),
    }),
    city: Yup.object({
      name: Yup.string().required('City is required'),
      geoId: Yup.number().required('City ID is required'),
    }),
  }),
  address: Yup.string().required('Address is required'),
  remote: Yup.string().required('Remote option is required'),
  responsibilities: Yup.array().of(
    Yup.string()
      .required('Responsibility is required')
      .max(100, 'Responsibility cannot be longer than 100 characters'),
  ),
  skills: Yup.array().of(
    Yup.string()
      .required('Skill is required')
      .max(100, 'Skill cannot be longer than 100 characters'),
  ),
  goals: Yup.array().of(
    Yup.string()
      .required('Goal is required')
      .max(100, 'Goal cannot be longer than 100 characters'),
  ),
})

const onSubmit = (
  values: FormValues,
  { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
) => {
  const submissionValues = {
    ...values,
    location: {
      country: values.location.country.name,
      state: values.location.state.name,
      city: values.location.city.name,
    },
  }
  console.log(submissionValues)
  setSubmitting(false)
}

const PostJob: React.FC = () => {
  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="description">
                Description
              </label>
              <Field
                type="text"
                id="description"
                name="description"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500"
              />
            </div>
            <Location
              locationTitle="country"
              geoId={null}
              isCountry={true}
              onChange={(geoId) => {
                setFieldValue('location.country.geoId', geoId)
                setFieldValue('location.state', { name: '', geoId: null })
                setFieldValue('location.city', { name: '', geoId: null })
              }}
            />
            <Location
              locationTitle="state"
              geoId={values.location.country.geoId}
              isCountry={false}
              onChange={(geoId) => {
                setFieldValue('location.state.geoId', geoId)
                setFieldValue('location.city', { name: '', geoId: null })
              }}
            />
            <Location
              locationTitle="city"
              geoId={values.location.state.geoId}
              isCountry={false}
              onChange={(geoId) => {
                setFieldValue('location.city.geoId', geoId)
              }}
            />
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="minSalary">
                Min Salary
              </label>
              <Field
                type="text"
                id="minSalary"
                name="minSalary"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="minSalary"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="maxSalary">
                Max Salary
              </label>
              <Field
                type="text"
                id="maxSalary"
                name="maxSalary"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="maxSalary"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="experience">
                Experience Level
              </label>
              <Field
                as="select"
                id="experience"
                name="experience"
                className="w-full p-2 border border-gray-300 rounded">
                <option value="">Select Experience Level</option>
                <option value="senior">Senior</option>
                <option value="intermediate">Intermediate</option>
                <option value="junior">Junior</option>
              </Field>
              <ErrorMessage
                name="experience"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="address">
                Address
              </label>
              <Field
                type="text"
                id="address"
                name="address"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="remote">
                Remote
              </label>
              <Field
                as="select"
                id="remote"
                name="remote"
                className="w-full p-2 border border-gray-300 rounded">
                <option value="">Select Remote Option</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </Field>
              <ErrorMessage
                name="remote"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 font-bold"
                htmlFor="responsibilities">
                Responsibilities
              </label>
              <FieldArray name="responsibilities">
                {({ remove, push }) => (
                  <div>
                    {values.responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex mb-2 items-center">
                        <Field
                          name={`responsibilities.${index}`}
                          className="w-full p-2 border border-gray-300 rounded mr-2"
                        />
                        <button
                          type="button"
                          className="p-2 bg-red-500 text-white rounded"
                          onClick={() => remove(index)}>
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                      onClick={() => push('')}>
                      Add Responsibility
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage
                name="responsibilities"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="skills">
                Skills
              </label>
              <FieldArray name="skills">
                {({ remove, push }) => (
                  <div>
                    {values.skills.map((skill, index) => (
                      <div key={index} className="flex mb-2 items-center">
                        <Field
                          name={`skills.${index}`}
                          className="w-full p-2 border border-gray-300 rounded mr-2"
                        />
                        <button
                          type="button"
                          className="p-2 bg-red-500 text-white rounded"
                          onClick={() => remove(index)}>
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                      onClick={() => push('')}>
                      Add Skill
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage
                name="skills"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="goals">
                Goals
              </label>
              <FieldArray name="goals">
                {({ remove, push }) => (
                  <div>
                    {values.goals.map((goal, index) => (
                      <div key={index} className="flex mb-2 items-center">
                        <Field
                          name={`goals.${index}`}
                          className="w-full p-2 border border-gray-300 rounded mr-2"
                        />
                        <button
                          type="button"
                          className="p-2 bg-red-500 text-white rounded"
                          onClick={() => remove(index)}>
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                      onClick={() => push('')}>
                      Add Goal
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage
                name="goals"
                component="div"
                className="text-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PostJob
