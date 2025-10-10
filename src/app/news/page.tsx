import NewsListHeroSection from '@/components/sections/news-list/NewsListHeroSection'
import NewsListSection from '@/components/sections/news-list/NewsListSection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Background from '@/components/layout/Background'

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <NewsListHeroSection />
      <NewsListSection />
      <Footer />
    </div>
  )
}