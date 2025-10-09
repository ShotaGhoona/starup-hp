import HeroSection from '@/components/sections/about/HeroSection'
import MemberSection from '@/components/sections/about/MemberSection'
import CompanySection from '@/components/sections/about/CompanySection'
import { StarWarpSpeed } from '@/components/animation/star-warp-speed/StarWarpSpeed'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function About() {
  return (
    <div className="relative">
      <Header />
      <HeroSection />
      <MemberSection />
      <CompanySection />
      <StarWarpSpeed />
      <Footer />
    </div>
  );
}
