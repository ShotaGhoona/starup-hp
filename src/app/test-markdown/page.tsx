/**
 * Markdown Test Page
 * MarkdownContentコンポーネントのテストページ
 */

import MarkdownContent from '@/components/ui/MarkdownContent'

const testMarkdown = `# テストページ

これは通常の段落です。

> これは引用ブロックです。Notionのスタイルに合わせています。

## コードブロックのテスト

\`\`\`javascript
function hello() {
  console.log('Hello, World!')
  return true
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
    return True
\`\`\`

\`\`\`
言語指定なしのコードブロック
テストテストテスト
\`\`\`

## その他の機能

**太字のテキスト**

リンク: <https://example.com>

- 箇条書き項目1
- 箇条書き項目2

1. 番号付きリスト1
1. 番号付きリスト2

---

終わり。
`

export default function TestMarkdownPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Markdown Test Page</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Desktop Version</h2>
          <div className="border border-gray-300 rounded-lg p-8">
            <MarkdownContent content={testMarkdown} variant="desktop" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Mobile Version</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <MarkdownContent content={testMarkdown} variant="mobile" />
          </div>
        </div>
      </div>
    </div>
  )
}
