import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const dataSourceId = process.env.NOTION_RECRUIT_DATA_SOURCE_ID

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, position, portfolio, message } = body

    console.log('Received recruit data:', { name, email, phone, position, portfolio, message })

    // バリデーション
    if (!name || !email || !phone || !position || !message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    if (!dataSourceId) {
      console.error('NOTION_RECRUIT_DATA_SOURCE_ID is not set')
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      )
    }

    console.log('Using recruit data source ID:', dataSourceId)

    // Notionにデータを追加
    const response = await notion.pages.create({
      parent: {
        type: 'data_source_id',
        data_source_id: dataSourceId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        email: {
          email: email,
        },
        Phone: {
          phone_number: phone,
        },
        position: {
          rich_text: [
            {
              text: {
                content: position,
              },
            },
          ],
        },
        portfolio: {
          url: portfolio || null,
        },
        message: {
          rich_text: [
            {
              text: {
                content: message,
              },
            },
          ],
        },
      },
    })

    console.log('Successfully created recruit page:', response.id)

    return NextResponse.json(
      { success: true, id: response.id },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Notion API Error:', error)
    console.error('Error details:', error.body || error.message)
    return NextResponse.json(
      { error: 'データの保存に失敗しました', details: error.message },
      { status: 500 }
    )
  }
}
