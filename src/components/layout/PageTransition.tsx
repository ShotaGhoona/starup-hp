'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [phase, setPhase] = useState(7) // 初期状態は非表示
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // ページが実際に変わった時の処理（新しいページを表示）
    setDisplayChildren(children)
    setPhase(4) // 画面を覆った状態から開始
    
    // 左に消えていくアニメーション
    const timer1 = setTimeout(() => setPhase(5), 100)
    const timer2 = setTimeout(() => setPhase(6), 200) 
    const timer3 = setTimeout(() => setPhase(7), 300)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname, children])

  useEffect(() => {
    // カスタムイベントでトランジション開始を監視
    const handleTransitionStart = () => {
      setPhase(1) // アニメーション開始
      
      const timer1 = setTimeout(() => setPhase(2), 50)
      const timer2 = setTimeout(() => setPhase(3), 100)
      const timer3 = setTimeout(() => setPhase(4), 150) // 画面全体を覆う
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }

    window.addEventListener('startPageTransition', handleTransitionStart)
    
    return () => {
      window.removeEventListener('startPageTransition', handleTransitionStart)
    }
  }, [])

  const getClipPath = () => {
    switch (phase) {
      case 1: return 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)'           // 左上から点で開始
      case 2: return 'polygon(0% 0%, 15% 0%, 0% 0%, 0% 0%)'         // 上部が右に伸びる
      case 3: return 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)'   // 右側の斜め線が現れる
      case 4: return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'  // 画面全体（右側垂直）
      case 5: return 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' // 左上が移動開始
      case 6: return 'polygon(100% 0%, 100% 0%, 100% 100%, 85% 100%)' // 左側が斜めに消える
      case 7: return 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)' // 右下の点で終了
      default: return 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)'
    }
  }

  return (
    <>
      {/* グレーの四角形トランジション */}
      <div
        className="fixed inset-0 z-[9999] transition-all duration-100 ease-in-out overflow-hidden"
        style={{
          clipPath: getClipPath(),
        }}
      >
        {/* 100vw/100vhの固定コンテナ */}
        <div className="relative w-screen h-screen bg-gray-100">
          {/* STARUPロゴとテキスト - 常に画面中央 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-6">
              {/* ロゴ部分 */}
              <div className="relative glitch-logo">
                <Image
                  src="/icons/starup-logo.svg"
                  alt="STARUP Logo"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px]"
                />
              </div>
              
              {/* テキスト部分 */}
              <h1 className="glitch-text" data-text="STAR UP">
                STAR UP
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* ページコンテンツ */}
      <div>
        {displayChildren}
      </div>
    </>
  )
}