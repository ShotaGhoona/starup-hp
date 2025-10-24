'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  [key: string]: any
}

export default function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    // 外部リンクやアンカーリンクの場合は通常通り
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
      if (onClick) onClick(e)
      return
    }

    // 同じページの場合は何もしない
    if (href === window.location.pathname) {
      e.preventDefault()
      if (onClick) onClick(e)
      return
    }

    e.preventDefault()
    
    // onClickがある場合は実行
    if (onClick) onClick(e)

    // トランジションイベントを発火
    window.dispatchEvent(new CustomEvent('startPageTransition', { detail: { href } }))
    
    // 300ms後にナビゲーション（グレーが画面を覆った時）
    setTimeout(() => {
      router.push(href)
    }, 300)
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}