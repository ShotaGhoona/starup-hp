/**
 * Notion Blocks to Markdown変換
 * NotionのブロックをMarkdown形式に変換
 */

import {
  NotionBlock,
  NotionRichText,
  NotionHeadingBlock,
  NotionParagraphBlock,
  NotionListItemBlock,
  NotionCodeBlock,
  NotionQuoteBlock,
  NotionImageBlock,
} from './types'

/**
 * Rich Textをプレーンテキストに変換
 *
 * @param richTexts - Notion Rich Text配列
 * @returns プレーンテキスト
 */
export function richTextToPlainText(richTexts: NotionRichText[]): string {
  if (!richTexts || richTexts.length === 0) {
    return ''
  }

  return richTexts.map((text) => text.plain_text).join('')
}

/**
 * Notionの色をTailwind CSSクラスにマッピング（Notionの淡い色に合わせる）
 */
const textColorMap: Record<string, string> = {
  red: 'text-red-500',
  pink: 'text-pink-500',
  purple: 'text-purple-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  yellow: 'text-yellow-600',
  orange: 'text-orange-500',
  brown: 'text-amber-700',
  gray: 'text-gray-500',
  default: '',
}

/**
 * Notionの背景色をTailwind CSSクラスにマッピング（Notionの淡いマーカーに合わせる）
 */
const backgroundColorMap: Record<string, string> = {
  red_background: 'bg-red-100',
  pink_background: 'bg-pink-100',
  purple_background: 'bg-purple-100',
  blue_background: 'bg-blue-100',
  green_background: 'bg-green-100',
  yellow_background: 'bg-yellow-100',
  orange_background: 'bg-orange-100',
  brown_background: 'bg-amber-100',
  gray_background: 'bg-gray-100',
}

/**
 * Rich TextをMarkdownに変換（装飾を含む）
 *
 * @param richTexts - Notion Rich Text配列
 * @returns Markdownテキスト
 */
export function richTextToMarkdown(richTexts: NotionRichText[]): string {
  if (!richTexts || richTexts.length === 0) {
    return ''
  }

  return richTexts
    .map((text) => {
      let content = text.plain_text

      // リンクがある場合の処理
      if (text.href) {
        // リンクテキストとURLが同じ場合は、生のURLのみを表示
        if (text.plain_text === text.href || text.plain_text.trim() === text.href.trim()) {
          return `<${text.href}>`
        }
        // リンクテキストとURLが異なる場合は、装飾を適用してからMarkdownリンク形式に
        if (text.annotations.bold) {
          content = `**${content}**`
        }
        if (text.annotations.italic) {
          content = `*${content}*`
        }
        if (text.annotations.strikethrough) {
          content = `~~${content}~~`
        }
        if (text.annotations.code) {
          content = `\`${content}\``
        }
        return `[${content}](${text.href})`
      }

      // リンクがない場合は通常の装飾を適用
      if (text.annotations.bold) {
        content = `**${content}**`
      }
      if (text.annotations.italic) {
        content = `*${content}*`
      }
      if (text.annotations.strikethrough) {
        content = `~~${content}~~`
      }
      if (text.annotations.code) {
        content = `\`${content}\``
      }
      if (text.annotations.underline) {
        content = `<u>${content}</u>`
      }

      // 色とマーカーの処理
      const color = text.annotations.color || 'default'
      const classes: string[] = []

      // 背景色（マーカー）の処理
      if (color.endsWith('_background')) {
        const bgClass = backgroundColorMap[color]
        if (bgClass) {
          classes.push(bgClass)
        }
      } else {
        // テキスト色の処理
        const textClass = textColorMap[color]
        if (textClass) {
          classes.push(textClass)
        }
      }

      // 色やマーカーがある場合はspanタグで囲む
      if (classes.length > 0) {
        content = `<span class="${classes.join(' ')}">${content}</span>`
      }

      return content
    })
    .join('')
}

/**
 * 単一のブロックをMarkdownに変換
 *
 * @param block - Notionブロック
 * @returns Markdown文字列
 */
