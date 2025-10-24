"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ServiceDetailSection() {
    const [activeTabs, setActiveTabs] = useState([0, 0, 0, 0])
    const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
    const progressRefs = useRef<(HTMLDivElement | null)[]>([]) 

    const sections = [
        {
            title: "図面起点のAI管理 ARCHAIVE",
            description: "Build AI apps, actions, and agents in Workflow Builder an intuitive workspace designed with next-gen AI builders in mind.",
            videoContent: "AI workflow building demonstration video placeholder",
            detailsContent: "Our AI Workflow Builder provides a comprehensive platform for creating sophisticated AI applications. With drag-and-drop functionality, pre-built components, and seamless integration capabilities, you can build powerful AI solutions without extensive coding knowledge."
        },
        {
            title: "Smart Analytics Engine",
            description: "Transform raw data into actionable insights with our advanced analytics engine powered by machine learning algorithms.",
            videoContent: "Analytics dashboard demonstration video placeholder",
            detailsContent: "The Smart Analytics Engine processes large datasets in real-time, identifying patterns and trends that would be impossible to detect manually. Our machine learning models continuously improve their accuracy, providing increasingly valuable insights for your business decisions."
        },
        {
            title: "Automated Process Management",
            description: "Streamline your business operations with intelligent automation that adapts to your workflow requirements.",
            videoContent: "Process automation demonstration video placeholder",
            detailsContent: "Our Automated Process Management system learns from your existing workflows and suggests optimizations. It can handle complex business rules, exception handling, and seamless integration with existing systems, reducing manual work by up to 80%."
        },
        {
            title: "Cloud Infrastructure Suite",
            description: "Deploy and scale your applications with our robust cloud infrastructure designed for enterprise-grade performance.",
            videoContent: "Cloud deployment demonstration video placeholder",
            detailsContent: "Built on modern cloud technologies, our infrastructure suite provides automatic scaling, high availability, and enterprise-level security. With global CDN support and 99.9% uptime guarantee, your applications will perform optimally worldwide."
        }
    ]

    const handleTabChange = (sectionIndex: number, tabIndex: number) => {
        const newTabs = [...activeTabs]
        newTabs[sectionIndex] = tabIndex
        setActiveTabs(newTabs)
    }

    useEffect(() => {
        titleRefs.current.forEach((titleElement, index) => {
            if (!titleElement || !sectionRefs.current[index] || !progressRefs.current[index]) return

            // タイトルの文字を分割
            const chars = sections[index].title.split('').map((char, i) => 
                `<span class="char" style="opacity: 0; display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('')
            titleElement.innerHTML = chars

            const charElements = titleElement.querySelectorAll('.char')
            
            // プログレスインジケーターの要素を取得
            const progressElement = progressRefs.current[index]
            const numberElements = progressElement?.querySelectorAll('.progress-number')
            const lineElements = progressElement?.querySelectorAll('.progress-line')
            
            // 初期状態を設定
            if (numberElements) {
                gsap.set(numberElements, { opacity: 0 })
            }
            if (lineElements) {
                gsap.set(lineElements, { scaleX: 0, transformOrigin: "left center" })
            }
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRefs.current[index],
                    start: "top 50%",
                    end: "top 30%",
                    toggleActions: "play none none reverse"
                }
            })
            
            // プログレス番号を順番に表示
            if (numberElements) {
                numberElements.forEach((num, i) => {
                    tl.to(num, {
                        opacity: 1,
                        duration: 0.1,
                        ease: "none"
                    }, i * 0.15)
                    
                    // 線を伸ばす（最後の番号の後には線がない）
                    if (lineElements && lineElements[i]) {
                        tl.to(lineElements[i], {
                            scaleX: 1,
                            duration: 0.3,
                            ease: "none"
                        }, i * 0.15 + 0.1)
                    }
                })
            }
            
            // タイトルの文字アニメーション
            tl.to(charElements, {
                opacity: 1,
                duration: 0.05,
                stagger: 0.03,
                ease: "none"
            }, 0.3)
        })

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill())
        }
    }, [])

    const ProgressIndicator = ({ currentSection }: { currentSection: number }) => {
        return (
            <div className="flex items-center mb-8 w-full">
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center" style={{ 
                        flex: index === currentSection ? '1' : 'none' 
                    }}>
                        <span 
                            className={`progress-number px-3 py-1 text-sm font-mono ${
                                index === currentSection 
                                    ? 'bg-black text-white' 
                                    : 'text-gray-400'
                            }`}
                        >
                            [0.{index + 1}]
                        </span>
                        {index < 3 && (
                            <div 
                                className={`progress-line h-px ${
                                    index === currentSection 
                                        ? 'bg-gray-300' 
                                        : 'w-8 bg-gray-200'
                                }`}
                                style={{ 
                                    flex: index === currentSection ? '1' : 'none' 
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white relative z-20">
            <div className="max-w-[1500px] mx-auto px-4">
                {sections.map((section, sectionIndex) => (
                    <div 
                        key={sectionIndex} 
                        ref={el => {
                            sectionRefs.current[sectionIndex] = el
                        }}
                        className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-8"
                    >
                        {/* サービス詳細 - Sticky */}
                        <div className="lg:col-span-3 lg:sticky lg:top-0 h-fit flex flex-col justify-start pt-12 md:pt-20">
                            <div ref={el => {
                                progressRefs.current[sectionIndex] = el
                            }}>
                                <ProgressIndicator currentSection={sectionIndex} />
                            </div>
                            <h2 
                                ref={el => {
                                    titleRefs.current[sectionIndex] = el
                                }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight"
                            >
                                {section.title}
                            </h2>
                        </div>

                        {/* サービス詳細 - コンテンツ */}
                        <div className="lg:col-span-5 flex flex-col justify-start px-0 md:px-6 lg:px-12 py-8 md:py-12 lg:py-20">
                            {/* サービス詳細 - 説明 */}
                            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                                {section.description}
                            </p>

                            {/* サービス詳細 - ボタン */}
                            <div className="flex mb-6 md:mb-8">
                                <button
                                    onClick={() => handleTabChange(sectionIndex, 0)}
                                    className={`px-4 md:px-6 py-2 text-sm font-medium rounded-l-full ${
                                        activeTabs[sectionIndex] === 0
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    VIDEO
                                </button>
                                <button
                                    onClick={() => handleTabChange(sectionIndex, 1)}
                                    className={`px-4 md:px-6 py-2 text-sm font-medium rounded-r-full ${
                                        activeTabs[sectionIndex] === 1
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    DETAILS
                                </button>
                            </div>

                            {/* サービス詳細 - コンテンツ */}
                            <div className="bg-gray-50 rounded-lg p-4 md:p-6 lg:p-8 h-64 md:h-80 lg:h-160">
                                {activeTabs[sectionIndex] === 0 ? (
                                    <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 text-sm md:text-base">{section.videoContent}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full overflow-y-auto">
                                        <div className="prose prose-sm md:prose-lg max-w-none">
                                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                                {section.detailsContent}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}