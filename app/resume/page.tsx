'use client'

import {
  Box,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Spacer,
  SystemStyleObject,
  Tag,
  Text,
  UnorderedList,
} from '@chakra-ui/react'

interface Project {
  title: string
  description: string
  worklist: string[]
  startDate: string
  endDate: string
  skills: string[]
}

interface CareerData {
  companyName: string
  role: string
  jobType: string
  position: string
  years: number
  responsibilty: string
  description: string
  department: string
  startDate: string
  endDate: string
  projects: Project[]
}

const careerDatas: CareerData[] = [
  {
    companyName: '어바웃피싱',
    role: '프론트엔드 개발자',
    jobType: '정규직',
    years: 2,
    position: '사원',
    responsibilty: '팀원',
    department: '개발부문',
    description: '낚시 커뮤니티 앱',
    startDate: '22. 06',
    endDate: '재직중',
    projects: [
      {
        title: '백오피스',
        description: '어바웃피싱 운영을 위한 관리자 사이트입니다.',
        worklist: [
          '회원 및 게시물, 리워드 관리 기능 등 서비스에 필요한 관리자 화면 개발',
        ],
        startDate: '22. 06',
        endDate: '진행중',
        skills: [
          'Nuxt2',
          'SCSS',
          'graphql',
          'RESTful API',
          'Docker',
          'ESLint',
          'Prettier',
          'PropTypes',
          'Typscript',
        ],
      },
      {
        title: '앱브릿지',
        description: '웹뷰용 웹인 앱브릿지 페이지입니다.',
        worklist: [
          '앱내 게시판 개발',
          '이벤트 상세페이지 및 이벤트 신청서 개발',
          '매거진 상세페이지 개발',
        ],
        startDate: '22. 10',
        endDate: '진행중',
        skills: [
          'Next13',
          'SCSS',
          'graphql',
          'RESTful API',
          'Docker',
          'ESLint',
          'Prettier',
          'Typscript',
        ],
      },
    ],
  },
  {
    companyName: '솔트룩스',
    role: '프론트엔드 개발자',
    jobType: '정규직',
    years: 1,
    position: '책임',
    responsibilty: '팀원',
    department: 'AI Labs',
    description: '',
    startDate: '21. 11',
    endDate: '22. 05',
    projects: [
      {
        title: '통합인증프레임워크 클라이언트',
        description: 'SSO 기술 사용하여 자사 솔루션 내 인증 서버입니다.',
        worklist: ['프론트엔드 코어 개발', '인증 과정 설계'],
        startDate: '21. 11',
        endDate: '22. 05',
        skills: [
          'vue-cli',
          'vue-router',
          'vuex',
          'RESTful API',
          'SCSS',
          'Docker',
          'ESLint',
          'Prettier',
          'PropTypes',
          'Git',
          'GitLab',
        ],
      },
      {
        title: 'KentV 클라이언트',
        description:
          'Table QA 기술을 기반으로 제작된 KenV 엔진의 클라이언트입니다. OCR 저작도구로 사용자가 선택한 영역 내 문자를 추출할 수 있도록 지원하는 제품입니다.',
        worklist: [
          '프론트엔드 코어 개발',
          'KenV엔진의 지도 학습을 위한 화면 개발',
          'OCR 추출을 위한 사용자 화면 개발',
        ],
        startDate: '21. 11',
        endDate: '22. 05',
        skills: [
          'vue-cli',
          'vue-router',
          'vuex',
          'RESTful API',
          'SCSS',
          'Docker',
          'ESLint',
          'Prettier',
          'PropTypes',
          'Git',
          'GitLab',
        ],
      },
    ],
  },
  {
    companyName: '(주)에스넷시스템즈',
    role: '프론트엔드 개발자',
    jobType: '정규직',
    years: 3,
    position: '대리',
    responsibilty: '팀원',
    description: '',
    department: '오감지능연구소',
    startDate: '19.09',
    endDate: '21.10',
    projects: [
      {
        title: '클라우드허브',
        description: `온프레미스 및 하이브리드 클라우드 등의 서버를 모니터링하고 제어할 수 있도록 설계된 제품입니다.`,
        worklist: [
          '서버의 상태, 리소스, 네트워크를 시각화하고 관리, 점검, 제어하는 화면개발',
          '인프라에 설치하는 Agent를 설정하고 관리할 수 있는 화면개발',
          '자사 내 타 솔루션을 관제하는 화면 개발',
          '웹에서 ssh 접속을 할 수 있도록 웹 콘솔을 개발',
        ],
        startDate: '',
        endDate: '',
        skills: [
          'React',
          'React-Router',
          'Redux',
          'Redux-Thunk',
          'Redux-Saga',
          'SCSS',
          'Parcel',
          'RESTful API',
          'graphql',
          'SALTSTACK',
          'TICKSTACK',
          'Docker',
          'Kubernates',
          'Prettier',
          'ESLint',
          'Babel',
          'D3',
          'mxgraph',
          'Xterm',
          'Axios',
          'Golang',
          'Python3',
          'Typescript',
          'Git',
          'GitHub',
          'Notion',
          'Confluence',
          'CentOS7',
          'Swagger',
          'WebSocket',
        ],
      },
    ],
  },
  {
    companyName: '(주)티디에이치 컴퍼니',
    role: '프론트엔드 개발자',
    jobType: '정규직',
    years: 2,
    position: '사원',
    responsibilty: '팀원',
    description: '남성 빅사이즈 쇼핑몰',
    department: '웹부문',
    startDate: '17.11',
    endDate: '19.08',
    projects: [
      {
        title: '오까네',
        description:
          '남성 빅사이즈 쇼핑몰입니다. Makeshop의 상점 서비스를 활용되었습니다. ',
        worklist: ['자사몰 유지보수'],
        startDate: '',
        endDate: '',
        skills: ['Makeshop', 'HTML5', 'CSS2', 'jQuery2'],
      },
      {
        title: '어드민 대시보드',
        description:
          '오까네 관리자용 대시보드입니다. 조회수, 판매수, 장바구니수 등 다양한 측정값들을 사용해 지표를 생성하고, 시각화하였습니다.',
        worklist: ['Makeshop API&외부 서비스 API를 활용하여 대시보드 구성'],
        startDate: '',
        endDate: '',
        skills: ['Makeshop', 'HTML5', 'CSS2', 'jQuery2', 'RESTful API', 'VUE2'],
      },
    ],
  },
  {
    companyName: '(주)나성I&T',
    role: '프론트엔드 개발자',
    jobType: '정규직',
    years: 1,
    position: '사원',
    responsibilty: '팀원',
    description: '자사몰 유지보수',
    startDate: '16.11',
    department: '웹부문',
    endDate: '17.10',
    projects: [
      {
        title: 'LIBBAM',
        description: '여성 랩원피스 브랜드',
        worklist: ['자사몰 유지보수'],
        startDate: '',
        endDate: '',
        skills: ['CAFE24', 'HTML5', 'CSS2', 'jQuery2'],
      },
      {
        title: 'OUTRUE',
        description: '애슬레져 브랜드',
        worklist: ['자사몰 유지보수'],
        startDate: '',
        endDate: '',
        skills: ['CAFE24', 'HTML5', 'CSS2', 'jQuery2'],
      },
      {
        title: 'SOCCER1004',
        description: '축구용품 직구몰',
        worklist: ['자사몰 유지보수'],
        startDate: '',
        endDate: '',
        skills: ['WordPress', 'PHP', 'WooCommerce', 'jQuery2', 'HTML', 'CSS2'],
      },
    ],
  },
  {
    companyName: '성은상사',
    role: '콘텐츠 기획 및 디자이너',
    jobType: '상주 프리랜서',
    years: 3,
    position: '대리',
    responsibilty: '팀원',
    description:
      '시나리오, 만화, 웹툰 등 콘텐츠 기반 제품을 제작하고, 콘텐츠 컨설팅을 하는 디자인회사입니다.',
    department: '디자인기획',
    startDate: '13.01',
    endDate: '16.01',
    projects: [
      {
        title: '장르소설 출판 디자인',
        description:
          '마야&마루, 발해, 동아, 러브스토리, 뿔미디어, 로크미디어, 인타임, 데일리북스 등등 다양한 출판사와 작업에 대응',
        worklist: ['표지, 내지, 마감 작업 등 300권 이상 작업'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator'],
      },
      {
        title: 'FLYBAG 총판수주 및 런칭, 브랜드 현지화',
        description:
          '일본잡화전문기업 BRUSH UP STANDARD의 FLY BAG 브랜드를 국내 총판수주하여, 국내 굴지의 백화점에서 팝업스토어 진행',
        worklist: [
          '국내에 맞는 브랜드 아이덴티티 구축 및 디자인 가이드 수립',
          '브로셔, 리플렛, 포스터 등 사인물 제작',
          '브랜드 웹사이트 디자인',
          '브랜드 웹사이트 구축',
          '판매 및 C/S',
        ],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator'],
      },
      {
        title: '건담 챠지 토이',
        description:
          '디즈니 사에서 건담 라이센싱을 받은 정식 제품으로 큐브형 스마트폰 충전 케이블에 장난감 머리를 조합한 제품입니다.',
        worklist: ['시안 및 상세도안 작업', '목업 생산', '프로토타입 제작'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator', '3Ds Max', 'PPT', 'Excel'],
      },
      {
        title: '독도를 지킨 33인의 영웅 애니메이션',
        description: '독도 의용군을 소재로한 교육용 애니메이션',
        worklist: [
          '시나리오 제작',
          '콘티 작성',
          '애니메이션 검수',
          '치킨마루 납품',
        ],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'PPT'],
      },
      {
        title: '독도 AR 콘텐츠 기획',
        description: '독도 교육용 AR 콘텐츠',
        worklist: [
          '독도 역사 자료수집',
          '독도 생태 자료수집',
          '독도 및 독도 내 시설 3D 모델링',
          '주요 생태계 표본을 3D 모델링',
        ],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'PPT', '3Ds Max'],
      },
      {
        title: '공룡 AR 콘텐츠 기획',
        description: '공룡 교육용 AR 콘텐츠',
        worklist: [
          '생태계 역사 박물관 등 AR을 즐길 수 있는 마커를 설치하여 관객들의  흥미를 유발하고, 정보를 제공하는 서비스를 기획',
          '제공 서비스 기획',
        ],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator'],
      },
      {
        title: 'JHcommerce 비즈니스 웹사이트',
        description: '일본 무역하는 JHcommerce 사의 비즈니스 웹사이트',
        worklist: ['웹디자인', '퍼블리싱'],
        startDate: '',
        endDate: '',
        skills: ['HTML', 'CSS2', 'jQuery2'],
      },
      {
        title: '프리미엄 스마트폰 가죽케이스 ',
        description: '프리미엄 스마트폰 케이스 제품을 기획, 판매하였습니다.',
        worklist: ['시안 제작', '도쿄 한큐 백화점 납품'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator'],
      },
      {
        title: '리볼텍 단보 보조 배터리 가죽케이스',
        description:
          '일본 유명 캐릭터 단보 모양의 보조배터리 가죽 케이스 제작, 시제품',
        worklist: ['시안 제작', '시제품'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator'],
      },
      {
        title: '티롤 초코 케이스',
        description:
          '일본 유명한 티롤 초코의 초콜릿 가죽케이스 제작 및 납품(일본 유명 잡지에 게재)',
        worklist: ['시안 제작', '목업 제작', '도쿄 한큐 백화점 납품'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator'],
      },
      {
        title: '브리프케이스 가방디자인',
        description: '건축도면용 브리프케이스 제작',
        worklist: ['시안 제작'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator'],
      },
      {
        title: '시나리오 반려의마음',
        description:
          '사람에겐 까칠하고 불친절한 수의사 조재호, 그는 특별한 능력으로 동물들을 치료해준다. 라는 시나리오',
        worklist: ['시나리오 구체화', '연계사업 발굴'],
        startDate: '',
        endDate: '',
        skills: ['hwp'],
      },
      {
        title: '웹툰 반려의마음(NHN 코미코)',
        description: '반려의 마음 시나리오를 기반으로한 웹툰',
        worklist: [
          '시나리오 구체화',
          '등장인물 시각화 기획',
          '연계사업 발굴',
          '달력, 스티커 등 인쇄물 굿즈 제작',
        ],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator'],
      },
      {
        title: '프리미엄 가죽으로 만든 반려견 용품 제작',
        description: '반려동물 용품 제작, 판매',
        worklist: ['시안 제작', '시제품 도출', '코리안펫쇼 참가'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator'],
      },
      {
        title: '웹툰 붉은점(카카오페이지)',
        description:
          '사람의 죽음을 암시하는 이마의 붉은 점을 볼 수 있는 한 사람의 저주를 헤쳐나가는 이야기',
        worklist: ['시나리오 구체화', '연계사업 발굴'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator', 'PPT'],
      },
      {
        title: '모바일 추리게임 붉은점',
        description: '시나리오 붉은 점을 기반으로한 추리게임',
        worklist: ['게임 기획', 'UI/UX 디자인'],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator'],
      },
      {
        title: '백진강 출판전',
        description: '설재록 작가의 백진강 소설 출판전 디자인 총괄',
        worklist: [
          '출판 기획',
          '표지 및 내지 디자인',
          '기타 시안물 디자인 총괄',
        ],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator'],
      },
    ],
  },
]

const uniq = (strings: string[]) => {
  const cache: Record<string, string> = {}
  for (let i = 0; i < strings.length; i++) {
    if (!Object.hasOwn(cache, strings[i].toLowerCase())) {
      cache[strings[i]] = ''
    }
  }

  return Object.keys(cache)
}

const skills: string[] = uniq(
  careerDatas.reduce((prev: string[], curr: CareerData) => {
    const s: string[] = curr.projects.reduce((prevP: string[], currP) => {
      return [...prevP, ...currP.skills]
    }, [])
    return [...prev, ...s]
  }, [])
)

const SkillTag = ({ skill }: { skill: string }) => {
  return (
    <Tag key={skill} sx={{ background: '#191919', color: '#fbfbfb' }}>
      {skill}
    </Tag>
  )
}

interface CareerProps {
  career: CareerData
  index: number
}

type CareerFC = (props: CareerProps) => JSX.Element

const Career: CareerFC = ({ career, index }) => {
  const styles = {
    heading5: {
      mb: '5px',
    },
  }
  return (
    <Box sx={{ mt: '25px', mb: '35px' }}>
      <Flex sx={{ alignItems: 'center', mb: '15px', opacity: 0.7 }}>
        <Tag
          sx={{
            bg: 'indianred',
            color: '#fff',
            rounded: 'full',
            aspectRatio: '1',
          }}
          size="sm"
        >
          {index + 1}
        </Tag>
        <Divider sx={{ border: '1px solid indianred' }} />
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading as="h3" size="md">
          {career.companyName}
        </Heading>
        <Heading as="h4" size="sm">
          {career.startDate} ~ {career.endDate}
        </Heading>
      </Flex>

      <Text sx={{ mt: '15px', mb: '15px' }}>{career.description}</Text>
      <Heading as="h4" size="sm" sx={{ mt: '15px', mb: '15px' }}>
        {career.department}({career.responsibilty}, {career.position},{' '}
        {career.years}년차)
      </Heading>
      {/* <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading as="h4" size="sm">
          {career.role}
        </Heading>
        <Heading as="h4" size="sm">
          {career.jobType}
        </Heading>
      </Flex> */}
      <Heading as="h4" size="sm" sx={{ mt: '15px', mb: '15px' }}>
        참여 프로젝트
      </Heading>
      {career.projects.map((project, i) => {
        return (
          <Box key={project.title} sx={{ mt: '15px', mb: '15px', ml: '15px' }}>
            {i > 0 ? <Divider my={'15px'} /> : null}
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Flex sx={{ alignItems: 'center', ...styles.heading5 }}>
                <Heading as="h5" size="sm">
                  {i + 1}) {project.title}
                </Heading>
              </Flex>
            </Flex>
            <Text sx={styles.heading5}>{project.description}</Text>
            <Spacer h={'20px'} />
            <Heading as="h5" size="sm" sx={{ ...styles.heading5 }}>
              작업내역
            </Heading>
            <UnorderedList sx={{ marginInlineStart: '1.5rem' }}>
              {project.worklist.map((work) => (
                <ListItem key={work}>{work}</ListItem>
              ))}
            </UnorderedList>
            <Spacer h={'20px'} />
            <Heading as="h5" size="sm" sx={styles.heading5}>
              사용기술
            </Heading>
            <Flex sx={{ gap: '5px', flexWrap: 'wrap' }}>
              {project.skills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </Flex>
          </Box>
        )
      })}
    </Box>
  )
}

const About = () => {
  const styles: Record<string, SystemStyleObject> = {
    heading2: {
      mt: '5px',
      mb: '5px',
      color: '#191919',
    },
    divider: {
      my: '15px',
    },
  }
  return (
    <Box>
      <Heading as="h1" size="md" sx={styles.heading2}>
        최대범. Choe DaeBeom
      </Heading>
      <Divider sx={styles.divider} />
      <Text>
        연락처: 010-9775-4920 <br />
        이메일: chleoqja1760@gmail.com <br />
      </Text>
      <Divider sx={styles.divider} />
      <Heading as="h2" size="md" sx={styles.heading2}>
        핵심역량
      </Heading>
      <List>
        <ListItem>
          React, Redux, React-Router, Typescript, SCSS, HTTP, WebSocket에 대한
        </ListItem>
        <ListItem>
          이해와 RESTful API, graphQL 사용하여 비동기 개발 CSS방법론(BEM), 코딩
        </ListItem>
        <ListItem>
          컨벤션, Git, 등 표준에 가까운 협업중심의 업무스타일 서버를 이해하여
        </ListItem>
        <ListItem> 프론트엔드 개발이 원활함 섬세한 에러처리</ListItem>
      </List>
      <Divider sx={styles.divider} />
      <Heading as="h2" size="md" sx={styles.heading2}>
        보유기술
      </Heading>
      <Box>
        <Flex sx={{ gap: '5px', flexWrap: 'wrap' }}>
          {skills.map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
        </Flex>
      </Box>
      <Divider sx={styles.divider} />
      <Heading as="h2" size="md" sx={styles.heading2}>
        학력사항
      </Heading>
      <Box>
        <Text>
          방송통신대학교/첨단공학과/인공지능학과/2021. 03 ~ 2024.02(졸업예정)
        </Text>
        <Text>
          광주송원대학/컴퓨터공학과/게임영상콘텐츠학과/2011. 03 ~ 2015.02(졸업)
        </Text>
      </Box>
      <Divider sx={styles.divider} />
      <Heading as="h2" size="md" sx={styles.heading2}>
        병역사항
      </Heading>
      <Box>
        <Text>해병대 병장 만기전역/2011.04.04 ~ 2013.01.03</Text>
      </Box>
      <Divider sx={styles.divider} />
      <Heading as="h2" size="md" sx={styles.heading2}>
        자격사항
      </Heading>
      <Box>
        <Text>정보처리기사 / 한국산업인력공단 / 2019. 11. 22</Text>
        <Text>운전면허증(1종 보통) / 한국산업인력공단 / 2013. 03. 22</Text>
      </Box>
      <Divider sx={styles.divider} />
      <Heading as="h2" size="md" sx={styles.heading2}>
        경력내역
      </Heading>
      <Box>
        {careerDatas.map((career, i) => (
          <Career key={career.companyName} career={career} index={i} />
        ))}
      </Box>
    </Box>
  )
}

export default About
