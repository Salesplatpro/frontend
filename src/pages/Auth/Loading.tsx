import React from 'react'
import { ColorRing } from 'react-loader-spinner'

const Loading = () => {
  return (
    <div className="w-[93%] flex justify-center items-center border-[1px] rounded-lg bg-white">
      <ColorRing
        visible={true}
        height="50"
        width="50"
        ariaLabel="color-ring-loading"
        wrapperClass="color-ring-wrapper"
        colors={['#95a8d1', '#7594cf', '#5a85d8', '#4674d3', '#3c6fd4']}
      />
    </div>
  )
}

export default Loading
