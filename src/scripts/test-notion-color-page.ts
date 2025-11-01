/**
 * Test Notion Page Color and Marker Conversion
 * 実際のNotionページから色とマーカーを含むMarkdownへの変換をテスト
 */

import { Client } from '@notionhq/client'
import { blocksToMarkdown } from '../lib/notion/blocks-to-markdown'
import type { NotionBlock } from '../lib/notion/types'
import dotenv from 'dotenv'

// .env.localを読み込み
dotenv.config({ path: '.env.local' })

const NOTION_API_KEY = process.env.NOTION_API_KEY
const pageId = '29c4f9d8-9717-806f-a23d-cfd71f7a1817' // テストページ1

if (!NOTION_API_KEY) {
  console.error('❌ エラー: NOTION_API_KEY が設定されていません')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_API_KEY })

async function testColorConversion() {
  try {
    console.log('🚀 Notionページから色とマーカーのテストを開始\n')
    console.log(`ページID: ${pageId}\n`)

    // ページのブロックを取得
    const blocksResponse = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    console.log(`✅ ${blocksResponse.results.length}個のブロックを取得\n`)

    // ブロックをMarkdownに変換
    const markdown = blocksToMarkdown(blocksResponse.results as NotionBlock[])

    console.log('='.repeat(80))
    console.log('📝 変換されたMarkdown')
    console.log('='.repeat(80))
    console.log(markdown)
    console.log('='.repeat(80))

    console.log('\n✅ テスト完了')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

testColorConversion()
