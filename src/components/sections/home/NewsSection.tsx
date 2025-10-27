import { getLatestNews } from '@/lib/news'
import NewsItem from '@/components/ui/NewsItem'
import TransitionLink from '@/components/ui/TransitionLink'

export default function NewsSection() {
  const latestNews = getLatestNews(4)
  return (
    <section className="py-12 md:py-16 bg-gray-100 relative z-10">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="mb-12 md:mb-16">
          <p className="text-sm lg:text-base text-gray-600">最新の活動と取り組みをお知らせいたします。</p>
          <p className="text-2xl md:text-3xl lg:text-6xl">Stay updated with our latest news and innovations shaping the future.</p>
        </div>

        <div className="space-y-0 grid grid-cols-2 gap-4">
          {latestNews.slice(0, 2).map((item) => (
            <NewsItem 
              key={item.id} 
              item={item}
              showDivider={true}
            />
          ))}
          {latestNews.slice(2, 4).map((item) => (
            <NewsItem 
              key={item.id} 
              item={item}
              showDivider={true}
            />
          ))}
        </div>
        
        {/* View All News Link */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <TransitionLink 
            href="/news" 
            className="text-sm text-gray-800 hover:text-black transition-colors font-medium flex items-center gap-2 border-b border-gray-300 hover:border-black pb-1"
          >
            View All News
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </TransitionLink>
        </div>
      </div>
    </section>
  )
}