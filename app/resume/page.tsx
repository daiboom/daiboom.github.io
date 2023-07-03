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
    position: '사원',
    responsibilty: '팀원',
    department: '개발부문',
    description: '낚시 커뮤니티 앱',
    startDate: '22. 06',
    endDate: '재직중',
    projects: [
      {
        title: '앱브릿지',
        description: '앱과 웹을 연결하는 프로덕트',
        worklist: [],
        startDate: '22. 10',
        endDate: '',
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
      {
        title: '백오피스',
        description: '어바웃피싱 앱의 어드민입니다.',
        worklist: [],
        startDate: '22. 06',
        endDate: '',
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
    ],
  },
  {
    companyName: '솔트룩스',
    role: '프론트엔드 개발자',
    jobType: '정규직',
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
        worklist: [],
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
          'Table QA 기술을 기반으로 한 KenV 엔진의 클라이언트입니다. 사용자가 선택한 영역 내 문자를 추출할 수 있도록 지원하는 제품입니다.',
        worklist: [],
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
    position: '사원',
    responsibilty: '팀원',
    description: '남성 빅사이즈 쇼핑몰',
    department: '웹부문',
    startDate: '17.11',
    endDate: '19.08',
    projects: [
      {
        title: '오까네',
        description: '',
        worklist: [],
        startDate: '',
        endDate: '',
        skills: ['Makeshop', 'HTML5', 'CSS2', 'jQuery2'],
      },
      {
        title: '백오피스',
        description: '',
        worklist: [],
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
    position: '사원',
    responsibilty: '팀원',
    description: '자사몰 유지보수',
    startDate: '16.11',
    department: '웹부문',
    endDate: '17.10',
    projects: [
      {
        title: 'LIBBAM',
        description: '',
        worklist: [],
        startDate: '',
        endDate: '',
        skills: ['CAFE24', 'HTML5', 'CSS2', 'jQuery2'],
      },
      {
        title: 'OUTRUE',
        description: '',
        worklist: [],
        startDate: '',
        endDate: '',
        skills: ['CAFE24', 'HTML5', 'CSS2', 'jQuery2'],
      },
      {
        title: 'SOCCER1004',
        description: '',
        worklist: [],
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
    position: '대리',
    responsibilty: '팀원',
    description: '',
    department: '디자인기획',
    startDate: '13.01',
    endDate: '16.01',
    projects: [
      {
        title: '장르소설 출판 디자인',
        description: '',
        worklist: [],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator'],
      },
      {
        title: '사인물 디자인',
        description: '',
        worklist: [],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Indesign', 'Illustrator'],
      },
      {
        title: '건담 챠지 토이',
        description: '',
        worklist: [],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator', '3D Max'],
      },
      {
        title: '티로리 초코 케이스',
        description: '',
        worklist: [],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator'],
      },
      {
        title: '브리프케이스 가방디자인',
        description: '',
        worklist: [],
        startDate: '',
        endDate: '',
        skills: ['Photoshop', 'Illustrator'],
      },
      {
        title: '백진강 출판전',
        description: '',
        worklist: [],
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
        {career.department}({career.responsibilty}, {career.position})
      </Heading>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading as="h4" size="sm">
          {career.role}
        </Heading>
        <Heading as="h4" size="sm">
          {career.jobType}
        </Heading>
      </Flex>
      <Heading as="h4" size="sm" sx={{ mt: '15px', mb: '15px' }}>
        참여 프로젝트
      </Heading>
      {career.projects.map((project, i) => {
        return (
          <Box key={project.title} sx={{ mt: '15px', mb: '15px' }}>
            {i > 0 ? <Divider my={'15px'} /> : null}
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Flex sx={{ alignItems: 'center', ...styles.heading5 }}>
                <Heading as="h5" size="sm">
                  {project.title}
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
