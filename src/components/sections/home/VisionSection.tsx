'use client'

import { DiamondCanvas } from '@/components/animation/vision-animation'

interface VisionSectionProps {
  className?: string
}

interface VisionItem {
  id: number
  color: string
  intensity: number
  title: string
  description: string[]
}

const visionData: VisionItem[] = [
  {
    id: 1,
    color: '#B8C5FF',
    intensity: 0.6,
    title: '現実世界の課題',
    description: [
      '• クライアントの企業が直面している、複雑な社会課題から主にいます。',
      '• データライブに客観を深層から課題意識を構築し、課題分析とその背景を明らかします。'
    ]
  },
  {
    id: 2,
    color: '#8A9BFF',
    intensity: 0.8,
    title: '現実世界とデジタルとのフローの融合点',
    description: [
      '• 現実世界で蓄積されたデータから主に課題を解決するアイデアを蓄積デザインします。',
      '• 蓄積フローション力との構造においては、システムスの解決案を構築構成とします。'
    ]
  },
  {
    id: 3,
    color: '#5A6FFF',
    intensity: 1.0,
    title: 'フローに基づいたデータの集合体',
    description: [
      '• システムアとデータのシート-データを構造に部質につなげる。などで、',
      '• 会社システム技術の構造で課題解決にはさまざまば・',
      '• 問題解決に分解的な明記により型レイアウト・調査で課題構築されさます。'
    ]
  }
]

export default function VisionSection({ className = '' }: VisionSectionProps) {
  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* タイトル */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            OUR VISION
          </h2>
          {/* 青いアンダーライン */}
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-[#7A83FA] to-[#002AF4] rounded-full"></div>
          </div>
        </div>

        {/* テキストコンテンツ */}
        <div className="space-y-6 text-lg leading-relaxed text-gray-700 mb-16">
          <p>私たちは3層のアプローチで、複雑な社会課題を体系的に解決します。</p>
          <p>現実世界の課題を最先端のAI技術で分析し、</p>
          <p>実用的なソリューションとして社会に実装する、これがSTARUPの独自メソッドです。</p>
        </div>
      </div>

      {/* 3層図解 */}
      <div className="">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative">
            {/* テキストコンテンツを通常フローで配置 */}
            {visionData.map((item, index) => (
              <div key={item.id} className="py-8  ml-120">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {item.title}
                </h3>
                <div className="space-y-3">
                  {item.description.map((line, lineIndex) => (
                    <p 
                      key={lineIndex}
                      className="text-gray-700 text-base leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* 右側: 3D立方体を絶対配置 */}
            <div className="absolute left-0 top-0 flex flex-col justify-around items-center">
              {visionData.map((item) => (
                <div key={item.id} className="flex justify-center">
                  <DiamondCanvas 
                    color={item.color}
                    intensity={item.intensity}
                    className="transform hover:scale-105 transition-transform -translate-y-2/3 duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}