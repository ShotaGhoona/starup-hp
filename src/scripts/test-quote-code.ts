/**
 * Test Quote and Code Block Conversion
 * 引用ブロックとコードブロックの変換をテスト
 */

const testMarkdown = `# テストページ

これは通常の段落です。

> これは引用ブロックです

## コードブロックのテスト

\`\`\`javascript
function hello() {
  console.log('Hello, World!')
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

\`\`\`
言語指定なしのコードブロック
\`\`\`

もう一度引用ブロック：

> 引用の中に**太字**を含む

**太字のテキスト**

終わり。
`

// MarkdownContent.tsxと同じロジックでHTMLに変換
function convertMarkdownToHtml(markdown: string, variant: 'mobile' | 'desktop' = 'desktop'): string {
  const isMobile = variant === 'mobile'

  const h1Class = isMobile
    ? 'text-2xl font-bold text-gray-900 mt-6 mb-4'
    : 'text-3xl font-bold text-gray-900 mt-8 mb-6'
  const h2Class = isMobile
    ? 'text-xl font-semibold text-gray-800 mt-6 mb-3'
    : 'text-2xl font-semibold text-gray-800 mt-8 mb-4'
  const h3Class = isMobile
    ? 'text-lg font-medium text-gray-800 mt-4 mb-2'
    : 'text-xl font-medium text-gray-800 mt-6 mb-3'
  const pClass = isMobile
    ? 'mb-4 text-gray-600 leading-relaxed text-sm'
    : 'mb-4 text-gray-600 leading-relaxed'
  const hrClass = isMobile
    ? 'my-6 border-gray-300'
    : 'my-8 border-gray-300'
  const blockquoteClass = isMobile
    ? 'border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-700 italic bg-gray-50 text-sm'
    : 'border-l-4 border-gray-300 pl-6 py-3 my-6 text-gray-700 italic bg-gray-50'
  const codeBlockClass = isMobile
    ? 'bg-gray-100 rounded p-3 my-4 overflow-x-auto text-sm'
    : 'bg-gray-100 rounded-lg p-4 my-6 overflow-x-auto'
  const codeClass = 'text-gray-800 font-mono text-sm'

  // プレースホルダーの配列（ブロック要素を一時保存）
  const placeholders: string[] = []
  let placeholderIndex = 0

  // ステップ1: コードブロックをプレースホルダーに置き換え
  let result = markdown.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, language, code) => {
      const lang = language || 'plaintext'
      const html = `<pre class="${codeBlockClass}"><code class="${codeClass} language-${lang}">${code.trim()}</code></pre>`
      const placeholder = `__PLACEHOLDER_${placeholderIndex}__`
      placeholders[placeholderIndex] = html
      placeholderIndex++
      return placeholder
    }
  )

  // ステップ2: その他のMarkdown変換
  result = result
    // 引用ブロック
    .replace(/^> (.+)$/gm, `<blockquote class="${blockquoteClass}">$1</blockquote>`)
    // 見出し
    .replace(/^# (.+)$/gm, `<h1 class="${h1Class}">$1</h1>`)
    .replace(/^## (.+)$/gm, `<h2 class="${h2Class}">$1</h2>`)
    .replace(/^### (.+)$/gm, `<h3 class="${h3Class}">$1</h3>`)
    // 水平線
    .replace(/^---$/gm, `<hr class="${hrClass}" />`)
    // 画像
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="w-full h-auto my-4 rounded-lg" loading="lazy" />'
    )
    // 太字
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // リンク
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(
      /<(https?:\/\/[^>]+)>/g,
      '<a href="$1" class="text-blue-600 hover:text-blue-800 underline break-all" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // リスト
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-2 list-decimal">$2</li>')

  // ステップ3: 段落処理（ブロック要素ではない行のみ）
  result = result
    .split('\n')
    .map(line => {
      // 空行をスキップ
      if (line.trim() === '') return ''
      // すでにHTMLタグで始まっている行はそのまま（見出し、リスト、引用など）
      if (line.match(/^<(h[123]|blockquote|hr|img|pre|li|ul|ol)/)) return line
      // プレースホルダーもそのまま
      if (line.match(/^__PLACEHOLDER_\d+__$/)) return line
      // それ以外は段落として扱う
      return `<p class="${pClass}">${line}</p>`
    })
    .join('\n')

  // ステップ4: プレースホルダーを実際のHTMLに戻す
  placeholders.forEach((html, index) => {
    result = result.replace(`__PLACEHOLDER_${index}__`, html)
  })

  return result
}

console.log('=== Original Markdown ===')
console.log(testMarkdown)
console.log('\n=== Converted HTML ===')
const html = convertMarkdownToHtml(testMarkdown)
console.log(html)
console.log('\n✅ Test completed')
