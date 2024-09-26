import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { PageHeaderTitle } from '../../../components/PageHeaderTitle'
import { useScreenWidth } from '../../../hooks'
import { useGetRecruiterShortlistQuery } from '../../../redux/api/recruiter'
import { ResponsiveTableRenderer } from '../../../utils'

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#d0d5dd',
    color: '#101828',
    fontWeight: 400,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: 400,
    padding: 12,
  },
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export const Shortlist = () => {
  const alignHeader = 'left'
  const screenWidth = useScreenWidth()
  const { data, isLoading } = useGetRecruiterShortlistQuery({})

  console.log(data?.data.campaigns)

  return (
    <div className="flex flex-col space-y-12">
      <PageHeaderTitle
        title="Shortlist"
        description="View shortlisted talents ready "
      />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col space-y-28 max-w-[1005px] ml-10">
          <TableContainer component={Paper}>
            <div className="font-medium text-[20px] p-2">Campaigns</div>
            <Table aria-label="Campaigns">
              <TableHead>
                <TableRow>
                  <StyledTableCell align={alignHeader}>Title</StyledTableCell>
                  <StyledTableCell align={alignHeader}>
                    Talent Name
                  </StyledTableCell>
                  <ResponsiveTableRenderer
                    screenWidth={screenWidth}
                    breakpoint={768}>
                    <StyledTableCell align={alignHeader}>Rank</StyledTableCell>
                  </ResponsiveTableRenderer>
                  <StyledTableCell align="center">Details</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.campaigns.length > 0 &&
                  data?.data?.campaigns.map((item: any, index: number) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{item.job?.role?.name}</StyledTableCell>
                      <StyledTableCell>{item.talent}</StyledTableCell>
                      <StyledTableCell>{item.rank}</StyledTableCell>
                      <StyledTableCell>
                        <Link to="">
                          <Button textType="small" title="Details" />
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper}>
            <div className="font-medium text-[20px] p-2">Scouts</div>
            <Table aria-label="Application pipeline data">
              <TableHead>
                <TableRow>
                  <StyledTableCell align={alignHeader}>Title</StyledTableCell>
                  <StyledTableCell align={alignHeader}>
                    Talent Name
                  </StyledTableCell>
                  <ResponsiveTableRenderer
                    screenWidth={screenWidth}
                    breakpoint={768}>
                    <StyledTableCell align={alignHeader}>Score</StyledTableCell>
                  </ResponsiveTableRenderer>
                  <StyledTableCell align="center">Details</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.scouts.length > 0 &&
                  data?.data?.scouts.map((item: any, index: number) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>Title</StyledTableCell>
                      <StyledTableCell>{item.cvName}</StyledTableCell>
                      <StyledTableCell>{item.evaluationScore}%</StyledTableCell>
                      <StyledTableCell>
                        <Link to="">
                          <Button textType="small" title="Details" />
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  )
}
