import { Box, Heading } from '@chakra-ui/react'
import { useCallback, useEffect } from 'react'

const Fibonacci = () => {
  const reculsiveFibonacci = useCallback((num: number): number => {
    if (num === 1 || num === 2) {
      return 1
    }

    return reculsiveFibonacci(num - 1) + reculsiveFibonacci(num - 2)
  }, [])

  const nomalFibonacci = (num: number) => {
    let n1 = 1
    let n2 = 1
    let n = 1

    for (let i = 3; i <= num; i++) {
      n = n1 + n2
      n1 = n2
      n2 = n
    }

    return n
  }

  useEffect(() => {
    console.time('reculsiveFibonacci')
    console.log('reculsiveFibonacci: ', reculsiveFibonacci(1))
    console.timeEnd('reculsiveFibonacci')
    console.time('nomalFibonacci')
    console.log('nomalFibonacci: ', nomalFibonacci(1))
    console.timeEnd('nomalFibonacci')
  }, [reculsiveFibonacci])

  return (
    <Box>
      <Heading>Fibonacci</Heading>
    </Box>
  )
}

export default Fibonacci
