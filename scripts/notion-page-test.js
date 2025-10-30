/**
 * Notion Page Detail Test Script
 * Notionページの詳細とブロック構造を確認するスクリプト
 *
 * 実行方法:
 * node src/scripts/notion-page-test.js [page_id]
 *
 * page_id を指定しない場合は、データベースの最初のページを取得
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')

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

const notion = new Client({ auth: NOTION_API_KEY })

// コマンドライン引数からページIDを取得
const targetPageId = process.argv[2]

async function testPageDetail() {
  try {
    let pageId = targetPageId

    // ページIDが指定されていない場合は、データベースから最初のページを取得
    if (!pageId) {
      console.log('📊 ページIDが指定されていないため、データベースから最初のページを取得します\n')

      const databaseResponse = await notion.dataSources.query({
        data_source_id: NOTION_NEWS_DATABASE_ID,
      })

      if (databaseResponse.results.length === 0) {
        console.error('❌ データベースにページがありません')
        process.exit(1)
      }

      pageId = databaseResponse.results[0].id
      console.log(`✅ 最初のページのIDを取得: ${pageId}\n`)
    }

    console.log('='.repeat(80))
    console.log('📄 1. ページ情報を取得')
    console.log('='.repeat(80))
    console.log(`ページID: ${pageId}\n`)

    // ページ情報を取得
    const page = await notion.pages.retrieve({ page_id: pageId })

    console.log('--- ページ基本情報 ---')
    console.log(`作成日: ${page.created_time}`)
    console.log(`更新日: ${page.last_edited_time}`)
    console.log(`アーカイブ: ${page.archived}`)
    console.log(`URL: ${page.url}`)
    console.log('')

    console.log('--- ページプロパティ詳細 ---')
    console.log(JSON.stringify(page.properties, null, 2))
    console.log('')

    console.log('--- プロパティ抽出結果 ---')

    // Name (title)
    const name = page.properties.Name?.title?.[0]?.plain_text || ''
    console.log(`Name: ${name}`)

    // ID (unique_id)
    const id = page.properties.ID?.unique_id?.number || null
    console.log(`ID: ${id}`)

    // Tags (multi_select)
    const tags = page.properties.Tags?.multi_select?.map(tag => tag.name) || []
    console.log(`Tags: [${tags.join(', ')}]`)

    // Date
    const date = page.properties.Date?.date?.start || ''
    console.log(`Date: ${date}`)

    // Description (rich_text)
    const description = page.properties.Description?.rich_text?.[0]?.plain_text || ''
    console.log(`Description: ${description}`)

    // Thumbnail (files)
    const thumbnail = page.properties.Thumbnail?.files?.[0]
    if (thumbnail) {
      const thumbnailUrl = thumbnail.type === 'file'
        ? thumbnail.file.url
        : thumbnail.external?.url || ''
      console.log(`Thumbnail: ${thumbnailUrl}`)
    } else {
      console.log(`Thumbnail: (なし)`)
    }
    console.log('')

    console.log('='.repeat(80))
    console.log('📝 2. ページブロック（本文）を取得')
    console.log('='.repeat(80))

    // ページのブロックを取得
    const blocksResponse = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    console.log(`✅ ${blocksResponse.results.length}個のブロックを取得\n`)

    console.log('--- ブロック詳細（JSON） ---')
    console.log(JSON.stringify(blocksResponse.results, null, 2))
    console.log('')

    console.log('--- ブロック構造の概要 ---')
    blocksResponse.results.forEach((block, index) => {
      console.log(`\n[${index + 1}] ブロックタイプ: ${block.type}`)
      console.log(`    ID: ${block.id}`)
      console.log(`    has_children: ${block.has_children}`)

      switch (block.type) {
        case 'paragraph':
          const paragraphText = block.paragraph.rich_text.map(t => t.plain_text).join('')
          console.log(`    内容: ${paragraphText || '(空の段落)'}`)
          break

        case 'heading_1':
          const h1Text = block.heading_1.rich_text.map(t => t.plain_text).join('')
          console.log(`    内容: # ${h1Text}`)
          break

        case 'heading_2':
          const h2Text = block.heading_2.rich_text.map(t => t.plain_text).join('')
          console.log(`    内容: ## ${h2Text}`)
          break

        case 'heading_3':
          const h3Text = block.heading_3.rich_text.map(t => t.plain_text).join('')
          console.log(`    内容: ### ${h3Text}`)
          break

        case 'bulleted_list_item':
          const bulletText = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('')
          console.log(`    内容: - ${bulletText}`)
          break

        case 'numbered_list_item':
          const numberedText = block.numbered_list_item.rich_text.map(t => t.plain_text).join('')
          console.log(`    内容: 1. ${numberedText}`)
          break

        case 'code':
          const codeText = block.code.rich_text.map(t => t.plain_text).join('')
          console.log(`    言語: ${block.code.language}`)
          console.log(`    内容: ${codeText.substring(0, 100)}${codeText.length > 100 ? '...' : ''}`)
          break

        case 'quote':
          const quoteText = block.quote.rich_text.map(t => t.plain_text).join('')
          console.log(`    内容: > ${quoteText}`)
          break

        case 'divider':
          console.log(`    内容: ---`)
          break

        case 'image':
          const imageUrl = block.image.type === 'file'
            ? block.image.file.url
            : block.image.external?.url || ''
          console.log(`    URL: ${imageUrl}`)
          break

        default:
          console.log(`    ⚠️  未対応のブロックタイプ: ${block.type}`)
      }
    })

    console.log('')
    console.log('='.repeat(80))
    console.log('✅ テスト完了')
    console.log('='.repeat(80))

    // 取得したデータの整形例を表示
    console.log('\n--- 実装時のデータ構造イメージ ---')
    console.log(JSON.stringify({
      id: String(id),
      title: name,
      date: date,
      tags: tags,
      summary: description,
      thumbnail: thumbnail?.type === 'file' ? thumbnail.file.url : '',
      content: '(Markdown変換後の本文)',
      blockCount: blocksResponse.results.length
    }, null, 2))

  } catch (error) {
    console.error('❌ エラーが発生しました:')
    console.error('エラーコード:', error.code)
    console.error('エラーメッセージ:', error.message)

    if (error.code === 'object_not_found') {
      console.error('\n💡 ヒント: 指定したページIDが存在しないか、Integrationからアクセスできません')
    }

    console.error('\n詳細:', error)
    process.exit(1)
  }
}

console.log('🚀 Notion Page Detail テスト開始\n')
testPageDetail()
