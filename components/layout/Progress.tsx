import { Box, SystemCSSProperties } from '@chakra-ui/react'

export default function Progress() {
  const styles: {
    [key: string]: SystemCSSProperties
  } = {
    wrapper: {
      fontSize: '12px',
      lineHeight: '18px',
      color: '#9e9e9e',
    },
  }
  return (
    <Box
      sx={{
        height: '2px',
        background: '#f5f5f5',
      }}
    />
  )
}
