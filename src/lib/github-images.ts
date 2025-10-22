// GitHub Contents API를 사용한 이미지 업로드

const GITHUB_REPO_OWNER = 'daiboom'
const GITHUB_REPO_NAME = 'daiboom.github.io'
const GITHUB_CONTENTS_API_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents`

export interface ImageUploadResult {
  success: boolean
  url?: string
  fileName?: string
  error?: string
}

// GitHub Contents API로 이미지 업로드
export async function uploadImageToGitHub(
  file: File,
  token: string
): Promise<ImageUploadResult> {
  try {
    // 파일을 Base64로 인코딩
    const arrayBuffer = await file.arrayBuffer()
    const base64Content = Buffer.from(arrayBuffer).toString('base64')

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${originalName}`
    const filePath = `public/uploads/blog/${fileName}`

    // GitHub Contents API 요청
    const response = await fetch(`${GITHUB_CONTENTS_API_URL}/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Upload image: ${fileName}`,
        content: base64Content,
        branch: 'main',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('GitHub API error:', errorData)
      return {
        success: false,
        error: `GitHub API error: ${errorData.message || response.statusText}`,
      }
    }

    const result = await response.json()

    // GitHub Pages에서 접근 가능한 URL 생성
    const imageUrl = `/${filePath.replace('public/', '')}`

    return {
      success: true,
      url: imageUrl,
      fileName: fileName,
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// 이미지 삭제 (선택사항)
export async function deleteImageFromGitHub(
  filePath: string,
  token: string
): Promise<boolean> {
  try {
    // 먼저 파일의 SHA를 가져와야 함
    const getResponse = await fetch(`${GITHUB_CONTENTS_API_URL}/${filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!getResponse.ok) {
      return false
    }

    const fileData = await getResponse.json()
    const sha = fileData.sha

    // 파일 삭제
    const deleteResponse = await fetch(
      `${GITHUB_CONTENTS_API_URL}/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: `Delete image: ${filePath}`,
          sha: sha,
          branch: 'main',
        }),
      }
    )

    return deleteResponse.ok
  } catch (error) {
    console.error('Image delete error:', error)
    return false
  }
}
