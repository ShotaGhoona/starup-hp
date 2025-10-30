/**
 * Notion Database Test Script
 * NotionのデータベースとページのJSON構造を確認するためのスクリプト
 *
 * 実行方法:
 * node src/scripts/notion-db-test.js
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')

// 環境変数の確認
const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_NEWS_DATABASE_ID = process.env.NOTION_NEWS_DATABASE_ID

if (!NOTION_API_KEY) {
  console.error('❌ エラー: NOTION_API_KEY が設定されていません')
  process.exit(1)
}

if (!NOTION_NEWS_DATABASE_ID) {
  console.error('❌ エラー: NOTION_NEWS_DATABASE_ID が設定されていません')
  process.exit(1)
}

console.log('✅ 環境変数読み込み成功')
console.log(`- NOTION_API_KEY: ${NOTION_API_KEY.substring(0, 20)}...`)
console.log(`- NOTION_NEWS_DATABASE_ID: ${NOTION_NEWS_DATABASE_ID}`)
console.log('')

// Notionクライアントの初期化
const notion = new Client({ auth: NOTION_API_KEY })

console.log('🔍 デバッグ: notion オブジェクトの型:', typeof notion)
console.log('🔍 デバッグ: notion のプロパティ:', Object.keys(notion))
console.log('🔍 デバッグ: notion.databases のプロパティ:', Object.keys(notion.databases))
console.log('🔍 デバッグ: notion.dataSources のプロパティ:', Object.keys(notion.dataSources))
console.log('🔍 デバッグ: notion.pages のプロパティ:', Object.keys(notion.pages))
console.log('')

async function testNotionDatabase() {
  try {
    console.log('='.repeat(80))
    console.log('📊 1. データベースクエリの実行')
    console.log('='.repeat(80))

    // データベースからページリストを取得
    // Note: @notionhq/client v5.x では dataSources.query を使用
    const databaseResponse = await notion.dataSources.query({
      data_source_id: NOTION_NEWS_DATABASE_ID,
      // sorts を一旦削除してデータ構造を確認
    })

    console.log(`✅ データベースクエリ成功: ${databaseResponse.results.length}件のページを取得`)
    console.log('')

    // データベースの全体構造を出力
    console.log('--- データベースレスポンス全体 ---')
    console.log(JSON.stringify(databaseResponse, null, 2))
    console.log('')

    if (databaseResponse.results.length === 0) {
      console.log('⚠️  データベースにページがありません')
      return
    }

    // 最初のページの詳細を取得
    const firstPage = databaseResponse.results[0]
    console.log('='.repeat(80))
    console.log('📄 2. 最初のページの詳細')
    console.log('='.repeat(80))
    console.log('--- ページプロパティ ---')
    console.log(JSON.stringify(firstPage.properties, null, 2))
    console.log('')

    // プロパティの簡易表示
    console.log('--- プロパティ簡易表示 ---')
    for (const [key, value] of Object.entries(firstPage.properties)) {
      console.log(`${key}: ${value.type}`)

      // 各プロパティタイプに応じて値を表示
      switch (value.type) {
        case 'title':
          console.log(`  → ${value.title[0]?.plain_text || '(空)'}`)
          break
        case 'rich_text':
          console.log(`  → ${value.rich_text[0]?.plain_text || '(空)'}`)
          break
        case 'multi_select':
          console.log(`  → [${value.multi_select.map(s => s.name).join(', ')}]`)
          break
        case 'date':
          console.log(`  → ${value.date?.start || '(空)'}`)
          break
        case 'files':
          if (value.files.length > 0) {
            console.log(`  → ${value.files[0].type}: ${value.files[0][value.files[0].type]?.url || value.files[0].name}`)
          } else {
            console.log(`  → (空)`)
          }
          break
        default:
          console.log(`  → [未対応の型: ${value.type}]`)
      }
    }
    console.log('')

    console.log('='.repeat(80))
    console.log('📝 3. ページのブロック（本文）を取得')
    console.log('='.repeat(80))

    // ページのブロックを取得
    const pageId = firstPage.id
    const blocksResponse = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    console.log(`✅ ブロック取得成功: ${blocksResponse.results.length}個のブロック`)
    console.log('')
    console.log('--- ブロック全体 ---')
    console.log(JSON.stringify(blocksResponse.results, null, 2))
    console.log('')

    // ブロックの簡易表示
    console.log('--- ブロック簡易表示 ---')
    blocksResponse.results.forEach((block, index) => {
      console.log(`[${index + 1}] ${block.type}`)

      switch (block.type) {
        case 'paragraph':
          console.log(`  → ${block.paragraph.rich_text.map(t => t.plain_text).join('')}`)
          break
        case 'heading_1':
          console.log(`  → # ${block.heading_1.rich_text.map(t => t.plain_text).join('')}`)
          break
        case 'heading_2':
          console.log(`  → ## ${block.heading_2.rich_text.map(t => t.plain_text).join('')}`)
          break
        case 'heading_3':
          console.log(`  → ### ${block.heading_3.rich_text.map(t => t.plain_text).join('')}`)
          break
        case 'bulleted_list_item':
          console.log(`  → - ${block.bulleted_list_item.rich_text.map(t => t.plain_text).join('')}`)
          break
        case 'numbered_list_item':
          console.log(`  → 1. ${block.numbered_list_item.rich_text.map(t => t.plain_text).join('')}`)
          break
        default:
          console.log(`  → [未対応の型: ${block.type}]`)
      }
    })
    console.log('')

    console.log('='.repeat(80))
    console.log('✅ テスト完了')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('❌ エラーが発生しました:')
    console.error('エラーコード:', error.code)
    console.error('エラーメッセージ:', error.message)

    if (error.code === 'unauthorized') {
      console.error('\n💡 ヒント: NOTION_API_KEYが正しいか、Integrationがデータベースに接続されているか確認してください')
    } else if (error.code === 'object_not_found') {
      console.error('\n💡 ヒント: NOTION_NEWS_DATABASE_IDが正しいか確認してください')
    }

    console.error('\n詳細:', error)
    process.exit(1)
  }
}

// スクリプト実行
console.log('🚀 Notion Database テスト開始\n')
testNotionDatabase()
