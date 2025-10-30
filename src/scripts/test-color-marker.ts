/**
 * Test Color and Marker Conversion
 * 色とマーカーの変換をテスト
 */

import { richTextToMarkdown } from '../lib/notion/blocks-to-markdown'
import type { NotionRichText } from '../lib/notion/types'

// テストデータ: 各色のテキスト
const colorTests: NotionRichText[] = [
  {
    type: 'text',
    text: { content: 'red text', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'red',
    },
    plain_text: 'red text',
    href: null,
  },
  {
    type: 'text',
    text: { content: 'pink text', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'pink',
    },
    plain_text: 'pink text',
    href: null,
  },
  {
    type: 'text',
    text: { content: 'purple text', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'purple',
    },
    plain_text: 'purple text',
    href: null,
  },
  {
    type: 'text',
    text: { content: 'blue text', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'blue',
    },
    plain_text: 'blue text',
    href: null,
  },
  {
    type: 'text',
    text: { content: 'green text', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'green',
    },
    plain_text: 'green text',
    href: null,
  },
]

// テストデータ: 各マーカー
const markerTests: NotionRichText[] = [
  {
    type: 'text',
    text: { content: 'red marker', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'red_background',
    },
    plain_text: 'red marker',
    href: null,
  },
  {
    type: 'text',
    text: { content: 'yellow marker', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'yellow_background',
    },
    plain_text: 'yellow marker',
    href: null,
  },
  {
    type: 'text',
    text: { content: 'green marker', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'green_background',
    },
    plain_text: 'green marker',
    href: null,
  },
]

// テストデータ: 複合（太字 + 色）
const combinedTests: NotionRichText[] = [
  {
    type: 'text',
    text: { content: 'bold red text', link: null },
    annotations: {
      bold: true,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'red',
    },
    plain_text: 'bold red text',
    href: null,
  },
  {
    type: 'text',
    text: { content: 'bold with yellow marker', link: null },
    annotations: {
      bold: true,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'yellow_background',
    },
    plain_text: 'bold with yellow marker',
    href: null,
  },
]

console.log('=== Color Tests ===')
colorTests.forEach((test) => {
  const result = richTextToMarkdown([test])
  console.log(`${test.annotations.color}: ${result}`)
})

console.log('\n=== Marker Tests ===')
markerTests.forEach((test) => {
  const result = richTextToMarkdown([test])
  console.log(`${test.annotations.color}: ${result}`)
})

console.log('\n=== Combined Tests ===')
combinedTests.forEach((test) => {
  const result = richTextToMarkdown([test])
  console.log(`${test.annotations.color} (bold: ${test.annotations.bold}): ${result}`)
})

console.log('\n✅ Test completed')
