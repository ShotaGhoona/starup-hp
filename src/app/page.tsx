import HeroSection from '@/components/sections/home/HeroSection'
import VisionSection from '@/components/sections/home/VisionSection'
import Background from '@/components/layout/Background'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      
      {/* HeroSection以降の背景 */}
      <div className="relative">
        <Background />
        <VisionSection />
      </div>
      
      <Footer />
    </div>
  );
}
