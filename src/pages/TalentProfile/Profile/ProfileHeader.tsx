import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../../redux/store/store'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'
import ProgressBar from '../../../utils/ProgressBar'
import ProfilePic from './ProfilePic'

interface TalentHeaderType {
  userInfo: any
  uploadPic: any
  updateProfilePics: any
  progress: any
}

const TalentProfileHeader: React.FC<TalentHeaderType> = ({
  userInfo,
  uploadPic,
  updateProfilePics,
  progress,
}) => {
  const user = useSelector((state: RootState) => state.auth.user)

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
                <p className="text-[16px]">
                  {capitalizeEachWord(userInfo?.userRole)}
                </p>
              </div>
              <button className="bg-[#3C6FD4] text-white rounded-xl text-[12px] font-light w-[93px] h-[40px]">
                {userInfo?.profile ? 'Edit Profile' : 'Create Profile'}
              </button>
            </div>
            <hr className="my-2" />
            {/* <p className="text-[14px] text-[#667085]">
              Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus
              id scelerisque est ultricies ultricies. Duis est sit sed leo nisl,
              blandit elit
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TalentProfileHeader
