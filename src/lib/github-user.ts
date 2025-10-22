// GitHub 사용자 정보 확인

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name?: string
  email?: string
}

// GitHub API로 현재 사용자 정보 가져오기
export async function getCurrentGitHubUser(): Promise<GitHubUser | null> {
  try {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
    if (!token) {
      return null
    }

    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch GitHub user:', error)
    return null
  }
}

// 저장소 소유자인지 확인
export async function isRepositoryOwner(
  repoOwner: string = 'daiboom'
): Promise<boolean> {
  try {
    const user = await getCurrentGitHubUser()
    return user?.login === repoOwner
  } catch (error) {
    console.error('Failed to check repository ownership:', error)
    return false
  }
}
