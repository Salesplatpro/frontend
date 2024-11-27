import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  useFetchProfileQuery,
  useTalentCreationMutation,
  useUpdateProfileMutation,
  useUpdateProfilePicsMutation,
  useUploadCvMutation,
} from '../../../redux/api/talent'
import { TalentProfileProps } from '../../../utils/types'
import { handleProfileSubmit } from './ProfileOnSubmit'

const useProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [talentCreation] = useTalentCreationMutation()
  const [uploadCv] = useUploadCvMutation()
  const [updateProfile] = useUpdateProfileMutation()
  const [updateProfilePics] = useUpdateProfilePicsMutation()

  const [uploadPic] = useUploadCvMutation()

  const {
    data: userProfile,
    error: userProfileError,
    isLoading: userProfileLoading,
    refetch,
  } = useFetchProfileQuery({})
  const userInfo = userProfile?.data?.user

  const handleProfileImageUpload = async (imageFile: File) => {
    const formData = new FormData()
    formData.append('profilePic', imageFile) // Replace 'profilePic' with your API's expected field name

    try {
      const response = await updateProfilePics(formData).unwrap()
      setProfileImage(response.data?.profilePic || profilePics)
    } catch (error) {
      console.error('Error updating profile picture:', error)
    }
  }

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
    // profileImage,
    // setProfileImage,
    uploadPic,
    updateProfilePics,
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
        'defaultProfileImage',
        initialValues,
        talentCreation,
        uploadCv,
        updateProfile,
        refetch,
        navigate,
      ),
    handleProfileImageUpload,
    userProfileLoading,
    userProfileError,
    refetchProfile: refetch,
    initialValues,
  }
}

export default useProfile
