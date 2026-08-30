import React from 'react'
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom'

import PageNotFound from '@/PageNotFound'

/**
 * Root error boundary. Unmatched splat / 404 responses stay on PageNotFound.
 * Thrown loader/render errors used to look like a 404 because every
 * errorElement was PageNotFound.
 */
export const RouteErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <PageNotFound />
  }

  const message =
    error instanceof Error
      ? error.message
      : isRouteErrorResponse(error)
      ? error.statusText || 'Something went wrong'
      : 'Something went wrong'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-raleway font-semibold text-3xl">
        Something went wrong
      </h1>
      <p className="font-raleway text-lg text-grey-700 max-w-lg">{message}</p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="bg-primary text-white font-raleway font-semibold rounded-lg px-4 py-3">
        Previous page
      </button>
    </div>
  )
}
