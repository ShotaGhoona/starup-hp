"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScanLine from "@/components/animation/scan-line/ScanLine"
import TransitionLink from "@/components/ui/TransitionLink"
import TypingText from "@/components/ui/TypingText"

gsap.registerPlugin(ScrollTrigger)

export default function MissionSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const scanlineRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current || !scanlineRef.current) return

        const ctx = gsap.context(() => {
            // scanlineコンテナ全体をピン留めとともにスケールアップ&横移動させる
            const cardStream = scanlineRef.current?.querySelector('.card-stream') as HTMLElement

            if (cardStream) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=100%",
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                    }
                })

                // 最初に素早くスケールアップ（全体の10%の期間で）
                tl.to(cardStream, {
                    scale: 1.5,
                    duration: 0.1,
                    ease: "power2.out"
                })
                // その後、中間の期間で横スクロール（60%の期間で高速化）
                .to(cardStream, {
                    x: -1000,
                    duration: 1.5,
                    ease: "none"
                })
                // 最後にスケールダウンして元に戻す（30%の期間で）
                .to(cardStream, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.in"
                })
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
    <section
        ref={sectionRef}
        className="flex flex-col lg:min-h-screen items-center justify-center bg-gray-100 relative z-10 py-12 md:py-16"
        data-bg="light"
    >
      <div className="max-w-[1500px] mx-auto px-4">
        <h2 className="text-4xl md:text-7xl text-gray-900 leading-relaxed">Mission</h2>
        <div className="my-8 md:my-16">
          <p className="text-sm lg:text-base text-gray-600">思想をテクノロジーに変え、産業と文化の構造を再構築する。</p>
          <TypingText
            text="Transform thought into technology, redesigning the structures of industry and culture."
            className="text-2xl md:text-3xl lg:text-6xl"
          />
        </div>
      </div>
        <div ref={scanlineRef} className="w-full mb-8 md:mb-16">
            <ScanLine autoScroll={false} />
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