export function blockToMarkdown(block: NotionBlock): string {
  switch (block.type) {
    case 'heading_1': {
      const headingBlock = block as NotionHeadingBlock
      const text = richTextToMarkdown(headingBlock.heading_1?.rich_text || [])
      return `# ${text}\n`
    }

    case 'heading_2': {
      const headingBlock = block as NotionHeadingBlock
      const text = richTextToMarkdown(headingBlock.heading_2?.rich_text || [])
      return `## ${text}\n`
    }

    case 'heading_3': {
      const headingBlock = block as NotionHeadingBlock
      const text = richTextToMarkdown(headingBlock.heading_3?.rich_text || [])
      return `### ${text}\n`
    }

    case 'paragraph': {
      const paragraphBlock = block as NotionParagraphBlock
      const text = richTextToMarkdown(paragraphBlock.paragraph.rich_text)
      return text ? `${text}\n` : '\n'
    }

    case 'bulleted_list_item': {
      const listBlock = block as NotionListItemBlock
      const text = richTextToMarkdown(
        listBlock.bulleted_list_item?.rich_text || []
      )
      return `- ${text}\n`
    }

    case 'numbered_list_item': {
      const listBlock = block as NotionListItemBlock
      const text = richTextToMarkdown(
        listBlock.numbered_list_item?.rich_text || []
      )
      return `1. ${text}\n`
    }

    case 'code': {
      const codeBlock = block as NotionCodeBlock
      const text = richTextToPlainText(codeBlock.code.rich_text)
      const language = codeBlock.code.language || ''
      return `\`\`\`${language}\n${text}\n\`\`\`\n`
    }

    case 'quote': {
      const quoteBlock = block as NotionQuoteBlock
      const text = richTextToMarkdown(quoteBlock.quote.rich_text)
      return `> ${text}\n`
    }

    case 'divider': {
      return `---\n`
    }

    case 'image': {
      const imageBlock = block as NotionImageBlock
      let url = ''

      if (imageBlock.image.type === 'file' && imageBlock.image.file) {
        url = imageBlock.image.file.url
      } else if (
        imageBlock.image.type === 'external' &&
        imageBlock.image.external
      ) {
        url = imageBlock.image.external.url
      }

      return url ? `![image](${url})\n` : ''
    }

    default: {
      // 未対応のブロックタイプはコメントとして出力
      console.warn(`Unsupported block type: ${block.type}`)
      return `<!-- Unsupported block type: ${block.type} -->\n`
    }
  }
}

/**
 * ブロック配列をMarkdownに変換
 *
 * @param blocks - Notionブロックの配列
 * @returns Markdown文字列
 */
export function blocksToMarkdown(blocks: NotionBlock[]): string {
  if (!blocks || blocks.length === 0) {
    return ''
  }

  const markdownLines: string[] = []

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const markdown = blockToMarkdown(block)
    markdownLines.push(markdown)

    // 段落と見出しの後に空行を追加（リストアイテムは除く）
    const needsExtraNewline =
      block.type === 'paragraph' ||
      block.type === 'heading_1' ||
      block.type === 'heading_2' ||
      block.type === 'heading_3' ||
      block.type === 'code' ||
      block.type === 'quote' ||
      block.type === 'divider'

    // 次のブロックがリストアイテムでない場合のみ空行を追加
    const nextBlock = blocks[i + 1]
    const nextIsListItem =
      nextBlock?.type === 'bulleted_list_item' ||
      nextBlock?.type === 'numbered_list_item'

    if (needsExtraNewline && nextBlock && !nextIsListItem) {
      markdownLines.push('\n')
    }

    // リストアイテムが終わったら空行を追加
    const currentIsListItem =
      block.type === 'bulleted_list_item' ||
      block.type === 'numbered_list_item'

    if (currentIsListItem && nextBlock && !nextIsListItem) {
      markdownLines.push('\n')
    }
  }

  return markdownLines.join('')
}
