'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // ページが変わったときの処理
    setIsVisible(false)
    
    // 少し遅延してから新しいコンテンツを表示
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname, children])

  useEffect(() => {
    // 初回マウント時にフェードイン
    setIsVisible(true)
  }, [])

  return (
    <div 
      className={`transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {displayChildren}
    </div>
  )
}