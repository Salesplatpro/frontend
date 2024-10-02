import { capitalize } from '@mui/material'
import React from 'react'

import profile from '../../../assets/profile.jpeg'
import { capitalizeEachWord } from '../../TalentProfile/Profile Component/CapitalizeWord'

type ProfileCardProps = {
  firstName: string
  lastName: string
  role: string
  description: string
}

export const ProfileCard = ({
  firstName,
  lastName,
  role,
  description,
}: ProfileCardProps) => {
  return (
    <div>
      <div className="flex justify-between items-center py-[32px] px-[24px] my-[40px] border rounded-lg">
        <div className="flex gap-4">
          <div className="w-[69px] h-[69px]">
            <img src={profile} alt="profile" className="rounded-full" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium">
              {firstName} {lastName}
            </div>
            <div>{capitalizeEachWord(role)}</div>
            <div className="font-extralight">5 years</div>
          </div>
        </div>
        <div className="w-[260px]">{description}</div>
      </div>
    </div>
  )
}
