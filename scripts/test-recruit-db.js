/**
 * Recruit Database Test Script
 * Notionの採用情報データベースのJSON構造を確認するスクリプト
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_RECRUIT_DATABASE_ID = process.env.NOTION_RECRUIT_DATABASE_ID

if (!NOTION_API_KEY) {
  console.error('❌ エラー: NOTION_API_KEY が設定されていません')
  process.exit(1)
}

if (!NOTION_RECRUIT_DATABASE_ID) {
  console.error('❌ エラー: NOTION_RECRUIT_DATABASE_ID が設定されていません')
  process.exit(1)
}

console.log('✅ 環境変数読み込み成功')
console.log(`- NOTION_API_KEY: ${NOTION_API_KEY.substring(0, 20)}...`)
console.log(`- NOTION_RECRUIT_DATABASE_ID: ${NOTION_RECRUIT_DATABASE_ID}`)
console.log('')

const notion = new Client({ auth: NOTION_API_KEY })

async function testRecruitDatabase() {
  try {
    console.log('='.repeat(80))
    console.log('📊 採用情報データベースクエリの実行')
    console.log('='.repeat(80))

    const databaseResponse = await notion.dataSources.query({
      data_source_id: NOTION_RECRUIT_DATABASE_ID,
    })

    console.log(`✅ クエリ成功: ${databaseResponse.results.length}件のページを取得`)
    console.log('')

    if (databaseResponse.results.length === 0) {
      console.log('⚠️  データベースにページがありません')
      return
    }

    // 最初のページの詳細
    const firstPage = databaseResponse.results[0]
    console.log('='.repeat(80))
    console.log('📄 最初の採用情報ページ')
    console.log('='.repeat(80))
    console.log('--- プロパティ詳細 ---')
    console.log(JSON.stringify(firstPage.properties, null, 2))
    console.log('')

    console.log('--- プロパティ簡易表示 ---')
    for (const [key, value] of Object.entries(firstPage.properties)) {
      console.log(`${key}: ${value.type}`)

      switch (value.type) {
        case 'title':
          console.log(`  → ${value.title[0]?.plain_text || '(空)'}`)
          break
        case 'rich_text':
          console.log(`  → ${value.rich_text[0]?.plain_text || '(空)'}`)
          break
        case 'select':
          console.log(`  → ${value.select?.name || '(空)'}`)
          break
        case 'multi_select':
          console.log(`  → [${value.multi_select.map(s => s.name).join(', ')}]`)
          break
        case 'date':
          console.log(`  → ${value.date?.start || '(空)'}`)
          break
        case 'unique_id':
          console.log(`  → ${value.unique_id?.number || '(空)'}`)
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

    // データ抽出テスト
    console.log('='.repeat(80))
    console.log('🔍 データ抽出テスト')
    console.log('='.repeat(80))

    // Thumbnail URL取得
    const thumbnail = firstPage.properties.Thumbnail?.files?.[0]
    const thumbnailUrl = thumbnail
      ? (thumbnail.type === 'file' ? thumbnail.file.url : thumbnail.external?.url || '')
      : ''

    const extractedData = {
      id: firstPage.properties.ID?.unique_id?.number || '',
      title: firstPage.properties.Name?.title?.[0]?.plain_text || '',
      date: firstPage.properties.Date?.date?.start || '',
      category: firstPage.properties.Category?.select?.name || '',
      summary: firstPage.properties.Summary?.rich_text?.[0]?.plain_text || '',
      jobType: firstPage.properties.JobType?.select?.name || '',
      location: firstPage.properties.Location?.rich_text?.[0]?.plain_text || '',
      employmentType: firstPage.properties.EmploymentType?.rich_text?.[0]?.plain_text || '',
      thumbnail: thumbnailUrl,
    }

    console.log(JSON.stringify(extractedData, null, 2))
    console.log('')

    // 全ページのIDリスト
    console.log('='.repeat(80))
    console.log('📋 全採用情報のIDリスト')
    console.log('='.repeat(80))

    databaseResponse.results.forEach((page, index) => {
      const id = page.properties.ID?.unique_id?.number || ''
      const title = page.properties.Name?.title?.[0]?.plain_text || '(タイトルなし)'
      console.log(`[${index + 1}] ID: ${id} - ${title}`)
    })
    console.log('')

    console.log('='.repeat(80))
    console.log('✅ テスト完了')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('❌ エラーが発生しました:')
    console.error('エラーコード:', error.code)
    console.error('エラーメッセージ:', error.message)

    if (error.code === 'object_not_found') {
      console.error('\n💡 ヒント: NOTION_RECRUIT_DATABASE_IDが正しいか、Integrationがデータベースに接続されているか確認してください')
    }

    console.error('\n詳細:', error)
    process.exit(1)
  }
}

console.log('🚀 Recruit Database テスト開始\n')
testRecruitDatabase()
