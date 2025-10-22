import Header2 from "@/components/layout/Header2"
import HeroSection from "@/components/sections/home2/HeroSection"
import VisionSection from "@/components/sections/home2/VisionSection"
import ServiceSection from "@/components/sections/home2/ServiceSection"
import ServiceDetailSection from "@/components/sections/home2/ServiceDetailSection"
export default function Page2() {
  return (
    <div className="relative">
      <Header2 />
      <HeroSection />
      <VisionSection />
      <ServiceSection />
      <ServiceDetailSection />
    </div>
  )
}