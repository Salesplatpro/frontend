type ErrorBody = { message?: string; error?: { message?: string } }

/**
 * The API has two error envelope shapes in the wild: the legacy
 * `{ message }` format and the current `{ error: { message } }` format
 * (see AUTHENTICATION_ERROR/VALIDATION_ERROR responses from api.auxhr.com).
 * Also covers both axios errors (`err.response.data`) and RTK Query's
 * FetchBaseQueryError (`err.data`), so a real backend message surfaces
 * regardless of which client made the request or which endpoint responded.
 */
export const getErrorMessage = (err: unknown, fallback: string): string => {
  const err_ = err as { response?: { data?: unknown }; data?: unknown }
  const data = (err_?.response?.data ?? err_?.data) as ErrorBody | undefined

  return data?.error?.message || data?.message || fallback
}
