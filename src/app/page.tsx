import Header from "@/components/layout/Header"
import HeroSection from "@/components/sections/home/HeroSection"
import VisionSection from "@/components/sections/home/VisionSection"
import ServiceSection from "@/components/sections/home/ServiceSection"
import ServiceDetailSection from "@/components/sections/home/ServiceDetailSection"
import Footer from "@/components/layout/Footer"
import ContactSection from "@/components/sections/home/ContactSection"
import RectuitSection from "@/components/sections/home/RecruitSection"
import TechSection from "@/components/sections/home/TechSection"
import NewsSection from "@/components/sections/home/NewsSection"
export default function Home() {
  return (
    <div className="relative">
      <Header />
      <HeroSection />
      <VisionSection />
      <TechSection/>
      <ServiceSection />
      <ServiceDetailSection />
      <NewsSection />
      <RectuitSection />
      <ContactSection />
      <Footer />
    </div>
  )
}