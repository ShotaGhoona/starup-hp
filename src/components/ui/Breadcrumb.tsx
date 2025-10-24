'use client'

import TransitionLink from '@/components/ui/TransitionLink'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  isDarkBackground?: boolean
}

export default function Breadcrumb({ isDarkBackground = false }: BreadcrumbProps) {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []

    // パスからブレッドクラムを生成（Homeは含めない）
    let currentPath = ''
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`
      
      // セグメントをラベルに変換
      let label = segment
      switch (segment) {
        case 'news':
          label = 'ニュース'
          break
        case 'about':
          label = '会社概要'
          break
        case 'member':
          label = 'メンバー'
          break
        case 'contact':
          label = 'お問い合わせ'
          break
        default:
          // ニュース詳細ページの場合、簡潔なラベルを表示
          if (pathSegments[pathSegments.indexOf(segment) - 1] === 'news') {
            label = '記事詳細'
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1)
          }
      }

      items.push({ label, href: currentPath })
    })

    return items
  }, [pathname])

  // ホームページの場合はパンくずを表示しない
  if (pathname === '/') {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          {/* 最初の要素の前にも / を表示 */}
          <span className={`transition-colors duration-300 ${
            isDarkBackground ? 'text-white/60' : 'text-black/60'
          }`}>
            /
          </span>
          {index === breadcrumbs.length - 1 ? (
            <span className={`transition-colors duration-300 ${
              isDarkBackground ? 'text-white' : 'text-black'
            }`}>
              {item.label}
            </span>
          ) : (
            <TransitionLink
              href={item.href}
              className={`hover:opacity-80 transition-all duration-300 ${
                isDarkBackground ? 'text-white/80' : 'text-black/80'
              }`}
            >
              {item.label}
            </TransitionLink>
          )}
        </div>
      ))}
    </nav>
  )
}