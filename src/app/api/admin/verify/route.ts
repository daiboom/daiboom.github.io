import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    // 토큰 검증 로직 (실제로는 JWT 등 사용)
    if (token && typeof token === 'string') {
      return NextResponse.json({
        success: true,
        message: '토큰이 유효합니다.',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: '유효하지 않은 토큰입니다.',
        },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '토큰 검증 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
