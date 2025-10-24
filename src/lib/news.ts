import { getAllNewsPosts } from './mdx'

// カテゴリに応じた画像を返す関数
function getNewsImage(category: string): string {
  const imageMap: { [key: string]: string } = {
    'プレスリリース': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
    '事業提携': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop',
    '会社情報': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'サービス情報': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop',
    '開発情報': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    'IR情報': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    'システム情報': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
    '採用情報': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    'イベント情報': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
  }
  
  return imageMap[category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
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
    imageUrl: getNewsImage(post.category),
    summary: post.summary
  })).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// 最新のニュースを指定件数取得
export function getLatestNews(limit: number = 3): NewsListItem[] {
  return getAllNewsForList().slice(0, limit)
}