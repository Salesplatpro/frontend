import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import React from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

import profilePics from '../../assets/profilePics.png'
import AllRoles from '../../components/Roles/AllRoles'
import {
  useTalentCreationMutation,
  useUploadCvMutation,
} from '../../redux/api/talent'

interface TalentProfileProps {
  bio?: string
  role?: string[]
  maxSalary?: string
  minSalary?: string
  experience?: string
  cv?: File | null
}

const initialValues: TalentProfileProps = {
  bio: '',
  role: [],
  maxSalary: '',
  minSalary: '',
  experience: '',
  cv: null,
}

const validationSchema = Yup.object({
  bio: Yup.string().required('Bio is required'),
  minSalary: Yup.number()
    .required('Minimum Salary is required')
    .positive('Minimum Salary must be positive'),
  maxSalary: Yup.number()
    .required('Maximum Salary is required')
    .positive('Maximum Salary must be positive'),
  experience: Yup.string().required('Experience level is required'),
  cv: Yup.mixed()
    .required('A file is required')
    .test(
      'fileSize',
      'File size is too large',
      (value) => value && value.size <= 5 * 1024 * 1024, // 5MB
    )
    .test(
      'fileType',
      'Unsupported file format',
      (value) =>
        value &&
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(value.type),
    ),
})

const TalentProfile: React.FC = () => {
  const [talentCreation] = useTalentCreationMutation()
  const [uploadCv] = useUploadCvMutation()

  const onSubmit = async (
    values: TalentProfileProps,
    { setSubmitting, setFieldValue }: FormikHelpers<TalentProfileProps>,
  ) => {
    try {
      if (values.cv) {
        const formData = new FormData()
        formData.append('file', values.cv)

        const submitCv = await uploadCv(formData).unwrap()

        const updatedFormValue = {
          ...values,
          cv: submitCv.data.fileUrl,
        }

        const data = await talentCreation(updatedFormValue).unwrap()

        if (data.status) {
          toast.success('Profile created successfully')
        } else {
          toast.error(
            data.message || 'An error occurred while creating profile',
          )
        }
      } else {
        toast.error('Error uploading CV')
        throw new Error('Error uploading CV')
      }
    } catch (error: any) {
      console.error('Error submitting', error)
      toast.error(error.message || 'An error occurred while creating profile')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="md:w-[80%] w-full m-auto">
        <div className="md:my-3">
          <h2 className="font-bold md:text-3xl text-xl">
            Create Talent Profile
          </h2>
        </div>
        <div className="border flex space-x-5 p-5 rounded-2xl border-[#D0D5DD] mt-2">
          <div>
            <img src={profilePics} alt="Profile" />
            <p className="text-[10px] text-[#4884DF]">Change Image</p>
          </div>
          <div className="w-full">
            <div className="flex justify-between w-full">
              <div className="text-[#101828]">
                <p className="text-[20px] font-semibold">Williamson Paints</p>
                <p className="text-[16px]">Customer Success</p>
              </div>
              <button className="bg-[#3C6FD4] text-white rounded-xl text-[12px] font-light w-[93px] h-[40px]">
                Edit Profile
              </button>
            </div>
            <hr className="my-2" />
            <p className="text-[14px] text-[#667085]">
              Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus
              id scelerisque est ultricies ultricies. Duis est sit sed leo nisl,
              blandit elit
            </p>
          </div>
        </div>

        <div className="border p-5 rounded-2xl border-[#D0D5DD] mt-2 w-[100%]">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({ values, isSubmitting, setFieldValue }) => (
              <Form>
                <div>
                  <label htmlFor="bio" className="text-[14px] text-[#344054]">
                    Bio
                  </label>
                  <Field
                    type="text"
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself"
                    className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[128px]"
                  />
                  <ErrorMessage
                    name="bio"
                    component="div"
                    className="text-red-500 text-[14px]"
                  />
                </div>

                <div className="flex md:flex-row flex-col w-[100%] justify-between mt-16">
                  <div className="md:w-[48%]">
                    <label
                      htmlFor="role"
                      className="text-[14px] text-[#344054]">
                      Role
                    </label>
                    <div className="border border-gray-300 p-2 rounded-lg h-[44px]">
                      <AllRoles
                        name="role"
                        value={values.role || []}
                        onChange={(e) =>
                          setFieldValue('role', [e.target.value])
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="inline-block mt-6 w-full">
                  <div className="md:w-[48%]">
                    <label htmlFor="cv" className="text-[14px] text-[#344054]">
                      Upload CV
                    </label>
                    <input
                      id="cv"
                      name="cv"
                      type="file"
                      onChange={(event) => {
                        if (event.currentTarget.files) {
                          setFieldValue('cv', event.currentTarget.files[0])
                        }
                      }}
                    />
                    <ErrorMessage
                      name="cv"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-WHITE text-black rounded hover:bg-blue-700">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default TalentProfile
