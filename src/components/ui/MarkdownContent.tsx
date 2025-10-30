/**
 * MarkdownContent Component
 * Markdownコンテンツを安全にHTMLに変換して表示するコンポーネント
 */

import Image from 'next/image'
import parse, { Element, domToReact, HTMLReactParserOptions } from 'html-react-parser'

interface MarkdownContentProps {
  content: string
  className?: string
  variant?: 'mobile' | 'desktop'
}

/**
 * MarkdownをHTMLに変換
 * @param markdown - Markdown文字列
 * @param variant - モバイルまたはデスクトップ用のスタイル
 * @returns HTML文字列
 */
function convertMarkdownToHtml(markdown: string, variant: 'mobile' | 'desktop' = 'desktop'): string {
  const isMobile = variant === 'mobile'

  // 見出しのスタイル
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

  return markdown
    // 見出し
    .replace(/^# (.+)$/gm, `<h1 class="${h1Class}">$1</h1>`)
    .replace(/^## (.+)$/gm, `<h2 class="${h2Class}">$1</h2>`)
    .replace(/^### (.+)$/gm, `<h3 class="${h3Class}">$1</h3>`)
    // 画像 - ![alt](url) 形式（リンクより先に処理）
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="w-full h-auto my-4 rounded-lg" loading="lazy" />'
    )
    // 太字（インライン）
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // リンク - [テキスト](URL) 形式
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // リンク - <URL> 形式（自動リンク）
    .replace(
      /<(https?:\/\/[^>]+)>/g,
      '<a href="$1" class="text-blue-600 hover:text-blue-800 underline break-all" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // リスト
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-2 list-decimal">$2</li>')
    // 段落区切り
    .replace(/\n\n/g, `</p><p class="${pClass}">`)
    .replace(/^(.+)$/gm, `<p class="${pClass}">$1</p>`)
    // 水平線
    .replace(/---/g, `<hr class="${hrClass}" />`)
}

/**
 * MarkdownContentコンポーネント
 * Markdownを安全にHTMLに変換して表示
 */
export default function MarkdownContent({
  content,
  className = '',
  variant = 'desktop'
}: MarkdownContentProps) {
  const html = convertMarkdownToHtml(content, variant)

  // HTMLパーサーのオプション: imgタグをNext.js Imageに置き換え
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'img') {
        const { src, alt } = domNode.attribs

        if (!src) return null

        return (
          <div className="relative w-full my-4">
            <Image
              src={src}
              alt={alt || 'image'}
              width={1200}
              height={675}
              className="w-full h-auto rounded-lg"
              style={{ objectFit: 'cover' }}
              unoptimized // NotionのURLは外部URLなので最適化をスキップ
            />
          </div>
        )
      }
    }
  }

  return (
    <div className={`leading-relaxed ${className}`}>
      {parse(html, options)}
    </div>
  )
}
