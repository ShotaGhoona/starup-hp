import HeroSection from '@/components/sections/about/HeroSection'
import MemberSection from '@/components/sections/about/MemberSection'
import Footer from '@/components/layout/Footer'

export default function About() {
  return (
    <div className="relative">
      <HeroSection />
      <MemberSection />
      <Footer />
    </div>
  );
}
