import React, { useEffect, useState } from 'react'
import { useSearchParams, Link, useParams } from 'react-router-dom'
import { AnalyzedPercentage } from '../AnalyzedPercentage'
import { Alert } from '@mui/material'
import { useSearchTalentDbQuery } from '../../../../redux/api/recruiter'
import talentdb from '../../../../assets/talentdb.webp'
import Loading from '../../../../components/Loading/Loading'
import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'

const SearchResult = () => {
  const [searchParams] = useSearchParams()
  const [talents, setTalents] = useState([])
  const param = useParams()

  const initialSearchValues = {
    scoutJobId: searchParams.get('scoutJobId') || '',
    role: searchParams.get('role') || '',
    location: {
      country: {
        name: searchParams.get('countryName') || '',
        geoId: searchParams.get('geoId') || null,
      },
      state: {
        name: searchParams.get('stateName') || '',
        geoId: searchParams.get('geoId') || null,
      },
      city: {
        name: searchParams.get('cityName') || '',
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
      <PageHeaderTitle
        paramsId={param}
        description="Find qualified talents by searching"
      />
      {talents.length === 0 ? (
        <Alert severity="error">No Talents fit this description</Alert>
      ) : (
        <div className="md:w-[60%] w-[80%] mx-auto md:max-w[528px] mt-10">
          {talents.map((talent: any, i) => (
            <div
              key={i}
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

// import React, { useEffect, useState } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import { AnalyzedPercentage } from '../AnalyzedPercentage';
// import { Alert } from '@mui/material';
// import { useSearchTalentDbQuery, useGetCampaignNameQuery } from '../../../../redux/api/recruiter';
// import talentdb from '../../../../assets/talentdb.webp';
// import Loading from '../../../../components/Loading/Loading';
// import { PageHeaderTitle } from '../../../../components/PageHeaderTitle';

// const SearchResult = () => {
//   const [searchParams] = useSearchParams();
//   const scoutJobId = searchParams.get('scoutJobId') || '';
//   console.log('scoutJobId in SearchResult:', scoutJobId); // Ensure scoutJobId is logged correctly

//   // Skip the API calls if scoutJobId is empty
//   const shouldFetchData = Boolean(scoutJobId);

//   // Fetch scout campaign name
//   const { data: campaignData, isLoading: isCampaignLoading } = useGetCampaignNameQuery(scoutJobId, {
//     skip: !shouldFetchData,
//   });

//   // Fetch talents based on scoutJobId and other params
//   const { data, isLoading, error } = useSearchTalentDbQuery({ scoutJobId }, {
//     skip: !shouldFetchData,  // Skip query if scoutJobId is invalid
//   });

//   useEffect(() => {
//     if (data?.data?.talents) {
//       setTalents(data.data.talents);
//     }
//   }, [data]);

//   if (isLoading || isCampaignLoading) {
//     return <Loading />;
//   }

//   if (error) {
//     let errorMessage = 'An error occurred while fetching the data';
//     return <Alert severity="error">{errorMessage}</Alert>;
//   }

//   return (
//     <div>
//       {/* Display page header */}
//       <PageHeaderTitle
//         paramsId={scoutJobId}
//         description={`Search results for ${campaignData?.data?.name || 'Unknown'} campaign`}
//       />
//       {talents.length === 0 ? (
//         <Alert severity="error">No Talents fit this description</Alert>
//       ) : (
//         <div className="md:w-[60%] w-[80%] mx-auto md:max-w[528px] mt-10">
//           {talents.map((talent: any, i) => (
//             <div
//               key={i}
//               className="flex border border-[#E4E7EC] w-full items-start justify-center rounded-lg p-3">
//               <div className="flex-1 flex space-x-4">
//                 <img src={talentdb} alt="" className="w-9 h-9" />
//                 <div>
//                   <h2 className="text-[#0D0C22] font-semibold">
//                     {talent.firstName} {talent.lastName}
//                   </h2>
//                   {talent.profile.role.map((item: any) => (
//                     <h2
//                       key={item.id}
//                       className="text-[#0D0C22] text-sm font-medium">
//                       {item.name}
//                     </h2>
//                   ))}
//                   <h2 className="text-[#0D0C22] text-sm font-medium">
//                     {talent.profile.experience}
//                   </h2>
//                 </div>
//               </div>
//               <div className="flex flex-col space-y-1">
//                 <div className="flex justify-end">
//                   <AnalyzedPercentage targetValue={talent.similarity} />
//                 </div>
//                 <Link to="#" className="text-[#3C6FD4] text-sm">
//                   See analysis
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResult;
