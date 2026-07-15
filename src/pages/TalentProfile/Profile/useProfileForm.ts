import { FormikHelpers } from 'formik'
import { useEffect, useState } from 'react'
import { Bounce } from 'react-toastify'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { buildProfileFormValues } from '@/features/profile/hooks/useProfileFormValues'
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile'
import { useUploadCv } from '@/features/profile/hooks/useUploadCv'
import { uploadFile } from '@/features/profile/services/profileService'
import { ProfileFormValues } from '@/features/profile/types'
import { diffProfileValues } from '@/features/profile/utils/diffProfileValues'
import { calculateProgress } from '@/utils/calculateProgress'
import { notify } from '@/utils/toastNotifications'

export const useProfileForm = () => {
  const { profile, isLoading, error } = useProfile()
  const { updateProfile, isUpdating } = useUpdateProfile()
  const { uploadCv, isUploading, progress } = useUploadCv()

  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [formProgress, setFormProgress] = useState(0)
  const [pictureFile, setPictureFile] = useState<File | null>(null)
  const [picturePreview, setPicturePreview] = useState<string | null>(null)

  const initialValues = buildProfileFormValues(profile)

  useEffect(() => {
    if (!pictureFile) {
      setPicturePreview(null)
      return
    }

    const url = URL.createObjectURL(pictureFile)
    setPicturePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [pictureFile])

  const updateFormProgress = (values: ProfileFormValues) => {
    setFormProgress(calculateProgress(values, !!profile?.cvUrl))
  }

  const handleSubmit = async (
    values: ProfileFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ProfileFormValues>,
  ) => {
    const patch = diffProfileValues(initialValues, values)

    if (pictureFile) {
      try {
        const uploaded = await uploadFile(pictureFile)
        patch.picture = uploaded.data?.fileUrl
      } catch {
        notify('error', 'Failed to upload profile picture', {
          autoClose: 5000,
          transition: Bounce,
        })
        setSubmitting(false)
        return
      }
    }

    if (Object.keys(patch).length > 0) {
      const success = await updateProfile(patch)
      if (success) {
        resetForm({ values })
        setPictureFile(null)
      }
    }

    setSubmitting(false)
  }

  const handleCvChange = (file: File) => {
    setCvFileName(file.name)
    void uploadCv(file)
  }

  return {
    profile,
    isLoading,
    error,
    isUpdating,
    isUploading,
    progress,
    cvFileName,
    formProgress,
    picturePreview,
    setPictureFile,
    initialValues,
    updateFormProgress,
    handleSubmit,
    handleCvChange,
  }
}
