'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
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
    <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="flex items-center justify-between w-full max-w-[1500px] mx-auto mt-8 h-[70px] px-10 bg-white/10 backdrop-blur-sm rounded-sm shadow-[4px_4px_20px_0px_rgba(0,0,0,0.1)]">
        {/* ロゴ */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Image
              src="/icons/starup-logo-white.svg"
              alt="Starup Logo"
              width={60}
              height={35}
              className="w-[40px] h-[25px]"
            />
            <span className="text-white text-2xl font-bold">STAR UP</span>
          </div>
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center justify-between ml-8">
          <ul className="flex items-center space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-white font-inter font-normal text-base leading-[170%] tracking-[0.04em] hover:opacity-80 transition-opacity"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTAボタン */}
          <Link
            href="/contact"
            className="ml-8 px-6 py-2 bg-white text-black font-inter font-normal rounded-sm hover:opacity-90 transition-opacity text-sm"
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header