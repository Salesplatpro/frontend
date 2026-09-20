import { httpClient } from '@/features/auth/services/httpClient'

import { getErrorMessage } from './getErrorMessage'
import { notify } from './toastNotifications'

interface ViewCandidateCvParams {
  cvUrl?: string | null
  talentId: string
  notFoundMessage?: string
}

// Opens a candidate's CV in a new tab: the public Spaces URL directly when
// present, or (legacy talents with no stored file) an authenticated fetch of
// the on-demand generated PDF. Shared by the recruiter candidate dossier and
// the admin talent detail page.
export const viewCandidateCv = async ({
  cvUrl,
  talentId,
  notFoundMessage = 'This candidate has no CV on file',
}: ViewCandidateCvParams): Promise<void> => {
  if (cvUrl) {
    window.open(cvUrl, '_blank', 'noopener')
    return
  }

  // Open a blank tab synchronously (so the browser doesn't treat it as a
  // popup) then point it at the on-demand generated PDF once the
  // authenticated fetch resolves.
  const cvWindow = window.open('', '_blank')
  try {
    const response = await httpClient.get(`/user/profile/${talentId}/cv`, {
      responseType: 'blob',
    })
    const blobUrl = URL.createObjectURL(response.data as Blob)
    if (cvWindow) {
      cvWindow.location.href = blobUrl
    }
  } catch (err) {
    cvWindow?.close()
    notify('error', getErrorMessage(err, notFoundMessage), {
      autoClose: 2500,
    })
  }
}
