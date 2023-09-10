import { Box, Divider, Flex } from '@chakra-ui/react'
import Link from 'next/link'

export default function SubHeader() {
  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Flex
        sx={{
          padding: '0 16px 0 24px',
          maxW: '1080px',
          margin: '0 auto',
          overflow: 'hidden',
          position: 'relative',
          height: '48px',
          alignItems: 'center',
        }}
      >
        <Flex
          sx={{
            w: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Flex sx={{ gap: '10px' }}>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/resume'}>경력사항</Link>
            </Box>
            <Divider orientation="vertical" />
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/archive'}>저장소</Link>
            </Box>
            <Divider orientation="vertical" />
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/archive'}>블로그</Link>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
