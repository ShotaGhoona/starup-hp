import { getAllNewsPosts } from './mdx'

// デフォルト画像パス
const DEFAULT_NEWS_IMAGE = '/images/news/news-detail/s-1470x816_v-fms_webp_033766ae-ae48-42b4-8f69-9d944c37b6f2.webp'

// カテゴリに応じた画像を返す関数（画像が指定されていない場合に使用）
function getNewsImage(category: string, customImage?: string): string {
  // カスタム画像が指定されている場合はそれを使用
  if (customImage) {
    return customImage
  }

  // デフォルト画像を返す
  return DEFAULT_NEWS_IMAGE
}

// ニュース一覧表示用のインターフェース
export interface NewsListItem {
  id: string
  title: string
  date: string
  category: string
  imageUrl: string
  summary?: string
}

// MDXファイルからニュース一覧用のデータを取得
export function getAllNewsForList(): NewsListItem[] {
  const posts = getAllNewsPosts()

  return posts.map(post => ({
    id: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    imageUrl: getNewsImage(post.category, post.image),
    summary: post.summary
  })).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// 最新のニュースを指定件数取得
export function getLatestNews(limit: number = 3): NewsListItem[] {
  return getAllNewsForList().slice(0, limit)
}