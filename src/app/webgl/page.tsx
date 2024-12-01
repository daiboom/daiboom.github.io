import Link from 'next/link'

export const metadata = {
  title: {
    default: 'WebGL 갤러리',
    template: '%S | 사이트명',
  },
}

export default function Page() {
  return (
    <>
      <main>
        <h1>WebGL 갤러리</h1>
        <ul>
          <li>
            <Link href={'/webgl/roulette'}>룰렛</Link>
          </li>
          <li>
            <Link href={'/webgl/pheonix'}>불사조</Link>
          </li>
          <li>
            <Link href={'/webgl/music-sphere'}>음악상자</Link>
          </li>
          <li>
            <Link href={'/webgl/bingo'}>빙고</Link>
          </li>
          <li>
            <Link href={'/webgl/solar-system'}>태양계</Link>
          </li>
        </ul>
      </main>
    </>
  )
}
