'use client'

import { BlogPost } from '@/lib/blog'
import { HybridBlogStorage } from '@/lib/hybrid-blog'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit')
  const [isUploading, setIsUploading] = useState(false)
  const [pendingImages, setPendingImages] = useState<File[]>([])
  const router = useRouter()

  // 컴포넌트 마운트 시 포스트 로드 및 토큰 검증
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // 하이브리드 스토리지에서 포스트 로드 (GitHub 우선, 실패 시 로컬)
        const storedPosts = await HybridBlogStorage.getPosts()
        setPosts(storedPosts)
      } catch (error) {
        console.error('Failed to load posts:', error)
        // 실패 시 빈 배열로 설정
        setPosts([])
      }
    }
    loadPosts()

    // 토큰 검증 (클라이언트사이드)
    const verifyToken = async () => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        try {
          // 간단한 토큰 검증 (실제로는 더 안전한 방법 필요)
          if (token.startsWith('YWRtaW4=')) {
            // 'admin' base64 인코딩
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

  // URL 파라미터에서 편집할 포스트 자동 로드
  useEffect(() => {
    const editPostId = searchParams.get('edit')
    if (editPostId && posts.length > 0) {
      const postToEdit = posts.find((post) => post.id === editPostId)
      if (postToEdit) {
        setEditingPost({ ...postToEdit })
        setIsCreating(false)
      }
    }
  }, [searchParams, posts])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setPassword('')
  }

  // 이미지 선택 함수 (임시 저장)
  const handleImageSelect = (file: File) => {
    if (!editingPost) return

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert(
        '지원하지 않는 파일 형식입니다. JPEG, PNG, GIF, WebP만 업로드 가능합니다.'
      )
      return
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.')
      return
    }

    // 임시 이미지 ID 생성
    const tempImageId = `temp_${Date.now()}_${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      '_'
    )}`

    // 임시 이미지 URL 생성 (더 깔끔한 형태)
    const tempUrl = `[이미지: ${file.name}]`

    // 마크다운 이미지 태그 생성 (임시 플레이스홀더 사용)
    const imageMarkdown = `![${file.name}](${tempUrl})`

    // 현재 커서 위치에 이미지 삽입
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = editingPost.content
      const before = text.substring(0, start)
      const after = text.substring(end)
      const newContent = before + imageMarkdown + after

      setEditingPost({
        ...editingPost,
        content: newContent,
      })

      // 커서 위치 조정
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + imageMarkdown.length,
          start + imageMarkdown.length
        )
      }, 0)
    }

    // 임시 이미지 목록에 추가 (파일과 임시 ID 매핑)
    setPendingImages((prev) => [...prev, file])
  }

  // 실제 이미지 업로드 함수 (GitHub Contents API 직접 사용)
  const uploadImageFile = async (file: File): Promise<string> => {
    // GitHub Pages에서는 환경변수에서 토큰을 가져오고, 로컬에서는 localStorage에서 가져옴
    const token =
      process.env.NEXT_PUBLIC_GITHUB_TOKEN ||
      localStorage.getItem('admin_token')
    if (!token) {
      throw new Error(
        'GitHub 토큰이 없습니다. PAGES_TOKEN 환경변수를 설정해주세요.'
      )
    }

    // GitHub Contents API로 직접 업로드
    const arrayBuffer = await file.arrayBuffer()
    const base64Content = Buffer.from(arrayBuffer).toString('base64')

    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${originalName}`
    const filePath = `public/uploads/blog/${fileName}`

    const response = await fetch(
      `https://api.github.com/repos/daiboom/daiboom.github.io/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: `Upload image: ${fileName}`,
          content: base64Content,
          branch: 'main',
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `GitHub API error: ${errorData.message || response.statusText}`
      )
    }

    // GitHub Pages에서 접근 가능한 URL 생성
    const imageUrl = `/uploads/blog/${fileName}`
    return imageUrl
  }

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
    // 파일 입력 초기화
    event.target.value = ''
  }

  // 환경변수에서 비밀번호 가져오기
  const getAdminPassword = () => {
    // 클라이언트 사이드에서는 환경변수 접근 제한
    // 실제로는 서버 사이드에서 처리하거나 더 안전한 방법 사용
    return process.env.PAGES_ADMIN_PASSWORD || 'admin123'
  }

  const handleLogin = async () => {
    try {
      // 클라이언트사이드 인증 (GitHub Pages용)
      if (password === getAdminPassword()) {
        // 간단한 토큰 생성 (base64로 'admin' 인코딩)
        const token = btoa('admin')
        localStorage.setItem('admin_token', token)
        setIsAuthenticated(true)
        alert('로그인 성공!')
        return
      } else {
        alert('비밀번호가 올바르지 않습니다.')
        return
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

  const handleDeletePost = async (id: string) => {
    if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        const success = await HybridBlogStorage.deletePost(id)
        if (success) {
          setPosts(posts.filter((post) => post.id !== id))
        } else {
          alert('포스트 삭제에 실패했습니다.')
        }
      } catch (error) {
        console.error('Failed to delete post:', error)
        alert('포스트 삭제 중 오류가 발생했습니다.')
      }
    }
  }

  const handleSavePost = async () => {
    if (!editingPost) return

    // slug 자동 생성
    if (!editingPost.slug) {
      editingPost.slug = editingPost.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, '')
        .replace(/\s+/g, '-')
    }

    setIsUploading(true)
    try {
      let finalContent = editingPost.content

      // 임시 이미지들을 실제 업로드하고 URL 교체
      if (pendingImages.length > 0) {
        console.log('이미지 업로드 시작:', pendingImages.length, '개')

        for (const file of pendingImages) {
          try {
            const uploadedUrl = await uploadImageFile(file)
            // 임시 URL을 실제 URL로 교체 (플레이스홀더 패턴 매칭)
            const placeholderPattern = new RegExp(
              `!\\[${file.name.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
              )}]\\(\\[이미지: ${file.name.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
              )}\\]\\)`,
              'g'
            )
            finalContent = finalContent.replace(
              placeholderPattern,
              `![${file.name}](${uploadedUrl})`
            )
            console.log('이미지 업로드 완료:', file.name, '->', uploadedUrl)
          } catch (error) {
            console.error('이미지 업로드 실패:', file.name, error)
            alert(`이미지 업로드 실패: ${file.name}`)
            return
          }
        }

        // 업로드된 내용으로 포스트 업데이트
        editingPost.content = finalContent
        setPendingImages([]) // 임시 이미지 목록 초기화
      }

      let success = false
      if (isCreating) {
        success = await HybridBlogStorage.createPost(editingPost)
        if (success) {
          setPosts([...posts, editingPost])
        }
      } else {
        success = await HybridBlogStorage.updatePost(editingPost)
        if (success) {
          setPosts(
            posts.map((post) =>
              post.id === editingPost.id ? editingPost : post
            )
          )
        }
      }

      if (success) {
        setEditingPost(null)
        setIsCreating(false)
        setPendingImages([])
        alert('포스트가 성공적으로 저장되었습니다!')
      } else {
        alert('포스트 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('포스트 저장 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setEditingPost(null)
    setIsCreating(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-center">
            관리자 로그인
          </h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base font-medium"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (editingPost) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            {/* 헤더 - 반응형 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isCreating ? '새 글 작성' : '글 수정'}
              </h1>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  취소
                </button>
                <button
                  onClick={handleSavePost}
                  disabled={isUploading}
                  className={`px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                    isUploading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isUploading ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  제목
                </label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="글 제목을 입력하세요"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  설명
                </label>
                <textarea
                  value={editingPost.description}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 text-sm sm:text-base"
                  placeholder="글에 대한 간단한 설명을 입력하세요"
                />
              </div>

              {/* 카테고리와 읽기 시간 - 반응형 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Programming">Programming</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    min="1"
                  />
                </div>
              </div>

              {/* 태그 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="React, JavaScript, WebGL"
                />
              </div>

              {/* 슬러그 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  슬러그 (URL)
                </label>
                <input
                  type="text"
                  value={editingPost.slug}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, slug: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="url-friendly-slug"
                />
              </div>

              {/* 추천 포스트 체크박스 */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingPost.featured}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        featured: e.target.checked,
                      })
                    }
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  추천 포스트
                </label>
              </div>

              {/* 마크다운 에디터 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    내용 (Markdown)
                  </label>
                  <div className="flex gap-2">
                    {/* 이미지 업로드 버튼 */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <button
                        type="button"
                        disabled={isUploading}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          isUploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        📷 이미지 추가
                      </button>
                    </div>

                    {/* 뷰 모드 버튼들 */}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setViewMode('edit')}
                        className={`px-3 py-1 text-sm rounded-l-md transition-colors ${
                          viewMode === 'edit'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        편집
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('split')}
                        className={`px-3 py-1 text-sm transition-colors ${
                          viewMode === 'split'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        분할
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1 text-sm rounded-r-md transition-colors ${
                          viewMode === 'preview'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        미리보기
                      </button>
                    </div>
                  </div>
                </div>

                {viewMode === 'edit' && (
                  <textarea
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-64 sm:h-96 font-mono text-sm"
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
                )}

                {viewMode === 'preview' && (
                  <div className="w-full border border-gray-300 rounded-md h-64 sm:h-96 overflow-y-auto bg-white">
                    <div className="p-4 prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                        components={{
                          pre({ children, ...props }) {
                            return (
                              <pre
                                className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed border border-gray-700 shadow-lg"
                                {...props}
                              >
                                {children}
                              </pre>
                            )
                          },
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(className || '')

                            return !inline && match ? (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            ) : (
                              <code
                                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border border-gray-200"
                                {...props}
                              >
                                {children}
                              </code>
                            )
                          },
                          img({ src, alt, ...props }) {
                            // 임시 플레이스홀더인 경우
                            if (src && src.startsWith('[이미지:')) {
                              return (
                                <div className="my-4 text-center">
                                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mx-auto max-w-md">
                                    <div className="text-gray-500 text-center">
                                      <div className="text-4xl mb-2">📷</div>
                                      <p className="text-sm font-medium">
                                        이미지 준비 중
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {alt}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            }

                            return (
                              <div className="my-4 text-center">
                                <img
                                  src={src}
                                  alt={alt}
                                  className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 mx-auto"
                                  style={{ maxHeight: '500px' }}
                                  {...props}
                                />
                                {alt && (
                                  <p className="text-sm text-gray-600 mt-2 italic">
                                    {alt}
                                  </p>
                                )}
                              </div>
                            )
                          },
                        }}
                      >
                        {editingPost.content ||
                          '*내용이 없습니다. 마크다운을 입력해주세요.*'}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {viewMode === 'split' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-64 sm:h-96">
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 text-sm font-medium text-gray-700">
                        편집
                      </div>
                      <textarea
                        value={editingPost.content}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            content: e.target.value,
                          })
                        }
                        className="w-full h-full p-3 border-0 focus:ring-0 font-mono text-sm resize-none"
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
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 text-sm font-medium text-gray-700">
                        미리보기
                      </div>
                      <div className="h-full overflow-y-auto bg-white">
                        <div className="p-4 prose prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight, rehypeRaw]}
                            components={{
                              pre({ children, ...props }) {
                                return (
                                  <pre
                                    className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed border border-gray-700 shadow-lg"
                                    {...props}
                                  >
                                    {children}
                                  </pre>
                                )
                              },
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ''
                                )

                                return !inline && match ? (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code
                                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border border-gray-200"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              },
                              img({ src, alt, ...props }) {
                                // 임시 플레이스홀더인 경우
                                if (src && src.startsWith('[이미지:')) {
                                  return (
                                    <div className="my-4 text-center">
                                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 mx-auto max-w-sm">
                                        <div className="text-gray-500 text-center">
                                          <div className="text-3xl mb-2">
                                            📷
                                          </div>
                                          <p className="text-xs font-medium">
                                            이미지 준비 중
                                          </p>
                                          <p className="text-xs text-gray-400 mt-1">
                                            {alt}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }

                                return (
                                  <div className="my-4 text-center">
                                    <img
                                      src={src}
                                      alt={alt}
                                      className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 mx-auto"
                                      style={{ maxHeight: '500px' }}
                                      {...props}
                                    />
                                    {alt && (
                                      <p className="text-sm text-gray-600 mt-2 italic">
                                        {alt}
                                      </p>
                                    )}
                                  </div>
                                )
                              },
                            }}
                          >
                            {editingPost.content ||
                              '*내용이 없습니다. 마크다운을 입력해주세요.*'}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 - 반응형 */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            블로그 관리
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              새 글 작성
            </button>
            <button
              onClick={() => router.push('/blog')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              블로그 보기
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 데스크톱 테이블 뷰 */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
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

        {/* 모바일 카드 뷰 */}
        <div className="lg:hidden space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {post.description}
                  </p>
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="text-xs text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-50"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-xs text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                    추천
                  </span>
                )}
                <span className="text-gray-500">{post.publishedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
