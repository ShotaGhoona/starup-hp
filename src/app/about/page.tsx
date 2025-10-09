import HeroSection from '@/components/sections/about/HeroSection'
import MemberSection from '@/components/sections/about/MemberSection'
import CompanySection from '@/components/sections/about/CompanySection'
import { StarWarpSpeed } from '@/components/animation/star-warp-speed/StarWarpSpeed'

export default function About() {
  return (
    <div className="relative">
      <HeroSection />
      <MemberSection />
      <CompanySection />
      <StarWarpSpeed />
    </div>
  );
}
