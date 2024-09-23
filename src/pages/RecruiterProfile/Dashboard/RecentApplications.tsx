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

const rows = [
  {
    name: 'Tayo Amosun',
    preScreening: '80%',
    cvMatch: '69%',
    dateApplied: '16 days ago',
  },
  {
    name: 'Tayo Amosun',
    preScreening: '80%',
    cvMatch: '69%',
    dateApplied: '16 days ago',
  },
  {
    name: 'Tayo Amosun',
    preScreening: '80%',
    cvMatch: '69%',
    dateApplied: '16 days ago',
  },
]

const tableHeadStyle = {
  color: '#101828',
  fontSize: '18px',
}

const tableCellStyle = {
  color: '#101828',
  fontSize: '16px',
}

const RecentApplications = () => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg text-[#000] font-semibold">Recent Applications</h4>
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
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" sx={tableCellStyle}>
                  {row.name}
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {row.preScreening}
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {row.cvMatch}
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {row.dateApplied}
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
