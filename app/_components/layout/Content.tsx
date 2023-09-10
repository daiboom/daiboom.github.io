import { Box } from '@chakra-ui/react'

interface ContentProps {
  children: React.ReactNode
}

export default function Content({ children }: ContentProps) {
  return <Box>{children}</Box>
}
