import React from 'react'

export const handleImageChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setProfileImage: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null>
  >,
) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage(reader.result)
    }
    reader.readAsDataURL(file)
  }
}
