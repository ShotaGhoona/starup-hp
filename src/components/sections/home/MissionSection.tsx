import ScanLine from "@/components/animation/scan-line/ScanLine"
import TransitionLink from "@/components/ui/TransitionLink"

export default function MissionSection() {
    return (
    <section className="flex flex-col items-center justify-center bg-gray-100 relative z-10 py-12 md:py-16" data-bg="light">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="my-8 md:my-16">
          <p className="text-sm lg:text-base text-gray-600">思想をテクノロジーに変え、産業と文化の構造を再構築する。</p>
          <p className="text-2xl md:text-3xl lg:text-6xl">Transform thought into technology, redesigning the structures of industry and culture.</p>
        </div>
      </div>
        <div className="w-full mb-8 md:mb-16">
            <ScanLine />
        </div>
        <div className="flex justify-center">
          <TransitionLink 
            href="/about" 
            className="text-sm text-gray-800 hover:text-black transition-colors font-medium flex items-center gap-2 border-b border-gray-300 hover:border-black pb-1"
          >
            Learn More About Us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </TransitionLink>
        </div>
    </section>
    )
}