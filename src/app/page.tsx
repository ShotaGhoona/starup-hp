import HeroSection from '@/components/sections/home/HeroSection'
import VisionSection from '@/components/sections/home/VisionSection'
import NetworkSection from '@/components/sections/home/NetworkSection'
import NewsSection from '@/components/sections/home/NewsSection'
import Background from '@/components/layout/Background'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />     
      <VisionSection />
      <NetworkSection />
      <NewsSection />
      
      <Footer />
    </div>
  );
}
