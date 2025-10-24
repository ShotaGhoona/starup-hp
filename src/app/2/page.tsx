import Header2 from "@/components/layout/Header2"
import HeroSection from "@/components/sections/home2/HeroSection"
import VisionSection from "@/components/sections/home2/VisionSection"
import ServiceSection from "@/components/sections/home2/ServiceSection"
import ServiceDetailSection from "@/components/sections/home2/ServiceDetailSection"
import Footer2 from "@/components/layout/Footer2"
import ContactSection from "@/components/sections/home2/ContactSection"
import RectuitSection from "@/components/sections/home/RecruitSection"
import TechSection from "@/components/sections/home2/TechSection"
export default function Page2() {
  return (
    <div className="relative">
      <Header2 />
      <HeroSection />
      <VisionSection />
      <ServiceSection />
      {/* <TechSection/> */}
      <ServiceDetailSection />
      <RectuitSection />
      <ContactSection />
      <Footer2 />
    </div>
  )
}