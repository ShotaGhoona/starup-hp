import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const navItems = [
    { label: '新着情報', href: '/news' },
    { label: '会社概要', href: '/company' },
    { label: '事業概要', href: '/business' },
    { label: '会社概要', href: '/about' },
    { label: 'メンバー', href: '/members' },
    { label: '採用', href: '/careers' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="flex items-center justify-between mt-[54.79px] w-[1200px] h-[100px] px-10 bg-white/80 rounded-[50px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.1)]">
        {/* ロゴ */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/icons/starup-logo.svg"
            alt="Starup Logo"
            width={60}
            height={35}
            className="w-[60px] h-[35px]"
          />
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center justify-between ml-8">
          <ul className="flex items-center space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-black font-inter font-normal text-base leading-[170%] tracking-[0.04em] hover:opacity-80 transition-opacity"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTAボタン */}
          <Link
            href="/contact"
            className="ml-8 px-6 py-3 bg-gradient-to-r from-[#0810BC] to-[#414BA3] text-white font-inter font-normal rounded-full hover:opacity-90 transition-opacity"
          >
            お問い合わせ
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header