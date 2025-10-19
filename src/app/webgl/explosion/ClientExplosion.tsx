'use client'

import dynamic from 'next/dynamic'

const Explosion = dynamic(() => import('./Explosion'), {
  ssr: false,
  loading: () => <div>Loading 3D Scene...</div>,
})

export default function ClientExplosion(props: any) {
  return <Explosion {...props} />
}
