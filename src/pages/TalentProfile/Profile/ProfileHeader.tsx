import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../../redux/store/store'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'
import { getDefaultIcon } from '../../../utils/getDefaultIcon'
import ProgressBar from '../../../utils/ProgressBar'

interface TalentHeaderType {
  userInfo: any
  profileImage: string | ArrayBuffer | null
  setProfileImage?: (value: string | ArrayBuffer) => void
  handleProfileImageUpload: (file: File) => Promise<void>
  progress: any
}

const TalentProfileHeader: React.FC<TalentHeaderType> = ({
  userInfo,
  profileImage,
  setProfileImage,
  handleProfileImageUpload,
  progress,
}) => {
  const user = useSelector((state: RootState) => state.auth.user)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (setProfileImage) {
        setProfileImage(URL.createObjectURL(file)) // Preview the new image
      }
      handleProfileImageUpload(file) // Upload the image
    }
  }

  return (
    <div>
      <div className="w-full">
        <div className="md:my-3 flex justify-between items-center">
          <h2 className="font-bold md:text-3xl text-xl">
            {userInfo?.profile
              ? 'Edit Talent Profile'
              : 'Create Talent Profile'}
          </h2>

          <ProgressBar
            percentage={progress}
            textColor="#344054"
            pathColor="#3C6FD4"
            trailColor="#F4EBFF"
            size={70}
          />
        </div>
        <div className="border flex space-x-5 p-5 rounded-2xl border-[#D0D5DD] mt-1">
          <div className="flex justify-center items-center flex-col space-y-2">
            <img
              src={
                (profileImage as string) ||
                getDefaultIcon({ id: user?.id, size: 50 })
              }
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full"
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
          <div className="w-full">
            <div className="flex justify-between w-full">
              <div className="text-[#101828]">
                <p className="text-[20px] font-semibold">{`${userInfo?.firstName} ${userInfo?.lastName}`}</p>
                <p className="text-[16px]">
                  {capitalizeEachWord(userInfo?.userRole)}
                </p>
              </div>
              <button className="bg-[#3C6FD4] text-white rounded-xl text-[12px] font-light w-[93px] h-[40px]">
                {userInfo?.profile ? 'Edit Profile' : 'Create Profile'}
              </button>
            </div>
            <hr className="my-2" />
            <p className="text-[14px] text-[#667085]">
              Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus
              id scelerisque est ultricies ultricies. Duis est sit sed leo nisl,
              blandit elit
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TalentProfileHeader

// const handleImageChange = (
//   event: React.ChangeEvent<HTMLInputElement>,
//   setProfileImage: ((value: string | ArrayBuffer) => void) | undefined,
// ) => {
//   const file = event.target.files?.[0] // Get the first selected file
//   if (!file) {
//     return // Exit if no file is selected
//   }

//   // Validate file type
//   const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
//   if (!validTypes.includes(file.type)) {
//     alert('Please upload a valid image file (JPEG, PNG).')
//     return
//   }

//   // Validate file size (e.g., max 2MB)
//   const maxSize = 2 * 1024 * 1024 // 2MB
//   if (file.size > maxSize) {
//     alert('File size exceeds 2MB. Please upload a smaller image.')
//     return
//   }

//   // Preview the image using FileReader
//   const reader = new FileReader()
//   reader.onload = () => {
//     const result = reader.result as string // Get the image as a base64 string
//     setProfileImage?.(result) // Update the profile image state
//   }
//   reader.readAsDataURL(file) // Read the file as a Data URL
// }
