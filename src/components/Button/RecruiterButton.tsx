import React from 'react'

type RecruiterButtonProps = {
  buttonTitle: string
  onClick?: () => void
  disabled?: boolean
}

export const RecruiterButton = ({
  buttonTitle,
  onClick,
  disabled,
}: RecruiterButtonProps) => {
  return (
    <div className="flex justify-center -mt-4">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full max-w-xs lg:max-w-md rounded-lg bg-[#3c6fd4] border hover:bg-[#4b82e1] py-3 my-9">
        <p className="text-white font-semibold font-raleway leading-[24px] text-[17px]">
          {buttonTitle}
        </p>
      </button>
    </div>
  )
}
