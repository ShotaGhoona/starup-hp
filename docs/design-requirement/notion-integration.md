# News機能 Notion連携 要件定義書

## 1. 背景と目的

### 1.1 現在のシステムの問題点
- MDXファイルでのコンテンツ管理は開発者しか編集できない
- git commitが必要で、非技術者にとって敷居が高い
- ビルド・デプロイが必要で即座に公開できない
- ファイルベースのため、CMS的な管理機能が不足

### 1.2 Notion連携の目的
- **保守性の向上**: 非技術者でもNotionで記事を管理可能
- **リアルタイム性**: Notionで編集後、即座にWebサイトに反映
- **管理の効率化**: Notion UIでの直感的な記事管理
- **コラボレーション**: チーム全体での記事作成・編集が容易

## 2. Notion データベース構造

### 2.1 プロパティ一覧

| プロパティ名 | 型 | 必須 | 説明 |
|------------|-----|------|------|
| Name | title | ✅ | 記事タイトル |
| ID | unique_id | ✅ | URL用の一意識別子（自動採番: 1, 2, 3...） |
| Tags | multi_select | ✅ | カテゴリタグ（複数選択可） |
| Date | date | ✅ | 公開日 |
| Description | rich_text | ✅ | 記事概要（サマリー） |
| Thumbnail | files | ✅ | サムネイル画像（必須） |
| ページ本文 | blocks | ✅ | Notionページのコンテンツ |

### 2.2 Notion接続情報

- **DB URL**: https://www.notion.so/29c4f9d8971780da97ddfa2d2c307ba1?v=29c4f9d8971780f4aede000cd29f2ea1
- **Database ID**: `29c4f9d8971780da97ddfa2d2c307ba1`
- **Integration Token**: 環境変数 `NOTION_API_KEY` に設定済み
- **環境変数**: `NOTION_API_KEY` (すでに.envに登録済み)
- **環境変数**: `NOTION_NEWS_DATABASE_ID` (新規追加が必要)

## 3. データマッピング

| Notion | 現在のMDX | 型変換 |
|--------|-----------|--------|
| Name | title | title → string |
| ID (unique_id) | slug | unique_id.number → string |
| Tags (multi_select) | category | multi_select → string[] ⚠️型変更 |
| Date | date | date.start → string (YYYY-MM-DD) |
| Description (rich_text) | summary | rich_text[0].plain_text → string |
| Thumbnail (files) | image | files[0].file.url → string ⚠️必須化 |
| ページ本文（blocks） | content | blocks → markdown string |

### 3.1 型定義の変更点

**変更前（MDXベース）:**
```typescript
interface NewsPost {
  slug: string
  title: string
  date: string
  category: string // 単一文字列
  summary: string
  content: string
  image?: string
}
```

**変更後（Notionベース）:**
```typescript
interface NewsPost {
  id: string // unique_id.number を文字列化（"1", "2", "3"...）
  title: string
  date: string
  tags: string[] // 複数タグ対応
  summary: string
  content: string
  thumbnail: string // 必須化（デフォルト画像のフォールバック実装）
}
```

## 4. アーキテクチャ設計

### 4.1 レンダリング方式
- **SSR (Server-Side Rendering)** を採用
- 一覧ページ: Database APIでページリストを取得
- 詳細ページ: Page API + Blocks APIでページ本文を取得

### 4.2 データフロー

```
┌─────────────────┐
│  Notion         │
│  Database       │
└────────┬────────┘
         │
         │ API Request (SSR)
         ↓
┌─────────────────┐
│ Next.js Server  │
│                 │
│ src/lib/notion.ts        ← Notion API Client
│ src/lib/notion-to-md.ts  ← Block → Markdown
│ src/lib/news.ts          ← Business Logic
└────────┬────────┘
         │
         │ Return HTML
         ↓
┌─────────────────┐
│  Browser        │
│                 │
│ NewsListSection        ← 一覧表示
│ NewsDetailContentSection ← 詳細表示
└─────────────────┘
```

