import GaugeA from '@/components/slider/GaugeA'
import PercentageA from '@/components/slider/PercentageA'
import PriceA from '@/components/slider/PriceA'
import RangeA from '@/components/slider/RangeA'
import VolumeA from '@/components/slider/VolumeA'
import VolumeB from '@/components/slider/VolumeB'

import { Box } from '@chakra-ui/react'

export default function SliderPage() {
  return (
    <Box>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center">
        <VolumeA />
        <VolumeB />
        <RangeA />
      </div>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center">
        <PriceA />
        <PercentageA />
        <GaugeA />
      </div>
    </Box>
  )
}
