import { Box, Flex } from '@chakra-ui/react'
import Link from 'next/link'

export default function Header() {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Flex
        sx={{
          padding: '0 16px 0 24px',
          maxW: '1080px',
          margin: '0 auto',
          overflow: 'hidden',
          position: 'relative',
          height: '72px',
          alignItems: 'center',
        }}
      >
        <Flex
          sx={{
            w: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ fontWeight: '600', fontSize: '16px' }}>
            <Link href={'/'}>Daiboom`s dev</Link>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}
