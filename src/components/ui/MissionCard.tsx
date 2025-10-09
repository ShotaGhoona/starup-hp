'use client'

import { ChevronRight } from 'lucide-react'
import { GlassCard } from '@/components/animation/glass-card'

interface MissionCardProps {
  className?: string
}

export default function MissionCard({ className = '' }: MissionCardProps) {
  return (
    <GlassCard className={className}>

      {/* ヘッダー */}
      <div className="mb-8 relative z-10">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#1A1A2E]">
            MISSION
          </h2>
          <div className="w-[200px] h-[3px] bg-gradient-to-r from-[#7A83FA] to-[#002AF4]"></div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="space-y-4">
          <p className="text-base font-medium text-[#333333] leading-[1.8]">
            私たちは知の集団としてAIで社会課題を解決します
          </p>
          
          <div className="space-y-4 text-sm text-[#333333] leading-[1.8]">
            <p>
              東大・京大をはじめとする一流大学出身者が集結。
            </p>
            <p>
              深い専門知識と最先端のAI技術を融合させ、
            </p>
            <p>
              企業が直面する複雑な課題を根本から解決する
            </p>
            <p>
              革新的なソリューションを提供しています。
            </p>
            <p>
              データの力で未来を創造し、社会全体の進歩に貢献します。
            </p>
          </div>
        </div>
      </div>

      {/* CTAボタン */}
      <button 
        className={`
          flex items-center justify-center gap-2
          text-white font-medium text-base bg-[#333333]
          px-6 py-2
          transition-all duration-200
          hover:shadow-lg hover:scale-[1.02]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-label="会社概要ページへ移動"
      >
        <span>会社概要をみる</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </GlassCard>
  )
}