### 4.3 API呼び出しフロー

**一覧ページ (`/news`):**
```
1. src/app/news/page.tsx (SSR)
2. → src/lib/news.ts: getAllNewsForList()
3. → src/lib/notion.ts: queryNewsDatabase()
4. → @notionhq/client: client.databases.query()
5. ← Notion Database API Response
6. ← 整形済みニュース一覧
```

**詳細ページ (`/news/[id]`):**
```
1. src/app/news/[id]/page.tsx (SSR)
2. → src/lib/news.ts: getNewsPostById(id)
3. → src/lib/notion/client.ts: getPageById(id)
4. → @notionhq/client: client.pages.retrieve()
5. → src/lib/notion/client.ts: getPageBlocks(pageId)
6. → @notionhq/client: client.blocks.children.list()
7. → src/lib/notion/blocks-to-markdown.ts: blocksToMarkdown()
8. ← Markdown文字列
9. ← 完全なNewsPost
```

## 5. ディレクトリ構造

### 5.1 変更前（現在）

```
src/
├── app/
│   └── news/
│       ├── [slug]/
│       │   └── page.tsx          # 詳細ページ（SSG）
│       └── page.tsx               # 一覧ページ（SSG）
├── components/
│   ├── sections/
│   │   └── news/
│   │       ├── NewsListSection.tsx
│   │       └── NewsDetailContentSection.tsx
│   └── ui/
│       └── NewsItem.tsx
├── lib/
│   ├── mdx.ts                     # MDXファイル読み込み
│   └── news.ts                    # ビジネスロジック
└── content/
    └── news/
        ├── article-1.mdx          # MDXファイル
        ├── article-2.mdx
        └── ...
```

### 5.2 変更後（Notion連携）

```
src/
├── app/
│   └── news/
│       ├── [id]/
│       │   └── page.tsx          # 詳細ページ（SSR） ⚠️完全刷新
│       └── page.tsx               # 一覧ページ（SSR） ⚠️完全刷新
├── components/
│   ├── sections/
│   │   └── news/
│   │       ├── NewsListSection.tsx        # ⚠️完全刷新（複数タグ対応）
│   │       └── NewsDetailContentSection.tsx # ⚠️完全刷新（複数タグ対応）
│   └── ui/
│       └── NewsItem.tsx          # ⚠️完全刷新（複数タグ対応）
├── lib/
│   ├── notion/
│   │   ├── client.ts             # ✨新規 Notion APIクライアント
│   │   ├── blocks-to-markdown.ts # ✨新規 Block→Markdown変換
│   │   └── types.ts              # ✨新規 Notion型定義
│   ├── news.ts                   # ⚠️完全刷新 Notion専用
│   └── mdx.ts                    # 🗑️削除
├── types/
│   └── news.ts                   # ✨新規 共通型定義
└── content/
    └── news/                     # 🗑️削除
```

### 5.3 新規ファイル詳細

#### `src/lib/notion/client.ts`
```typescript
// Notion APIクライアントのラッパー
- initNotionClient()
- queryNewsDatabase()
- getPageById()
- getPageBlocks()
- getPageProperty()
```

#### `src/lib/notion/blocks-to-markdown.ts`
```typescript
// NotionブロックをMarkdownに変換
- blocksToMarkdown()
- blockToMarkdown()
- richTextToPlainText()
```

#### `src/lib/notion/types.ts`
```typescript
// Notion API レスポンスの型定義
- NotionPage
- NotionBlock
- NotionProperty
```

#### `src/types/news.ts`
```typescript
// アプリケーション共通の型定義
- NewsPost
- NewsListItem
```

## 6. Notion APIレスポンス詳細

### 6.1 一覧ページのレスポンス

**APIエンドポイント**: `notion.dataSources.query()`

**リクエスト例**:
```typescript
const response = await notion.dataSources.query({
  data_source_id: NOTION_NEWS_DATABASE_ID,
  sorts: [
    {
      property: 'Date',
      direction: 'descending',
    },
  ],
})
```

