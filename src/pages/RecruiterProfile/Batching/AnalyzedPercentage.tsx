import Box from '@mui/material/Box'
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import * as React from 'react'

const ResultCircleWithLabel = (
  props: CircularProgressProps & { value: number },
) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'var(--color-primary-strong)' }}>{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

interface CircularWithValueLabelProps {
  targetValue: number
}

export const AnalyzedPercentage = ({
  targetValue,
}: CircularWithValueLabelProps) => {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= targetValue ? targetValue : prevProgress + 5,
      )
    }, 200)

    if (progress >= targetValue) {
      clearInterval(timer)
    }

    return () => {
      clearInterval(timer)
    }
  }, [progress, targetValue])

  return <ResultCircleWithLabel value={progress} />
}
