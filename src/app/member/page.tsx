import Header from "@/components/layout/Header"
import MemberHeroSection from "@/components/sections/member/MemberHeroSection"
import MemberListSection from "@/components/sections/member/MemberListSection"
import Footer from "@/components/layout/Footer"
export default function MemberPage() {
  return (
    <div className="relative">
      <Header />
      <MemberHeroSection />
      <MemberListSection />
      <Footer />
    </div>
  );
}