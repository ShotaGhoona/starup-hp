/**
 * Recruit データレイヤー
 * Notionから採用情報データを取得・整形
 */

import { RecruitPost, RecruitListItem } from '@/types/recruit'
import { queryDatabase, getPageBlocks } from './notion/client'
import { recruitConfig } from './notion/config/recruit-config'
import { createExtractors, getDatabaseId, getDefaultSorts } from './notion/extractors'
import { blocksToMarkdown } from './notion/blocks-to-markdown'

// Recruitのextractorを自動生成
const extractors = createExtractors(recruitConfig)

const DEFAULT_IMAGE = '/images/recruit/rectuit-detail/business.jpg'

/**
 * 画像URLを取得（NotionのThumbnailまたはデフォルト画像）
 */
function getImageUrl(notionImageUrl: string): string {
  return notionImageUrl || DEFAULT_IMAGE
}

/**
 * 採用情報一覧を取得
 *
 * @returns 採用情報一覧（日付降順）
 */
export async function getAllRecruitsForList(): Promise<RecruitListItem[]> {
  try {
    const pages = await queryDatabase(getDatabaseId(recruitConfig), {
      sorts: getDefaultSorts(recruitConfig),
    })

    return pages.map((page) => ({
      id: extractors.id(page),
      title: extractors.title(page),
      date: extractors.date(page),
      category: extractors.category(page),
      summary: extractors.summary(page),
      jobType: extractors.jobType(page),
      location: extractors.location(page),
      employmentType: extractors.employmentType(page),
      imageUrl: getImageUrl(extractors.thumbnail(page)),
    }))
  } catch (error) {
    console.error('Error fetching recruit list:', error)
    throw error
  }
}

/**
 * 最新の採用情報を指定件数取得
 *
 * @param limit - 取得件数
 * @returns 採用情報一覧
 */
export async function getLatestRecruits(limit: number = 3): Promise<RecruitListItem[]> {
  const allRecruits = await getAllRecruitsForList()
  return allRecruits.slice(0, limit)
}

/**
 * IDで採用情報を取得
 *
 * @param id - 採用情報ID（unique_id.number）
 * @returns 採用情報、見つからない場合はnull
 */
export async function getRecruitPostById(id: string): Promise<RecruitPost | null> {
  try {
    const pages = await queryDatabase(getDatabaseId(recruitConfig))
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
      category: extractors.category(page),
      summary: extractors.summary(page),
      jobType: extractors.jobType(page),
      location: extractors.location(page),
      employmentType: extractors.employmentType(page),
      thumbnail: getImageUrl(extractors.thumbnail(page)),
      content,
    }
  } catch (error) {
    console.error(`Error fetching recruit post by ID ${id}:`, error)
    throw error
  }
}

/**
 * 全ての採用情報IDを取得（動的ルーティング用）
 *
 * @returns 採用情報IDの配列
 */
export async function getAllRecruitIds(): Promise<string[]> {
  try {
    const pages = await queryDatabase(getDatabaseId(recruitConfig))
    return pages.map((page) => extractors.id(page)).filter(Boolean)
  } catch (error) {
    console.error('Error fetching all recruit IDs:', error)
    throw error
  }
}
