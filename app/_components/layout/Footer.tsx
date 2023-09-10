import { Box, Flex, Link, SystemCSSProperties } from '@chakra-ui/react'

export default function Footer() {
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
        background: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          ...styles.wrapper,
          paddingBottom: '40px',
          maxWidth: '1080px',
          margin: '0 auto',
        }}
      >
        <Flex
          sx={{
            padding: '16px 0px',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Box
            sx={{
              color: '#616161',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            전체보기
          </Box>
          <Box>
            <Link
              href={
                'https://www.facebook.com/people/%EB%8B%A4%EC%9D%B4%EB%B6%90/pfbid0PgmBrKMorGqynyL6R2NM86R9b6dM8u1b3v7C31nD3vXjY48BBQu3rnjpdrFsq82wl/'
              }
            >
              페이스북
            </Link>
            <Link href={'https://www.instagram.com/daiboom_0125/'}>인스타</Link>
            <Link
              href={
                'https://www.linkedin.com/in/%EB%8C%80%EB%B2%94-%EC%B5%9C-80b32a27b/'
              }
            >
              링크드인
            </Link>
          </Box>
        </Flex>
        <Box
          sx={{
            display: 'grid',
            gridGap: '4px',
            pt: '14px',
          }}
        >
          <Box>대범이의 개발이야기 | 블로그장: 최대범 | 개발자: 최대범</Box>
          <Box>제호: Daiboom`s dev | 편집인: 최대범</Box>
        </Box>
      </Box>
    </Box>
  )
}
