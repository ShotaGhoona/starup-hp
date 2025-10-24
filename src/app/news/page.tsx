
import NewsListSection from '@/components/sections/news-list/NewsListSection'
import Header2 from '@/components/layout/Header2'
import Footer2 from '@/components/layout/Footer2'
import Background from '@/components/layout/Background'

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <Header2 />
      <NewsListSection />
      <Footer2 />
    </div>
  )
}