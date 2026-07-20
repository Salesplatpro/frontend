import React from 'react'

import { DisplayError } from '@/components/ui/ErrorState'

import { ErrorResponse } from '../../utils/type'

interface Props {
  error: any
}

const ProgressError: React.FC<Props> = ({ error }) => {
  const errorMessage =
    (error?.data as ErrorResponse)?.message || 'An error occurred'

  return <DisplayError message={errorMessage} />
}

export default ProgressError
