/**
 * CodeBlock Component
 * コピーボタン付きのコードブロックコンポーネント
 */

'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  variant?: 'mobile' | 'desktop'
}

export default function CodeBlock({ code, language = 'plaintext', variant = 'desktop' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const isMobile = variant === 'mobile'
  const containerClass = isMobile
    ? 'group relative bg-gray-50 rounded p-3 my-4 overflow-x-auto border border-gray-200'
    : 'group relative bg-gray-50 rounded-lg p-4 my-6 overflow-x-auto border border-gray-200'
  const codeClass = 'text-gray-800 font-mono text-sm block'

  return (
    <div className={containerClass}>
      {/* コピーボタン（ホバー時に表示） */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-white border border-gray-300 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity duration-200 shadow-sm"
        aria-label="Copy code"
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          // チェックアイコン
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          // コピーアイコン
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>

      {/* コードブロック */}
      <pre>
        <code className={`${codeClass} language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
