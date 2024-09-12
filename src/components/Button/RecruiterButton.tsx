import React, { ReactNode } from 'react'

type RecruiterButtonProps = {
  buttonTitle: string | ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export const RecruiterButton = ({
  buttonTitle,
  onClick,
  disabled,
  className,
}: RecruiterButtonProps) => {
  return (
    <div className={`${className} flex justify-center -mt-4`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full max-w-xs lg:max-w-md rounded-lg bg-[#3c6fd4] border hover:bg-[#4b82e1] py-3 my-9">
        <div className="text-white font-semibold font-raleway leading-[24px] text-[17px]">
          {buttonTitle}
        </div>
      </button>
    </div>
  )
}
