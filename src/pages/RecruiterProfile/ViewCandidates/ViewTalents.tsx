// import React, { useEffect, useState } from 'react'
// import { fetchTalentProfies } from '../../../api/api-communication'
// import './ViewTalents.scss'
// import Roles from '../../../components/Roles/Roles'

// const ViewTalents = () => {
//   const [talentsProfile, setTalentsProfile] = useState([])
//   const [roleValue, setRoleValue] = useState<string | undefined>(undefined)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await fetchTalentProfies(roleValue);
//         setTalentsProfile(data.data.talents)
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     fetchData()
//   }, [roleValue])

//   const handleChange = (e) => {
//     const val = e.target.value
//     setRoleValue(val)
//   }

//   return (
//     <div className="view-container">
//       <h2>Talents</h2>
//       <div className="view-role">
//         <p>Search by roles</p>
//         <Roles value={roleValue} onChange={handleChange} />
//       </div>
//       <div className="view-body">
//         {talentsProfile.map((talent, index) => (
//           <div key={index} className="view-talent">
//             <h3>{`${talent.firstName} ${talent.lastName}`}</h3>
//             <p>Role: {talent.profile?.role[0]?.name || 'Role not specified'}</p>
//             <p>
//               Experience:{' '}
//               {talent.profile?.experience || 'Experience not specified'}
//             </p>
//             <p>Bio: {talent.profile?.bio || 'Bio not specified'}</p>
//             <hr />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ViewTalents

import React, { useEffect, useState } from 'react'
import { fetchTalentProfies } from '../../../api/api-communication'
import './ViewTalents.scss'
import Roles from '../../../components/Roles/Roles'
import Loading from '../../../components/Loading/Loading'

const ViewTalents = () => {
  const [talentsProfile, setTalentsProfile] = useState([])
  const [roleValue, setRoleValue] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchTalentProfies(roleValue)
        setTalentsProfile(data.data.talents)
      } catch (error) {
        setError('Failed to fetch talent profiles')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [roleValue])

  const handleChange = (e) => {
    const val = e.target.value
    setRoleValue(val)
  }

  return (
    <div className="view-container">
      <h4>Talents</h4>
      <div className="search-role">
        <p>Search by roles</p>
        <div className="view-role">
          <Roles value={roleValue} onChange={handleChange} />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="view-body">
          {talentsProfile.length === 0 ? (
            <div className="no-talent">No talents found for this role</div>
          ) : (
            talentsProfile.map((talent, index) => (
              <div key={index} className="view-talent">
                <h3>{`${talent.firstName} ${talent.lastName}`}</h3>
                <p>
                  Role: {talent.profile?.role[0]?.name || 'Role not specified'}
                </p>
                <p>
                  Experience:{' '}
                  {talent.profile?.experience || 'Experience not specified'}
                </p>
                <p>Bio: {talent.profile?.bio || 'Bio not specified'}</p>
                <hr />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ViewTalents
