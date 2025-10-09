import HeroSection from '@/components/sections/about/HeroSection'
import MemberSection from '@/components/sections/about/MemberSection'
import CompanySection from '@/components/sections/about/CompanySection'
import Footer from '@/components/layout/Footer'

export default function About() {
  return (
    <div className="relative">
      <HeroSection />
      <MemberSection />
      <CompanySection />
      <Footer />
    </div>
  );
}
