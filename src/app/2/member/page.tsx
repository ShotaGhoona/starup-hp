import Header2 from "@/components/layout/Header2"
import MemberHeroSection from "@/components/sections/member/MemberHeroSection"
import MemberListSection from "@/components/sections/member/MemberListSection"
import Footer2 from "@/components/layout/Footer2"
export default function MemberPage() {
  return (
    <div className="relative">
      <Header2 />
      <MemberHeroSection />
      <MemberListSection />
      <Footer2 />
    </div>
  );
}