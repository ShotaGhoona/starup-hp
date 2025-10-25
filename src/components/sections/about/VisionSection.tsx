import ScanLine from "@/components/animation/scan-line/ScanLine"

export default function VisionSection() {
    return (
    <section className="flex flex-col items-center justify-center bg-gray-100 py-20 md:py-40">
      <div className="max-w-[1500px] mx-auto px-4">
        <h2 className="text-4xl md:text-7xl text-gray-900 leading-relaxed">Our Mission</h2>
        <div className="my-6 md:my-8">
          <p className="text-sm lg:text-base text-gray-600">思想をテクノロジーに変え、産業と文化の構造を再構築する。</p>
          <p className="text-2xl md:text-3xl lg:text-6xl">Transform thought into technology, redesigning the structures of industry and culture.</p>
        </div>
      </div>
      <div className="w-full mb-12 md:mb-16">
          <ScanLine />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-32 max-w-[1500px] mx-auto px-4">
        <div className="text-sm md:text-base text-gray-900 leading-relaxed space-y-4 md:space-y-6">
          <p className="text-base md:text-lg font-bold">産業と文化の再構築</p>
          <p className="leading-relaxed">
            私たちは、SaaSやSIerが蔓延る業界自体を徹底的に変える破壊的な存在として、
            提供する産業の構造をプロダクトで根本から変革します。
            既存の業界慣習や非合理な構造を壊し、独自の思想とテクノロジーを融合させて、
            社会・産業・文化の&ldquo;仕組み&rdquo;そのものを再設計する企業です。
            単なる技術提供者ではなく、業界の常識を覆し、
            新たな価値創造の基盤を築く革新的な存在であり続けます。
          </p>
        </div>
        <div className="text-sm md:text-base text-gray-900 leading-relaxed space-y-4 md:space-y-6">
          <p className="leading-relaxed">
            We are a disruptive force that fundamentally transforms industries 
            dominated by conventional SaaS and system integrators, 
            reshaping industrial structures through our products.
            We break down existing industry practices and irrational structures, 
            fusing our unique philosophy with technology to redesign 
            the very foundations of society, industry, and culture.
            Beyond being mere technology providers, we challenge industry norms 
            and establish new foundations for value creation, 
            remaining a revolutionary presence that drives meaningful change.
          </p>
        </div>
      </div>
    </section>
    )
}