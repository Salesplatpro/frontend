import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import upload from '../../assets/Featured icon.png'
import profilePics from '../../assets/profilePics.png'
import AllRoles from '../../components/Roles/AllRoles'
import {
  useTalentCreationMutation,
  useUploadCvMutation,
} from '../../redux/api/talent'
import { setUser } from '../../redux/features/authSlice/authSlice'
import { RootState } from '../../redux/store/store'
import ProgressBar from '../TalentProfile/ProgressBar'
import { capitalizeEachWord } from './Profile Component/CapitalizeWord'
import UploadCV from './Profile Component/UploadCV'

interface TalentProfileProps {
  bio?: string
  role?: string[]
  maxSalary?: string
  minSalary?: string
  experience?: string
  cv?: File | null
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
      (value) => value && (value as File).size <= 5 * 1024 * 1024, // 5MB
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
        ].includes((value as File).type),
    ),
})

const calculateProgress = (values: TalentProfileProps): number => {
  const fields = ['bio', 'role', 'maxSalary', 'minSalary', 'experience', 'cv']
  const filledFields = fields.filter(
    (field) =>
      values[field as keyof TalentProfileProps] !== undefined &&
      values[field as keyof TalentProfileProps] !== '',
  )
  return (filledFields.length / fields.length) * 100
}

