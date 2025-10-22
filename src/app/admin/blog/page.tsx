'use client'

import { BlogPost, samplePosts } from '@/lib/blog'
import { BlogStorage } from '@/lib/blog-storage'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // 컴포넌트 마운트 시 포스트 로드 및 토큰 검증
  useEffect(() => {
    const loadPosts = () => {
      BlogStorage.initializeWithSampleData(samplePosts)
      const storedPosts = BlogStorage.getPosts()
      setPosts(storedPosts)
    }
    loadPosts()

    // 토큰 검증
    const verifyToken = async () => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        try {
          const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          })

          const data = await response.json()
          if (data.success) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('admin_token')
          }
        } catch (error) {
          console.error('Token verification error:', error)
          localStorage.removeItem('admin_token')
        }
      }
    }

    verifyToken()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setPassword('')
  }

  // 환경변수에서 비밀번호 가져오기
  const getAdminPassword = () => {
    // 클라이언트 사이드에서는 환경변수 접근 제한
    // 실제로는 서버 사이드에서 처리하거나 더 안전한 방법 사용
    return process.env.NEXT_PUBLIC_PAGES_ADMIN_PASSWORD || 'admin123'
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        // 토큰을 로컬 스토리지에 저장 (실제로는 더 안전한 방법 사용)
        localStorage.setItem('admin_token', data.token)
      } else {
        alert(data.message || '비밀번호가 틀렸습니다.')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('로그인 중 오류가 발생했습니다.')
    }
  }

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: '',
      description: '',
      content: '',
      author: 'daiboom',
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [],
      category: 'Frontend',
      slug: '',
      readTime: 1,
      featured: false,
    }
    setEditingPost(newPost)
    setIsCreating(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post })
    setIsCreating(false)
  }

  const handleDeletePost = (id: string) => {
    if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
      BlogStorage.deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
    }
  }

  const handleSavePost = () => {
    if (!editingPost) return

    // slug 자동 생성
    if (!editingPost.slug) {
      editingPost.slug = editingPost.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, '')
        .replace(/\s+/g, '-')
    }

    if (isCreating) {
      BlogStorage.addPost(editingPost)
      setPosts([...posts, editingPost])
    } else {
      BlogStorage.updatePost(editingPost)
      setPosts(
        posts.map((post) => (post.id === editingPost.id ? editingPost : post))
      )
    }

    setEditingPost(null)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setEditingPost(null)
    setIsCreating(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">관리자 로그인</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full p-3 border rounded-md mb-4"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          >
            로그인
          </button>
        </div>
      </div>
    )
  }

  if (editingPost) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {isCreating ? '새 글 작성' : '글 수정'}
              </h1>
              <div className="space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  취소
                </button>
                <button
                  onClick={handleSavePost}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  저장
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  placeholder="글 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">설명</label>
                <textarea
                  value={editingPost.description}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-md h-20"
                  placeholder="글에 대한 간단한 설명을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    카테고리
                  </label>
                  <select
                    value={editingPost.category}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Programming">Programming</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    읽기 시간 (분)
                  </label>
                  <input
                    type="number"
                    value={editingPost.readTime}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        readTime: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 border rounded-md"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={editingPost.tags.join(', ')}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      tags: e.target.value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter((tag) => tag),
                    })
                  }
                  className="w-full p-3 border rounded-md"
                  placeholder="React, JavaScript, WebGL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  슬러그 (URL)
                </label>
                <input
                  type="text"
                  value={editingPost.slug}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, slug: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  placeholder="url-friendly-slug"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingPost.featured}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        featured: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  추천 포스트
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  내용 (Markdown)
                </label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, content: e.target.value })
                  }
                  className="w-full p-3 border rounded-md h-96 font-mono"
                  placeholder="# 제목

## 소개
여기에 마크다운으로 글 내용을 작성하세요.

## 코드 예시
\`\`\`javascript
console.log('Hello World!')
\`\`\`

## 결론
글을 마무리하세요."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">블로그 관리</h1>
          <div className="space-x-4">
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              새 글 작성
            </button>
            <button
              onClick={() => router.push('/blog')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              블로그 보기
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    발행일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    추천
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.publishedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          추천
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
