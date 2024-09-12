import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const SearchResult = () => {
  const location = useLocation()
  const talents = location.state?.talents || []

  return (
    <div>
      <div className="space-y-2 mt-4">
        <h1 className="font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
          Talent Search Result
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
          find qualified talents by searching
        </p>
      </div>
      <div className="md:w-[50%] w-[80%] mx-auto mt-10">
        {talents.map((talent: any) => (
          <div
            key={talent.id}
            className="flex border w-full items-center p-4 rounded-lg">
            <div className="flex-1">
              <h2 className="text-[#0D0C22] font-semibold">
                {talent.firstName} {talent.lastName}
              </h2>
              <h2 className="text-[#0D0C22] text-sm">
                {talent.profile.experience}
              </h2>
              <h2 className="text-black">{talent.profile.role.name}</h2>
            </div>
            <div>
              <Link to="#" className="text-[#3C6FD4] text-sm">
                See analysis
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResult
