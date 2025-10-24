'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isDarkBackground, setIsDarkBackground] = useState(true)

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
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
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
    { label: '新着情報', href: '/news' },
    { label: '会社概要', href: '/company' },
    { label: '事業概要', href: '/business' },
    { label: '会社概要', href: '/about' },
    { label: 'メンバー', href: '/members' },
    { label: '採用', href: '/careers' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className={`flex items-center justify-between w-full max-w-[1500px] mx-auto mt-8 h-[70px] px-10 backdrop-blur-sm rounded-sm shadow-[4px_4px_20px_0px_rgba(0,0,0,0.1)] transition-colors duration-300 ${
        isDarkBackground ? 'bg-white/10' : 'bg-black/10'
      }`}>
        {/* ロゴ */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Image
              src={isDarkBackground ? "/icons/starup-logo-white.svg" : "/icons/starup-logo.svg"}
              alt="Starup Logo"
              width={60}
              height={35}
              className="w-[40px] h-[25px]"
            />
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkBackground ? 'text-white' : 'text-black'
            }`}>STAR UP</span>
          </div>
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center justify-between ml-8">
          <ul className="flex items-center space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`font-inter font-normal text-base leading-[170%] tracking-[0.04em] hover:opacity-80 transition-all duration-300 ${
                    isDarkBackground ? 'text-white' : 'text-black'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTAボタン */}
          <Link
            href="/contact"
            className={`ml-8 px-6 py-2 font-inter font-normal rounded-sm hover:opacity-90 transition-all duration-300 text-sm ${
              isDarkBackground ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header