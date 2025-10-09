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
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // ページが変わったときの処理
    if (isVisible) {
      setIsTransitioning(true)
      setIsVisible(false)
      
      // より長い遅延でスムーズな遷移
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsVisible(true)
        setIsTransitioning(false)
      }, 800) // 800ms遅延でより自然な遷移

      return () => clearTimeout(timer)
    }
  }, [pathname, children, isVisible])

  useEffect(() => {
    // 初回マウント時にフェードイン（少し遅延）
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* トランジション用のオーバーレイ */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/20 to-black/50"></div>
        </div>
      )}
      
      <div 
        className={`transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}
      >
        {displayChildren}
      </div>
      
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </>
  )
}