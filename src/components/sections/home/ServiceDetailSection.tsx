"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ServiceDetailSection() {
    const [activeTabs, setActiveTabs] = useState([0, 0, 0])
    const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
    const progressRefs = useRef<(HTMLDivElement | null)[]>([]) 

    const sections = [
        {
            subtitle: "AI開発プラットフォーム",
            title: "STAR UP.AI",
            description: "経営、現場、研究の各部門をAIで統合し、データドリブンな意思決定を実現する包括的なAI開発プラットフォームです。",
            imageSrc: "/images/services/ai-solution.jpg",
            detailsContent: `
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">統合AIプラットフォームの特徴</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">経営部門</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li><strong>計画管理</strong> - 戦略的計画立案をAIでサポート</li>
                                <li><strong>財務分析</strong> - リアルタイム財務データの可視化</li>
                                <li><strong>需要予測</strong> - LLMを活用した高精度予測</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">現場部門</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li><strong>製造管理</strong> - 生産工程の最適化</li>
                                <li><strong>品質管理</strong> - 画像処理による自動検査</li>
                                <li><strong>工程管理</strong> - BI機能でリアルタイム監視</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">研究部門</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li><strong>試験・分析</strong> - 統計処理による高度なデータ分析</li>
                                <li><strong>実証実験</strong> - 最適化アルゴリズムによる効率化</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="border-l-4 border-gray-800 pl-4 py-2">
                        <p class="text-gray-800 font-medium"><strong>統合のメリット:</strong> 部署間の連携を強化し、組織全体の生産性向上を実現</p>
                    </div>
                </div>
            `
        },
        {
            subtitle: "図面起点のAI管理",
            title: "ARCHAIVE",
            description: "社内に点在した図面データを一元管理し、AIによる類似図面検索とチャット型データ検索で業務効率を革新します。",
            imageSrc: "/images/services/archaive.jpg",
            detailsContent: `
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">AI図面データ活用プラットフォーム</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">主な機能・サービス</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li><strong>AI類似図面検索</strong> - 膨大な過去の図面データから似た図面を瞬時に検索</li>
                                <li><strong>AIチャット型データ検索</strong> - 欲しいデータが「話す」とすぐに見つかる</li>
                                <li><strong>案件管理機能</strong> - 図面に紐づく情報（自動解析）・書類を一元管理</li>
                                <li><strong>導入サポート</strong> - 現場定着までのDXを伴走支援</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">データ管理の革新</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li>社内に点在したデータを一元管理</li>
                                <li>部署間の壁をなくし、欲しいデータをAIにより一瞬で検索</li>
                                <li>類似度99%以上の高精度検索機能</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">対象業界</h4>
                            <p class="text-gray-700">製造業、建設業、設計業界など、図面データを扱うあらゆる業界に対応</p>
                        </div>
                    </div>
                    
                    <div class="border-l-4 border-gray-800 pl-4 py-2">
                        <p class="text-gray-800 font-medium"><strong>効果:</strong> 図面検索時間を90%短縮、部署間連携の効率化を実現</p>
                    </div>
                </div>
            `
        },
        {
            subtitle: "サプライチェーン支援AI",
            title: "SEND AI",
            description: "需要予測を起点として発注に関わるあらゆる指標を最適化し、在庫管理から売上分析までを統合的に支援します。",
            imageSrc: "/images/services/sendai.jpg",
            detailsContent: `
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">サプライチェーン支援AIソリューション</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">主な機能・サービス</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li><strong>需要予測AI</strong> - 業態やPoCからオーダーメイドの高精度アルゴリズムを開発</li>
                                <li><strong>発注機能</strong> - 個社ごとの発注フローをシステム化により効率化</li>
                                <li><strong>BI機能</strong> - 中長期の戦略策定の材料となる各種データを可視化</li>
                                <li><strong>導入サポート</strong> - PoCから本稼働、運用改善までワンストップで支援</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">在庫管理の最適化</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li><strong>在庫切れ予測</strong> - 先1ヶ月・先半年の売上予測</li>
                                <li><strong>店舗別在庫管理</strong> - 各店舗の在庫数と在庫週数をリアルタイム表示</li>
                                <li><strong>補充履歴</strong> - 過去の補充データから最適な発注タイミングを算出</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3 text-lg">売上分析機能</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li>全体店舗分析・新商品分析</li>
                                <li>過去6ヶ月の平均売上データ</li>
                                <li>前月比の売上・在庫数変化を可視化</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="border-l-4 border-gray-800 pl-4 py-2">
                        <p class="text-gray-800 font-medium"><strong>成果:</strong> 在庫最適化により売上最大化とコスト削減を同時実現</p>
                    </div>
                </div>
            `
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

            // subtitleとtitleの文字を分割
            const subtitle = sections[index].subtitle
            const title = sections[index].title

            const subtitleChars = subtitle.split('').map((char, i) =>
                `<span class="char" style="opacity: 0; display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('')

            const titleChars = title.split('').map((char, i) =>
                `<span class="char" style="opacity: 0; display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('')

            titleElement.innerHTML = `
                <div class="subtitle">${subtitleChars}</div>
                <div class="main-title">${titleChars}</div>
            `

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
                {[0, 1, 2].map((index) => (
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
                        {index < 2 && (
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
        <div className="min-h-screen bg-white relative z-20 sticky-container">
            <div className="max-w-[1500px] mx-auto px-4">
                {sections.map((section, sectionIndex) => (
                    <div 
                        key={sectionIndex} 
                        ref={el => {
                            sectionRefs.current[sectionIndex] = el
                        }}
                        className="grid grid-cols-1 lg:grid-cols-8 gap-2 lg:gap-8 lg:gap-8  py-8 md:py-12 lg:py-20"
                    >
                        {/* サービス詳細 - Sticky */}
                        <div className="lg:col-span-3 lg:sticky lg:top-20 h-fit flex flex-col justify-start">
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
                            </h2>
                        </div>

                        {/* サービス詳細 - コンテンツ */}
                        <div className="lg:col-span-5 flex flex-col justify-start px-0 md:px-6 lg:px-12">
                            {/* サービス詳細 - 説明 */}
                            <p className="text-base md:text-lg text-black mb-6 md:mb-8 leading-relaxed">
                                {section.description}
                            </p>

                            {/* サービス詳細 - ボタン */}
                            <div className="flex mb-6 md:mb-8">
                                <button
                                    onClick={() => handleTabChange(sectionIndex, 0)}
                                    className={`px-4 md:px-6 py-2 text-sm font-medium rounded-l-lg ${
                                        activeTabs[sectionIndex] === 0
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    Image
                                </button>
                                <button
                                    onClick={() => handleTabChange(sectionIndex, 1)}
                                    className={`px-4 md:px-6 py-2 text-sm font-medium rounded-r-lg ${
                                        activeTabs[sectionIndex] === 1
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    Details
                                </button>
                            </div>

                            {/* サービス詳細 - コンテンツ */}
                            <div className="bg-gray-50 rounded-lg p-4 md:p-6 lg:p-8">
                                {activeTabs[sectionIndex] === 0 ? (
                                    <div className="rounded-lg overflow-hidden">
                                        <img 
                                            src={section.imageSrc} 
                                            alt={section.title}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="min-h-32 overflow-y-auto">
                                        <div 
                                            className="text-sm md:text-base"
                                            dangerouslySetInnerHTML={{ __html: section.detailsContent }}
                                        />
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