'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { Box, ChakraProvider, Container, Flex } from '@chakra-ui/react'
import Link from 'next/link'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <Container
          sx={{
            height: '100%',
            maxW: '100%',
          }}
        >
          <Box sx={{}}>
            <Box
              sx={{
                maxW: '710px',
                margin: '0 auto',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Flex
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: '15px',
                }}
              >
                <Box sx={{ fontWeight: '600', fontSize: '18px' }}>
                  <Link href={'/'}>📺 Daiboom</Link>
                </Box>
                <Flex sx={{ gap: '10px' }}>
                  <Box>
                    <Link href={'/resume'}>Resume</Link>
                  </Box>
                  <Box>
                    <Link href={'/archive'}>Archive</Link>
                  </Box>
                </Flex>
              </Flex>
              {children}
            </Box>
          </Box>
        </Container>
      </ChakraProvider>
    </CacheProvider>
  )
}
