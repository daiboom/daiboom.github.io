'use client'

import { Box, Heading } from '@chakra-ui/react'

export default function Home() {
  return (
    <Box sx={{ width: '1080px', px: '24px', margin: '0 auto' }}>
      <Box>
        <Heading as={'h2'} sx={{ fontSize: '22px' }}>
          공지사항
        </Heading>
      </Box>
      <Box>
        <Heading as={'h2'} sx={{ fontSize: '22px' }}>
          인기 있는 포스트
        </Heading>
      </Box>
      <Box>
        <Heading as={'h2'} sx={{ fontSize: '22px' }}>
          인기 있는 아카이브
        </Heading>
      </Box>
    </Box>
  )
}
