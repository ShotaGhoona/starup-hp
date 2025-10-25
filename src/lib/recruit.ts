import { getAllRecruitPosts } from './mdx'

// カテゴリに応じた画像を返す関数
function getRecruitImage(category: string): string {
  const imageMap: { [key: string]: string } = {
    'エンジニア': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    'デザイナー': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    'ビジネス': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
    'コーポレート': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'マーケティング': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    'セールス': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
  }

  return imageMap[category] || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
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
    imageUrl: getRecruitImage(post.category),
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
