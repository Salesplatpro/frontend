import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useFetchAllApplicationsQuery } from '../../../redux/api/recruiter'
import { calculateDaysFromCreation } from '../../../utils'
import Loading from '../../../components/Loading/Loading'
import { Button, DisplayError } from '../../../components'
import { useNavigate } from 'react-router-dom'

interface ApplicationRow {
  applicantName: string
  cvSimilarityScore?: number
  createdAt: string
  talent?: {
    firstName: string
    lastName: string
    profile: {
      prescreeningScore?: number
    }
  }
}

const tableHeadStyle = {
  color: '#101828',
  backgroundColor: '#F8F8F8',
  fontSize: '16px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const tableCellStyle = {
  color: '#101828',
  fontSize: '16px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const AllApplications: React.FC = () => {
  const navigate = useNavigate()
  const { data, isLoading, error } = useFetchAllApplicationsQuery({})
  const applications: ApplicationRow[] = data?.data?.applications || []

  if (isLoading) return <Loading />

  if (error) {
    return <DisplayError message="Error loading applications" />
  }

  return (
    <div className="lg:w-[90%] mx-auto">
      <div className="mb-4 flex items-center justify-between mt-8">
        <h4 className="text-lg text-[#000] font-semibold">Applications</h4>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadStyle}>Applicant name</TableCell>
              <TableCell align="center" sx={tableHeadStyle}>
                Pre screening
              </TableCell>
              <TableCell align="center" sx={tableHeadStyle}>
                Cv match
              </TableCell>
              <TableCell align="center" sx={tableHeadStyle}>
                Date Applied
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" sx={tableCellStyle}>
                  {row?.talent?.firstName} {row?.talent?.lastName}
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {row?.talent?.profile.prescreeningScore || 'nill'}%
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {row?.cvSimilarityScore || 'nill'}%
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {calculateDaysFromCreation(row?.createdAt)} days ago
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-5 py-3 w-[185px] h-[48px] bg-blue-500 text-white rounded hover:bg-blue-700 mt-6">
        Back
      </button>
    </div>
  )
}

export default AllApplications
