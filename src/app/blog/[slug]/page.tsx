import { getPosts } from '@/lib/blog'
import { isRepositoryOwner } from '@/lib/github-user'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import BlogPostClient from './BlogPostClient'
import EditButton from './EditButton'

// 정적 생성용 함수
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const posts = await getPosts()
  const post = posts.find((p) => p.slug === params.slug)
  const isOwner = await isRepositoryOwner()

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            포스트를 찾을 수 없습니다
          </h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            블로그로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
              홈
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-700">
              블로그
            </Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>

          <div className="flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                추천
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
            {isOwner && <EditButton postId={post.id} />}
          </div>
          <p className="text-xl text-gray-600 mb-6">{post.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>작성자: {post.author}</span>
              <span>발행일: {post.publishedAt}</span>
              <span>읽는 시간: {post.readTime}분</span>
            </div>
            <div className="flex space-x-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <div className="prose prose-lg max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:border prose-pre:border-gray-700 prose-pre:shadow-lg prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:border prose-code:border-gray-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    pre({ children, ...props }) {
                      return (
                        <pre
                          className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed border border-gray-700 shadow-lg"
                          {...props}
                        >
                          {children}
                        </pre>
                      )
                    },
                    code({ node, inline, className, children, ...props }) {
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
                      return (
                        <div className="my-6 text-center">
                          <img
                            src={src}
                            alt={alt}
                            className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200 mx-auto"
                            style={{ maxHeight: '600px' }}
                            {...props}
                          />
                          {alt && (
                            <p className="text-sm text-gray-600 mt-3 italic">
                              {alt}
                            </p>
                          )}
                        </div>
                      )
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </article>

            {/* Comments Section - Client Component */}
            <BlogPostClient post={post} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">목차</h4>
                <div className="space-y-2 text-sm">
                  <a
                    href="#introduction"
                    className="block text-gray-600 hover:text-blue-600"
                  >
                    소개
                  </a>
                  <a
                    href="#features"
                    className="block text-gray-600 hover:text-blue-600"
                  >
                    주요 특징
                  </a>
                  <a
                    href="#usage"
                    className="block text-gray-600 hover:text-blue-600"
                  >
                    사용법
                  </a>
                  <a
                    href="#conclusion"
                    className="block text-gray-600 hover:text-blue-600"
                  >
                    결론
                  </a>
                </div>
              </div>

              {/* Related Posts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  관련 포스트
                </h4>
                <div className="space-y-3">
                  {posts
                    .filter(
                      (p) => p.id !== post.id && p.category === post.category
                    )
                    .slice(0, 3)
                    .map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="block group"
                      >
                        <h5 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {relatedPost.title}
                        </h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {relatedPost.publishedAt}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
