import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { PageHeaderTitle } from '../../../components/PageHeaderTitle'
import { useScreenWidth } from '../../../hooks'
import { useGetRecruiterShortlistQuery } from '../../../redux/api/recruiter'
import { ResponsiveTableRenderer } from '../../../utils'

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

export const Shortlist = () => {
  const alignHeader = 'left'
  const screenWidth = useScreenWidth()
  const { data, isLoading } = useGetRecruiterShortlistQuery({})

  console.log(data?.data.scouts)

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
                  <TableCell align={alignHeader} sx={tableHeadStyle}>
                    Title
                  </TableCell>
                  <TableCell align={alignHeader} sx={tableHeadStyle}>
                    Talent Name
                  </TableCell>
                  <ResponsiveTableRenderer
                    screenWidth={screenWidth}
                    breakpoint={768}>
                    <TableCell align={alignHeader} sx={tableHeadStyle}>
                      Rank
                    </TableCell>
                  </ResponsiveTableRenderer>
                  <TableCell align="center" sx={tableHeadStyle}>
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.campaigns.length > 0 &&
                  data?.data?.campaigns.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell sx={tableCellStyle}>
                        {item.job?.role?.name}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>{item.talent}</TableCell>
                      <TableCell sx={tableCellStyle}>{item.rank}</TableCell>
                      <TableCell sx={tableCellStyle}>
                        <Link to="">
                          <Button textType="small" title="Details" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper}>
            <div className="font-medium text-[20px] p-2">Scouts</div>
            <Table aria-label="Application pipeline data">
              <TableHead>
                <TableRow>
                  <TableCell align={alignHeader} sx={tableHeadStyle}>
                    Title
                  </TableCell>
                  <TableCell align={alignHeader} sx={tableHeadStyle}>
                    Talent Name
                  </TableCell>
                  <ResponsiveTableRenderer
                    screenWidth={screenWidth}
                    breakpoint={768}>
                    <TableCell align={alignHeader} sx={tableHeadStyle}>
                      Score
                    </TableCell>
                  </ResponsiveTableRenderer>
                  <TableCell align="center" sx={tableHeadStyle}>
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.scouts.length > 0 &&
                  data?.data?.scouts.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell sx={tableCellStyle}>no title</TableCell>
                      <TableCell sx={tableCellStyle}>{item.cvName}</TableCell>
                      <TableCell sx={tableCellStyle}>
                        {item.evaluationScore}%
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        <Link to="">
                          <Button textType="small" title="Details" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  )
}
