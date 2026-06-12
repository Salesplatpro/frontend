import Box from '@mui/material/Box'
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { useDispatch } from 'react-redux'

import {
  markCvCoverLetterUploadCompleted,
  markUploadCompleted,
} from '@/redux/features/filesSlice/fileSlice'

const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number },
) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

interface UploaderProps {
  size: number
  index: number
}

export const Uploader = ({ size, index }: UploaderProps) => {
  const dispatch = useDispatch()
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const intervalDuration = Math.max(10, 1000 / size)
    const incrementValue = 1000000 / size

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + incrementValue, 100)
        if (newProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return newProgress
      })
    }, intervalDuration)

    return () => {
      clearInterval(timer)
    }
  }, [size])

  React.useEffect(() => {
    if (progress === 100) {
      dispatch(markUploadCompleted(index)) ||
        dispatch(markCvCoverLetterUploadCompleted(index))
    }
  }, [progress, dispatch, index])

  return (
    <Box sx={{ width: '80%' }}>
      <LinearProgressWithLabel
        value={progress}
        style={{ height: 8, borderRadius: 8 }}
      />
    </Box>
  )
}
