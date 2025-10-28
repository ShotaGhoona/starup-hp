import { getAllNewsForList } from '@/lib/news'
import NewsItem from '@/components/ui/NewsItem'
import TypingText from '@/components/ui/TypingText'

export default function NewsListSection() {
  const allNews = getAllNewsForList()

  return (
    <section className="flex flex-col items-center justify-center bg-white py-20 md:py-40">
      <div className="max-w-[1500px] mx-auto px-4">
        <h2 className="text-4xl md:text-7xl text-gray-900 leading-relaxed">Story</h2>
        <div className="my-6 md:my-8">
          <p className="text-sm lg:text-base text-gray-600">すべてのニュースと最新情報をご覧いただけます。</p>
          <TypingText
            text="Explore all our news and latest updates from our journey."
            className="text-2xl md:text-3xl lg:text-6xl"
          />
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