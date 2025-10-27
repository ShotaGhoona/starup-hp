'use client'
import Image from 'next/image'
import TransitionLink from '@/components/ui/TransitionLink'
import { useState, useEffect } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isDarkBackground, setIsDarkBackground] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkBackground = () => {
      // 背景の明度を判定
      const elements = document.elementsFromPoint(window.innerWidth / 2, 120)
      let isDark = false
      
      // data-bg属性をチェック
      for (const element of elements) {
        const bgAttribute = element.getAttribute('data-bg')
        if (bgAttribute === 'dark') {
          isDark = true
          break
        } else if (bgAttribute === 'light') {
          isDark = false
          break
        }
      }
      
      // data-bg属性がない場合は従来の方法で判定
      if (!isDark) {
        let backgroundColor = '#ffffff'
        
        for (const element of elements) {
          const computedStyle = window.getComputedStyle(element)
          const bgColor = computedStyle.backgroundColor
          
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            backgroundColor = bgColor
            break
          }
        }
        
        // RGB値を取得して明度を計算
        const rgb = backgroundColor.match(/\d+/g)
        if (rgb) {
          const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000
          isDark = brightness < 128
        }
      }
      
      setIsDarkBackground(isDark)
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // デスクトップのみでヘッダーを隠す
      if (window.innerWidth >= 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
      } else {
        // モバイルでは常に表示
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
      checkBackground()
    }

    // 初期チェック（複数回実行で確実に）
    checkBackground()
    setTimeout(checkBackground, 50)
    setTimeout(checkBackground, 200)
    setTimeout(checkBackground, 500)
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('load', checkBackground)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('load', checkBackground)
    }
  }, [lastScrollY])
  const navItems = [
    { label: 'News', href: '/news' },
    { label: 'About', href: '/about' },
    { label: 'Member', href: '/member' },
    { label: 'Career', href: '/recruit' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className={`flex items-center justify-between w-full mx-auto md:max-w-[1500px] md:mt-8 md:h-[70px] md:px-10 md:backdrop-blur-sm md:rounded-sm md:shadow-[4px_4px_20px_0px_rgba(0,0,0,0.1)] h-16 px-4 backdrop-blur-sm transition-colors duration-300 ${
        isDarkBackground ? 'bg-white/10' : 'bg-black/10'
      }`}>
        {/* ロゴとパンくずリスト */}
        <div className="flex items-end space-x-2 flex-1">
          <TransitionLink href="/" className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Image
                src={isDarkBackground ? "/icons/starup-logo-white.svg" : "/icons/starup-logo.svg"}
                alt="Starup Logo"
                width={60}
                height={35}
                className="w-[32px] h-[20px] md:w-[40px] md:h-[25px]"
              />
              <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                isDarkBackground ? 'text-white' : 'text-black'
              }`}>STAR UP</span>
            </div>
          </TransitionLink>
          
          {/* パンくずリスト - デスクトップのみ */}
          <div className="hidden md:block">
            <Breadcrumb isDarkBackground={isDarkBackground} />
          </div>
        </div>

        {/* デスクトップナビゲーション */}
        <nav className="hidden md:flex items-center justify-between ml-8">
          <ul className="flex items-center space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <TransitionLink
                  href={item.href}
                  className={`font-inter font-bold text-base leading-[170%] tracking-[0.04em] hover:opacity-80 transition-all duration-300 ${
                    isDarkBackground ? 'text-white' : 'text-black'
                  }`}
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ハンバーガーメニューボタン - モバイルのみ */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="メニューを開く"
        >
          <span className={`absolute w-6 h-0.5 transition-all duration-300 ${
            isDarkBackground ? 'bg-white' : 'bg-black'
          } ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
          <span className={`absolute w-6 h-0.5 transition-all duration-300 ${
            isDarkBackground ? 'bg-white' : 'bg-black'
          } ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`absolute w-6 h-0.5 transition-all duration-300 ${
            isDarkBackground ? 'bg-white' : 'bg-black'
          } ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
        </button>
      </div>

      {/* モバイルメニュー */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className={`backdrop-blur-sm ${
          isDarkBackground ? 'bg-white/10' : 'bg-black/10'
        } border-t ${
          isDarkBackground ? 'border-white/20' : 'border-black/20'
        }`}>
          <ul className="px-4 py-4 space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <TransitionLink
                  href={item.href}
                  className={`block py-2 font-inter font-normal text-base leading-[170%] tracking-[0.04em] hover:opacity-80 transition-all duration-300 ${
                    isDarkBackground ? 'text-white' : 'text-black'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header