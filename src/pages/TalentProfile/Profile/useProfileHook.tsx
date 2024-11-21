import { useState } from 'react'
import { useDispatch } from 'react-redux'

import profilePics from '../../../assets/profilePics.png'
import {
  useFetchProfileQuery,
  useTalentCreationMutation,
  useUpdateProfileMutation,
  useUploadCvMutation,
} from '../../../redux/api/talent'
import { TalentProfileProps } from '../../../utils/types'
import { handleProfileSubmit } from './ProfileOnSubmit'

const useProfile = () => {
  const dispatch = useDispatch()
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    profilePics,
  )
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [talentCreation] = useTalentCreationMutation()
  const [uploadCv] = useUploadCvMutation()
  const [updateProfile] = useUpdateProfileMutation()

  const {
    data: userProfile,
    error: userProfileError,
    isLoading: userProfileLoading,
    refetch,
  } = useFetchProfileQuery({})
  const userInfo = userProfile?.data?.user

  const initialValues: TalentProfileProps = {
    bio: userInfo?.profile?.bio || '',
    role: userInfo?.profile?.role?.map((r: any) => r._id) || [],
    location: {
      country: {
        name: userInfo?.profile?.location?.country || '',
        geoId: null,
      },
      state: {
        name: userInfo?.profile?.location?.state || '',
        geoId: null,
      },
      city: { name: userInfo?.profile?.location?.city || '', geoId: null },
    },
    maxSalary: userInfo?.profile?.maxSalary || '',
    minSalary: userInfo?.profile?.minSalary || '',
    experience: userInfo?.profile?.experience || '',
    remote: userInfo?.profile?.remote || false,
    onSite: userInfo?.profile?.onSite || false,
    hybrid: userInfo?.profile?.hybrid || false,
    cv: null,
  }

  return {
    userInfo,
    profileImage,
    setProfileImage,
    cvFileName,
    setCvFileName,
    handleProfileSubmit: (values: any, setSubmitting: any) =>
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
        refetch,
      ),
    userProfileLoading,
    userProfileError,
    refetchProfile: refetch,
    initialValues,
  }
}

export default useProfile
