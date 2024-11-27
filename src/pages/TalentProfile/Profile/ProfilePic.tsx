import React, { useState } from 'react'
import { Bounce, toast } from 'react-toastify'

import { getDefaultIcon } from '../../../utils/getDefaultIcon'

interface ProfilePicType {
  userInfo: any
  uploadPic: any
  updateProfilePics: any
  user: any
}

const ProfilePic: React.FC<ProfilePicType> = ({
  userInfo,
  uploadPic,
  updateProfilePics,
  user,
}) => {
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    userInfo?.picture,
  )

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only Image files are allowed')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('file size exceed the 5mb limit')
      }
      if (setProfileImage) {
        setProfileImage(URL.createObjectURL(file))
      }
      handleProfileImageUpload(file)
    }
  }

  const handleProfileImageUpload = async (imageFile: File) => {
    if (!imageFile) return

    const formData = new FormData()
    formData.append('file', imageFile)

    try {
      const cloudinaryResponse = await uploadPic(formData).unwrap()
      if (cloudinaryResponse?.data?.fileUrl) {
        const fileUrl = cloudinaryResponse?.data?.fileUrl
        setProfileImage(fileUrl)

        const updateResponse = await updateProfilePics({
          picture: fileUrl,
        }).unwrap()

        if (updateResponse.status) {
          toast.success('Picture Uploaded Successfully', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          })
        } else {
          toast.error(
            updateResponse.message || 'Failed to upload profile picture',
            {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            },
          )
        }
      } else {
        throw new Error('File URL not returned from cloudinary')
      }
    } catch (error) {
      console.error('Error uploading or updating profile picture:', error)
      toast.error('An error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    }
  }

  const profileImageSrc =
    (profileImage as string) ||
    userInfo?.picture ||
    getDefaultIcon({ id: user?.id, size: 50 })

  return (
    <div>
      <div className="flex justify-center items-center flex-col space-y-2">
        <img
          src={profileImageSrc}
          alt="Profile"
          className="w-24 h-24 object-cover rounded-full border-1 border-gray-300 shadow-md"
        />
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          className="text-[10px] text-[#4884DF] cursor-pointer mt-1"
          onClick={() => document.getElementById('profileImage')?.click()}>
          Change Image
        </button>
      </div>
    </div>
  )
}

export default ProfilePic
