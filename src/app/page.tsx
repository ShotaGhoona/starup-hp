import HeroSection from '@/components/sections/home/HeroSection'
import VisionSection from '@/components/sections/home/VisionSection'
import NetworkSection from '@/components/sections/home/NetworkSection'
import NewsSection from '@/components/sections/home/NewsSection'
import ServiceSection from '@/components/sections/home/ServiceSection'
import RecruitSection from '@/components/sections/home/RecruitSection'
import { StarWarpSpeed } from '@/components/animation/star-warp-speed/StarWarpSpeed'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
export default function Home() {
  return (
    <div className="relative">
      <Header />
      <HeroSection />     
      <VisionSection />
      <NetworkSection />
      <ServiceSection />
      <NewsSection />
      <StarWarpSpeed />
      <RecruitSection />
      <Footer />
    </div>
  );
}
