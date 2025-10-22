import { getPosts } from '@/lib/blog'
import { isRepositoryOwner } from '@/lib/github-user'
import AdminButton from './AdminButton'
import BlogClient from './BlogClient'

export default async function BlogPage() {
  const allPosts = await getPosts()
  const featuredPosts = allPosts.filter((post) => post.featured)
  const isOwner = await isRepositoryOwner()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">기술 블로그</h1>
              <p className="mt-2 text-lg text-gray-600">
                개발 경험과 지식을 공유하는 공간입니다
              </p>
            </div>
            {isOwner && <AdminButton />}
          </div>
        </div>
      </div>

      <BlogClient allPosts={allPosts} featuredPosts={featuredPosts} />
    </div>
  )
}
