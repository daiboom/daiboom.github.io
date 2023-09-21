import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { ReactSortable } from 'react-sortablejs'

interface ItemType {
  id: number
  order: number
  name: string
}

const dragOptions = {
  animation: 500,

  ghostClass: 'ghost',
}

export default function BasicFunction() {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: '성시경', order: 1 },
    { id: 2, name: '박효신', order: 2 },
    { id: 3, name: '이수', order: 3 },
    { id: 4, name: '임재범', order: 4 },
    { id: 5, name: 'SG워너비', order: 5 },
    { id: 6, name: '김경호', order: 6 },
    { id: 7, name: '김종서', order: 7 },
  ])

  const orderList = (list: ItemType[]) => {
    return list.toSorted((a, b) => {
      return a.order - b.order
    })
  }

  const up = (order: number) => {
    if (order === 1) {
      return
    }

    const newState = [...state]

    newState[order - 2].order += 1
    newState[order - 1].order -= 1

    const sorted = orderList(newState)
    setState(sorted)
  }
  const down = (order: number) => {
    if (order === state.length) {
      return
    }

    const newState = [...state]

    newState[order - 1].order += 1
    newState[order].order -= 1

    const sorted = orderList(newState)
    setState(sorted)
  }

  return (
    <>
      <ReactSortable
        list={state}
        setList={(newState) => {
          const ordering = newState.map((s, i) => {
            s.order = i + 1
            return s
          })
          setState(ordering)
        }}
        {...dragOptions}
      >
        {state.map((item, index) => (
          <Box key={item.id}>
            <Flex sx={{ gap: '5px', alignItems: 'center' }}>
              <Input
                min={1}
                max={state.length}
                type={'number'}
                sx={{ width: '100px' }}
                size={'xs'}
                defaultValue={item.order}
                onChange={(event) => {
                  if (
                    !event.target.value ||
                    parseInt(event.target.value) === item.order ||
                    parseInt(event.target.value) > state.length ||
                    parseInt(event.target.value) <= 0
                  ) {
                    return
                  }

                  const value = parseInt(event.target.value)
                  let newState = [...state]

                  const current = newState.slice(index, index + 1)
                  current[0].order = value
                  const before = newState.slice(
                    0,
                    index === state.length ? index - 1 : index
                  )
                  const after = newState.slice(index + 1)

                  const merge = [...before, ...after].toSpliced(
                    value - 1,
                    0,
                    current[0]
                  )

                  setState(
                    merge.map((s, i) => {
                      s.order = i + 1
                      return s
                    })
                  )
                  console.log(value, index, newState, {
                    current,
                    before,
                    after,
                    merge,
                  })
                }}
              />
              <Button
                size={'xs'}
                onClick={() => {
                  up(item.order)
                }}
              >
                변경
              </Button>
              <Button
                size={'xs'}
                onClick={() => {
                  up(item.order)
                }}
              >
                위
              </Button>
              <Button
                size={'xs'}
                onClick={() => {
                  down(item.order)
                }}
              >
                아래
              </Button>
              <Text>{item.name}</Text>
            </Flex>
          </Box>
        ))}
      </ReactSortable>
      <Text as={'pre'} sx={{ fontSize: '12px', lineHeight: 'normal' }}>
        <Text as={'code'}>{JSON.stringify(state, null, 2)}</Text>
      </Text>
    </>
  )
}
