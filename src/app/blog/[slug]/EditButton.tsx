'use client'

import { useRouter } from 'next/navigation'

interface EditButtonProps {
  postId: string
}

export default function EditButton({ postId }: EditButtonProps) {
  const router = useRouter()

  const handleEdit = () => {
    // 관리자 페이지로 이동하면서 편집할 포스트 ID를 전달
    router.push(`/admin/blog?edit=${postId}`)
  }

  return (
    <button
      onClick={handleEdit}
      className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      편집
    </button>
  )
}
