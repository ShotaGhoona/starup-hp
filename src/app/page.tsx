import HeroSection from '@/components/sections/home/HeroSection'
import VisionSection from '@/components/sections/home/VisionSection'
import NetworkSection from '@/components/sections/home/NetworkSection'
import NewsSection from '@/components/sections/home/NewsSection'
import ServiceSection from '@/components/sections/home/ServiceSection'
import { StarWarpSpeed } from '@/components/animation/star-warp-speed/StarWarpSpeed'

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />     
      <VisionSection />
      <NetworkSection />
      <ServiceSection />
      <NewsSection />
      <StarWarpSpeed />
    </div>
  );
}
