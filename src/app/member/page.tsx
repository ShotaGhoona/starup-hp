import Header from "@/components/layout/Header"
import MemberListSection from "@/components/sections/member/MemberListSection"
import Footer from "@/components/layout/Footer"
export default function MemberPage() {
  return (
    <div className="relative">
      <Header />
      <MemberListSection />
      <Footer />
    </div>
  );
}