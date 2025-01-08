// Submit and update Talent Profile

import { FormikHelpers } from 'formik'

import { setUser } from '../../../redux/features/authSlice/authSlice'
import { notify } from '../../../utils/toastNotifications'
import { TalentProfileProps } from '../../../utils/types'

export const handleProfileSubmit = async (
  values: TalentProfileProps,
  setSubmitting: FormikHelpers<TalentProfileProps>['setSubmitting'],
  userInfo: any,
  dispatch: any,
  initialValues: TalentProfileProps,
  talentCreation: any,
  uploadCv: any,
  updateProfile: any,
  refetch: any,
  navigate: any,
) => {
  try {
    const isNewProfile = !userInfo?.profile
    const formData = new FormData()

    if (isNewProfile) {
      formData.append('bio', values.bio || '')
      formData.append('minSalary', values.minSalary || '')
      formData.append('maxSalary', values.maxSalary || '')
      formData.append('experience', values.experience || '')
      formData.append('remote', values.remote ? 'true' : 'false')
      formData.append('onSite', values.onSite ? 'true' : 'false')
      formData.append('hybrid', values.hybrid ? 'true' : 'false')
      formData.append('country', values.location.country.name || '')
      formData.append('state', values.location.state.name || '')
      formData.append('city', values.location.city.name || '')

      if (values.cv) {
        formData.append('file', values.cv)
      }

      const submitCv = values.cv
        ? await uploadCv(formData).unwrap()
        : { data: { fileUrl: '' } }

      const updatedFormValues = {
        ...values,
        role: Array.isArray(values.role) ? values.role : [values.role],
        cv: submitCv.data.fileUrl || '',
      }
      const response = await talentCreation(updatedFormValues).unwrap()

      if (response.status) {
        dispatch(setUser({ user: response.data.user, isLoggedIn: true }))
        notify('success', 'Profile created successfully')
        refetch()
        navigate('/talentDashboard/job')
      } else {
        notify(
          'error',
          response.message || 'An error occurred while creating profile',
        )
      }
    } else {
      const updatedFields: Partial<TalentProfileProps> = {}
      // Check for changes in location values
      const locationChanged =
        values.location.country !== initialValues.location.country.name ||
        values.location.state !== initialValues.location.state.name ||
        values.location.city !== initialValues.location.city.name

      if (locationChanged) {
        formData.append('country', values.location.country || '')
        formData.append('state', values.location.state || '')
        formData.append('city', values.location.city || '')

        updatedFields.location = {
          country: values.location.country,
          state: values.location.state,
          city: values.location.city,
        }
      }

      updatedFields.remote = values.remote
      updatedFields.onSite = values.onSite
      updatedFields.hybrid = values.hybrid

      if (values.bio !== initialValues.bio) {
        updatedFields.bio = values.bio
      }

      if (JSON.stringify(values.role) !== JSON.stringify(initialValues.role)) {
        updatedFields.role = Array.isArray(values.role)
          ? values.role.filter((role): role is any => typeof role === 'string')
          : [values.role]
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
        notify('error', 'No changes detected')
        setSubmitting(false)
        return
      }

      if (updatedFields.cv) {
        formData.append('file', updatedFields.cv)
      }

      const updatedCv = updatedFields.cv
        ? await uploadCv(formData).unwrap()
        : { data: { fileUrl: '' } }

      if (updatedCv.data.fileUrl) {
        updatedFields.cv = updatedCv.data.fileUrl
      }

      const response = await updateProfile(updatedFields).unwrap()

      if (response.status) {
        notify('success', 'Profile updated successfully')
        refetch()
        navigate('/talentDashboard/job')
      } else {
        const errorMessage =
          response?.data?.message ||
          'An error occurred while processing your request'
        notify('error', errorMessage)
      }
    }
  } catch (error: any) {
    const errorMessage =
      error?.data?.message ||
      error.message ||
      'An error occurred while processing your request'

    notify('error', errorMessage)
  } finally {
    setSubmitting(false)
  }
}
