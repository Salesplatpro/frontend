import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { uploadLogo as uploadLogoFile } from '../services/organizationService'
import { useMyOrganizations } from './useMyOrganizations'

export const useUploadLogo = (organizationId: string) => {
  const { mutate: mutateProfile } = useProfile()
  const { mutate: mutateOrganizations } = useMyOrganizations()
  const [progress, setProgress] = useState<number | null>(null)

  const { trigger, isMutating } = useSWRMutation(
    `/organizations/${organizationId}/logo`,
    async (_key, { arg: file }: { arg: File }) => {
      setProgress(0)

      try {
        await uploadLogoFile(organizationId, file, (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100))
          }
        })
        // The edited company may be the active one, so the banner needs refreshing too.
        await Promise.all([mutateOrganizations(), mutateProfile()])
        notify('success', 'Company logo updated', { autoClose: 2000 })
      } catch (error) {
        notify('error', getErrorMessage(error, 'Failed to upload company logo'))
        throw error
      } finally {
        setProgress(null)
      }
    },
  )

  return { uploadLogo: trigger, isUploading: isMutating, progress }
}
