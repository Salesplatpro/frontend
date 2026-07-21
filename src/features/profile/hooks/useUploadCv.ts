import { useState } from 'react'
import { Bounce } from 'react-toastify'
import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import { uploadCv as uploadCvFile } from '../services/profileService'
import { useProfile } from './useProfile'

export const useUploadCv = () => {
  const { mutate } = useProfile()
  const [progress, setProgress] = useState<number | null>(null)

  const { trigger, isMutating } = useSWRMutation(
    '/user/me/cv',
    async (_key, { arg: file }: { arg: File }) => {
      setProgress(0)

      try {
        await uploadCvFile(file, (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100))
          }
        })
        await mutate()
        notify('success', 'CV uploaded successfully', { autoClose: 2000 })
      } catch (error) {
        notify('error', 'Failed to upload CV', {
          autoClose: 2000,
          transition: Bounce,
        })
        throw error
      } finally {
        setProgress(null)
      }
    },
  )

  return { uploadCv: trigger, isUploading: isMutating, progress }
}
