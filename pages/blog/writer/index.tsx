import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  SystemCSSProperties,
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

export default function Writer() {
  const styles: { [key: string]: SystemCSSProperties } = {
    label: { margin: 0 },
  }

  const editorStateRef = useRef()

  useEffect(() => {
    console.log(editorStateRef.current)
  }, [editorStateRef])
  return (
    <Box>
      <FormControl>
        <FormLabel sx={styles.label}>카테고리</FormLabel>
        <Select placeholder="Select country">
          <option>United Arab Emirates</option>
          <option>Nigeria</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel sx={styles.label}>제목</FormLabel>
        <Input type="email" />
      </FormControl>
      내용
      {/*  <Editor ref={editorStateRef} /> */}
    </Box>
  )
}
