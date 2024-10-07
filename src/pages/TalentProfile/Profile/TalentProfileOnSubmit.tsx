// Submit and update Talent Profile

import { FormikHelpers } from 'formik'
import { setUser } from '../../../redux/features/authSlice/authSlice'
import { toast } from 'react-hot-toast'
import { TalentProfileProps } from '../../../utils/types'

export const handleProfileSubmit = async (
  values: TalentProfileProps,
  setSubmitting: FormikHelpers<TalentProfileProps>['setSubmitting'],
  userInfo: any,
  dispatch: any,
  profileImage: string | ArrayBuffer | null,
  profilePics: string,
  initialValues: TalentProfileProps,
  talentCreation: any,
  uploadCv: any,
  updateProfile: any,
) => {
  try {
    const isNewProfile = !userInfo.profile
    const formData = new FormData()

    if (isNewProfile) {
      formData.append('bio', values.bio || '')
      formData.append('role', (values.role || []).join(','))
      formData.append('minSalary', values.minSalary || '')
      formData.append('maxSalary', values.maxSalary || '')
      formData.append('experience', values.experience || '')
      formData.append('remote', values.remote ? 'true' : 'false')
      formData.append('onSite', values.onSite ? 'true' : 'false')
      formData.append('hybrid', values.hybrid ? 'true' : 'false')

      if (values.cv) {
        formData.append('file', values.cv)
      }
      if (profileImage && profileImage !== profilePics) {
        formData.append('profileImage', profileImage as string)
      }

      const submitCv = values.cv
        ? await uploadCv(formData).unwrap()
        : { data: { fileUrl: '' } }

      const updatedFormValues = {
        ...values,
        cv: submitCv.data.fileUrl || '',
      }

      const response = await talentCreation(updatedFormValues).unwrap()

      if (response.status) {
        dispatch(setUser({ user: response.data.user, isLoggedIn: true }))
        toast.success('Profile created successfully')
      } else {
        toast.error(
          response.message || 'An error occurred while creating profile',
        )
      }
    } else {
      // Updating existing profile
      const updatedFields: Partial<TalentProfileProps> = {}

      updatedFields.remote = values.remote
      updatedFields.onSite = values.onSite
      updatedFields.hybrid = values.hybrid

      if (values.bio !== initialValues.bio) {
        updatedFields.bio = values.bio
      }
      if (values.role?.join(',') !== initialValues.role?.join(',')) {
        updatedFields.role = values.role
      }
      if (values.minSalary !== initialValues.minSalary) {
        updatedFields.minSalary = values.minSalary
      }
      if (values.maxSalary !== initialValues.maxSalary) {
        updatedFields.maxSalary = values.maxSalary
      }
      if (values.experience !== initialValues.experience) {
        updatedFields.experience = values.experience
      }
      if (values.cv && values.cv !== initialValues.cv) {
        updatedFields.cv = values.cv
      }

      if (Object.keys(updatedFields).length === 0) {
        toast.error('No changes detected')
        setSubmitting(false)
        return
      }

      // Append only the updated fields to formData
      if (updatedFields.cv) {
        formData.append('file', updatedFields.cv)
      }
      if (updatedFields.bio) {
        formData.append('bio', updatedFields.bio)
      }
      if (updatedFields.role && updatedFields.role.length > 0) {
        formData.append('role', updatedFields.role.join(','))
      }
      if (updatedFields.minSalary) {
        formData.append('minSalary', updatedFields.minSalary)
      }
      if (updatedFields.maxSalary) {
        formData.append('maxSalary', updatedFields.maxSalary)
      }
      if (updatedFields.experience) {
        formData.append('experience', updatedFields.experience)
      }
      formData.append('remote', updatedFields.remote ? 'true' : 'false')
      formData.append('onSite', updatedFields.onSite ? 'true' : 'false')
      formData.append('hybrid', updatedFields.hybrid ? 'true' : 'false')

      const updatedCv = updatedFields.cv
        ? await uploadCv(formData).unwrap()
        : { data: { fileUrl: '' } }

      if (updatedCv.data.fileUrl) {
        updatedFields.cv = updatedCv.data.fileUrl
      }

      const response = await updateProfile(updatedFields).unwrap()

      if (response.status) {
        const updatedUser = { ...userInfo, profile: response.data.user }
        dispatch(setUser({ user: updatedUser, isLoggedIn: true }))
        toast.success('Profile updated successfully')
      } else {
        toast.error(
          response.message || 'An error occurred while updating profile',
        )
      }
    }
  } catch (error: any) {
    console.error('Error submitting profile', error)
    toast.error(
      error.message || 'An error occurred while processing your request',
    )
  } finally {
    setSubmitting(false)
  }
}
