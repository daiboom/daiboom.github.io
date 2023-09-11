

import { Box, Flex, Heading, Image, Spacer } from '@chakra-ui/react'
import Link from 'next/link'

// export async function generateStaticParams() {
//   return [
//     'statistics',
//     'typescript',
//     'web-development',
//     'software',
//     'javascript',
//     'python',
//     'rlang',
//     'golang',
//   ].map((slug) => ({
//     cid: slug,
//   }))
// }

export default function Category({ params }: any) {
  // const { cid } = params
  // console.log('params ===>', params)
  return (
    <Box sx={{ maxW: '720px', pt: '32px', paddingX: '24px', margin: '0 auto' }}>
      <Box sx={{ pb: '24px' }}>
        <Box
          sx={{
            alignItems: 'flex-start',
            marginBottom: '6px',
          }}
        >
          <Heading
            sx={{
              fontWeight: '500',
              fontSize: '22px',
              lineHeight: '32px',
              marginRight: '4px',
              color: '#212121',
            }}
          >
            통계
          </Heading>
        </Box>
        <Box
          sx={{
            fontSize: '14px',
            lineHeight: '24px',
            fontWeight: '400',
            color: '#616161',
          }}
        >
          통계에 대해서 알아봅시다.
        </Box>
      </Box>

      <Box>
        <Spacer height={'32px'} />
        {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).map((item) => {
          return (
            <Flex
              sx={{
                justifyContent: 'space-between',
                borderBottom: 'solid 1px #eee',
                paddingBottom: '24px',
                marginBottom: '24px',
                _last: {
                  borderBottom: 'none',
                  paddingBottom: '0',
                },
              }}
              key={item}
            >
              <Box
                sx={{
                  width: 'calc(100% - 112px)',
                  marginRight: '24px',
                }}
              >
                <Link
                  style={{
                    display: '-webkit-box',
                    fontSize: '18px',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                  href={'/'}
                >
                  브랜드 정립 단계에서 꼭 던져야 하는 질문들
                </Link>
                <Flex
                  sx={{
                    width: '100%',
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#424242',
                  }}
                >
                  <Box>8분</Box>
                  <Box
                    sx={{
                      width: '1px',
                      height: '100%',
                      borderLeft: '1px solid black',
                      mx: '8px',
                    }}
                  />
                  <Box>2023. 09. 10</Box>
                </Flex>
              </Box>
              <Box
                sx={{
                  verticalAlign: 'top',
                  height: '92px',
                  width: '92px',
                }}
              >
                <Image
                  sx={{
                    width: '92px',
                    height: '92px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                  }}
                  src={
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80'
                  }
                />
              </Box>
            </Flex>
          )
        })}
      </Box>
    </Box>
  )
}
