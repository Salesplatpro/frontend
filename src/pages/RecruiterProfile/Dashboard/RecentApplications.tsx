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
import { Link } from 'react-router-dom'
import { calculateDaysFromCreation } from '../../../utils'

interface ApplicationRow {
  applicantName: string
  prescreeningScore?: number
  cvSimilarityScore?: number
  dateApplied: string
}

interface RecentApplicationsProps {
  infoData: ApplicationRow[]
}

const tableHeadStyle = {
  color: '#101828',
  backgroundColor: '#F8F8F8',
  fontSize: '18px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const tableCellStyle = {
  color: '#101828',
  fontSize: '16px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const RecentApplications: React.FC<RecentApplicationsProps> = ({
  infoData,
}) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg text-[#000] font-semibold">
          Recent Applications
        </h4>
        <Link to="#" className="text-base text-[#4985DF]">
          View all
        </Link>
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
            {infoData.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" sx={tableCellStyle}>
                  {row.applicantName}
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {row.prescreeningScore || 'nill'}%
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {row.cvSimilarityScore || 'nill'}%
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {calculateDaysFromCreation(row.dateApplied)} days ago
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default RecentApplications
