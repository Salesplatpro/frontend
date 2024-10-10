import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import upload from '../../../assets/Featured icon.png'
import profilePics from '../../../assets/profilePics.png'
import AllRoles from '../../../components/Roles/AllRoles'
import {
  useTalentCreationMutation,
  useUpdateProfileMutation,
  useUploadCvMutation,
} from '../../../redux/api/talent'
import { RootState } from '../../../redux/store/store'
import ProgressBar from '../../../utils/ProgressBar'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'
import UploadCV from './UploadCV'
import Worktype from '../../../components/Worktype'
import { TalentProfileProps } from '../../../utils/types'
import { handleProfileSubmit } from './TalentProfileOnSubmit'
// import { handleImageChange } from '../../../utils/HandleImageChange'
import Location from '../../../components/global/Location'

const validationSchema = Yup.object({
  // bio: Yup.string().required('Bio is required'),
  // location: Yup.object({
  //   country: Yup.object({
  //     name: Yup.string().required('Country is required'),
  //     geoId: Yup.number().required('Country ID is required'),
  //   }),
  //   state: Yup.object({
  //     name: Yup.string().required('State is required'),
  //     geoId: Yup.number().required('State ID is required'),
  //   }),
  //   city: Yup.object({
  //     name: Yup.string().required('City is required'),
  //     geoId: Yup.number().required('City ID is required'),
  //   }),
  // }),
  // minSalary: Yup.number()
  //   .required('Minimum Salary is required')
  //   .positive('Minimum Salary must be positive'),
  // maxSalary: Yup.number()
  //   .required('Maximum Salary is required')
  //   .positive('Maximum Salary must be positive'),
  // experience: Yup.string().required('Experience level is required'),
  // cv: Yup.mixed()
  //   .required('A file is required')
  //   .test(
  //     'fileSize',
  //     'File size is too large',
  //     (value) => value && (value as File).size <= 5 * 1024 * 1024, // 5MB
  //   )
  //   .test(
  //     'fileType',
  //     'Unsupported file format',
  //     (value) =>
  //       value &&
  //       [
  //         'application/pdf',
  //         'application/msword',
  //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       ].includes((value as File).type),
  //   ),
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
  const [isEditing, setIsEditing] = useState(false) // New state for editing
  const [talentCreation] = useTalentCreationMutation()
  const [uploadCv] = useUploadCvMutation()
  const [updateProfile] = useUpdateProfileMutation()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth)
  const userInfo = user.user
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    profilePics,
  )
  const [cvFileName, setCvFileName] = useState<string | null>(null)

  const initialValues: TalentProfileProps = {
    bio: userInfo.profile?.bio || '',
    role: userInfo.profile?.role.map((r: any) => r._id) || [],
    location: {
      country: {
        name: userInfo.profile?.location?.country?.name || '',
        geoId: null,
      },
      state: {
        name: userInfo.profile?.location?.state?.name || '',
        geoId: null,
      },
      city: { name: userInfo.profile?.location?.city.name || '', geoId: null },
    },
    maxSalary: userInfo.profile?.maxSalary || '',
    minSalary: userInfo.profile?.minSalary || '',
    experience: userInfo.profile?.experience || '',
    remote: userInfo.profile?.remote || false,
    onSite: userInfo.profile?.onSite || false,
    hybrid: userInfo.profile?.hybrid || false,
    cv: null,
  }

  return (
    <div className="w-full">
      <div className="md:w-[80%] w-full m-auto">
        <div className="md:my-3 flex justify-between items-center">
          <h2 className="font-bold md:text-3xl text-xl">
            {userInfo.profile ? 'Edit Talent Profile' : 'Create Talent Profile'}
          </h2>

          <ProgressBar
            percentage={progress}
            textColor="#344054"
            pathColor="#3C6FD4"
            trailColor="#F4EBFF"
            size={80}
          />
        </div>
        <div className="border flex space-x-5 p-5 rounded-2xl border-[#D0D5DD] mt-1">
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
              // onChange={(event) => handleImageChange(event, setProfileImage)} 
            />
            <button
              className="text-[10px] text-[#4884DF] cursor-pointer mt-1"
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
              <button
                className="bg-[#3C6FD4] text-white rounded-xl text-[12px] font-light w-[93px] h-[40px]"
                onClick={() => setIsEditing(true)}>
                {userInfo.profile ? 'Edit Profile' : 'Create Profile'}
              </button>
            </div>
            <hr className="my-2" />
            {/* <p className="text-[14px] text-[#667085]">
              Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus
              id scelerisque est ultricies ultricies. Duis est sit sed leo nisl,
              blandit elit
            </p> */}
          </div>
        </div>

        <div className="border p-5 rounded-2xl border-[#D0D5DD] mt-1 w-[100%]">
          <Formik
            initialValues={initialValues}
            validationSchema={!userInfo.profile ? validationSchema : null}
            onSubmit={(values, { setSubmitting }) =>
              handleProfileSubmit(
                {
                  ...values,
                  location: {
                    country: values.location.country.name,
                    state: values.location.state.name,
                    city: values.location.city.name,
                  },
                },
                setSubmitting,
                userInfo,
                dispatch,
                profileImage,
                'defaultProfileImage',
                initialValues,
                talentCreation,
                uploadCv,
                updateProfile,
              )
            }
            enableReinitialize>
            {({ values, isSubmitting, setFieldValue }) => {
              useEffect(() => {
                setProgress(calculateProgress(values))
              }, [values]) // Update progress on form value change

              return (
                <Form>
                  <div>
                    <label
                      htmlFor="bio"
                      className="text-[14px] text-[#344054] font-medium">
                      Bio
                    </label>
                    <Field
                      as="textarea"
                      id="bio"
                      name="bio"
                      readOnly={!isEditing}
                      placeholder="Tell us about yourself"
                      className="w-[100%] px-4 pb-16 rounded-lg border border-[#D0D5DD] h-[128px] mt-1"
                    />
                    <ErrorMessage
                      name="bio"
                      component="div"
                      className="text-red-500 text-[14px]"
                    />
                  </div>

                  <div className="flex md:flex-row flex-col w-[100%] justify-between mt-12">
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="names"
                        className="text-[14px] text-[#344054] font-medium">
                        Name
                      </label>
                      <Field
                        type="text"
                        id="names"
                        name="names"
                        placeholder="Williamson Paints"
                        readOnly // Make it read-only
                        value={`${userInfo.firstName} ${userInfo.lastName}`}
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-1"
                      />
                    </div>
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="role"
                        className="text-[14px] text-[#344054]">
                        Role
                      </label>
                      <div className="border border-gray-300 p-2 rounded-lg h-[44px] mt-1">
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

                  <div className="flex md:flex-row flex-col w-[100%] justify-between mt-6">
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="phoneNumber"
                        className="text-[14px] text-[#344054] font-medium">
                        Phone number
                      </label>
                      <Field
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="08198675757"
                        value={userInfo.phone}
                        readOnly={!isEditing} // Read-only if not editing
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-1"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-red-500 text-[14px]"
                      />
                    </div>

                    <div className="md:w-[48%]">
                      <label
                        htmlFor="workTypes"
                        className="text-[14px] text-[#344054] font-medium">
                        Work Type
                      </label>
                      <Worktype
                        options={[
                          { value: 'remote', label: 'Remote' },
                          { value: 'onSite', label: 'On Site' },
                          { value: 'hybrid', label: 'Hybrid' },
                        ]}
                        initialSelected={{
                          remote: values.remote,
                          onSite: values.onSite,
                          hybrid: values.hybrid,
                        }}
                        onSelectionChange={(selected) => {
                          setFieldValue('remote', selected.remote)
                          setFieldValue('onSite', selected.onSite)
                          setFieldValue('hybrid', selected.hybrid)
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex md:flex-row flex-col w-[100%] justify-between mt-6">
                    <div className="md:w-[48%]">
                      <Location
                        locationTitle="Country"
                        geoId={null}
                        isCountry={true}
                        onChange={(geoId) => {
                          setFieldValue('location.country.geoId', geoId)
                          setFieldValue('location.state', {
                            name: '',
                            geoId: null,
                          })
                          setFieldValue('location.city', {
                            name: '',
                            geoId: null,
                          })
                        }}
                      />
                    </div>
                    <div className="md:w-[48%]">
                      <Location
                        locationTitle="State"
                        geoId={values.location.country.geoId}
                        isCountry={false}
                        onChange={(geoId) => {
                          setFieldValue('location.state.geoId', geoId)
                          setFieldValue('location.city', {
                            name: '',
                            geoId: null,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex md:flex-row flex-col w-[100%] justify-between mt-6">
                    <div className="md:w-[48%]">
                      <Location
                        locationTitle="City"
                        geoId={values.location.state.geoId}
                        isCountry={false}
                        onChange={(geoId) => {
                          setFieldValue('location.city.geoId', geoId)
                        }}
                      />
                    </div>
                    <div className="md:w-[48%]">
                      <label
                        className="text-[14px] text-[#344054] font-medium"
                        htmlFor="experience">
                        Experience Level
                      </label>
                      <Field
                        as="select"
                        id="experience"
                        name="experience"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-1">
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
                        className="text-[14px] text-[#344054] font-medium">
                        Min Salary
                      </label>
                      <Field
                        type="text"
                        id="minSalary"
                        name="minSalary"
                        readOnly={!isEditing} // Read-only if not editing
                        placeholder="Your minSalary"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-1"
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
                        className="text-[14px] text-[#344054] font-medium">
                        Max Salary
                      </label>
                      <Field
                        type="text"
                        id="maxSalary"
                        name="maxSalary"
                        readOnly={!isEditing} // Read-only if not editing
                        placeholder="Your Max Salary"
                        className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-1"
                      />
                      <ErrorMessage
                        name="maxSalary"
                        component="div"
                        className="text-red-500 text-[14px]"
                      />
                    </div>
                  </div>

                  <div className="inline-block mt-6 w-full">
                    {userInfo.profile?.cv ? (
                      // If a CV is already uploaded, show the download link
                      <div className="md:w-[48%] ">
                        <label
                          htmlFor="cv"
                          className="text-[14px] text-[#344054] font-medium">
                          Current CV
                        </label>
                        <div className="relative w-[100%]">
                          <div>
                            <a
                              href={userInfo.profile.cv}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-[#4884DF] mt-1">
                              {userInfo.profile?.cv.split('/').pop()}
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="inline-block mt-6 w-full">
                    <div className="md:w-[48%]">
                      <label
                        htmlFor="cv"
                        className="text-[14px] text-[#344054]">
                        {/* Upload New CV */}
                        {userInfo.profile?.cv ? 'Replace CV' : 'Upload CV'}
                      </label>
                      <div className="relative w-[100%]">
                        <input
                          id="cv"
                          name="cv"
                          type="file"
                          disabled={!isEditing} // Disable if not editing
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
                    {isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false)
                            setFieldValue('bio', initialValues.bio)
                            setFieldValue('role', initialValues.role)
                            setFieldValue('minSalary', initialValues.minSalary)
                            setFieldValue('maxSalary', initialValues.maxSalary)
                            setFieldValue(
                              'experience',
                              initialValues.experience,
                            )
                            setFieldValue('cv', null)
                            setCvFileName(null) // Reset CV file name
                          }}
                          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2">
                          Cancel
                        </button>

                        <button
                          type="submit"
                          // disabled={isSubmitting}
                          disabled={isSubmitting || !isEditing} // Disable if not editing
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                          {userInfo.profile
                            ? isSubmitting
                              ? 'Updating...'
                              : 'Update Profile'
                            : isSubmitting
                            ? 'Submitting...'
                            : 'Create Profile'}
                        </button>
                      </>
                    )}
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
