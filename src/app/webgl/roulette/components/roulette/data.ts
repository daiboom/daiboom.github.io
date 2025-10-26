import { RouletteItem, RouletteOption } from './types'

// 확장된 아이템 타입
export interface ExtendedRouletteItem extends RouletteItem {
  color?: string
  icon?: string
}

export const ROULETTE_ITEMS_DEFAULT: ExtendedRouletteItem[] = [
  {
    value: 'prize-1',
    text: '1등',
    color: '#DC143C', // 진한 빨간색
    icon: '🏆',
  },
  {
    value: 'prize-2',
    text: '2등',
    color: '#FF4500', // 진한 주황색
    icon: '🥈',
  },
  {
    value: 'prize-3',
    text: '3등',
    color: '#FFA500', // 진한 노란색
    icon: '🥉',
  },
  {
    value: 'prize-4',
    text: '보너스',
    color: '#228B22', // 진한 초록색
    icon: '🎁',
  },
  {
    value: 'prize-5',
    text: '다시',
    color: '#4169E1', // 진한 파란색
    icon: '🎫',
  },
  {
    value: 'prize-6',
    text: '꽝',
    color: '#8B008B', // 진한 보라색
    icon: '💔',
  },
]

export const defaultOption: Required<RouletteOption> = {
  border: true,
  center: true,
  correctionOffset: 0.8,
  cycleDuration: 5000,
  cycleTime: 10,
  clockwise: true,
}