**レスポンス構造**:
```typescript
{
  object: "list",
  results: [
    {
      object: "page",
      id: "29c4f9d8-9717-806f-a23d-cfd71f7a1817",
      created_time: "2025-10-30T07:40:00.000Z",
      last_edited_time: "2025-10-30T08:12:00.000Z",
      url: "https://www.notion.so/1-29c4f9d89717806fa23dcfd71f7a1817",
      properties: {
        // プロパティの詳細は次のセクションを参照
      }
    },
    // ... 他のページ
  ],
  next_cursor: null,
  has_more: false
}
```

**プロパティの詳細構造**:

#### Name (title)
```json
{
  "Name": {
    "id": "title",
    "type": "title",
    "title": [
      {
        "type": "text",
        "text": {
          "content": "テストページ1",
          "link": null
        },
        "plain_text": "テストページ1"
      }
    ]
  }
}
```

**抽出方法**: `page.properties.Name.title[0].plain_text`

#### ID (unique_id)
```json
{
  "ID": {
    "id": "_Kt%3B",
    "type": "unique_id",
    "unique_id": {
      "prefix": null,
      "number": 1
    }
  }
}
```

**抽出方法**: `page.properties.ID.unique_id.number` → 数値を文字列化

#### Tags (multi_select)
```json
{
  "Tags": {
    "id": "MLnh",
    "type": "multi_select",
    "multi_select": [
      {
        "id": "ca8b9239-52d8-4e41-b1a5-04be8b3927a4",
        "name": "プレスリリース",
        "color": "blue"
      }
    ]
  }
}
```

**抽出方法**: `page.properties.Tags.multi_select.map(tag => tag.name)`

#### Date (date)
```json
{
  "Date": {
    "id": "UHeB",
    "type": "date",
    "date": {
      "start": "2025-10-29",
      "end": null,
      "time_zone": null
    }
  }
}
```

**抽出方法**: `page.properties.Date.date.start`

#### Description (rich_text)
```json
{
  "Description": {
    "id": "%5DRat",
    "type": "rich_text",
    "rich_text": [
      {
        "type": "text",
        "text": {
          "content": "テストページ1の説明文です",
          "link": null
        },
        "plain_text": "テストページ1の説明文です"
      }
    ]
  }
}
```

**抽出方法**: `page.properties.Description.rich_text[0]?.plain_text || ''`

#### Thumbnail (files)
```json
{
  "Thumbnail": {
    "id": "%3B%60%3BC",
    "type": "files",
    "files": [
      {
        "name": "23faeffcb45457cb04d9d2e9d23f164186f36c91.png",
        "type": "file",
        "file": {
          "url": "https://prod-files-secure.s3.us-west-2.amazonaws.com/.../image.png?X-Amz-...",
          "expiry_time": "2025-10-30T09:11:33.239Z"
        }
      }
    ]
  }
}
```

**抽出方法**:
```typescript
const thumbnail = page.properties.Thumbnail.files[0]
const url = thumbnail?.type === 'file'
  ? thumbnail.file.url
  : thumbnail?.external?.url || ''
```

**⚠️ 注意**:
- 画像URLには有効期限（expiry_time）があり、約1時間で期限切れになります
- キャッシュする場合は定期的に再取得が必要です

### 6.2 詳細ページのレスポンス

**APIエンドポイント**: `notion.pages.retrieve()` + `notion.blocks.children.list()`

#### ページ情報取得

**リクエスト例**:
```typescript
const page = await notion.pages.retrieve({
  page_id: pageId
})
```

**レスポンス**: 一覧ページと同じ構造のプロパティが返ります

#### ブロック（本文）取得

**リクエスト例**:
```typescript
const blocks = await notion.blocks.children.list({
  block_id: pageId,
  page_size: 100,
})
```

