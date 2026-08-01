import React from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  /** Defaults to browser-back (navigate(-1)) when omitted. */
  onClick?: () => void
  className?: string
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  className = '',
}) => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={onClick ?? (() => navigate(-1))}
      className={`flex items-center gap-2 text-sm font-bold text-grey-700 mb-2 ${className}`}>
      <MdOutlineArrowBackIosNew />
      Back
    </button>
  )
}
