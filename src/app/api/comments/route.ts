import { NextRequest, NextResponse } from 'next/server'
import { getCommentsForPost } from '@/lib/github'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postTitle = searchParams.get('postTitle')

    if (!postTitle) {
      return NextResponse.json(
        { error: 'Post title is required' },
        { status: 400 }
      )
    }

    console.log('🔍 [API] Fetching comments for post:', postTitle)
    const comments = await getCommentsForPost(postTitle)
    
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('❌ [API] Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
