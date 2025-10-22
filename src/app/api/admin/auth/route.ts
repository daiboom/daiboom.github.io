import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // 환경변수에서 관리자 비밀번호 가져오기
    const adminPassword = process.env.PAGES_ADMIN_PASSWORD

    if (password === adminPassword) {
      // 인증 성공 시 세션 토큰 생성 (실제로는 JWT 등 사용)
      const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString(
        'base64'
      )

      return NextResponse.json({
        success: true,
        token,
        message: '인증 성공',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: '비밀번호가 틀렸습니다.',
        },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
