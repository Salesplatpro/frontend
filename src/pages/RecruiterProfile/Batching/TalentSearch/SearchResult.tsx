import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AnalyzedPercentage } from '../AnalyzedPercentage'
import { Alert } from '@mui/material'
import { useSearchTalentDbQuery } from '../../../../redux/api/recruiter'
import talentdb from '../../../../assets/talentdb.webp'
import Loading from '../../../../components/Loading/Loading'

const SearchResult = () => {
  const [searchParams] = useSearchParams()
  const [talents, setTalents] = useState([])

  const initialSearchValues = {
    scoutJobId: searchParams.get('scoutJobId') || '',
    role: searchParams.get('role') || '',
    description: searchParams.get('description') || '',
    location: {
      country: {
        name: searchParams.get('countryName') || '',
        geoId: searchParams.get('geoId') || null,
      },
    },
    experienceLevel: searchParams.get('experienceLevel') || '',
  }

  const { data, isLoading, error } = useSearchTalentDbQuery(
    initialSearchValues,
    {
      skip: !initialSearchValues,
    },
  )

  useEffect(() => {
    if (data?.data?.talents) {
      setTalents(data.data.talents)
    }
  }, [data])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    let errorMessage = 'An error occurred while fetching the data'
    return <Alert severity="error">{errorMessage}</Alert>
  }

  return (
    <div>
      <div className="space-y-2 mt-4 mb-10">
        <h1 className="font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
          Talent Search Result
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
          Find qualified talents by searching
        </p>
      </div>
      {talents.length === 0 ? (
        <Alert severity="error">No Talents fit this description</Alert>
      ) : (
        <div className="md:w-[60%] w-[80%] mx-auto md:max-w[528px]">
          {talents.map((talent: any) => (
            <div
              key={talent.id}
              className="flex border border-[#E4E7EC] w-full items-start justify-center rounded-lg p-3">
              <div className="flex-1 flex space-x-4">
                <img src={talentdb} alt="" className="w-9 h-9" />
                <div>
                  <h2 className="text-[#0D0C22] font-semibold">
                    {talent.firstName} {talent.lastName}
                  </h2>
                  {talent.profile.role.map((item: any) => (
                    <h2
                      key={item.id}
                      className="text-[#0D0C22] text-sm font-medium">
                      {item.name}
                    </h2>
                  ))}
                  <h2 className="text-[#0D0C22] text-sm font-medium">
                    {talent.profile.experience}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex justify-end">
                  <AnalyzedPercentage targetValue={talent.similarity} />
                </div>
                <Link to="#" className="text-[#3C6FD4] text-sm">
                  See analysis
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResult
