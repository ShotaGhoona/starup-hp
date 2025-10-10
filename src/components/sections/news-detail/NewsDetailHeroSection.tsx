import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { NewsPost } from '@/lib/mdx'

interface NewsDetailHeroSectionProps {
  post: NewsPost
}

export default function NewsDetailHeroSection({ post }: NewsDetailHeroSectionProps) {
  return (
    <section 
      className="relative pb-20 px-8 pt-60 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/news/news-hero-bg.jpg')"
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative max-w-7xl mx-auto z-10">
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
            <li>
              <Link href="/news" className="hover:text-white transition-colors">
                News
              </Link>
            </li>
            <li>
              <ChevronRight size={16} className="text-white/60" />
            </li>
            <li className="text-white font-medium truncate max-w-xs">
              {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
            </li>
          </ol>
        </nav>

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white border border-white/30 bg-white/10 backdrop-blur-sm">
              {post.category}
            </span>
            <time className="text-sm text-white/80">{post.date}</time>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-lg text-white/90 leading-relaxed max-w-3xl">
            {post.summary}
          </p>
        </div>
      </div>
    </section>
  )
}