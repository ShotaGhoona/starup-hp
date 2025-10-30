/**
 * Test Image Markdown Conversion
 * 画像付きMarkdownの変換をテスト
 */

const testMarkdown = `# テストページ1

![image](https://example.com/image.jpg)

## 見出し2

これは段落のテキストです。

**太字のテキスト**

- 箇条書き項目1
- 箇条書き項目2

リンク: <https://example.com>`

console.log('=== Original Markdown ===')
console.log(testMarkdown)
console.log('\n=== Converted HTML ===')

// MarkdownContent.tsxと同じロジック（デスクトップ版）
const html = testMarkdown
  .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
  .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">$1</h2>')
  .replace(/^### (.+)$/gm, '<h3 class="text-xl font-medium text-gray-800 mt-6 mb-3">$1</h3>')
  // 画像処理（リンクより先）
  .replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="w-full h-auto my-4 rounded-lg" loading="lazy" />'
  )
  .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
  .replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  .replace(
    /<(https?:\/\/[^>]+)>/g,
    '<a href="$1" class="text-blue-600 hover:text-blue-800 underline break-all" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
  .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-2 list-decimal">$2</li>')
  .replace(/\n\n/g, '</p><p class="mb-4 text-gray-600 leading-relaxed">')
  .replace(/^(.+)$/gm, '<p class="mb-4 text-gray-600 leading-relaxed">$1</p>')
  .replace(/---/g, '<hr class="my-8 border-gray-300" />')

console.log(html)
