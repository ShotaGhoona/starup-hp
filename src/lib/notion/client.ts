/**
 * 汎用Notion APIクライアント
 * プロジェクト間で再利用可能な汎用的なNotionクライアント
 */

import { Client } from '@notionhq/client'
import { NotionPage, NotionBlock } from './types'

/**
 * Notionクライアントのシングルトンインスタンス
 */
let notionClient: Client | null = null

/**
 * 環境変数を取得（検証付き）
 */
function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not defined in environment variables`)
  }
  return value
}

/**
 * Notionクライアントを初期化して取得
 */
export function getNotionClient(): Client {
  if (!notionClient) {
    const apiKey = getEnvVar('NOTION_API_KEY')
    notionClient = new Client({
      auth: apiKey,
    })
  }
  return notionClient
}

/**
 * データベースから全ページを取得（汎用）
 *
 * @param databaseId - NotionデータベースID
 * @param options.sorts - ソート条件
 * @param options.filter - フィルター条件
 * @returns ページの配列
 */
export async function queryDatabase(
  databaseId: string,
  options?: {
    sorts?: Array<{
      property: string
      direction: 'ascending' | 'descending'
    }>
    filter?: any
  }
): Promise<NotionPage[]> {
  const notion = getNotionClient()

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      sorts: options?.sorts,
      filter: options?.filter,
    })

    return response.results as unknown as NotionPage[]
  } catch (error) {
    console.error('Error querying Notion database:', error)
    throw error
  }
}

/**
 * ページIDでページ情報を取得
 *
 * @param pageId - NotionページID（UUID）
 * @returns ページオブジェクト
 */
export async function getPageByPageId(pageId: string): Promise<NotionPage> {
  const notion = getNotionClient()

  try {
    const response = await notion.pages.retrieve({
      page_id: pageId,
    })

    return response as unknown as NotionPage
  } catch (error) {
    console.error(`Error retrieving page ${pageId}:`, error)
    throw error
  }
}

/**
 * ページのブロック（本文）を取得
 *
 * @param pageId - NotionページID（UUID）
 * @returns ブロックの配列
 */
export async function getPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const notion = getNotionClient()

  try {
    const blocks: NotionBlock[] = []
    let cursor: string | undefined = undefined
    let hasMore = true

    // ページネーション対応
    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
        start_cursor: cursor,
      })

      blocks.push(...(response.results as unknown as NotionBlock[]))
      hasMore = response.has_more
      cursor = response.next_cursor || undefined
    }

    return blocks
  } catch (error) {
    console.error(`Error getting blocks for page ${pageId}:`, error)
    throw error
  }
}
