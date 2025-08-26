import React, { useState } from 'react'
import { Bounce } from 'react-toastify'

import { getDefaultIcon } from '../../../utils/getDefaultIcon'
import { notify } from '../../../utils/toastNotifications'

interface ProfilePicType {
  userInfo: any
  uploadPic: any
  updateProfilePics: any
  user: any
  useChangeImageButton?: boolean
}

const ProfilePic: React.FC<ProfilePicType> = ({
  userInfo,
  uploadPic,
  updateProfilePics,
  user,
  useChangeImageButton = false,
}) => {
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    userInfo?.picture,
  )

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        notify('error', 'Only Image files are allowed', {
          autoClose: 5000,
          transition: Bounce,
        })

        return
      }
      if (file.size > 5 * 1024 * 1024) {
        notify('error', 'file size exceed the 5mb limit', {
          autoClose: 5000,
          transition: Bounce,
        })
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
          notify('success', 'Picture Uploaded Successfully', {
            autoClose: 5000,
          })
        } else {
          notify(
            'error',
            updateResponse.message || 'Failed to upload profile picture',
            {
              autoClose: 5000,
              transition: Bounce,
            },
          )
        }
      } else {
        throw new Error('File URL not returned from cloudinary')
      }
    } catch (error) {
      console.error('Error uploading or updating profile picture:', error)

      notify('error', 'An error occurred. Please try again.', {
        autoClose: 5000,
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
          className="w-[100px] h-20 rounded-full lg:w-[100px] lg:h-20 object-cover lg:rounded-full border-1 border-gray-300 shadow-md"
        />
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {useChangeImageButton && (
          <button
            className="text-[10px] font-raleway font-medium lg:text-[12px] text-[#4884DF] cursor-pointer mt-1"
            onClick={() => document.getElementById('profileImage')?.click()}>
            Change Image
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfilePic
