import { BlogPost } from './blog'

// 로컬 스토리지에서 블로그 포스트 관리
export class BlogStorage {
  private static readonly STORAGE_KEY = 'blog_posts'

  // 모든 포스트 가져오기
  static getPosts(): BlogPost[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load posts from storage:', error)
      return []
    }
  }

  // 포스트 저장하기
  static savePosts(posts: BlogPost[]): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts))
    } catch (error) {
      console.error('Failed to save posts to storage:', error)
    }
  }

  // 포스트 추가
  static addPost(post: BlogPost): void {
    const posts = this.getPosts()
    posts.push(post)
    this.savePosts(posts)
  }

  // 포스트 업데이트
  static updatePost(updatedPost: BlogPost): void {
    const posts = this.getPosts()
    const index = posts.findIndex((post) => post.id === updatedPost.id)
    if (index !== -1) {
      posts[index] = updatedPost
      this.savePosts(posts)
    }
  }

  // 포스트 삭제
  static deletePost(id: string): void {
    const posts = this.getPosts()
    const filteredPosts = posts.filter((post) => post.id !== id)
    this.savePosts(filteredPosts)
  }

  // 포스트 ID로 찾기
  static getPostById(id: string): BlogPost | undefined {
    const posts = this.getPosts()
    return posts.find((post) => post.id === id)
  }

  // 슬러그로 포스트 찾기
  static getPostBySlug(slug: string): BlogPost | undefined {
    const posts = this.getPosts()
    return posts.find((post) => post.slug === slug)
  }

  // 초기 데이터 설정 (샘플 포스트가 없을 때)
  static initializeWithSampleData(samplePosts: BlogPost[]): void {
    const existingPosts = this.getPosts()
    if (existingPosts.length === 0) {
      this.savePosts(samplePosts)
    }
  }
}