**レスポンス構造**:
```typescript
{
  object: "list",
  results: [
    {
      object: "block",
      id: "29c4f9d8-9717-8079-af27-e995a2459b25",
      type: "heading_1",
      has_children: false,
      // ブロックタイプ固有のプロパティ
      heading_1: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "見出し1",
              link: null
            },
            plain_text: "見出し1"
          }
        ],
        is_toggleable: false,
        color: "default"
      }
    },
    // ... 他のブロック
  ],
  next_cursor: null,
  has_more: false
}
```

**対応するブロックタイプ**:

#### heading_1, heading_2, heading_3
```json
{
  "type": "heading_1",
  "heading_1": {
    "rich_text": [
      {
        "plain_text": "見出し1"
      }
    ]
  }
}
```

**Markdown変換**: `# 見出し1`

#### paragraph
```json
{
  "type": "paragraph",
  "paragraph": {
    "rich_text": [
      {
        "plain_text": "これは段落のテキストです。"
      }
    ]
  }
}
```

**Markdown変換**: `これは段落のテキストです。`

#### bulleted_list_item
```json
{
  "type": "bulleted_list_item",
  "bulleted_list_item": {
    "rich_text": [
      {
        "plain_text": "箇条書き項目1"
      }
    ]
  }
}
```

**Markdown変換**: `- 箇条書き項目1`

#### numbered_list_item
```json
{
  "type": "numbered_list_item",
  "numbered_list_item": {
    "rich_text": [
      {
        "plain_text": "番号付きリスト1"
      }
    ]
  }
}
```

**Markdown変換**: `1. 番号付きリスト1`

#### code
```json
{
  "type": "code",
  "code": {
    "language": "javascript",
    "rich_text": [
      {
        "plain_text": "console.log('Hello World')"
      }
    ]
  }
}
```

**Markdown変換**:
````markdown
```javascript
console.log('Hello World')
```
````

#### quote
```json
{
  "type": "quote",
  "quote": {
    "rich_text": [
      {
        "plain_text": "引用テキスト"
      }
    ]
  }
}
```

**Markdown変換**: `> 引用テキスト`

#### divider
```json
{
  "type": "divider",
  "divider": {}
}
```

**Markdown変換**: `---`

#### image
```json
{
  "type": "image",
  "image": {
    "type": "file",
    "file": {
      "url": "https://prod-files-secure.s3.us-west-2.amazonaws.com/.../image.png",
      "expiry_time": "2025-10-30T09:11:33.239Z"
    }
  }
}
```

**Markdown変換**: `![image](url)`

### 6.3 実装時のデータ変換フロー

**一覧ページ**:
```typescript
// Notion API レスポンス → NewsListItem
{
  id: String(page.properties.ID.unique_id.number),
  title: page.properties.Name.title[0].plain_text,
  date: page.properties.Date.date.start,
  category: page.properties.Tags.multi_select[0]?.name || '', // 後で複数対応
  tags: page.properties.Tags.multi_select.map(t => t.name),
  imageUrl: page.properties.Thumbnail.files[0]?.file?.url || DEFAULT_IMAGE,
  summary: page.properties.Description.rich_text[0]?.plain_text || ''
}
```

**詳細ページ**:
```typescript
// Notion API レスポンス → NewsPost
{
  id: String(page.properties.ID.unique_id.number),
  title: page.properties.Name.title[0].plain_text,
  date: page.properties.Date.date.start,
  tags: page.properties.Tags.multi_select.map(t => t.name),
  summary: page.properties.Description.rich_text[0]?.plain_text || '',
  thumbnail: page.properties.Thumbnail.files[0]?.file?.url || DEFAULT_IMAGE,
  content: blocksToMarkdown(blocks.results) // Markdownに変換
}
```

## 7. 実装詳細

### 7.1 必要なパッケージ

```bash
npm install @notionhq/client
npm install notion-to-md
```

### 7.2 環境変数

**.env.local:**
```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_NEWS_DATABASE_ID=29c4f9d8-9717-80af-ac91-000b453a06ba
```

### 7.3 エラーハンドリング

