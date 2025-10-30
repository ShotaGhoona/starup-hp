/**
 * News データレイヤー
 * Notionからニュースデータを取得・整形
 */

import { NewsPost, NewsListItem } from '@/types/news'
import { queryDatabase, getPageBlocks } from './notion/client'
import { newsConfig } from './notion/config/news-config'
import { createExtractors, getDatabaseId, getDefaultSorts } from './notion/extractors'
import { blocksToMarkdown } from './notion/blocks-to-markdown'

// Newsのextractorを自動生成
const extractors = createExtractors(newsConfig)

const DEFAULT_IMAGE = '/images/news/news-detail/s-1470x816_v-fms_webp_033766ae-ae48-42b4-8f69-9d944c37b6f2.webp'

/**
 * 画像URLを取得（デフォルト画像のフォールバック付き）
 */
function getImageUrl(imageUrl: string): string {
  return imageUrl || DEFAULT_IMAGE
}

/**
 * ニュース一覧を取得
 *
 * @returns ニュース一覧（日付降順）
 */
export async function getAllNewsForList(): Promise<NewsListItem[]> {
  try {
    const pages = await queryDatabase(getDatabaseId(newsConfig), {
      sorts: getDefaultSorts(newsConfig),
    })

    return pages.map((page) => ({
      id: extractors.id(page),
      title: extractors.title(page),
      date: extractors.date(page),
      tags: extractors.tags(page),
      summary: extractors.description(page),
      imageUrl: getImageUrl(extractors.thumbnail(page)),
    }))
  } catch (error) {
    console.error('Error fetching news list:', error)
    throw error
  }
}

/**
 * 最新のニュースを指定件数取得
 *
 * @param limit - 取得件数
 * @returns ニュース一覧
 */
export async function getLatestNews(limit: number = 3): Promise<NewsListItem[]> {
  const allNews = await getAllNewsForList()
  return allNews.slice(0, limit)
}

/**
 * IDでニュース記事を取得
 *
 * @param id - ニュースID（unique_id.number）
 * @returns ニュース記事、見つからない場合はnull
 */
export async function getNewsPostById(id: string): Promise<NewsPost | null> {
  try {
    const pages = await queryDatabase(getDatabaseId(newsConfig))
    const targetId = parseInt(id, 10)

    if (isNaN(targetId)) {
      return null
    }

    const page = pages.find((p) => {
      const pageId = extractors.id(p)
      return pageId === String(targetId)
    })

    if (!page) {
      return null
    }

    // ページのブロック（本文）を取得
    const blocks = await getPageBlocks(page.id)
    const content = blocksToMarkdown(blocks)

    return {
      id: extractors.id(page),
      title: extractors.title(page),
      date: extractors.date(page),
      tags: extractors.tags(page),
      summary: extractors.description(page),
      content,
      thumbnail: getImageUrl(extractors.thumbnail(page)),
    }
  } catch (error) {
    console.error(`Error fetching news post by ID ${id}:`, error)
    throw error
  }
}

/**
 * 全てのニュースIDを取得（動的ルーティング用）
 *
 * @returns ニュースIDの配列
 */
export async function getAllNewsIds(): Promise<string[]> {
  try {
    const pages = await queryDatabase(getDatabaseId(newsConfig))
    return pages.map((page) => extractors.id(page)).filter(Boolean)
  } catch (error) {
    console.error('Error fetching all news IDs:', error)
    throw error
  }
}
