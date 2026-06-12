import React, { useState } from 'react'

import { Button } from '../../../components'
import ProfilePic from '../Profile/ProfilePic'
import useProfile from '../Profile/useProfileHook'

export const Support = () => {
  // @ts-expect-error TODO: fix type error
  const { userInfo, updateProfilePics, uploadPic, user } = useProfile()
  const maxLength = 40
  const [values, setValues] = useState({
    name: `${userInfo?.firstName} ${userInfo?.lastName}`,
    email: `${userInfo?.email}`,
    phoneNumber: `${userInfo?.phone}`,
    role: `${userInfo?.userRole}`,
    message: '',
  })

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    if (newMessage.length <= maxLength) {
      setValues((prev) => ({
        ...prev,
        message: newMessage,
      }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-[31px]">
      <div className="w-full">
        <div className="md:my-3 flex justify-between items-center">
          <h2 className="font-bold md:text-3xl text-xl">Fill Support Form</h2>
        </div>
        <div className="border flex space-x-5 p-5 rounded-2xl border-[#D0D5DD] mt-1">
          <ProfilePic
            uploadPic={uploadPic}
            updateProfilePics={updateProfilePics}
            user={user}
            userInfo={userInfo}
          />

          <div className="w-full">
            <div className="flex justify-between w-full">
              <div className="text-[#101828]">
                <p className="text-[20px] font-semibold">{`${userInfo?.firstName} ${userInfo?.lastName}`}</p>
              </div>
            </div>
            <hr className="my-2" />
            <p className="text-[14px] text-[#667085]">
              Fill this form with the complaints you have, with correct details.
              And be rest assured we will get back to you as soon as we can.
            </p>
          </div>
        </div>
      </div>
      <div className="border flex flex-col p-5 rounded-2xl border-[#D0D5DD] mt-1">
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-medium mb-[6px]">
            Message
          </label>
          <textarea
            rows={5}
            maxLength={maxLength}
            className="border border-[#D0D5DD] rounded-lg p-2"
            placeholder="Tell us what is in your mind"
            value={values.message}
            onChange={(e) => handleMessageChange(e)}
          />
          <span className="text-sm font-normal">
            You have {maxLength - values.message.length} characters left
          </span>
        </div>
        <div className="flex flex-col md:flex-row w-full align-center justify-between gap-8 my-7">
          <div className="w-full md:w-1/2 ">
            <label htmlFor="name" className="text-sm font-medium mb-[6px]">
              Name
            </label>
            <input
              type="name"
              className="w-full border border-[#D0D5DD] rounded-lg p-2 mt-2 text-[#A7B1B9]"
              value={`${userInfo?.firstName} ${userInfo?.lastName}`}
              disabled
            />
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="role" className="text-sm font-medium mb-[6px]">
              Role
            </label>
            <input
              type="role"
              className="w-full border border-[#D0D5DD] rounded-lg p-2 mt-2 text-[#A7B1B9]"
              value={`${userInfo?.userRole}`}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full align-center justify-between gap-8">
          <div className="w-full md:w-1/2">
            <label htmlFor="email" className="text-sm font-medium mb-[6px]">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-[#D0D5DD] rounded-lg p-2 mt-2 text-[#A7B1B9]"
              value={`${userInfo?.email}`}
            />
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone number
            </label>
            <input
              type="phoneNumber"
              className="w-full border border-[#D0D5DD] rounded-lg p-2 mt-2 text-[#A7B1B9]"
              value={`${userInfo?.phone}`}
            />
          </div>
        </div>
        {values.message.length > 1 && (
          <div className="flex justify-end space-x-4 my-10">
            <Button
              title="Cancel"
              variant="secondary"
              onClick={() => setValues((prev) => ({ ...prev, message: '' }))}
            />
            <Button
              title="Done"
              variant="primary"
              onClick={() => console.log(values)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
