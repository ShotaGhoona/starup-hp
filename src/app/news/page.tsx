
import NewsListSection from '@/components/sections/news/NewsListSection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <NewsListSection />
      <Footer />
    </div>
  )
}