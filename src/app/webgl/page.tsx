import Link from 'next/link'

export const metadata = {
  title: {
    default: 'WebGL 갤러리',
    template: '%S | 사이트명',
  },
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b text-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-black">WebGL 갤러리</h1>

        <p className="text-black leading-relaxed mb-12 max-w-3xl">
          회사 업무와 개인적인 WebGL 모작 프로젝트들을 한곳에 모아둔
          갤러리입니다. 각 프로젝트는 실제 업무에서 구현했던 경험과 창의적인
          모작을 통해 만들어졌으며, WebGL의 다양한 기능과 기술을 활용하여
          구현되었습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          <ProjectCard
            href="/webgl/roulette"
            title="3D 룰렛"
            description="인터랙티브한 3D 룰렛 시스템"
          />
          <ProjectCard
            href="/webgl/pheonix"
            title="불사조"
            description="화려한 파티클 효과를 활용한 불사조 애니메이션"
          />
          <ProjectCard
            href="/webgl/music-sphere"
            title="음악상자"
            description="3D 공간에서 음악과 시각적 요소를 결합한 인터랙티브 작품"
          />
          <ProjectCard
            href="/webgl/bingo"
            title="3D 빙고"
            description="WebGL로 구현한 3D 빙고 게임"
          />
          <ProjectCard
            href="/webgl/solar-system"
            title="태양계"
            description="실제 태양계의 크기와 움직임을 시뮬레이션한 작품"
          />
          <ProjectCard
            href="/webgl/suika-game"
            title="수박 만들기"
            description="물리 엔진을 활용한 수박 게임 모작"
          />
          <ProjectCard
            href="/webgl/explosion"
            title="3D 빅뱅 애니메이션"
            description="빅뱅 애니메이션 만들기"
          />
          <ProjectCard
            href="/webgl/circles"
            title="2D 서클들"
            description="하나의 궤도에 여러 서클 만들기"
          />
          <ProjectCard
            href="/webgl/star-topology"
            title="성형 토폴로지"
            description="성형 토폴로지 만들기"
          />
        </div>
      </div>
    </main>
  )
}

function ProjectCard({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="block p-6 rounded-lg bg-black hover:bg-neutral-950
                 transform hover:-translate-y-1 transition-all duration-300
                 border border-gray-700 hover:border-gray-600"
    >
      <h2 className="text-xl font-semibold mb-3 text-white">{title}</h2>
      <p className="text-white text-sm">{description}</p>
    </Link>
  )
}
