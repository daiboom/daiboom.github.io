import { BlogComment } from './blog'

const GITHUB_OWNER = 'daiboom'
const GITHUB_REPO = 'daiboom.github.io'

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string
  user: {
    login: string
    avatar_url: string
    html_url: string
  }
  created_at: string
  updated_at: string
  comments_url: string
  state: 'open' | 'closed'
  labels: Array<{
    name: string
    color: string
  }>
}

export interface GitHubComment {
  id: number
  body: string
  user: {
    login: string
    avatar_url: string
    html_url: string
  }
  created_at: string
  updated_at: string
}

// GitHub Issues API에서 댓글 가져오기
export async function getCommentsForPost(postTitle: string): Promise<BlogComment[]> {
  try {
    // 1. 해당 포스트와 관련된 Issue 찾기
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=all&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'daiboom-blog'
        }
      }
    )

    if (!issuesResponse.ok) {
      console.error('GitHub API error:', issuesResponse.status)
      return []
    }

    const issues: GitHubIssue[] = await issuesResponse.json()
    
    // 2. 포스트 제목과 매칭되는 Issue 찾기
    const matchingIssue = issues.find(issue => 
      issue.title.includes(`댓글: ${postTitle}`) || 
      issue.title.includes(postTitle)
    )

    if (!matchingIssue) {
      console.log(`No matching issue found for post: ${postTitle}`)
      return []
    }

    // 3. Issue의 댓글들 가져오기
    const commentsResponse = await fetch(matchingIssue.comments_url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'daiboom-blog'
      }
    })

    if (!commentsResponse.ok) {
      console.error('GitHub Comments API error:', commentsResponse.status)
      return []
    }

    const comments: GitHubComment[] = await commentsResponse.json()

    // 4. GitHub 댓글을 블로그 댓글 형식으로 변환
    return comments.map(comment => ({
      id: comment.id,
      body: comment.body,
      user: comment.user,
      created_at: comment.created_at,
      updated_at: comment.updated_at
    }))

  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

// 특정 포스트의 댓글 수 가져오기
export async function getCommentCountForPost(postTitle: string): Promise<number> {
  const comments = await getCommentsForPost(postTitle)
  return comments.length
}

// 모든 포스트의 댓글 수 가져오기
export async function getAllCommentCounts(): Promise<Record<string, number>> {
  try {
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=all&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'daiboom-blog'
        }
      }
    )

    if (!issuesResponse.ok) {
      return {}
    }

    const issues: GitHubIssue[] = await issuesResponse.json()
    const commentCounts: Record<string, number> = {}

    // 각 Issue의 댓글 수 계산
    for (const issue of issues) {
      if (issue.title.includes('댓글:')) {
        const postTitle = issue.title.replace('댓글: ', '').trim()
        commentCounts[postTitle] = issue.comments || 0
      }
    }

    return commentCounts
  } catch (error) {
    console.error('Error fetching comment counts:', error)
    return {}
  }
}

// 댓글 작성 URL 생성
export function getCommentUrl(postTitle: string): string {
  const issueTitle = `댓글: ${postTitle}`
  const issueBody = `포스트: ${postTitle}\n\n댓글을 작성해주세요:`
  
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`
}
