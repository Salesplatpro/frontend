import { Alert } from '@mui/material'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'

import upload from '../../../assets/Featured icon.png'
// import { handleImageChange } from '../../../utils/HandleImageChange'
import Location from '../../../components/global/Location'
import Loading from '../../../components/Loading/Loading'
import AllRoles from '../../../components/Roles/AllRoles'
import Worktype from '../../../components/Worktype'
import { calculateProgress } from '../../../utils/calculateProgress'
import TalentProfileHeader from './ProfileHeader'
import { validationSchema } from './ProileValidationSchema'
import UploadCV from './UploadCV'
import useProfile from './useProfileHook'

const TalentProfile = () => {
  const {
    userInfo,
    profileImage,
    setProfileImage,
    uploadPic,
    updateProfilePics,

    cvFileName,
    setCvFileName,
    handleProfileSubmit,
    userProfileLoading,
    userProfileError,

    // refetchProfile,
    handleProfileImageUpload,

    initialValues,
  } = useProfile()

  const [progress, setProgress] = useState(0)

  if (userProfileLoading) return <Loading />

  if (userProfileError) {
    return <Alert severity="error">Error fetching user profile Info</Alert>
  }

  return (
    <div className="md:w-[80%] w-full m-auto">
      <div>
        <TalentProfileHeader
          userInfo={userInfo}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          uploadPic={uploadPic}
          updateProfilePics={updateProfilePics}
          progress={progress}
          handleProfileImageUpload={handleProfileImageUpload}
        />
      </div>
      <div className="border p-5 rounded-2xl border-[#D0D5DD] mt-6 w-[100%]">
        <Formik
          initialValues={initialValues}
          validationSchema={!userInfo?.profile ? validationSchema : null}
          onSubmit={handleProfileSubmit}
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
                    placeholder="Tell us about yourself"
                    className="w-[100%] px-4 pb-16 rounded-lg border border-[#D0D5DD] h-[128px] mt-1 pt-3"
                  />
                  <ErrorMessage
                    name="bio"
                    component="div"
                    className="text-red-500 text-[14px]"
                  />
                </div>

                <div className="flex md:flex-row flex-col w-[100%] justify-between mt-12">
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
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
                      readOnly
                      value={`${userInfo?.firstName} ${userInfo?.lastName}`}
                      className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-1"
                    />
                  </div>
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
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

                <div className="flex md:flex-row flex-col w-[100%] justify-between lg:mt-6">
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
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
                      value={userInfo?.phone}
                      className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-1"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-[14px]"
                    />
                  </div>

                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
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
                <div className="flex md:flex-row flex-col w-[100%] justify-between lg:mt-6">
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
                    <Location
                      locationTitle="Country"
                      locationLabel="Country"
                      geoId={null}
                      isCountry={true}
                      selectedName={values.location.country.name}
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
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
                    <Location
                      locationTitle="State"
                      locationLabel="States/Province"
                      geoId={values.location.country.geoId}
                      isCountry={false}
                      selectedName={values.location.state.name}
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
                <div className="flex md:flex-row flex-col w-[100%] justify-between lg:mt-6">
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
                    <Location
                      locationTitle="City"
                      locationLabel="Region"
                      geoId={values.location.state.geoId}
                      isCountry={false}
                      selectedName={values.location.city.name}
                      onChange={(geoId) => {
                        setFieldValue('location.city.geoId', geoId)
                      }}
                    />
                  </div>
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
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

                <div className="flex md:flex-row flex-col w-[100%] justify-between lg:mt-6">
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
                    <label
                      htmlFor="minSalary"
                      className="text-[14px] text-[#344054] font-medium">
                      Min Salary
                    </label>
                    <Field
                      type="text"
                      id="minSalary"
                      name="minSalary"
                      placeholder="Your minSalary"
                      className="w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[44px] mt-1"
                    />
                    <ErrorMessage
                      name="minSalary"
                      component="div"
                      className="text-red-500 text-[14px]"
                    />
                  </div>
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
                    <label
                      htmlFor="maxSalary"
                      className="text-[14px] text-[#344054] font-medium">
                      Max Salary
                    </label>
                    <Field
                      type="text"
                      id="maxSalary"
                      name="maxSalary"
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

                <div className="inline-block lg:mt-6 w-full">
                  {userInfo.profile?.cv ? (
                    // If a CV is already uploaded, show the download link
                    <div className="md:w-[48%] mb-6 lg:md:mb-0 ">
                      <label
                        htmlFor="cv"
                        className="text-[14px] text-[#344054] font-medium">
                        Current CV
                      </label>
                      <div className="relative w-[100%]">
                        <div>
                          <a
                            href={userInfo?.profile.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[#4884DF] mt-1">
                            {userInfo?.profile?.cv.split('/').pop()}
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="inline-block lg:mt-6 w-full">
                  <div className="md:w-[48%] mb-6 lg:md:mb-0">
                    <label htmlFor="cv" className="text-[14px] text-[#344054]">
                      {/* Upload New CV */}
                      {userInfo?.profile?.cv ? 'Replace CV' : 'Upload CV'}
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
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setFieldValue('bio', initialValues.bio)
                        setFieldValue('role', initialValues.role)
                        setFieldValue('minSalary', initialValues.minSalary)
                        setFieldValue('maxSalary', initialValues.maxSalary)
                        setFieldValue('experience', initialValues.experience)
                        setFieldValue('cv', null)
                        setCvFileName(null) // Reset CV file name
                      }}
                      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2">
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                      {userInfo?.profile
                        ? isSubmitting
                          ? 'Updating...'
                          : 'Update Profile'
                        : isSubmitting
                        ? 'Submitting...'
                        : 'Create Profile'}
                    </button>
                  </>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default TalentProfile
