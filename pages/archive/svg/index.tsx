import { Box, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_DATA = [
  { value: 2, asOf: '2000-01-01' },
  { value: 3, asOf: '2001-01-01' },
  { value: 5, asOf: '2002-01-01' },
  { value: 8, asOf: '2003-01-01' },
  { value: 13, asOf: '2004-01-01' },
  { value: 21, asOf: '2005-01-01' },
  { value: 34, asOf: '2006-01-01' },
  { value: 55, asOf: '2007-01-01' },
  { value: 89, asOf: '2008-01-01' },
  { value: 88, asOf: '2009-01-01' },
  { value: 86, asOf: '2010-01-01' },
  { value: 84, asOf: '2011-01-01' },
  { value: 81, asOf: '2012-01-01' },
  { value: 75, asOf: '2013-01-01' },
]

export default function SvgPage() {
  const [data, setData] = useState(DEFAULT_DATA)
  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(400)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    svgRef.current
  }, [svgRef])
  return (
    <Box>
      <Text>Hello SVG</Text>
      <svg ref={svgRef} width={width} height={height}>
        {/* <path d="M 0,100 c 0,-100 150,-100 150,0" stroke="green" />
        <path
          d="M 0,100 c 0,-100 150,-100 150,0 s 150,100 150,0"
          stroke="green"
        /> */}
        <path
          fill="none"
          stroke="red"
          d="M 10,50
           Q 25,25 40,50
           t 30,0 30,0 30,0 30,0 30,0"
        />

        {/* <!-- Highlight the curve vertex and control points --> */}
        <g>
          {/* <polyline
            points="10,50 25,25 40,50"
            stroke="rgba(0,0,0,.2)"
            fill="none"
          /> */}
          <circle cx="25" cy="25" r="1.5" />

          {/* <!-- Curve vertex points --> */}
          <circle cx="10" cy="50" r="1.5" />
          <circle cx="40" cy="50" r="1.5" />

          <g id="SmoothQuadraticDown">
            {/* <polyline
              points="40,50 55,75 70,50"
              stroke="rgba(0,0,0,.2)"
              stroke-dasharray="2"
              fill="none"
            /> */}
            <circle cx="55" cy="75" r="1.5" fill="lightgrey" />
            <circle cx="70" cy="50" r="1.5" />
          </g>

          <g id="SmoothQuadraticUp">
            {/* <polyline
              points="70,50 85,25 100,50"
              stroke="rgba(0,0,0,.2)"
              stroke-dasharray="2"
              fill="none"
            /> */}
            <circle cx="85" cy="25" r="1.5" fill="lightgrey" />
            <circle cx="100" cy="50" r="1.5" />
          </g>

          <use href="#SmoothQuadraticDown" x="60" />
          {/*<use href="#SmoothQuadraticUp" x="60" />
          <use href="#SmoothQuadraticDown" x="120" /> */}
        </g>
      </svg>
    </Box>
  )
}
