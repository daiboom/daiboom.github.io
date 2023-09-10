import { Box } from '@chakra-ui/react'

interface ContentProps {
  children: React.ReactNode
}

export default function Content({ children }: ContentProps) {
  return <Box sx={{ minH: '100vh' }}>{children}</Box>
}
