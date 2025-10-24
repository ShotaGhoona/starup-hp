import ScanLine from "@/components/animation/scan-line/ScanLine"

export default function TechSection() {
    return (
    <section className="flex flex-col items-center justify-center bg-gray-100" data-bg="light">
      <div className="max-w-[1500px] mx-auto">
        <div className="my-16">
          <p className="text-sm lg:text-base text-gray-600">思想をテクノロジーに変え、産業と文化の構造を再構築する。</p>
          <p className="text-3xl lg:text-6xl">Transform thought into technology, redesigning the structures of industry and culture.</p>
        </div>
      </div>
        <div className="w-full mb-16">
            <ScanLine />
        </div>
    </section>
    )
}