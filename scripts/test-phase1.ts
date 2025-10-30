/**
 * Phase 1 実装テスト（辞書ベースconfig版）
 * 作成したモジュールが正常に動作するか確認
 */

// 環境変数を読み込み
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

import { queryDatabase, getPageBlocks } from '../lib/notion/client'
import { newsConfig } from '../lib/notion/config/news-config'
import { createExtractors, getDatabaseId, getDefaultSorts } from '../lib/notion/extractors'
import { blocksToMarkdown } from '../lib/notion/blocks-to-markdown'
import { getNewsPostById } from '../lib/news'

// extractorsを自動生成
const extractors = createExtractors(newsConfig)

async function testPhase1() {
  console.log('🚀 Phase 1 実装テスト開始（辞書ベースconfig版）\n')

  try {
    // 1. データベースクエリのテスト
    console.log('='.repeat(80))
    console.log('1. データベースクエリのテスト')
    console.log('='.repeat(80))

    const pages = await queryDatabase(getDatabaseId(newsConfig), {
      sorts: getDefaultSorts(newsConfig),
    })
    console.log(`✅ ${pages.length}件のページを取得\n`)

    if (pages.length === 0) {
      console.log('⚠️  データベースにページがありません')
      return
    }

    // 2. プロパティ抽出のテスト
    console.log('='.repeat(80))
    console.log('2. プロパティ抽出のテスト（自動生成extractors）')
    console.log('='.repeat(80))

    const firstPage = pages[0]
    console.log('最初のページのプロパティ:')
    console.log(`- ID: ${extractors.id(firstPage)}`)
    console.log(`- タイトル: ${extractors.title(firstPage)}`)
    console.log(`- 日付: ${extractors.date(firstPage)}`)
    console.log(`- タグ: [${extractors.tags(firstPage).join(', ')}]`)
    console.log(`- 説明: ${extractors.description(firstPage)}`)
    console.log(`- サムネイル: ${extractors.thumbnail(firstPage).substring(0, 50)}...`)
    console.log()

    // 3. Config構造の確認
    console.log('='.repeat(80))
    console.log('3. Config構造の確認')
    console.log('='.repeat(80))

    console.log('Database ID:', getDatabaseId(newsConfig))
    console.log('Default Sorts:', JSON.stringify(getDefaultSorts(newsConfig), null, 2))
    console.log('Properties定義:')
    for (const [key, prop] of Object.entries(newsConfig.properties)) {
      console.log(`  - ${key}: { name: "${prop.name}", type: "${prop.type}" }`)
    }
    console.log()

    // 4. IDでページ取得のテスト
    console.log('='.repeat(80))
    console.log('4. IDでページ取得のテスト（データレイヤー経由）')
    console.log('='.repeat(80))

    const id = extractors.id(firstPage)
    const pageById = await getNewsPostById(id)

    if (pageById) {
      console.log(`✅ ID: ${id} のページを取得成功`)
      console.log(`   タイトル: ${pageById.title}\n`)
    } else {
      console.log(`❌ ID: ${id} のページが見つかりませんでした\n`)
    }

    // 5. ブロック取得とMarkdown変換のテスト
    console.log('='.repeat(80))
    console.log('5. ブロック取得とMarkdown変換のテスト')
    console.log('='.repeat(80))

    const blocks = await getPageBlocks(firstPage.id)
    console.log(`✅ ${blocks.length}個のブロックを取得`)

    const markdown = blocksToMarkdown(blocks)
    console.log('\n--- Markdown変換結果 ---')
    console.log(markdown)
    console.log('--- 変換結果終わり ---\n')

    // 6. 統合テスト
    console.log('='.repeat(80))
    console.log('6. 統合テスト（完全なニュース記事取得）')
    console.log('='.repeat(80))

    const newsPost = {
      id: extractors.id(firstPage),
      title: extractors.title(firstPage),
      date: extractors.date(firstPage),
      tags: extractors.tags(firstPage),
      summary: extractors.description(firstPage),
      thumbnail: extractors.thumbnail(firstPage),
      content: markdown,
    }

    console.log('完全なニュース記事データ:')
    console.log(JSON.stringify(newsPost, null, 2))
    console.log()

    console.log('='.repeat(80))
    console.log('✅ Phase 1 実装テスト完了')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('❌ テスト中にエラーが発生しました:')
    console.error(error)
    process.exit(1)
  }
}

testPhase1()
