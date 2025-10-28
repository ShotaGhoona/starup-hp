import { getAllRecruitPosts } from './mdx'

// カテゴリとジョブタイプに応じた画像を返す関数
function getRecruitImage(category: string, jobType?: string): string {
  // jobTypeベースで画像を判定
  const jobTypeImageMap: { [key: string]: string } = {
    'エンジニア': '/images/recruit/rectuit-detail/engineer.jpg',
    'マネジメント': '/images/recruit/rectuit-detail/management.jpg',
    'プロジェクトマネージャー': '/images/recruit/rectuit-detail/business.jpg',
    'セールス': '/images/recruit/rectuit-detail/sales.jpg',
  }

  // categoryベースで画像を判定（フォールバック）
  const categoryImageMap: { [key: string]: string } = {
    'エンジニア': '/images/recruit/rectuit-detail/engineer.jpg',
    'マネジメント': '/images/recruit/rectuit-detail/management.jpg',
    'ビジネス': '/images/recruit/rectuit-detail/business.jpg',
    'セールス': '/images/recruit/rectuit-detail/sales.jpg',
  }

  // jobTypeがある場合は優先
  if (jobType && jobTypeImageMap[jobType]) {
    return jobTypeImageMap[jobType]
  }

  return categoryImageMap[category] || '/images/recruit/rectuit-detail/business.jpg'
}

// 採用情報一覧表示用のインターフェース
export interface RecruitListItem {
  id: string
  title: string
  date: string
  category: string
  imageUrl: string
  summary?: string
  jobType: string
  location: string
  employmentType: string
}

// MDXファイルから採用情報一覧用のデータを取得
export function getAllRecruitsForList(): RecruitListItem[] {
  const posts = getAllRecruitPosts()

  return posts.map(post => ({
    id: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    imageUrl: getRecruitImage(post.category, post.jobType),
    summary: post.summary,
    jobType: post.jobType,
    location: post.location,
    employmentType: post.employmentType,
  })).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// 最新の採用情報を指定件数取得
export function getLatestRecruits(limit: number = 3): RecruitListItem[] {
  return getAllRecruitsForList().slice(0, limit)
}
