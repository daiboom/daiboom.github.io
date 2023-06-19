'use client'

import { Box, Heading } from '@chakra-ui/react'
import { useEffect } from 'react'

function MinCoinChange(coins: number[]) {
  let cache: { [k: string]: any } = {}

  this.makeChange = function (amount: number) {
    let _self = this
    if (!amount) {
      return []
    }

    if (cache[amount]) {
      return cache[amount]
    }

    let min: number[] = []
    let newMin: number[] = []
    let newAmount: number

    for (let i = 0; i < coins.length; i++) {
      let coin = coins[i]
      newAmount = amount - coin

      if (newAmount >= 0) {
        newMin = _self.makeChange(newAmount)
      }

      if (
        newAmount >= 0 &&
        (newMin.length < min.length - 1 ||
          (!min.length && newMin.length) ||
          !newAmount)
      ) {
        min = [coin].concat(newMin)
        console.log(`newMin ${min} for ${amount}`)
      }
    }

    return (cache[amount] = min)
  }
}

const MinCoinChangeFC = () => {
  useEffect(() => {
    const minCoinChange = new MinCoinChange([1, 5, 10, 25])
    console.log(minCoinChange.makeChange(36))
  }, [])

  return (
    <Box>
      <Heading>MinCoinChange</Heading>
    </Box>
  )
}

export default MinCoinChangeFC
