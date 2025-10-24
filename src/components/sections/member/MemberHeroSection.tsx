import SpaceBackgroundFooter from "@/components/animation/background-animation/SpaceBackgroundFooter"
import Link from "next/link"
export default function MemberHeroSection() {
  return <div>
    <section className="relative h-[50vh] overflow-hidden" data-bg="dark">
      <div className="fixed inset-0 h-[50vh] -z-10">
        <SpaceBackgroundFooter />
      </div>
      <div className="max-w-[1500px] mx-auto flex flex-col items-start justify-center h-full">
        {/* パンクズりすと */}
        <div className="text-base font-bold text-white">
            <Link href="/">Home</Link>
            <span className="mx-2">/</span>
            <span>Member</span>
        </div>
        <h1 className="text-7xl font-bold text-white">
          Our team
        </h1>
      </div>
    </section>
  </div>;
}