const TalentProfile = () => {
  const [progress, setProgress] = useState(0)
  const [talentCreation] = useTalentCreationMutation()
  const [uploadCv] = useUploadCvMutation()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth)
  const userInfo = user.user
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    profilePics,
  )
  const [cvFileName, setCvFileName] = useState<string | null>(null)

  const initialValues: TalentProfileProps = {
    bio: userInfo.profile?.bio || '',
    role: userInfo.profile?.role[0]?._id || [],
    maxSalary: userInfo.profile?.maxSalary || '',
    minSalary: userInfo.profile?.minSalary || '',
    experience: userInfo.profile?.experience || '',
    cv: null,
  }

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
          dispatch(
            setUser({
              user: data.data.user,
              isLoggedIn: true,
            }),
          )
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result) // Set the selected image
      }
      reader.readAsDataURL(file) // Read the file as a data URL
    }
  }

  return (
    <div className="w-full">
      <div className="md:w-[80%] w-full m-auto">
        <div className="md:my-3 flex justify-between items-center">
          <h2 className="font-bold md:text-3xl text-xl">
            {userInfo.profile ? 'Edit Talent Profile' : 'Create Talent Profile'}
          </h2>

          <ProgressBar percentage={progress} />
        </div>

        <div className="border flex space-x-5 p-5 rounded-2xl border-[#D0D5DD] mt-2">
          <div className="flex justify-center items-center flex-col space-y-2">
            <img
              src={profileImage as string}
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full"
            />
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              className="text-[10px] text-[#4884DF] cursor-pointer mt-2"
              onClick={() => document.getElementById('profileImage')?.click()}>
              Change Image
            </button>
          </div>
          <div className="w-full">
            <div className="flex justify-between w-full">
              <div className="text-[#101828]">
                <p className="text-[20px] font-semibold">{`${userInfo.firstName} ${userInfo.lastName}`}</p>
                <p className="text-[16px]">
                  {capitalizeEachWord(userInfo.userRole)}
                </p>
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
            validationSchema={!userInfo.profile ? validationSchema : null}
            onSubmit={onSubmit}>
            {({ values, isSubmitting, setFieldValue }) => {
              useEffect(() => {
                setProgress(calculateProgress(values))
              }, [values]) // Update progress on form value change

              return (
                <Form>
                  <div>
                    <label htmlFor="bio" className="text-[16px] text-[#344054]">
                      Bio
                    </label>
                    <Field
                      type="text"
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      className="w-[100%] px-4 pb-16 rounded-lg border border-[#D0D5DD] h-[128px] mt-2"
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
                        htmlFor="names"
                        className="text-[14px] text-[#344054]">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Williamson Paints"
                        value={
                          `${userInfo.firstName} ${userInfo.lastName}` || ''
                        }
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-2"
                        readOnly
                      />
                    </div>
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="role"
                        className="text-[14px] text-[#344054]">
                        Role
                      </label>
                      <div className="border border-gray-300 p-2 rounded-lg h-[44px] mt-2">
                        <AllRoles
                          name="role"
                          value={values.role}
                          onChange={(e) =>
                            setFieldValue('role', [e.target.value])
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="inline-block mt-6 w-full">
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="phoneNumber"
                        className="text-[14px] text-[#344054]">
                        Phone number
                      </label>
                      <Field
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="08198675757"
                        value={`${userInfo.phone}`}
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-2"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-red-500 text-[14px]"
                      />
                    </div>
                  </div>

                  <div className="flex md:flex-row flex-col w-[100%] justify-between mt-6">
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="github"
                        className="text-[14px] text-[#344054]">
                        Github
                      </label>
                      <Field
                        type="text"
                        id="github"
                        name="github"
                        placeholder="Your Github Link"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-2"
                      />
                      <ErrorMessage
                        name="github"
                        component="div"
                        className="text-red-500 text-[14px]"
                      />
                    </div>
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="linkedin"
                        className="text-[14px] text-[#344054]">
                        LinkedIn
                      </label>
                      <Field
                        type="text"
                        id="linkedin"
                        name="linkedin"
                        placeholder="Your Linkedin Link"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-2"
                      />
                      <ErrorMessage
                        name="linkedin"
                        component="div"
                        className="text-red-500 text-[14px]"
                      />
                    </div>
                  </div>

                  <div className="flex md:flex-row flex-col w-[100%] justify-between mt-6">
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="portfolio"
                        className="text-[14px] text-[#344054]">
                        Portfolio
                      </label>
                      <Field
                        type="text"
                        id="portfolio"
                        name="portfolio"
                        placeholder="Your portfolio Link"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-2"
                      />
                      <ErrorMessage
                        name="portfolio"
                        component="div"
                        className="text-red-500 text-[14px]"
                      />
                    </div>
                    <div className="md:w-[48%]">
                      <label
                        className="text-[14px] text-[#344054]"
                        htmlFor="experience">
                        Experience Level
                      </label>
                      <Field
                        as="select"
                        id="experience"
                        name="experience"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-2">
                        <option value="">Select experience Level</option>
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
                  </div>

                  <div className="flex md:flex-row flex-col w-[100%] justify-between mt-6">
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="minSalary"
                        className="text-[14px] text-[#344054]">
                        Min Salary
                      </label>
                      <Field
                        type="text"
                        id="minSalary"
                        name="minSalary"
                        placeholder="Your minSalary"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-2"
                      />
                      <ErrorMessage
                        name="minSalary"
                        component="div"
                        className="text-red-500 text-[14px]"
                      />
                    </div>
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="maxSalary"
                        className="text-[14px] text-[#344054]">
                        Max Salary
                      </label>
                      <Field
                        type="text"
                        id="maxSalary"
                        name="maxSalary"
                        placeholder="Your Max Salary"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-2"
                      />
                      <ErrorMessage
                        name="maxSalary"
                        component="div"
                        className="text-red-500 text-[14px]"
                      />
                    </div>
                  </div>

                  <div className="inline-block mt-6 w-full">
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="cv"
                        className="text-[14px] text-[#344054]">
                        Upload CV
                      </label>
                      <div className="relative w-[100%]">
                        <input
                          id="cv"
                          name="cv"
                          type="file"
                          onChange={(event) => {
                            if (event.currentTarget.files) {
                              const file = event.currentTarget.files[0]
                              setFieldValue('cv', file)
                              setCvFileName(file.name) // Update file name state
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <UploadCV cvFileName={cvFileName} upload={upload} />
                      </div>
                      <ErrorMessage
                        name="cv"
                        component="div"
                        className="text-red-500 mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-WHITE text-black rounded hover:bg-blue-700 mr-2"
                      onClick={() => {
                        // handle cancel action if needed
                      }}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                      {userInfo.profile
                        ? isSubmitting
                          ? 'Editing...'
                          : 'Edit'
                        : isSubmitting
                        ? 'Submitting...'
                        : 'Submit'}
                    </button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default TalentProfile

// function setProgress(arg0: number) {
//   throw new Error('Function not implemented.')
// }
