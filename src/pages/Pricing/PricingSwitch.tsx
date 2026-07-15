import React, { useState } from 'react'

interface PricingSwitchProp {
  isFlipped: boolean
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>
}

const PricingSwitch: React.FC<PricingSwitchProp> = ({
  isFlipped,
  setIsFlipped,
}) => {
  const [isSelected, setIsSelected] = useState(true)

  const toggle = () => {
    setIsSelected(!isSelected)
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="relative z-0 bg-[#F4EBFF] w-[320px] my-5 flex rounded-lg p-2 justify-between items-center overflow-hidden">
      {/* Sliding background */}
      <span
        className={`absolute top-2 bottom-2 w-[48%] rounded-lg bg-white shadow-custom-1 transition-all duration-300 ease-in-out ${
          isSelected ? 'left-2' : 'left-[50%]'
        }`}
      />

      <button
        onClick={toggle}
        className={`relative z-10 w-1/2 px-2 py-2 text-sm rounded-lg lg:px-3 lg:py-3 lg:text-lg md:px-4 md:py-4 md:text-base sm:px-3 sm:py-3 sm:text-sm font-inter font-medium text-center cursor-pointer transition-colors duration-300
        ${isSelected ? 'text-primary' : 'text-[#6941C6]'}`}>
        Monthly billing
      </button>

      <button
        onClick={toggle}
        className={`relative z-10 w-1/2 px-2 py-2 text-sm rounded-lg lg:px-3 lg:py-3 lg:text-lg md:px-4 md:py-4 md:text-base sm:px-3 sm:py-3 sm:text-sm font-inter font-medium text-center cursor-pointer transition-colors duration-300
        ${!isSelected ? 'text-primary' : 'text-[#6941C6]'}`}>
        Annual billing
      </button>
    </div>
  )
}

export default PricingSwitch
