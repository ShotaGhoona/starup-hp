import { getAllNewsForList } from '@/lib/news'
import NewsItem from '@/components/ui/NewsItem'

export default function NewsListSection() {
  const allNews = getAllNewsForList()
  return (
    <section className="pb-32 bg-white pt-48">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="mb-16">
          <p className="text-sm lg:text-base text-gray-600">すべてのニュースと最新情報をご覧いただけます。</p>
          <p className="text-3xl lg:text-6xl">Explore all our news and latest updates from our journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {allNews.map((item) => (
            <NewsItem 
              key={item.id} 
              item={item} 
              showDivider={true} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}