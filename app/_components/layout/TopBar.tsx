import { Box, Flex, Image, Link } from '@chakra-ui/react'

export default function TopBar() {
  return (
    <Flex
      sx={{
        paddingX: '24px',
        height: '48px',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(92deg, #6b16ee, #b276ed)',
        color: '#fff',
        fontSize: '14px',
      }}
    >
      <Box
        sx={{
          width: '24px',
          rounded: 'full',
          padding: '2px',
          marginRight: '10px',
        }}
      >
        <Image src={'/assets/images/icons/ic-github.svg'} />
      </Box>
      <Link href={'https://github.com/daiboom'}>깃허브 방문하기</Link>
    </Flex>
  )
}
