import React, { ReactNode } from 'react'

type OutlineButtonProps = {
  buttonTitle: string | ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export const OutlineButton = ({
  buttonTitle,
  onClick,
  disabled,
  className,
}: OutlineButtonProps) => {
  return (
    <div className={`${className} flex justify-center -mt-4`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full max-w-xs lg:max-w-md rounded-lg border-[#3c6fd4] border py-3 my-9 text-white font-semibold font-raleway leading-[24px] text-[17px]">
        <div className="text-[#3c6fd4] font-semibold font-raleway leading-[24px] text-[17px]">
          {buttonTitle}
        </div>
      </button>
    </div>
  )
}
