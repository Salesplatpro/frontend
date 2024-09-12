import Box from '@mui/material/Box'
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import * as React from 'react'

interface LinearProgressWithLabelProps extends LinearProgressProps {
  value: number
}

const LinearProgressWithLabel = ({
  value,
  ...props
}: LinearProgressWithLabelProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{ width: '100%', mr: 2 }}>
      <LinearProgress variant="determinate" value={value} {...props} />
    </Box>
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {`${Math.round(value)}%`}
      </Typography>
    </Box>
  </Box>
)

interface UploaderProps {
  initialProgress?: number
  interval: number
  increment: number
  maxProgress?: number
}

export const Uploader = ({
  initialProgress = 0,
  interval,
  increment,
  maxProgress = 100,
}: UploaderProps) => {
  const [progress, setProgress] = React.useState(initialProgress)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= maxProgress ? maxProgress : prevProgress + increment,
      )
    }, interval)

    if (progress >= maxProgress) {
      clearInterval(timer)
    }

    return () => clearInterval(timer)
  }, [progress, initialProgress, increment, interval, maxProgress])

  return (
    <Box sx={{ width: '80%' }}>
      <LinearProgressWithLabel
        value={progress}
        style={{ height: 8, borderRadius: 8 }}
      />
    </Box>
  )
}
