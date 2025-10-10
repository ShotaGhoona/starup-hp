
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function NewsListHeroSection() {
  return (
    <section 
      className="relative pb-20 px-8 pt-60 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/news/news-hero-bg.jpg')"
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">NEWS</h1>
          <h2 className="text-base font-bold text-white">ニュース</h2>
        </div>
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-white/80">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight size={16} className="text-white/60" />
            </li>
            <li className="text-white font-medium">
              News
            </li>
          </ol>
        </nav>
      </div>
    </section>
  )
}