import React, { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'

import talentdb from '../../../../assets/talentdb.webp'
import { Button, DisplayError } from '../../../../components'
import { useSearchTalentDbQuery } from '../../../../redux/api/recruiter'
import { AnalyzedPercentage } from '../AnalyzedPercentage'

const PAGE_SIZE = 20

const SearchResult = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const param = useParams()
  const [page, setPage] = useState(1)

  const searchValues = {
    scoutJobId: searchParams.get('scoutJobId') || '',
    role: searchParams.get('role') || '',
    location: {
      country: { name: searchParams.get('countryName') || '' },
      state: { name: searchParams.get('stateName') || '' },
      city: { name: searchParams.get('cityName') || '' },
    },
    experienceLevel: searchParams.get('experienceLevel') || '',
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  }

  const { data, isLoading, isFetching, error } =
    useSearchTalentDbQuery(searchValues)

  const talents = Array.isArray(data?.data?.talents) ? data.data.talents : []
  const hasNextPage = talents.length === PAGE_SIZE

  if (isLoading) {
    return <Spinner fullPage />
  }

  if (error) {
    return (
      <DisplayError message="Something went wrong while searching the talent database. Please try again." />
    )
  }

  return (
    <div>
      <PageHeaderTitle
        paramsId={param}
        description="Find qualified talents by searching"
        onBack={() => navigate(-1)}
      />
      {talents.length === 0 ? (
        <EmptyState
          title="No talents fit this description"
          description="Try widening your role, location, or experience filters."
        />
      ) : (
        <>
          <div className="md:w-[60%] w-[80%] mx-auto md:max-w[528px] mt-10 space-y-3">
            {talents.map((talent: any, i: number) => (
              <div
                key={talent.id ?? i}
                className="flex border border-grey-200 w-full items-start justify-center rounded-lg p-3">
                <div className="flex-1 flex space-x-4">
                  <img src={talentdb} alt="" className="w-9 h-9" />
                  <div>
                    <h2 className="text-midnight font-semibold">
                      {talent.firstName} {talent.lastName}
                    </h2>
                    {talent.profile?.role?.map((item: any) => (
                      <h2
                        key={item.id}
                        className="text-midnight text-sm font-medium">
                        {item.name}
                      </h2>
                    ))}
                    <h2 className="text-midnight text-sm font-medium">
                      {talent.profile?.experience}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-end">
                    <AnalyzedPercentage targetValue={talent.similarity ?? 0} />
                  </div>
                  <Link to="#" className="text-primary-strong text-sm">
                    See analysis
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage || isFetching}
              onClick={() => setPage((p) => p + 1)}>
              {isFetching ? <Spinner size="sm" /> : 'Next'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default SearchResult
