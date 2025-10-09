'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InteractiveBlackhole from '@/components/animation/interactive-blackhole/InteractiveBlackhole'

export default function NotFound() {
  const router = useRouter()
  const [isExploding, setIsExploding] = useState(false)

  const handleBackToHome = () => {
    setIsExploding(true)
    
    // ブラックホールが広がる時間に合わせて3秒後にページ遷移
    setTimeout(() => {
      router.push('/')
    }, 3000) // 3秒後にページ遷移
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

      {/* コンテンツ */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-8 lg:px-16">
          
          {/* 左側: 404エラー */}
          <div className={`flex-1 max-w-2xl transition-opacity duration-3000 ${isExploding ? 'opacity-0' : 'opacity-100'}`}>
            <div className="space-y-8">
              {/* 404テキスト */}
              <div className="space-y-4">
                <h1 className="text-8xl lg:text-9xl font-bold text-gray-300 leading-none">
                  404
                </h1>
                <div className="text-2xl lg:text-3xl font-semibold text-gray-600">
                  Page Not Found
                </div>
              </div>

              {/* 説明文 */}
              <div className="space-y-4 text-gray-500">
                <p className="text-lg">
                  お探しのページは宇宙の彼方に消えてしまったようです。
                </p>
                <p className="text-base">
                  右側のポータルをクリックして、安全な場所へ帰還しましょう。
                </p>
              </div>
            </div>
          </div>

          {/* 右側: インタラクティブブラックホール */}
          <div className="flex-shrink-0 flex items-center justify-center w-full h-screen absolute right-0 top-0 pointer-events-none">
            <div className="pointer-events-auto translate-x-1/4">
              <InteractiveBlackhole 
                className="w-screen h-screen" 
                onPortalClick={handleBackToHome}
              />
            </div>
          </div>
        </div>
      </div>


      {/* カスタムCSS */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        .duration-3000 {
          transition-duration: 3000ms;
        }
      `}</style>
    </div>
  )
}