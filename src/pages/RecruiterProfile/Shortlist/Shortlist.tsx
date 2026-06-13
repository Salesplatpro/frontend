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

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Spinner } from '@/components/ui/Spinner'

import { Button } from '../../../components'
import { useScreenWidth } from '../../../hooks'
import { useGetRecruiterShortlistQuery } from '../../../redux/api/recruiter'
import { ResponsiveTableRenderer } from '../../../utils'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'

const tableHeadStyle = {
  color: 'var(--color-grey-900)',
  backgroundColor: 'var(--color-grey-50)',
  fontSize: '18px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const tableCellStyle = {
  color: 'var(--color-grey-900)',
  fontSize: '16px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

export const Shortlist = () => {
  const alignHeader = 'left'
  const screenWidth = useScreenWidth()
  const { data, isLoading } = useGetRecruiterShortlistQuery({})

  return (
    <div className="flex flex-col space-y-12">
      <PageHeaderTitle
        title="Shortlist"
        description="View shortlisted talents ready "
      />
      {isLoading ? (
        <Spinner fullPage />
      ) : (
        <div className="flex flex-col space-y-28 max-w-[1005px] ml-10">
          <TableContainer component={Paper}>
            <div className="font-medium text-[20px] p-2">Campaigns</div>
            {data?.data?.campaigns.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No campaign yet
              </div>
            ) : (
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
                  {data?.data?.campaigns.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell sx={tableCellStyle}>
                        {capitalizeEachWord(item.job?.role?.name)}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        {item.talent.firstName} {item.talent.lastName}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>{item.rank}</TableCell>
                      <TableCell sx={tableCellStyle}>
                        <Link to="">
                          <Button size="sm">Details</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          <TableContainer component={Paper}>
            <div className="font-medium text-[20px] p-2">Scouts</div>
            {data?.data?.scouts.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">No scout yet</div>
            ) : (
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
                  {data?.data?.scouts.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell sx={tableCellStyle}>no title</TableCell>
                      <TableCell sx={tableCellStyle}>{item.cvName}</TableCell>
                      <TableCell sx={tableCellStyle}>
                        {item.evaluationScore}%
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        <Link to="">
                          <Button size="sm">Details</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </div>
      )}
    </div>
  )
}
