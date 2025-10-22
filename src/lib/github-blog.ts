import { BlogPost } from './blog'

const GITHUB_REPO_OWNER = 'daiboom'
const GITHUB_REPO_NAME = 'daiboom.github.io'
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`
const POSTS_DIR = 'src/content/posts'

export class GitHubBlogStorage {
  private static getAuthHeaders() {
    const token = process.env.PAGES_TOKEN
    if (!token) {
      console.log('GitHub Token이 없습니다. API 호출이 실패할 수 있습니다.')
    }
    return {
      Authorization: token ? `token ${token}` : '',
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }
  }

  // 마크다운 파일에서 메타데이터 파싱
  private static parseMarkdownContent(content: string): {
    frontmatter: Record<string, any>
    body: string
  } {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)

    if (!match) {
      return { frontmatter: {}, body: content }
    }

    const frontmatterText = match[1]
    const body = match[2]

    const frontmatter: Record<string, any> = {}
    frontmatterText.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim()
        if (value.startsWith('[') && value.endsWith(']')) {
          // 배열 파싱
          frontmatter[key.trim()] = value
            .slice(1, -1)
            .split(',')
            .map((item) => item.trim().replace(/['"]/g, ''))
        } else if (value === 'true' || value === 'false') {
          // 불린 파싱
          frontmatter[key.trim()] = value === 'true'
        } else {
          // 문자열 파싱
          frontmatter[key.trim()] = value.replace(/['"]/g, '')
        }
      }
    })

    return { frontmatter, body }
  }

  // 마크다운 파일 생성
  private static createMarkdownContent(post: BlogPost): string {
    const frontmatter = `---
title: "${post.title}"
description: "${post.description}"
author: "${post.author}"
date: "${post.date}"
publishedAt: "${post.publishedAt}"
updatedAt: "${post.updatedAt}"
tags: [${post.tags.map((tag) => `"${tag}"`).join(', ')}]
category: "${post.category}"
slug: "${post.slug}"
readTime: ${post.readTime}
featured: ${post.featured}
---

${post.content}`

    return frontmatter
  }

  // GitHub Contents API에서 블로그 포스트 가져오기
  static async getPosts(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/contents/${POSTS_DIR}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`)
      }

      const files = await response.json()
      const markdownFiles = files.filter((file: any) =>
        file.name.endsWith('.md')
      )

      const posts: BlogPost[] = []

      for (const file of markdownFiles) {
        try {
          const fileResponse = await fetch(file.download_url, {
            headers: this.getAuthHeaders(),
          })

          if (fileResponse.ok) {
            const content = await fileResponse.text()
            const { frontmatter, body } = this.parseMarkdownContent(content)

            posts.push({
              id: file.name.replace('.md', ''),
              title: frontmatter.title || 'Untitled',
              description: frontmatter.description || '',
              content: body,
              author: frontmatter.author || 'daiboom',
              date: frontmatter.date || frontmatter.publishedAt || '',
              publishedAt: frontmatter.publishedAt || frontmatter.date || '',
              updatedAt: frontmatter.updatedAt || frontmatter.date || '',
              tags: frontmatter.tags || [],
              category: frontmatter.category || 'Programming',
              slug: frontmatter.slug || file.name.replace('.md', ''),
              readTime: frontmatter.readTime || 1,
              featured: frontmatter.featured || false,
            })
          }
        } catch (error) {
          console.error(`Failed to fetch file ${file.name}:`, error)
        }
      }

      return posts.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } catch (error) {
      console.error('Failed to fetch posts from GitHub:', error)
      return []
    }
  }

  // GitHub Contents API로 새 포스트 생성
  static async createPost(post: BlogPost): Promise<boolean> {
    try {
      const fileName = `${post.slug}.md`
      const content = this.createMarkdownContent(post)
      const encodedContent = btoa(unescape(encodeURIComponent(content)))

      const response = await fetch(
        `${GITHUB_API_BASE}/contents/${POSTS_DIR}/${fileName}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            message: `Add blog post: ${post.title}`,
            content: encodedContent,
            branch: 'main',
          }),
        }
      )

      return response.ok
    } catch (error) {
      console.error('Failed to create post on GitHub:', error)
      return false
    }
  }

  // GitHub Contents API로 포스트 수정
  static async updatePost(post: BlogPost): Promise<boolean> {
    try {
      const fileName = `${post.slug}.md`
      const content = this.createMarkdownContent(post)
      const encodedContent = btoa(unescape(encodeURIComponent(content)))

      // 먼저 기존 파일의 SHA를 가져와야 함
      const getFileResponse = await fetch(
        `${GITHUB_API_BASE}/contents/${POSTS_DIR}/${fileName}`,
        {
          headers: this.getAuthHeaders(),
        }
      )

      if (!getFileResponse.ok) {
        throw new Error('File not found')
      }

      const fileData = await getFileResponse.json()

      const response = await fetch(
        `${GITHUB_API_BASE}/contents/${POSTS_DIR}/${fileName}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            message: `Update blog post: ${post.title}`,
            content: encodedContent,
            sha: fileData.sha, // 기존 파일의 SHA 필요
            branch: 'main',
          }),
        }
      )

      return response.ok
    } catch (error) {
      console.error('Failed to update post on GitHub:', error)
      return false
    }
  }

  // GitHub Contents API로 포스트 삭제
  static async deletePost(postId: string): Promise<boolean> {
    try {
      const fileName = `${postId}.md`

      // 먼저 기존 파일의 SHA를 가져와야 함
      const getFileResponse = await fetch(
        `${GITHUB_API_BASE}/contents/${POSTS_DIR}/${fileName}`,
        {
          headers: this.getAuthHeaders(),
        }
      )

      if (!getFileResponse.ok) {
        throw new Error('File not found')
      }

      const fileData = await getFileResponse.json()

      const response = await fetch(
        `${GITHUB_API_BASE}/contents/${POSTS_DIR}/${fileName}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            message: `Delete blog post: ${postId}`,
            sha: fileData.sha, // 기존 파일의 SHA 필요
            branch: 'main',
          }),
        }
      )

      return response.ok
    } catch (error) {
      console.error('Failed to delete post on GitHub:', error)
      return false
    }
  }

  // 포스트 디렉토리 초기화 (첫 실행 시)
  static async initializePostsDirectory(): Promise<boolean> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/contents/${POSTS_DIR}`, {
        headers: this.getAuthHeaders(),
      })

      // 디렉토리가 이미 존재하면 성공
      if (response.ok) {
        return true
      }

      // 디렉토리가 없으면 README 파일로 생성
      if (response.status === 404) {
        const readmeContent = btoa(
          unescape(
            encodeURIComponent(
              '# Blog Posts\n\nThis directory contains blog post markdown files.'
            )
          )
        )

        const createResponse = await fetch(
          `${GITHUB_API_BASE}/contents/${POSTS_DIR}/README.md`,
          {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
              message: 'Initialize blog posts directory',
              content: readmeContent,
              branch: 'main',
            }),
          }
        )

        return createResponse.ok
      }

      return false
    } catch (error) {
      console.error('Failed to initialize posts directory:', error)
      return false
    }
  }
}
