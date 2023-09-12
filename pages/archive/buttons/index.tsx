import { Button } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

export default function Buttons() {
  const [timerIds, setTimerIds] = useState<NodeJS.Timeout[]>()

  const clickHandler = useCallback(() => {
    const timerId = setTimeout(() => {
      console.log(timerId)
    }, 1000)
    timerIds?.push(timerId)
    setTimerIds(timerIds)
  }, [timerIds, setTimerIds])

  useEffect(() => {
    clickHandler()
  }, [clickHandler])

  return <Button onClick={clickHandler}>Hello</Button>
}
