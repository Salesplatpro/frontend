import React from 'react'
import { ColorRing } from 'react-loader-spinner'

const Loading = () => {
  return (
    <div className="flex justify-center items-center border-[1px] rounded-lg bg-white">
      <ColorRing
        visible={true}
        height="50"
        width="50"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
    </div>
  )
}

export default Loading
