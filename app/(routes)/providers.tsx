'use client'

import Content from '@/app/_components/layout/Content'
import Footer from '@/app/_components/layout/Footer'
import Header from '@/app/_components/layout/Header'
import Progress from '@/app/_components/layout/Progress'
import SubHeader from '@/app/_components/layout/SubHeader'
import TopBar from '@/app/_components/layout/TopBar'
import { CacheProvider } from '@chakra-ui/next-js'
import { Box, ChakraProvider, Container } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <Container
          sx={{
            height: '100%',
            maxW: '100%',
            p: 0,
          }}
        >
          <Box sx={{}}>
            <Progress />
            <TopBar />
            <Header />
            <SubHeader />
            <Content>{children}</Content>
            {/* <SideBar /> */}
            <Footer />
          </Box>
        </Container>
      </ChakraProvider>
    </CacheProvider>
  )
}
