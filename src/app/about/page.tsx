import VisionSection from '@/components/sections/about/VisionSection'
import InformationSection from '@/components/sections/about/InformationSection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function About() {
  return (
    <div className="relative">
      <Header />
      <VisionSection />
      <InformationSection />  
      <Footer />
    </div>
  );
}