```typescript
// Notion API呼び出し時のエラー
try {
  const response = await notion.databases.query(...)
} catch (error) {
  if (error.code === 'unauthorized') {
    // Integration権限エラー → 500エラーページ
    throw new Error('Notion API認証エラー')
  } else if (error.code === 'object_not_found') {
    // DB/ページが見つからない → 404エラーページ
    notFound()
  } else if (error.code === 'rate_limited') {
    // レート制限 → リトライまたは503エラー
    throw new Error('一時的にアクセスできません')
  } else {
    // その他のエラー → 500エラーページ
    throw new Error('データの取得に失敗しました')
  }
}
```

**エラー時のUI:**
- **404エラー**: Next.jsの`not-found.tsx`を表示
- **500エラー**: Next.jsの`error.tsx`を表示
- **画像読み込みエラー**: デフォルト画像にフォールバック

### 7.4 キャッシュ戦略

- SSRのため、デフォルトではリクエスト毎にNotion APIを呼び出す
- Next.js 13+ の `fetch` オプションでキャッシュ制御:

```typescript
// 例: 5分間キャッシュ
export const revalidate = 300

// または fetch レベルで制御
fetch(url, { next: { revalidate: 300 } })
```

**⚠️ 画像URLの有効期限に注意**:
- Notion S3画像URLは約1時間で期限切れ
- キャッシュ時間は画像URLの有効期限を考慮すること

## 8. 実装計画

### 8.1 一括移行アプローチ

**後方互換性は考慮せず、一気に全て置き換える方針**

1. **Phase 1: 基盤構築**
   - 環境変数設定
   - 必要なパッケージインストール
   - Notion APIクライアント実装
   - 型定義作成
   - blocks-to-markdown実装

2. **Phase 2: データレイヤー刷新**
   - src/types/news.ts 新規作成
   - src/lib/notion/ 配下の全ファイル実装
   - src/lib/news.ts を完全に書き換え

3. **Phase 3: UI完全刷新**
   - NewsItem.tsx を複数タグ対応に書き換え
   - NewsListSection.tsx を書き換え
   - NewsDetailContentSection.tsx を書き換え

4. **Phase 4: ページ書き換え**
   - src/app/news/page.tsx をSSR対応
   - src/app/news/[slug]/ → src/app/news/[id]/ にリネーム
   - src/app/news/[id]/page.tsx をSSR対応

5. **Phase 5: 旧システム削除**
   - src/lib/mdx.ts 削除
   - content/news/ ディレクトリ削除

6. **Phase 6: 動作確認**
   - 一覧ページ表示確認
   - 詳細ページ表示確認
   - 複数タグ表示確認
   - エラーケース確認

## 9. テスト要件

### 9.1 単体テスト
- Notion APIクライアントの各関数
- blocks-to-markdown変換ロジック
- データ整形ロジック

### 9.2 統合テスト
- Notion API → データ取得 → UI表示
- エラーケース（DB未接続、ページ削除等）

### 9.3 手動テスト
- [ ] 一覧ページでNotionデータが表示される
- [ ] 詳細ページ (`/news/1`, `/news/2`等) が正しく表示される
- [ ] 詳細ページでページ本文が正しくMarkdown変換される
- [ ] 複数タグが横並びで表示される
- [ ] 画像が正しく表示される
- [ ] 画像読み込みエラー時にデフォルト画像が表示される
- [ ] 存在しないID (`/news/999`) にアクセスすると404エラーが表示される
- [ ] Notionで編集後、ページをリロードすると即座に反映される

## 10. パフォーマンス考慮事項

- Notion APIのレート制限: 3 requests/second
- SSRのため、ページロードがNotion APIレスポンスに依存
- 必要に応じてNext.jsのキャッシュ機構を活用
- 画像はNotionホスティングまたはCDNにアップロード推奨

## 11. 今後の拡張性

- Recruit機能も同様にNotion連携可能
- Notionのステータスプロパティで下書き/公開管理
- Notionのリレーションプロパティで関連記事機能
- Webhookによる自動再検証（ISR）