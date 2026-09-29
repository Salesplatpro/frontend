const CONTENT_DISPOSITION_FILENAME = /filename="?([^";]+)"?/i

/** Triggers a browser download for an already-fetched blob response. */
export const downloadBlobResponse = (
  data: Blob,
  contentDispositionHeader: string | undefined,
  fallbackFileName: string,
): void => {
  const match = contentDispositionHeader?.match(CONTENT_DISPOSITION_FILENAME)
  const fileName = match?.[1] ?? fallbackFileName

  const blobUrl = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(blobUrl)
}
