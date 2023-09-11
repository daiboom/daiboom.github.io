

import { Box, Divider, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SubHeader() {
  const pathname = usePathname()

  console.log(pathname)

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Flex
        sx={{
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
          <Flex
            sx={{
              padding: '0 16px 0 24px',
              gap: '10px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/statistics'}>
                <Box sx={{ py: '16px' }}>통계</Box>
              </Link>
            </Box>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/typescript'}>
                <Box sx={{ py: '16px' }}>AI</Box>
              </Link>
            </Box>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/web-development'}>
                <Box sx={{ py: '16px' }}>웹개발</Box>
              </Link>
            </Box>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/software'}>
                <Box sx={{ py: '16px' }}>소프트웨어</Box>
              </Link>
            </Box>
            <Box sx={{ py: '16px' }}>
              <Divider orientation="vertical" />
            </Box>

            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/typescript'}>
                <Box sx={{ py: '16px' }}>타입스크립트</Box>
              </Link>
            </Box>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/javascript'}>
                <Box sx={{ py: '16px' }}>자바스크립트</Box>
              </Link>
            </Box>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/python'}>
                <Box sx={{ py: '16px' }}>파이썬</Box>
              </Link>
            </Box>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/rlang'}>
                <Box sx={{ py: '16px' }}>R</Box>
              </Link>
            </Box>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/blog/list/golang'}>
                <Box sx={{ py: '16px' }}>Go</Box>
              </Link>
            </Box>
            <Box sx={{ fontSize: '14px' }}>
              <Link href={'/archive'}>
                <Box sx={{ py: '16px' }}>저장소</Box>
              </Link>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
