'use client'

import { BlogComment, BlogPost } from '@/lib/blog'
import { getCommentUrl, getCommentsForPost } from '@/lib/github'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface BlogPostClientProps {
  post: BlogPost
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      console.log('Loading comments for post:', post.title)

      // GitHub Issues API에서 직접 댓글 가져오기
      const githubComments = await getCommentsForPost(post.title)
      console.log('GitHub comments:', githubComments)

      // 댓글이 없을 때 샘플 댓글 표시 (개발/테스트용)
      if (githubComments.length === 0) {
        const sampleComments: BlogComment[] = [
          {
            id: 999,
            body: `**아직 댓글이 없습니다!** 🎯\n\n이 포스트에 대한 첫 번째 댓글을 작성해보세요:\n\n1. 아래 "GitHub에서 댓글 작성하기" 버튼 클릭\n2. GitHub Issues 페이지에서 댓글 작성\n3. 이 페이지에서 "새로고침" 버튼 클릭\n\n댓글을 작성하면 여기에 표시됩니다!`,
            user: {
              login: 'system',
              avatar_url: 'https://github.com/github.png',
              html_url: 'https://github.com',
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
        setComments(sampleComments)
      } else {
        setComments(githubComments)
      }
        } catch (error) {
          console.error('Failed to load comments:', error)
          // Rate limit 에러인지 확인
          const isRateLimitError = error instanceof Error && 
            error.message.includes('rate limit')
          
          const sampleComments: BlogComment[] = [
            {
              id: 1,
              body: isRateLimitError 
                ? `🚨 **GitHub API Rate Limit 초과**\n\nGitHub API 호출 한도가 초과되었습니다. 잠시 후(약 1시간) 다시 시도해주세요.\n\n💡 **해결 방법:**\n- 1시간 후 다시 시도\n- GitHub Personal Access Token 사용 (시간당 5,000회)\n- 댓글은 GitHub Issues에서 직접 확인 가능`
                : `댓글을 불러오는 중 오류가 발생했습니다. (${post.title}) 잠시 후 다시 시도해주세요.`,
              user: {
                login: 'system',
                avatar_url: 'https://github.com/github.png',
                html_url: 'https://github.com',
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]
          setComments(sampleComments)
        } finally {
          setLoading(false)
        }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          댓글 ({comments.length})
        </h3>
        <button
          onClick={() => {
            setLoading(true)
            loadComments()
          }}
          disabled={loading}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          {loading ? '새로고침 중...' : '새로고침'}
        </button>
      </div>

      {/* Comment Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          댓글을 작성하려면 GitHub Issues를 사용해주세요.
        </p>
        <p className="text-xs text-gray-500 mb-4">
          💡 <strong>사용법:</strong> 버튼을 클릭하면 GitHub Issues 페이지로
          이동합니다. Issue에 댓글을 작성한 후 이 페이지에서 "새로고침" 버튼을
          눌러주세요.
        </p>
        <a
          href={getCommentUrl(post.title)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
          🚀 GitHub에서 댓글 작성하기
        </a>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">댓글을 불러오는 중...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={comment.user.avatar_url}
                  alt={comment.user.login}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <a
                      href={comment.user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {comment.user.login}
                    </a>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {comment.body}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
        </div>
      )}
    </div>
  )
}
