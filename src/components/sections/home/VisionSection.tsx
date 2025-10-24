"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function VisionSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const line1Ref = useRef<HTMLSpanElement>(null)
    const line2Ref = useRef<HTMLSpanElement>(null)
    const scrollPromptRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        const container = containerRef.current
        const line1 = line1Ref.current
        const line2 = line2Ref.current
        const scrollPrompt = scrollPromptRef.current
        if (!section || !container || !line1 || !line2 || !scrollPrompt) return

        // タイムラインを使って順序を制御
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=100%", // 100%のスクロール領域に延長
                scrub: 1,
                pin: true,
            }
        })

        // 文字を一文字ずつ分割
        const line1Text = "Create culture through technology,"
        const line1Chars = line1Text.split('').map((char, i) => 
            `<span class="char" style="opacity: 0; transform: translateY(20px); display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('')
        line1.innerHTML = line1Chars

        // 初期状態設定
        gsap.set(line2, { opacity: 0, y: 30 })
        gsap.set(container, { opacity: 1 })
        gsap.set(scrollPrompt, { opacity: 0, y: 20 })

        // 0-5%: 背景色をグレーから白に (60%の12%)
        tl.to(section, {
            backgroundColor: "#ffffff",
            duration: 0.05
        })
        
        // 5-15%: 1行目を一文字ずつフェードイン (60%の12%)
        const chars = line1.querySelectorAll('.char')
        chars.forEach((char, index) => {
            tl.to(char, {
                opacity: 1,
                y: 0,
                duration: 0.01,
                ease: "power2.out"
            }, 0.05 + (index * 0.005)) // 各文字を少しずつ遅らせる
        })
        
        // 15-25%: 2行目を一気にフェードイン (60%の12%)
        tl.to(line2, {
            opacity: 1,
            y: 0,
            duration: 0.05,
            ease: "power2.out"
        }, 0.15)
        
        // 25-48%: 2行目にグラデーション (60%の12%)
        tl.to(line2, {
            backgroundImage: "linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            duration: 0.06
        }, 0.25)
        
        // 48-60%: スクロールプロンプトを表示 (60%の12%)
        tl.to(scrollPrompt, {
            opacity: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out"
        }, 0.48)
        
        // 60-100%: 何も変化させない（最後の40%）
        
        // スクロールアイコンのループアニメーション
        gsap.to(scrollPrompt.querySelector('.scroll-icon'), {
            y: 5,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        })

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill())
        }
    }, [])

    return (
        <section ref={sectionRef} className="relative h-screen flex items-center justify-center">
            <div 
                ref={containerRef}
                className="text-center max-w-6xl px-4"
                style={{ opacity: 0 }}
            >
                <span 
                    ref={line1Ref}
                    className="block text-2xl lg:text-4xl font-bold text-black leading-tight mb-2"
                >
                    Create culture through technology,
                </span>
                <span 
                    ref={line2Ref}
                    className="block text-2xl lg:text-5xl font-bold text-black leading-tight"
                >
                    Leaving timeless value.
                </span>
            </div>
            
            {/* スクロールプロンプト */}
            <div 
                ref={scrollPromptRef}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
                style={{ opacity: 0 }}
            >
                <svg 
                    className="scroll-icon w-6 h-6 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="7 13 12 18 17 13" />
                    <polyline points="7 6 12 11 17 6" />
                </svg>
                <span className="text-sm text-gray-600 uppercase tracking-wider">Scroll to explore</span>
            </div>
        </section>
    )
}