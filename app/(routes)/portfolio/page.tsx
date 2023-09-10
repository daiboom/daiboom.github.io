'use client'

import { Flex, SystemStyleObject } from '@chakra-ui/react'

const About = () => {
  const styles: Record<string, SystemStyleObject> = {
    heading2: {
      mt: '35px',
      mb: '15px',
      color: '#191919',
    },
    divider: {
      my: '15px',
    },
  }
  return <Flex sx={{ maxWidth: '720px', margin: '0 auto' }}>클라우드허브</Flex>
}

export default About
